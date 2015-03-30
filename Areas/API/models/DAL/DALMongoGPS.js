var	
	Async = require('async'),
	Util = require('util'),
	Mongodb = require('mongodb'),
	ObjectID = require('mongodb').ObjectID,
	Config = require(appRoot + '/config'),
	UtilTool = require(appRoot + '/models/UtilTool'),
	DALMongoBasic = require('./DALMongoBasic');
	
var 
	mongoDbClient = Mongodb.MongoClient,
	utilObj = new UtilTool();

var DALMongoGPS = function(){
	this.collectionName = 'GPSData';		
};
Util.inherits(DALMongoGPS, DALMongoBasic); //繼承
	

/*
 * result:function(err, data);
 */
DALMongoGPS.prototype.insert = function(insertObj, result){
	
	var timestamp = Math.floor(new Date().getTime()/1000);
	var id = new ObjectID(timestamp);
	
	insertObj._id = id;	
	
	DALMongoGPS.super_.prototype.insert(this.collectionName, insertObj, result);
};

/*
 * result:function(err, data);
 */
DALMongoGPS.prototype.getData = function(strID, result){
	DALMongoGPS.super_.prototype.getData(this.collectionName, strID, result);
};

/*
 * result:function(err, data);
 */
DALMongoGPS.prototype.getList = function(selectField, result) {
	DALMongoGPS.super_.prototype.getList(this.collectionName, selectField, result);
};

module.exports = DALMongoGPS;