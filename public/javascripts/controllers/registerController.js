libifyApp.controller("registerController",function($scope,$http,$location,authService) {
	if(authService.accessUsername) {
		$location.path("/home");
	}

	$scope.registering = false;
	$scope.newUser =  {
		username:"",
		password:""
	};


	$scope.register = function(user) {
		$scope.registering = true;
		$http.post(BASE_URL + "/api/users",user,{headers:{'x-access-token':authService.accessToken}}).then(function(response) {
			$scope.registering = false;
			if(response.data.success) {
				$location.path("/");
			} else {
				alert("Error");
			}
		});
	}
});