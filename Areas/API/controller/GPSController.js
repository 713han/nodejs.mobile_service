var 
	GPSFactory = require('../models/GPSFactory'),
	UtilTool = require(appRoot + '/models/UtilTool');

var 
	gpsFactory = new GPSFactory(),
	utilObj = new UtilTool();

var GPSController = function(){
	
};

GPSController.prototype.getGPSList = function(req, res){	
	gpsFactory.getGPSList(function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

GPSController.prototype.getGPSData = function(req, res){
	var key = req.params.id;

	gpsFactory.getGPSData(key, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

GPSController.prototype.gpsLogUpload = function(req, res){
	var gpsLogObj = req.body;
	
	gpsFactory.gpsLogUpload(gpsLogObj, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

module.exports = GPSController;