libifyApp.controller("homeController",function($scope,$location,$http,examService,authService) {
	$scope.exams = [];
	$scope.updating = false;
	$scope.deleting = false;
	if(!authService.accessUsername) {
		$location.path('/');
		return;
	} else {
		$scope.user = authService.accessUsername;
	}
	setActiveVoice($scope.menus,"Home");
	$http.get(examService.examsApi($scope.user),{headers:{'x-access-token':authService.accessToken}}).then(function(response) {
			examService.exams = response.data;
			$scope.exams = response.data;
	});


	$scope.computeAverage = function(exams) {
		return examService.average(exams);
	}

	$scope.selected = null;

	$scope.select = function(index) {
		$scope.selected = angular.copy($scope.exams[index]);
		$scope.selected.index = index;
	}

	$scope.update = function(name) {
		$scope.updating =  true;
		$http.put(examService.examsApi($scope.user) + "/" + name,$scope.selected,{headers:{'x-access-token':authService.accessToken}}).then(function(response) {
			$scope.updating = false;
			if(response.data.success)
				$scope.exams[$scope.selected.index] = angular.copy($scope.selected);
			else {
				alert("Error");
			}
		});
	}

	$scope.delete = function(name) {
		$scope.deleting = true;
		$http.delete(examService.examsApi($scope.user) + "/" + name,{headers:{'x-access-token':authService.accessToken}}).then(function(response) {
			$scope.deleting = false;
			if(response.data.success) {
				$scope.exams.splice($scope.selected.index,1);
			} else {
				alert("Error");
			}

		});
	}
})