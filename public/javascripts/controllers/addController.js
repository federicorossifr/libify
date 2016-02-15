libifyApp.controller("addController",function($scope,$location,$http,examService,authService) {
	if(!authService.accessUsername) {
		$location.path('/');
		return;
	} 
	setActiveVoice($scope.menus,"Add");
	$scope.adding = false;
	$scope.projectionExams = angular.copy(examService.exams);
	$scope.computeAverage = function(exams) {
		return examService.average(exams);
	}

	$scope.newExam = {
		"mark":18,
		"credits":3,
		"honor":false
	}

	$scope.projectionExams.push($scope.newExam);


	$scope.add = function() {
		$scope.adding = true;
		$http.post(examService.examsApi(authService.accessUsername),$scope.newExam,{headers:{"x-access-token":authService.accessToken}}).then(function(response) {
			$scope.adding = false;
			if(response.data.success) {
				examService.exams.push($scope.newExam);
			} else {
				alert("Error");
			}
		});
	}
});