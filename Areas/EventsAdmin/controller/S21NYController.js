var 
	Moment = require('moment'),
	UtilTool = require('../models/UtilTool'),
	Status = require('../models/DataObj/Status'),
	Node_xlsx = require('node-xlsx'),
	
	S21newyarProfileFactory = require(appRoot + '/Areas/21newyear/models/ProfileFactory'),
	S21newyarPrizeFactory = require(appRoot + '/Areas/21newyear/models/PrizeFactory');

var 
	tool = new UtilTool(),
	s21newyarProfileFactory = new S21newyarProfileFactory(),
	s21newyarPrizeFactory = new S21newyarPrizeFactory();

var S21NYController = function(){
	
};

S21NYController.prototype.getProfileListForm = function(req, res){
	var viewData = {
		identify:'S21NYProfileList',
		menu:'S21NYProfileList',
		title: '個資總覽',
		userName: req.user.nickname		
	};
	res.render('S21NY/profilelist',viewData);		
};

S21NYController.prototype.getProfileList = function(req, res){
	var page = req.body.page || 1;
	var itemPerPage = 20;
	
	s21newyarProfileFactory.getList(page, itemPerPage, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

S21NYController.prototype.getPoemListForm = function(req, res){
	var viewData = {
		identify:'S21NYPoemList',
		menu:'S21NYPoemList',
		title: '幸運靈籤個資蒐集',
		userName: req.user.nickname		
	};
	res.render('S21NY/poemlist',viewData);		
};

S21NYController.prototype.getPoemList = function(req, res){
	var page = req.body.page || 1;
	var itemPerPage = 20;
	
	s21newyarProfileFactory.getPoemList(page, itemPerPage, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

S21NYController.prototype.getWinnerListForm = function(req, res){
	var viewData = {
		identify:'S21NYWinnerList',
		menu:'S21NYWinnerList',
		title: '新春領紅包名單',
		userName: req.user.nickname		
	};
	res.render('S21NY/winnerlist',viewData);		
};

S21NYController.prototype.getWinnerList = function(req, res){
	var page = req.body.page || 1;
	var itemPerPage = 200;
	
	s21newyarPrizeFactory.getWinnerList(page, itemPerPage, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

S21NYController.prototype.getWinnerListExcel = function(req, res){
	
	s21newyarPrizeFactory.getWinnerListExcel(function(err, obj){

		if(err){
			res.send(err);
		}else{
			var buffer = Node_xlsx.build([{name: "WinnerList", data: obj.Object}]);
			res.set('Content-disposition', 'attachment; filename=WinnerList_' + Moment().format('YYYYMMDD') + '.xlsx');
			res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.send(buffer);		   
		}
	});
};

S21NYController.prototype.getPoemListExcel = function(req, res){
	
	s21newyarProfileFactory.getPoemListExcel(function(err, obj){
		if(err){
			res.send(err);
		}else{
			var buffer = Node_xlsx.build([{name: "PoemList", data: obj.Object}]);
			res.set('Content-disposition', 'attachment; filename=PoemList_' + Moment().format('YYYYMMDD') + '.xlsx');
			res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.send(buffer);		   
		}
	});
};

S21NYController.prototype.getPoemGroupListExcel = function(req, res){
	
	s21newyarProfileFactory.getPoemGroupListExcel(function(err, obj){
		if(err){
			res.send(err);
		}else{
			var buffer = Node_xlsx.build([{name: "PoemGroupList", data: obj.Object}]);
			res.set('Content-disposition', 'attachment; filename=PoemList_' + Moment().format('YYYYMMDD') + '.xlsx');
			res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.send(buffer);		   
		}
	});
};

module.exports = S21NYController;