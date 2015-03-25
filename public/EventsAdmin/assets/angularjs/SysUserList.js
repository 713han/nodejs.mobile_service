var SysUserListAPI = 'userlist';
var SysUserStatusAPI = 'enableuser';
var SysUserListApp = angular.module('SysUserListApp', []);

SysUserListApp.controller('UserListController', ['$http', '$scope',  function ($http, $scope) {
	
	$scope.list = [];
	$scope.startPage = 1;
	$scope.limitPage = 5;
	$scope.numberOfPages = 0;
	$scope.currentPage = 0;
	
	$scope.getLabelClass = function(value){
		if(value!=null){
			return value == 1 ? ['label', 'label-success'] : ['label', 'label-danger'];
		}else{
			return [];
		}
	};
	
	$scope.getCurrentPageClass = function(value){
		if(value === $scope.currentPage){
			return ['active'];
		}
	};
	
	var setPage = function(pagingObj){
		var limit = $scope.limitPage;
		var current = pagingObj.currentPage;
		var start = current - ((current - 1) % limit) - ((current > limit) ? 1 : 0);		
		
		$scope.numberOfPages = pagingObj.totalPage;
    	$scope.currentPage = current;
    	$scope.startPage = start;
	};
	
	var loadList = function(pageNo){
		$http.post(SysUserListAPI, { page: pageNo })
		.success(function(data){
			if (data.status === false) {
                alert(data.msg);
            } else {
            	$scope.list = data.Object.result;
            	setPage(data.Object.paging);
            }
		})
		.error(function(data){
			alert('System Error');
		});
	};
	
	this.getUserList = function(pageNo){
		pageNo = pageNo ? pageNo : 1;
		loadList(pageNo);
	};
	
	this.setStatus = function(id, active){		
		
		$http.post(SysUserStatusAPI, { id: id, active: active })
		.success(function(data){
			if (data.status === true) {
				loadList($scope.currentPage);
            } 
		})
		.error(function(data){
			alert('System Error');
		});
	};
	
	this.edit = function(id){
		window.location = 'profile/' + id;
	};
	
}]);

SysUserListApp.filter('range', function() {
	return function(input, total) {
		total = parseInt(total);
		for (var i=0; i<=total; i++){
			input.push(i);
		}
	    return input;
	};
});

SysUserListApp.filter('startFrom', function() {
	return function(input, start) {         
		return input.slice(start);
	}
});

SysUserListApp.filter('status', function() {
	return function(input) {
		if(input!=null){
			return input == 1 ? '啟用中' : '停用中';
		}else{
			return '';
		}
	};
});
