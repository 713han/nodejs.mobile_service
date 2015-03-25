var LoginAPI = 'login'; 
var LoginApp = angular.module('LoginApp', []);

LoginApp.controller('LoginController', ['$http', '$scope',  function ($http, $scope) {
	$scope.showAlert = false;
	$scope.msg = '';
	
	this.username = '';
	this.password = '';
	this.remember = '';

	this.submit = function(){
		$http.post(LoginAPI, { username: this.username, 
							   password: this.password, 
							   remember: this.remember })
		.success(function(data){
			if (data.status === true){
				window.location = data.redirect;
			}else{
				$scope.showAlert = true;
				$scope.msg = data.msg;
			}
		})
		.error(function(data){
			$scope.showAlert = true;
			$scope.msg = 'System Error';
		});
	};
	
	this.resetAlert = function(){
		if($scope.showAlert){
			$scope.showAlert = false;
			$scope.msg = '';
		}
	};
}]);