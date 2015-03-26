var	
	Async = require('async'),
	Mongodb = require('mongodb'),
	ObjectID = require('mongodb').ObjectID,
	UUID = require('node-uuid'),
	Config = require(appRoot + '/config'),
	UtilTool = require(appRoot + '/models/UtilTool');
	
var 
	mongoDbClient = Mongodb.MongoClient,
	utilObj = new UtilTool();

var convertStrID2BinID = function(strID){
	var uuidBinary = new Buffer(UUID.parse(strID));
	var id = Mongodb.BSONPure.Binary(uuidBinary, Mongodb.BSONPure.Binary.SUBTYPE_UUID);
	return id;
};

/*
 * result:function(err, db, collection);
 */
var connectMongoDB = function(connectionString, collectionName, result){	
	Async.waterfall([
	function(callback) { 
		mongoDbClient.connect(connectionString,function(err,db){
			if (err) {
				callback(err, 'DALMongoBasic.connectMongoDB:connection');
			}else{
				callback(null, db);
			}
		});
	},
	function(db, callback) { 
		db.collection(collectionName, function(err, collection) {		
			if (err) {
				callback(err, 'DALMongoBasic.connectMongoDB:collection');
			}else{
				result(null, db, collection);
				callback(null, 'Done');
			}
		});
	}], function (err, resultObj) {		
		if(err){
			var obj = {
					err : err,
					result : resultObj
			};
			result(obj, null, null);
		}
	});
};
	
var DALMongoBasic = function(){	

};

/*
 * result:function(err, data);
 */
DALMongoBasic.prototype.insert = function(collectionName, dataObj, result){
	var connectString = Config.MongoDBConn;	
	
	var timestamp = Math.floor(new Date().getTime()/1000);
	var id = new ObjectID(timestamp);
	
	dataObj._id = id;	
	
	Async.waterfall([
	function(callback) { 
		connectMongoDB(connectString, collectionName, function(err, db, collection){
			if(err){
				callback(err, 'DALMongoBasic.insert:connectMongoDB');
			}else{
				callback(null, db, collection);
			}
		});
	},
	function(db, collection, callback) { 
		collection.insert(dataObj, function(err, data) {	
			if (err) {
				callback(err, 'DALMongoBasic.insert:insert');
			}else{
				result(null, data);
				callback(null, 'Done');
			}
			db.close();
		});	
	}], function (err, resultObj) {		
			if(err){
				var obj = {
						err : err,
						result : resultObj
				};
				result(obj, null);
			}
	});
};

/*
 * result:function(err, data);
 */
DALMongoBasic.prototype.remove = function(collectionName, strID, result){
	var connectString = Config.MongoDBConn;
	
	var deleteObj = { _id : ObjectID.createFromHexString(strID) };
	
	Async.waterfall([
	function(callback) { 
		connectMongoDB(connectString, collectionName, function(err, db, collection){
			if(err){
				callback(err, 'DALMongoBasic.remove:connectMongoDB');
			}else{
				callback(null, db, collection);
			}
		});
	},
	function(db, collection, callback) { 
		collection.remove(deleteObj, function(err, data) {	
			if (err) {
				callback(err, 'DALMongoBasic.remove:remove');
			}else{
				result(null, data);
				callback(null, 'Done');
			}
			db.close();
		});	
	}], function (err, resultObj) {		
			if(err){
				var obj = {
						err : err,
						result : resultObj
				};
				result(obj, null);
			}
	});
};

/*
 * result:function(err, data);
 */
DALMongoBasic.prototype.update = function(collectionName, strID, updateSetObj, result){
	var connectString = Config.MongoDBConn;	
	
	var updateObj = { _id : ObjectID.createFromHexString(strID) };
	//var updateSetObj = {$set:{createDate : t}};
	
	Async.waterfall([
	function(callback) { 
		connectMongoDB(connectString, collectionName, function(err, db, collection){
			if(err){
				callback(err, 'DALMongoBasic.update:connectMongoDB');
			}else{
				callback(null, db, collection);
			}
		});
	},
	function(db, collection, callback) { 
		collection.update(updateObj, updateSetObj, function(err, data) {	
			if (err) {
				callback(err, 'DALMongoBasic.update:update');
			}else{
				result(null, data);
				callback(null, 'Done');
			}
			db.close();
		});	
	}], function (err, resultObj) {		
			if(err){
				var obj = {
						err : err,
						result : resultObj
				};
				result(obj, null);
			}
	});
};

/*
 * result:function(err, data);
 */
DALMongoBasic.prototype.getData = function(collectionName, strID, result){
	var connectString = Config.MongoDBConn;
	
	var selectObj = { _id : ObjectID.createFromHexString(strID) };
	
	Async.waterfall([
	function(callback) { 
		connectMongoDB(connectString, collectionName, function(err, db, collection){
			if(err){
				callback(err, 'DALMongoBasic.getData:connectMongoDB');
			}else{
				callback(null, db, collection);
			}
		});
	},
	function(db, collection, callback) { 
		collection.find(selectObj).toArray(function(err, data) {	
			if (err) {
				callback(err, 'DALMongoBasic.getData:find');
			}else{
				result(null, data);
				callback(null, 'Done');
			}
			db.close();
		});	
	}], function (err, resultObj) {		
			if(err){
				var obj = {
						err : err,
						result : resultObj
				};
				result(obj, null);
			}
	});
};

/*
 * result:function(err, data);
 */
DALMongoBasic.prototype.getList = function(collectionName, result) {
	var connectString = Config.MongoDBConn;
	
	var selectField = { _id:1 };
	
	Async.waterfall([
	function(callback) { 
		connectMongoDB(connectString, collectionName, function(err, db, collection){
			if(err){
				callback(err, 'DALMongoBasic.getList:connectMongoDB');
			}else{
				callback(null, db, collection);
			}
		});
	},
	function(db, collection, callback) { 
		collection.find(null, selectField).toArray(function(err, data) {	
			if (err) {
				callback(err, 'DALMongoBasic.getList:find');
			}else{
				result(null, data);
				callback(null, 'Done');
			}
			db.close();
		});	
	}], function (err, resultObj) {		
			if(err){
				var obj = {
						err : err,
						result : resultObj
				};
				result(obj, null);
			}
	});
};

module.exports = DALMongoBasic;