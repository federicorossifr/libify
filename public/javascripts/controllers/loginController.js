libifyApp.controller("loginController",function($scope,$location,$http,authService){
	if(authService.accessUsername) {
		$location.path("/home");
	}
	$scope.loading = false;
	$scope.invalid = false;

	$scope.login = function(userLogin) {
		$scope.loading = true;
		authService.auth(userLogin.username,userLogin.password,function(response) {
			$scope.loading = false;
			if(response.data.success) {
				$location.path("/home");			
			} else {
				$scope.invalid = true;
			}
		});
	}
});