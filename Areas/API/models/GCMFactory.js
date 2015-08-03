var
	Async = require('async'),
	Gcm = require('node-gcm'),
	Config = require(appRoot + '/config'),
	Status = require(appRoot + '/models/DataObj/Status'),
	DALMongoGCM = require('./DAL/DALMongoGCM');	

var	
	dalGCM = new DALMongoGCM(),
	msg = new Gcm.Message({
	    collapseKey: 'demo',
	    delayWhileIdle: true,
	    timeToLive: 60 * 60 * 24 // sec * min * hour
	});

var GCMFactory = function(){
	
};

/*
 * result:function(err, obj);
 */
GCMFactory.prototype.getRegData = function(key, result){
	Async.waterfall([ 
	function(callback) {
		dalGCM.getData(key, function(err, data){
			if(err){
				callback('Get data failed', err);
	    	}else{
	    		if(data.length > 0){	    			
	    			callback(null, data);
	    		}else{
	    			callback('Data not found', data);
	    		}
	    	}
	    });
    }], function(err, resultObj) {
		var status = new Status();
		if (err) {			
			status.set(false, err, resultObj, result);
		}else{
			status.set(true, '', resultObj, result);
		}
	});
};

/*
 * result:function(err, obj);
 */
GCMFactory.prototype.getRegList = function(result){
	Async.waterfall([ 
	function(callback) {		
		//var selectField = { _id:0, info:1 };		
		dalGCM.getList(null, function(err, data){
			if(err){
				callback('Get data list failed', err);
	    	}else{
	    		if(data.length > 0){	    			
	    			callback(null, data);
	    		}else{
	    			callback('Data not found', data);
	    		}
	    	}
	    });
    }], function(err, resultObj) {
		var status = new Status();
		if (err) {			
			status.set(false, err, resultObj, result);
		}else{
			status.set(true, '', resultObj, result);
		}
	});
};

/*
 * result:function(err, obj);
 */
GCMFactory.prototype.reg = function(info, result) {
	
	Async.waterfall([
	function(callback) {
		dalGCM.insert(info, function(err, data) {
			if (err) {
				callback('Insert data failed', err);
			} else {
				callback(null, data);
			}
		});
	}], function(err, resultObj) {
		var status = new Status();
		if (err) {			
			status.set(false, err, resultObj, result);
		}else{
			status.set(true, '', resultObj, result);
		}
	});	
};

GCMFactory.prototype.sendMsg = function(strMsg, result) {
	var registrationIds = [];
	var sender = new Gcm.Sender(Config.gcmSender);
	msg.addData('msg', strMsg);
	
	Async.waterfall([
	function(callback) {
		var selectField = { _id:0, info:1 };
		dalGCM.getList(selectField, function(err, data){
			if(err){
				callback('Get GCM data list failed', err);
	    	}else{
	    		if(data.length > 0){	    			
	    			callback(null, data);
	    		}else{
	    			callback('Data not found', data);
	    		}
	    	}
	    });
	},
	function(data, callback) {
    	for(var key in data){
    		registrationIds.push(data[key].info);
    	}		
    	callback(null, registrationIds);    	
	},
	function(registrationIds, callback) {		
		sender.sendNoRetry(msg, registrationIds, function(err, result) {
			if(err){
				callback(null, err);
			}else{
				callback(null, result);
			}
		});
	}], function(err, resultObj) {
		var status = new Status();
		if (err) {			
			status.set(false, err, resultObj, result);
		}else{
			status.set(true, '', resultObj, result);
		}
	});	
};

GCMFactory.prototype.sendObj = function(obj, result) {
	var registrationIds = [];
	var sender = new Gcm.Sender(Config.gcmSender);
	msg.addData(obj);
	
	Async.waterfall([
	function(callback) {
		var selectField = { _id:0, info:1 };
		dalGCM.getList(selectField, function(err, data){
			if(err){
				callback('Get GCM data list failed', err);
	    	}else{
	    		if(data.length > 0){	    			
	    			callback(null, data);
	    		}else{
	    			callback('Data not found', data);
	    		}
	    	}
	    });
	},
	function(data, callback) {
    	for(var key in data){
    		registrationIds.push(data[key].info);
    	}		
    	callback(null, registrationIds);    	
	},
	function(registrationIds, callback) {		
		sender.sendNoRetry(msg, registrationIds, function(err, result) {
			if(err){
				callback(null, err);
			}else{
				callback(null, result);
			}
		});
	}], function(err, resultObj) {
		var status = new Status();
		if (err) {			
			status.set(false, err, resultObj, result);
		}else{
			status.set(true, '', resultObj, result);
		}
	});	
};

module.exports = GCMFactory;