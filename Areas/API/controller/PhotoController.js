var 
	Async = require('async'),
	UUID = require('node-uuid'),
	Config = require(appRoot + '/config'),	
	UtilTool = require(appRoot + '/models/UtilTool'),
	PhotoFactory = require('../models/PhotoFactory');

var 
	cacheTime = Config.cacheTime,
	imgHome = Config.imgHome,
	ipLimit = Config.ipLimit,
	uploadSize = Config.uploadSize,
	photoFactory = new PhotoFactory(),
	utilObj = new UtilTool();

var PhotoController = function(){

};

PhotoController.prototype.getPhoto = function(req, res){
	var key = req.params.strID;
	photoFactory.getPhoto(key, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

PhotoController.prototype.updatePhoto = function(req, res){	
	var key = req.params.strID;
	photoFactory.updatePhoto(key, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

PhotoController.prototype.removePhoto = function(req, res){	
	var key = req.params.strID;
	photoFactory.removePhoto(key, function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});	
};

PhotoController.prototype.getPhotoList = function(req, res){
	photoFactory.getPhotoList(function(err, obj){
		if(err){
			res.send(err);
		}else{
			res.send(obj);
		}
	});
};

PhotoController.prototype.getImg = function (req, res, next) {	
	var
		width = req.params.width,
		height = req.params.height,
		strPath = req.params.path;
		
	photoFactory.getImg(width, height, strPath, function(err, obj){
		if(err){
			res.send(err);
		}else{
			if (!res.getHeader('Cache-Control')){
				res.setHeader('Cache-Control', 'public, max-age=' + cacheTime);
			}		
			res.set('Content-Type', obj.contentType);
			res.send(obj.buffer);
		}
	});
};

PhotoController.prototype.imgUpload = function(req, res) {	
	try{
		var ip = req.headers['x-real-ip'] || 
				 req.connection.remoteAddress ;

		var strID = UUID.v1(),
			fileName = strID,
			fileHome = imgHome,
			fromPath = imgHome + 'temp/',
			toPath = 'photo/temp/Upload/',
			fstream;
		
		Async.waterfall([
		function(callback) {
			//callback(null);
			if(ipLimit[ip]){
				callback(null);
			}else{
				callback('Access Denied', 'PhotoController.imgUpload:ipLimit');
			}
		},
		function(callback){
			if(req.headers['content-length'] <= uploadSize){
				req.pipe(req.busboy);
				req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
					if(fieldname === 'filePath'){
						if(val !== ''){
							toPath = 'photo/' + val;
						}
					}					
					if(fieldname === 'fileName'){
						if(val !== ''){
							fileName = val;
						}
					}
				});
				req.busboy.on('file', function (fieldname, file, name, encoding, mimetype) {	
					callback(null, mimetype, file);
				});
			}else{
				callback('File is too large', 'PhotoController.imgUpload:content-length');
			}
		},
		function(mimetype, file, callback){
			photoFactory.imgUpload(strID, mimetype, file, fileName, fileHome, fromPath, toPath, function(err, obj){
				if(err){
					callback(err, 'PhotoController.imgUpload:photoObj.imgUpload');
				}else{
					callback(null, obj);
				}
			});
		}], function(err, obj){
			if(err){
				res.send(err);
			}else{
				res.send(obj);
			}
		});		
	}catch(e){
		res.send(e.toString());
	}
};

module.exports = PhotoController;