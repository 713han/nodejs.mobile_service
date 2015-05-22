var
	Fs = require("fs"),
	Path = require("path"),	
	FFmpeg = require('fluent-ffmpeg'),
	UtilTool = require(appRoot + '/models/UtilTool');

var 
	utilObj = new UtilTool();

var StreamController = function(){
	
};

StreamController.prototype.get = function(req, res){
	var name = req.params.name;
	var file = Path.resolve(appRoot + '/data/share', name);
	
    var range = req.headers.range;
    
    var positions;
    if(typeof(range) === 'undefined'){
    	positions = [0, 0];
    }else{
    	positions = range.replace(/bytes=/, "").split("-");
    }

    var start = parseInt(positions[0], 10);

	Fs.stat(file, function(err, stats) {
		if(err){
			res.status(404).send('Not Found');
		}else{
			var total = stats.size;
			var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
			var chunksize = (end - start) + 1;
			
			var headerObj = {
					"Content-Range" : "bytes " + start + "-" + end + "/" + total,
					"Accept-Ranges" : "bytes",
					"Content-Length" : chunksize,
					"Content-Type" : "video/mp4",
					"x-powered-by" : "Express (HansHuang)"
			};
			
			res.writeHead(206, headerObj);

			var stream = Fs.createReadStream(file, {
				start : start,
				end : end
			}).on("open", function() {
				stream.pipe(res);
			}).on("error", function(err) {
				res.end(err);
			});			
		}		
	});
};

StreamController.prototype.multOutput = function(req, res){
	var pathToMovie = appRoot + '/data/share/' + req.params.name;

	var proc = FFmpeg(pathToMovie)
		.seekInput('00:01:30')
		.inputOptions([           		  
           		  '-t 00:02:30'
        ])
        //.input(appRoot + '/data/API/2.png') //浮水印(不可與多輸出同時使用?)
		//.seekInput(60) //從何時開始
		.output(appRoot + '/data/share/out720p.mp4')		
        .addOptions([
           		  '-s 1280x720',
           		  '-strict',
           		  '-2'
        		])
        //.seek(30) 跳過
        .output(appRoot + '/data/share/out480p.mp4')		
        .addOptions([
           		  '-s 854x480',
           		  '-strict',
           		  '-2'
        		])        
        .output(appRoot + '/data/share/out240p.mp4')
		.addOptions([
           		  '-s 426x240',
           		  //'-filter_complex \'overlay=0:0\'', //浮水印(不可與多輸出同時使用?)
           		  '-strict',
           		  '-2'
        		])
		.on('start', function(cmd) {
			var sd = new Date();
			console.log(sd);
            console.log('Started ' + cmd);
        })
        .on('progress', function(info) {
		    //console.log('progress: ' + info.percent + '%');
		 })
		.on('end', function() {
			var sd = new Date();
			console.log(sd);
			console.log('file has been converted succesfully');
		})
		.on('error', function(err) {
			console.log(err);
			console.log('an error happened: ' + err.message);
		}).run();
	
	/*
	var proc = FFmpeg(pathToMovie)
		.preset('flashvideo')
		.on('end', function() {
			console.log('file has been converted succesfully');
		})
		.on('error', function(err) {
			console.log('an error happened: ' + err.message);
		})
		.pipe(res, {end : true});
	*/
	res.send('multOutput start...');
};

StreamController.prototype.watermark = function(req, res){
	var pathToMovie = appRoot + '/data/share/' + req.params.name;

	var proc = FFmpeg(pathToMovie)
		.seekInput('00:01:30')
		.inputOptions([           		  
           		  '-t 00:02:30'
        ])
        .input(appRoot + '/data/API/2.png') //浮水印(不可與多輸出同時使用?)
		.output(appRoot + '/data/share/watermark.mp4')		
        .addOptions([
           		  '-filter_complex \'overlay=0:0\'',
           		  '-strict',
           		  '-2'
        		])
		.on('start', function(cmd) {
			var sd = new Date();
			console.log(sd);
            console.log('Started ' + cmd);
        })
        .on('progress', function(info) {
		    //console.log('progress: ' + info.percent + '%');
		 })
		.on('end', function() {
			var sd = new Date();
			console.log(sd);
			console.log('file has been converted succesfully');
		})
		.on('error', function(err) {
			console.log(err);
			console.log('an error happened: ' + err.message);
		}).run();
	res.send('watermark start...');
};

StreamController.prototype.video2mp4 = function(req, res){
	var pathToMovie = appRoot + '/data/share/' + req.params.name;

	var proc = FFmpeg(pathToMovie)	
		.output(appRoot + '/data/share/out.mp4')
		.addOptions([
           		  '-strict',
           		  '-2'
        ])
		.on('start', function(cmd) {
			var sd = new Date();
			console.log(sd);
            console.log('Started ' + cmd);
        })
        .on('progress', function(info) {
		    console.log(info.percent + '%');
		 })
		.on('end', function() {
			var sd = new Date();
			console.log(sd);
			console.log('file has been converted succesfully');
		})
		.on('error', function(err) {
			console.log(err);
			console.log('an error happened: ' + err.message);
		}).run();	
	
	res.send('video2mp4 start...');
};

module.exports = StreamController;