var S21nyProfileListAPI = 'Profilelist';
var S21nyProfileListApp = angular.module('S21nyProfileListApp', []);

S21nyProfileListApp.controller('ProfileListController', ['$http', '$scope',  function ($http, $scope) {
	
	$scope.list = [];
	$scope.startPage = 1;
	$scope.limitPage = 5;
	$scope.numberOfPages = 0;
	$scope.currentPage = 0;
	
	$scope.getLabelClass = function(value){
		return value == 1 ? ['label', 'label-success'] : ['label', 'label-danger'];
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
	
	this.getProfileList = function(pageNo){
		pageNo = pageNo ? pageNo : 1;
		
		$http.post(S21nyProfileListAPI, { page: pageNo })
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
	
	
}]);

S21nyProfileListApp.filter('range', function() {
	return function(input, total) {
		total = parseInt(total);
		for (var i=0; i<=total; i++){
			input.push(i);
		}
	    return input;
	};
});

S21nyProfileListApp.filter('startFrom', function() {
	return function(input, start) {         
		return input.slice(start);
	}
});

S21nyProfileListApp.filter('sourceType', function() {
	return function(input) {
	    return input == 0 ? '新春領紅包' : '好運靈籤';
	};
});

S21nyProfileListApp.filter('epaperStatus', function() {
	return function(input) {
	    return input == 1 ? '接收' : '拒絕';
	};
});
