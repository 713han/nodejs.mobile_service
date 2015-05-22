var 
	Path = require('path'),
	Express = require('express'),
	Busboy = require('connect-busboy'),
	Config = require(appRoot + '/config');

var	
	UtilTool = require(appRoot + '/models/UtilTool'),	
	GPS = require('./controller/GPSController'),
	Photo = require('./controller/PhotoController'),
	Stream = require('./controller/StreamController'),
	GCM = require('./controller/GCMController');

var cacheTime = Config.cacheTime,
	uploadSize = Config.uploadSize;

var APIAreaRegistration = function(app){	
	this.root = '/API';

	var
		tool = new UtilTool(),	
		gps = new GPS(),
		photo = new Photo(),
		stream = new Stream(),
		gcm = new GCM();
	
	app.use(this.root ,Express.static(Path.join(appRoot, 'public/API'), { maxAge: cacheTime }));
	app.use(this.root + '/data' ,Express.static(Path.join(appRoot, 'data/share'), { maxAge: cacheTime }));
	app.use(this.root + '/OriginPhoto' ,Express.static(Path.join(Config.imgHome + '/photo'), { maxAge: cacheTime }));
	app.get('views').push(__dirname + '/views/');
	app.use(Busboy({	
		limits: {
			fileSize: uploadSize
		}
	}));

	app.route(this.root + '/gps/list')
	   	.get(gps.getGPSList);

	app.route(this.root + '/gps/get/:id(\\w{24})')
		.get(gps.getGPSData);

	app.route(this.root + '/gps/upload')
		.post(gps.gpsLogUpload);
	
	app.route(this.root + '/photo/:width(\\d{1,4})/:height(\\d{1,4})/:path')
		.get(photo.getImg);

	app.route(this.root + '/photo/fileupload')
		.post(photo.imgUpload);

	app.route(this.root + '/photo/get/:strID')
		.get(photo.getPhoto);

	app.route(this.root + '/photo/update/:strID')
		.get(photo.updatePhoto);

	app.route(this.root + '/photo/remove/:strID')
		.get(photo.removePhoto);

	app.route(this.root + '/photo/list')
		.get(photo.getPhotoList);
	
	app.route(this.root + '/stream/:name')
		.get(stream.get);
	
	app.route(this.root + '/video2mp4/:name')
		.get(stream.video2mp4);
	
	app.route(this.root + '/watermark/:name')
		.get(stream.watermark);
	
	app.route(this.root + '/multOutput/:name')
		.get(stream.multOutput);
	
	app.route(this.root + '/gcm/reg')
		.post(gcm.reg);
	
	app.route(this.root + '/gcm/list')
		.get(gcm.getRegList);
	
	app.route(this.root + '/gcm/send/:msg')
		.get(gcm.sendMsg);
};	

module.exports = APIAreaRegistration;