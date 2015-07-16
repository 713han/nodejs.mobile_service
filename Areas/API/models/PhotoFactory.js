var
	Async = require('async'),
	Fs = require('fs'),
	Mkdirp = require('mkdirp');
	Path = require('path'),
	Gm = require('gm'),
	LruCache = require('lru-cache'),
	MMMagic = require('mmmagic'),
	Magic = MMMagic.Magic,	
	ExifImage = require('exif').ExifImage,	
	Mongodb = require('mongodb'),
	Config = require(appRoot + '/config'),
	Status = require(appRoot + '/models/DataObj/Status'),
	
	PhotoData = require('./DataObject/PhotoData'),
	ImgCache = require('./DataObject/ImgCache'),
	DALMongoPhoto = require('./DAL/DALMongoPhoto'),
	
	GCMFactory = require('./GCMFactory');

var	
	cache = new LruCache(Config.lruOptions),
	hostname = Config.hostname,
	imgHome = Config.imgHome,
	dalPhoto = new DALMongoPhoto(),
	
	gcmFactory = new GCMFactory();

/*
Fs.mkdirParent = function(dirPath, mode, callback) {
	//Call the standard fs.mkdir
	Fs.mkdir(dirPath, mode, function(error) {
	//When it fail in this way, do the custom steps
		if (error && error.errno === 34) {
			//Create all the parents recursively			
			Fs.mkdirParent(Path.dirname(dirPath), mode, function(){});
			//Fs.mkdirParent(Path.dirname(dirPath), mode, callback);
			//And then the directory			
			Fs.mkdirParent(dirPath, mode, function(){});
			//Fs.mkdirParent(dirPath, mode, callback);
		}
		//Manually run the callback since we used our own callback to do all these
		callback && callback(error);
	});
};
*/
var getExtension = function(filename) {
	var i = filename.lastIndexOf('.');
	return (i < 0) ? '' : filename.substr(i).toLowerCase();
};

var PhotoFactory = function(){
	this.typeMap = {
			'image/x-ms-bmp' : true,
			'image/gif' : true,
			'image/png' : true,
			'image/jpeg' : true
	};
	
	this.nameMap = {
			'image/bmp' : '.bmp',
			'image/gif' : '.gif',
			'image/png' : '.png',
			'image/jpeg' : '.jpg'
	};
	
	this.getImgPath = imgHome + 'photo/';
};

/*
 * result:function(err, obj);
 */
