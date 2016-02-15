var libifyApp = angular.module("libify",['ngRoute']);

var BASE_URL = "http://libify.azurewebsites.net/";

function setActiveVoice(menu,voice) {
	for(var i = 0; i < menu.length; ++i) {
		if(menu[i].name == voice) {
			menu[i].active = "active";
		}
		else
			menu[i].active = "";
	}
}

libifyApp.controller("libifyController",function($scope,$location,$http,examService,authService) {
	$scope.menus = [
		{name:"Home",url:"#/home", active:"", icon:"home"},
		{name:"Add",url:"#/add", active:"", icon: "plus"}
	];

	$scope.authService = authService

	$scope.logout = function() {
		authService.logout();
		$location.path("/")
	}
	
});

libifyApp.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/home',{
		templateUrl: '../partials/home.html',
		controller: 'homeController'
	}).when('/add',{
		templateUrl: '../partials/add.html',
		controller: 'addController'
	}).when('/',{
		templateUrl: '../partials/login.html',
		controller: 'loginController'
	}).when('/404',{
		templateUrl: '../partials/404.html'
	}).when('/register',{
		templateUrl: '../partials/register.html',
		controller: 'registerController'
	}).otherwise({
        redirectTo: '/404'
     });
}]);

libifyApp.factory('examService',function() {
	return {
		examsApi: function(username) {
			return BASE_URL + "/api/users/" + username + "/exams";
		},
		exams:[],
		average:function(exams) {
			var pundMarksum = 0;
			var markSum = 0;
			var creditSum = 0

			for(var i = 0; i < exams.length; ++i) {
				var mark = exams[i].mark + ((exams[i].honor) ? 3:0);
				var credits = exams[i].credits;
				pundMarksum+= mark*credits;
				markSum += mark;
				creditSum+= credits;
			}

			var computes = {};

			var poundAverage = pundMarksum/creditSum;
			var aritmAverage = markSum/exams.length;
			computes.poundAverage = poundAverage.toFixed(2);
			computes.aritmAverage = aritmAverage.toFixed(2);
			return computes;
		}
	}
});


libifyApp.factory("authService",["$http",function($http) {
	return {
		accessUsername: undefined,
		accessToken: undefined,
		auth: function(username,password,callback) {
			var authApi = BASE_URL + "/api/auth";
			var authBody = {username:username,password:password};
			var service = this;
			$http.post(authApi,authBody).then(function(response) {
				if(response.data.success) {
					service.accessToken = response.data.token;
					service.accessUsername = username;
				}
				callback(response);
			});
		},
		logout: function() {
			this.accessUsername = null;
			this.accessToken = null;
		}
	}
}]);