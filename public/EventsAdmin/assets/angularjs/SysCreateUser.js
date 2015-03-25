var SysCreateUserAPI = 'createUser'; 
var SysCreateUserApp = angular.module('SysCreateUserApp', []);

SysCreateUserApp.controller('CreateUserController', ['$http', '$scope',  function ($http, $scope) {
	$scope.alertClass = ['alert'];
	$scope.showAlert = false;
	$scope.msg = '';
	
	var resetAlert = function(){
		$scope.alertClass = ['alert'];
		$scope.showAlert = false;
		$scope.msg = '';	
	};
	
	this.username = '';
	this.password = '';
	this.nickname = '';

	this.submit = function(){
		var userrole = $(".CreateUserWrap").find("#tt").tree('getChecked');
        var roleIDs = new Array(userrole.length);
        for (var i = 0; i < userrole.length; i++) {
        	roleIDs[i] = userrole[i].id;
        }
        
		$http.post(SysCreateUserAPI, { username: this.username,
									   password: this.password,
									   nickname: this.nickname,
									   roleIDs: roleIDs})
		.success(function(data){
			if (data.status === true){
				$scope.alertClass = ['alert', 'alert-success'];
				$scope.showAlert = true;
				$scope.msg = 'User ID:' + data.Object + ' has been created.';
			}else{
				$scope.alertClass = ['alert', 'alert-danger'];
				$scope.showAlert = true;
				$scope.msg = data.msg;
			}
		})
		.error(function(data){
			$scope.alertClass = ['alert', 'alert-danger'];
			$scope.showAlert = true;
			$scope.msg = 'System Error';
		});
	};
	
	this.resetAlert = function(){
		if($scope.showAlert){
			resetAlert();
		}
	};
}]);