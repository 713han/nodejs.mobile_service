var
	Async = require('async'),
	Config = require(appRoot + '/config'),
	Status = require(appRoot + '/models/DataObj/Status'),
	DALMongoGPS = require('./DAL/DALMongoGPS');	

var	
	dalGPS = new DALMongoGPS();

var GPSFactory = function(){
	
};

/*
 * result:function(err, obj);
 */
GPSFactory.prototype.getGPSData = function(key, result){
	Async.waterfall([ 
	function(callback) {
		dalGPS.getData(key, function(err, data){
			if(err){
				callback('Get GPS data failed', err);
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
GPSFactory.prototype.getGPSList = function(result){
	Async.waterfall([ 
	function(callback) {		
		var selectField = { _id:1 };		
		dalGPS.getList(selectField, function(err, data){
			if(err){
				callback('Get GPS data list failed', err);
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
GPSFactory.prototype.gpsLogUpload = function(gpsLogObj, result) {
	
	Async.waterfall([
	function(callback) {
		dalGPS.insert(gpsLogObj, function(err, data) {
			if (err) {
				callback('Insert GPS data failed', err);
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

module.exports = GPSFactory;