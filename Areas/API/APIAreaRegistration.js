var 
	Path = require('path'),
	Express = require('express'),
	Busboy = require('connect-busboy'),
	Config = require(appRoot + '/config');

var	
	UtilTool = require(appRoot + '/models/UtilTool'),	
	GPS = require('./controller/GPSController'),
	Photo = require('./controller/PhotoController');

var cacheTime = Config.cacheTime,
	uploadSize = Config.uploadSize;

var APIAreaRegistration = function(app){	
	this.root = '/API';	
	

	var
		tool = new UtilTool(),	
		gps = new GPS(),
		photo = new Photo();
	
	app.use(this.root ,Express.static(Path.join(appRoot, 'public/API'), { maxAge: cacheTime }));	
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
	
	app.route(this.root + '/photo/:width(\\d+)/:height(\\d+)/:path')
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
};	

module.exports = APIAreaRegistration;