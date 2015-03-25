var SysGetProfileAPI = 'getData'; 
var SysSetProfileAPI = '../profile'; 
var SysProfileApp = angular.module('SysProfileApp', []);

SysProfileApp.controller('ProfileController', ['$http', '$scope', function ($http, $scope) {
	$scope.alertClass = ['alert'];
	$scope.showAlert = false;
	$scope.msg = '';
	$scope.profileData = {};
	
	$scope.getLabelClass = function(value){
		if(value!=null){
			return value == 1 ? ['label', 'label-primary'] : ['label', 'label-danger'];
		}else{
			return [];
		}
	};
	
	var resetAlert = function(){
		$scope.showAlert = false;
		$scope.msg = '';	
	};
	
	this.getProfile = function(id){
    	
		$http.post(SysGetProfileAPI, { id: id })
		.success(function(data){
			if(data.status === true){
				$scope.profileData = data.Object;
			}else{
				alert('Get Data Error');
			}			
		})
		.error(function(data){
			alert('System Error');
		});
	};

	this.submit = function(){
		
        var userrole = $(".ProfileWrap").find("#tt").tree('getChecked');
        var roleIDs = new Array(userrole.length);
        for (var i = 0; i < userrole.length; i++) {
        	roleIDs[i] = userrole[i].id;
        }        
        
		$http.post(SysSetProfileAPI, { userid: $scope.profileData.ID, 
									   nickname: $scope.profileData.NickName, 
									   roleIDs: roleIDs })
		.success(function(data){
			if (data.status === true){
				$scope.alertClass = ['alert', 'alert-success'];
				$scope.showAlert = true;
				$scope.msg = 'User ID:' + data.Object + ' has been updated.';
			}else{
				$scope.alertClass = ['alert', 'alert-danger'];
				$scope.showAlert = true;
				$scope.msg = data.msg;
			}
			
			setTimeout(function() {
			     $scope.$apply(resetAlert());
			}, 5000);

		})
		.error(function(data){
			$scope.alertClass = ['alert', 'alert-danger'];
			$scope.showAlert = true;
			$scope.msg = 'System Error';
			
			setTimeout(function() {
			     $scope.$apply(resetAlert());
			}, 5000);
		});
		
	};
}]);

SysProfileApp.filter('status', function() {
	return function(input) {
		if(input!=null){
			return input == 1 ? '啟用中' : '停用中';
		}else{
			return '';
		}
	};
});