PhotoFactory.prototype.getPhoto = function(key, result){
	Async.waterfall([ 
	function(callback) {
		dalPhoto.getData(key, function(err, data){
			if(err){
				callback('Get photo data failed', err);
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
PhotoFactory.prototype.updatePhoto = function(key, result){
	Async.waterfall([ 
	function(callback) {
		//TODO SAMPLE
		var ts = new Date().getTime();
		var i = ts % 1000;
		var t = new Mongodb.BSONPure.Timestamp(i, Math.floor(ts * 0.001));	
		var updateSetObj = {$set:{createDate : t}};
		
		dalPhoto.update(key, updateSetObj, function(err, data){
			if(err){
				callback('Update photo data failed', err);
	    	}else{
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

/*
 * result:function(err, obj);
 */
PhotoFactory.prototype.removePhoto = function(key, result){
	Async.waterfall([ 
	function(callback) {
		dalPhoto.getData(key, function(err, data){
			if(err){
				callback('Get photo data failed', err);
	    	}else{
	    		if(data.length > 0){	    			
	    			callback(null, data[0]);
	    		}else{
	    			callback('Data not found', data);
	    		}
	    	}			
	    });
	},
	function(data, callback) {
		Fs.unlink(imgHome + data.path + data.filename, function(err) {
			if (err) {
				callback('File delete failed.', 'PhotoFactory.removePhoto:unlink');
			} else {
				callback();
			}
		});
    },
	function(callback) {
		dalPhoto.remove(key, function(err, data){
			if(err){
				callback('Remove photo data failed', err);
	    	}else{
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

/*
 * result:function(err, obj);
 */
PhotoFactory.prototype.getPhotoList = function(result){
	Async.waterfall([ 
	function(callback) {
		var selectField = { _id:1 };
		dalPhoto.getList(selectField, function(err, data){
			if(err){
				callback('Get photo data list failed', err);
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
PhotoFactory.prototype.getImg = function (width, height, strPath, result) {
	try{	
		width = (parseInt(width, 10) > 1024) ? 0 : width;
		height = (parseInt(height, 10) > 1024) ? 0 : height;
		
		if(!((width===0)||(height===0))){			
		
			var path = this.getImgPath + strPath.replace(/\'/g,"/");
			var key = width + height + strPath;		
			var ext = getExtension(path);
			var obj;		
	
			var useCache = function(){
				var show = false;
				if(!show){		
					if(obj.isReady === true){					
						result(null, obj);
						show = true;
					}else{
						setImmediate(useCache);
					}				
				}
			};
			
			if(Config.isUseCache){
				obj  = cache.get(key);
			}
			
			if(typeof obj === 'undefined'){				
				obj = new ImgCache();
				if(Config.isUseCache){
					cache.set(key, obj);	
				}
				
				Gm(path)
					.resize(width, height)
					.toBuffer(function (err, buffer) {
						obj.setImage(buffer, ext);					
						result(null, obj);					
					});			
			}else{			
				useCache();
			}
		}else{
			throw ('too large');
		}
	}catch(e){
		result(e.toString(), null);
	}	

	//process.send({cmd : 'addReq', pid : process.pid, cacheSize : cache.keys().length});	
};

/*
 * result:function(err, obj);
 */
PhotoFactory.prototype.imgUpload = function(strID, mimetype, file, fileName, fileHome, fileFromPath, fileToPath, result) {
	var nameMap = this.nameMap;
	var typeMap = this.typeMap;
	var extName = '';
	var exif;
	
	Async.waterfall([
	function(callback) {
		fstream = Fs.createWriteStream(fileFromPath + fileName);
		file.pipe(fstream);
		fstream.on('close', function() {
			callback(null);
		});
	},
	function(callback) {
		var magic = new Magic(MMMagic.MAGIC_MIME_TYPE);
		magic.detectFile(fileFromPath + fileName, function(err, result) {
			if (err) {
				callback('Get file type failed.', 'PhotoFactory.imgUpload:mkdirParent');
			} else {
				callback(null, result);
			}
		});
	},
	function(result, callback) {
		extName = nameMap[result];
		if (typeMap[result] === true) {
			/*Fs.mkdirParent(fileHome + fileToPath, '0755', function(err) {
				if (err) {
					// nothing
					// callback('Created parent directory failed.:' + err.toString(),'PhotoFactory.imgUpload:mkdirParent');
					console.log(err);
				}
				callback(null);
			});*/
			
			Mkdirp(fileHome + fileToPath,function(err) {
				if (err) {
					// nothing
					// callback('Created parent directory failed.:' + err.toString(),'PhotoFactory.imgUpload:mkdirParent');
					console.log(err);
				}
				callback(null);
			});
		} else {
			Fs.unlink(fileFromPath + fileName, function(err) {
				if (err) {
					callback('Incorrect Format, file delete failed.', 'PhotoFactory.imgUpload:unlink');
				} else {
					callback('Incorrect Format.', 'PhotoFactory.imgUpload:unlink');
				}
			});
		}
	},
	function(callback) {
		Fs.rename(fileFromPath + fileName, fileHome + fileToPath + fileName + extName, function(err) {
			if (err) {
				console.log(err);
				callback('file rename failed.', 'PhotoFactory.imgUpload:rename');
			} else {
				callback(null);
			}
		});
	},
	function(callback) {
		new ExifImage({ image : fileHome + fileToPath + fileName + extName }, function(error, exifData) {
			exif = exifData;
			if (error) {
				callback(null, error);
			} else {
				callback(null, exifData);
			}
		});
	},
	function(exifData, callback) {
		var ts = new Date().getTime();
		var i = ts % 1000;
		var t = new Mongodb.BSONPure.Timestamp(i, Math.floor(ts * 0.001));
		
		var dataObj = new PhotoData();
		dataObj.set(strID, fileToPath, fileName + extName, hostname + 'API/Origin' + fileToPath + fileName + extName, exifData, t, callback);
	},
	function(obj, callback) {
		dalPhoto.insert(obj, function(err, data) {
			if (err) {
				callback('Insert photo data failed', err);
			} else {
				callback(null, data);
			}
		});
	},
	function(data, callback){
		var appPath = data[0].path.toString().replace('photo/', '').replace(/\//g, '\'');	
		
		var 
			latD = 0,
			latM = 0,
			latS = 0,
			latR = '',
			
			lngD = 0,
			lngM = 0,
			lngS = 0,
			lngR = '';			
			
		if(exif.gps.GPSLatitude){
			latD = exif.gps.GPSLatitude[0];
			latM = exif.gps.GPSLatitude[1];
			latS = exif.gps.GPSLatitude[2];
			latR = exif.gps.GPSLatitudeRef;
		}
		
		if(exif.gps.GPSLongitude){
			lngD = exif.gps.GPSLongitude[0];
			lngM = exif.gps.GPSLongitude[1];
			lngS = exif.gps.GPSLongitude[2];
			lngR = exif.gps.GPSLongitudeRef;
		}
			
		var sendObj = {
			_id: data[0]._id,
			url: data[0].url,
			appUrl: hostname + 'API/photo/200/200/' + appPath + fileName + extName,
			latD: latD,
			latM: latM,
			latS: latS,
			latR: latR,
			
			lngD: lngD,
			lngM: lngM,
			lngS: lngS,
			lngR: lngR
		};
		
		gcmFactory.sendObj(sendObj, function(err, obj){
			if(err){
				callbcak('GCM Failed', err);
			}else{
				callback(null, obj);
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

module.exports = PhotoFactory;