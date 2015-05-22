var 
	GCMFactory = require('../models/GCMFactory'),
	UtilTool = require(appRoot + '/models/UtilTool');

var 
	gcmFactory = new GCMFactory(),
	utilObj = new UtilTool();

var GCMController = function(){
	
};

GCMController.prototype.getRegList = function(req, res){	
	gcmFactory.getRegList(function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

GCMController.prototype.getRegData = function(req, res){
	var key = req.params.id;

	gcmFactory.getRegData(key, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

GCMController.prototype.reg = function(req, res){
	var info = req.body;
	
	console.log(info);
	
	gcmFactory.reg(info, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

GCMController.prototype.sendMsg = function(req, res){
	var msg = req.params.msg;

	gcmFactory.sendMsg(msg, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

module.exports = GCMController;