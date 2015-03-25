var ListAPI = '/EventsAdmin/MYVITA/profilelist';

var ProfileListApp = angular.module('ProfileListApp', []);

ProfileListApp.controller('ProfileListController', ['$http', '$scope',  function ($http, $scope) {	
	$scope.list = [];
	$scope.startPage = 1;
	$scope.limitPage = 5;
	$scope.numberOfPages = 0;
	$scope.currentPage = 0;
	
	$scope.acceptPrivacyRule = false;
	
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
	
	
	
	var loadItem = function(pageNo, id, column){
		pageNo = pageNo ? pageNo : 1;
		
		$http.post(ListAPI, { page: pageNo, id: id, column: column })
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
	
	this.id = '';
	this.column = '';
	
	this.setOption = function(id, column){
		this.id = id;
		this.column = column;
	}
	
	this.getProfileList = function(pageNo){
		loadItem(pageNo, this.id, this.column);
	};
	
}]);

ProfileListApp.filter('range', function() {
	return function(input, total) {
		total = parseInt(total);
		for (var i=0; i<=total; i++){
			input.push(i);
		}
	    return input;
	};
});

ProfileListApp.filter('startFrom', function() {
	return function(input, start) {         
		return input.slice(start);
	}
});

