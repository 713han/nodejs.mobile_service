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

var DALMongoGCM = function(){
	this.collectionName = 'GCMData';		
};
Util.inherits(DALMongoGCM, DALMongoBasic); //繼承
	

/*
 * result:function(err, data);
 */
DALMongoGCM.prototype.insert = function(insertObj, result){
	
	var timestamp = Math.floor(new Date().getTime()/1000);
	var id = new ObjectID(timestamp);
	
	insertObj._id = id;	
	
	DALMongoGCM.super_.prototype.insert(this.collectionName, insertObj, result);
};

/*
 * result:function(err, data);
 */
DALMongoGCM.prototype.getData = function(strID, result){
	DALMongoGCM.super_.prototype.getData(this.collectionName, strID, result);
};

/*
 * result:function(err, data);
 */
DALMongoGCM.prototype.getList = function(selectField, result) {
	DALMongoGCM.super_.prototype.getList(this.collectionName, selectField, result);
};

module.exports = DALMongoGCM;