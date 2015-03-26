var 
	Path = require('path'),
	Express = require('express'),	
	Config = require(appRoot + '/config');

var	
	UtilTool = require(appRoot + '/models/UtilTool'),	
	GPS = require('./controller/GPSController');

var cacheTime = 1000 * 60 * 60 * 1 * 1; //ms * s * min * hour * day

var APIAreaRegistration = function(app){	
	this.root = '/API';	

	var
		tool = new UtilTool(),	
		gps = new GPS();
	
	app.use(this.root ,Express.static(Path.join(appRoot, 'public/API'), { maxAge: cacheTime }));	
	app.get('views').push(__dirname + '/views/');

	app.route(this.root + '/gps/list')
	   	.get(gps.getGPSList);

	app.route(this.root + '/gps/get/:id(\\w{24})')
		.get(gps.getGPSData);

	app.route(this.root + '/gps/upload')
		.post(gps.gpsLogUpload);
};	

module.exports = APIAreaRegistration;