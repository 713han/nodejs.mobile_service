var 
	Moment = require('moment'),
	UtilTool = require('../models/UtilTool'),
	Status = require('../models/DataObj/Status'),
	Node_xlsx = require('node-xlsx'),

	MyvitaGameDataFactory = require(appRoot + '/Areas/myvita/models/GameDataFactory');

var 
	tool = new UtilTool(),
	myvitaGameDataFactory = new MyvitaGameDataFactory();

var MYVITAController = function(){
	
};
/*
 * 取得遊戲資料UI
 */
MYVITAController.prototype.getGameListForm = function(req, res){
	var viewData = {
			identify:'MYVITAGameList',
			menu:'MYVITAGameList',
			title: '好運排行榜',
			userName: req.user.nickname		
	};
	res.render('MYVITA/gamelist', viewData);
};

/*
 * 遊戲資料API
 */
MYVITAController.prototype.getGameList = function(req, res){
	var page = req.body.page || 1;
	var itemPerPage = 20;
	
	myvitaGameDataFactory.getGameList(page, itemPerPage, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};


/*
 * 取得遊戲資料UI
 */
MYVITAController.prototype.getProfileListForm = function(req, res){
	var id = req.params.id || 0;
	var column = req.params.column || '';
	
	var viewData = {
			identify:'MYVITAProfileList',
			menu:'MYVITAProfileList',
			title: '個人資料',
			userName: req.user.nickname,
			
			id: id,
			column: column
	};
	res.render('MYVITA/profilelist', viewData);
};

/*
 * 個人資料API
 */
MYVITAController.prototype.getProfileList = function(req, res){
	var page = req.body.page || 1;
	var itemPerPage = 20;
	var id = req.body.id || 0;
	var column = req.body.column || '';
	
	myvitaGameDataFactory.getList(id, column, page, itemPerPage, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

/*
 * 取得Excel
 */
MYVITAController.prototype.getExcel = function(req, res){	
	myvitaGameDataFactory.getExcel(function(err, obj){
		if(err){
			res.send(err);
		}else{
			var buffer = Node_xlsx.build([{name: "MyVitaList", data: obj.Object}]);
			res.set('Content-disposition', 'attachment; filename=MyVitaList_' + Moment().format('YYYYMMDD') + '.xlsx');
			res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.send(buffer);		   
		}
	});
};

/*
 * 取的Excel(Email不重複)
 */
MYVITAController.prototype.getGroupExcel = function(req, res){	
	myvitaGameDataFactory.getGroupExcel(function(err, obj){
		if(err){
			res.send(err);
		}else{
			var buffer = Node_xlsx.build([{name: "MyVitaGroupList", data: obj.Object}]);
			res.set('Content-disposition', 'attachment; filename=MyVitaGroupList_' + Moment().format('YYYYMMDD') + '.xlsx');
			res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.send(buffer);		   
		}
	});
};

module.exports = MYVITAController;