var ListAPI = 'gamelist';

var GameListApp = angular.module('GameListApp', []);

GameListApp.controller('GameListController', ['$http', '$scope',  function ($http, $scope) {	
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
	
	$scope.getClass = function(target, value){
		return (value == (target|value)) ? ['label', 'label-success'] : ['label', 'label-danger'];
	};
	
	var setPage = function(pagingObj){
		var limit = $scope.limitPage;
		var current = pagingObj.currentPage;
		var start = current - ((current - 1) % limit) - ((current > limit) ? 1 : 0);		
		
		$scope.numberOfPages = pagingObj.totalPage;
    	$scope.currentPage = current;
    	$scope.startPage = start;
	};
	
	var loadItem = function(pageNo){
		pageNo = pageNo ? pageNo : 1;
		
		$http.post(ListAPI, { page: pageNo })
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
	
	this.getGameList = function(pageNo){
		loadItem(pageNo);
	};
	
}]);

GameListApp.filter('range', function() {
	return function(input, total) {
		total = parseInt(total);
		for (var i=0; i<=total; i++){
			input.push(i);
		}
	    return input;
	};
});

GameListApp.filter('startFrom', function() {
	return function(input, start) {         
		return input.slice(start);
	}
});

GameListApp.filter('resultStatus', function() {
	return function(input) {
		var val = '';
		switch(input){
			case 33:
				val = '中,籤詩1';
				break;
			case 32:
				val = '中,籤詩2';
				break;
			case 17:
				val = '保,籤詩1';
				break;
			case 16:
				val = '保,籤詩2';
				break;
			case 9:
				val = '無,籤詩1';
				break;
			case 8:
				val = '無,籤詩2';
				break;
			case 5:
				val = '限,籤詩1';
				break;
			case 4:
				val = '限,籤詩2';
				break;
			case 3:
				val = '+,籤詩1';
				break;
			case 2:
				val = '+,籤詩2';
				break;
		}
		return val;
	};
});
