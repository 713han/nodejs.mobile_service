var
	Fs = require("fs"),
	Path = require("path"),	
	UtilTool = require(appRoot + '/models/UtilTool');

var 
	utilObj = new UtilTool();

var StreamController = function(){
	
};

StreamController.prototype.get = function(req, res){
	var name = req.params.name;
	var file = Path.resolve(appRoot + '/data/API', name);
	
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

module.exports = StreamController;