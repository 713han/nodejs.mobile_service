var S21nyWinnerListAPI = 'Winnerlist';
var S21nyWinnerListApp = angular.module('S21nyWinnerListApp', []);

S21nyWinnerListApp.controller('WinnerListController', ['$http', '$scope',  function ($http, $scope) {
	
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
	
	this.getWinnerList = function(pageNo){
		pageNo = pageNo ? pageNo : 1;
		
		$http.post(S21nyWinnerListAPI, { page: pageNo })
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

S21nyWinnerListApp.filter('range', function() {
	return function(input, total) {
		total = parseInt(total);
		for (var i=0; i<=total; i++){
			input.push(i);
		}
	    return input;
	};
});

S21nyWinnerListApp.filter('startFrom', function() {
	return function(input, start) {         
		return input.slice(start);
	}
});

S21nyWinnerListApp.filter('epaperStatus', function() {
	return function(input) {
		if(input!=null){
			return input == 1 ? '接收' : '拒絕';
		}else{
			return '';
		}
	};
});
