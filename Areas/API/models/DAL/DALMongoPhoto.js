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

var DALMongoPhoto = function(){
	this.collectionName = 'PhotoData';		
};
Util.inherits(DALMongoPhoto, DALMongoBasic); //繼承

/*
 * result:function(err, data);
 */
DALMongoPhoto.prototype.insert= function(insertObj, result){
	var timestamp = Math.floor(new Date().getTime()/1000);
	var id = new ObjectID(timestamp);
	
	insertObj._id = id;	
	
	DALMongoPhoto.super_.prototype.insert(this.collectionName, insertObj, result);
};

/*
 * result:function(err, data);
 */
DALMongoPhoto.prototype.remove = function(strID, result){
	DALMongoPhoto.super_.prototype.remove(this.collectionName, strID, result);
};

/*
 * result:function(err, data);
 */
DALMongoPhoto.prototype.update = function(strID, updateSetObj, result){
	DALMongoPhoto.super_.prototype.update(this.collectionName, strID, updateSetObj,  result);
};

/*
 * result:function(err, data);
 */
DALMongoPhoto.prototype.getData = function(strID, result){
	DALMongoPhoto.super_.prototype.getData(this.collectionName, strID, result);
};

/*
 * result:function(err, data);
 */
DALMongoPhoto.prototype.getList = function(selectField, result) {
	DALMongoPhoto.super_.prototype.getList(this.collectionName, selectField, result);
};

module.exports = DALMongoPhoto;