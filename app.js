var Path = require('path');
global.appRoot = Path.resolve(__dirname);

var Express = require('express'), 
	EjsEngine = require('ejs-locals'),
	Http = require('http'), 
	Fs = require('fs'),
	Cluster = require('cluster'),
	Favicon = require('serve-favicon'),	
	BodyParser = require('body-parser'),
	Morgan = require('morgan'),
	MethodOverride = require('method-override'),
	ErrorHandler = require('errorhandler'),
	CookieParser = require('cookie-parser'),
	Flash = require('connect-flash'),
	Log4js = require('log4js'),
	Config = require('./config'),
	EventsAdminAreaRegistration = require('./Areas/EventsAdmin/EventsAdminAreaRegistration'),
	APIAreaRegistration = require('./Areas/API/APIAreaRegistration');
	
var app = Express(),
	applog  = Log4js.getLogger();

// all environments
app.engine('ejs', EjsEngine);
app.set('port', process.env.PORT || 80);

/*
app.set('views', [__dirname + '/Areas/EventsAdmin/views/',
                  __dirname + '/Areas/21newyear/views/']);
*/
app.set('views', []);
app.set('view engine', 'ejs');
app.use(new Favicon(__dirname + '/public/EventsAdmin/2010favicon.ico'));
app.use(new Morgan('tiny', {
	  "stream": {
		  write: function(str) { applog.info(str); }
	  }
	}));
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
app.use(new MethodOverride());
app.use(new CookieParser());

app.use(new Flash());

// development only
if ('development' == app.get('env')) {
	app.use(new ErrorHandler());
}

Log4js.configure({ 
	"appenders": [{ "type": "dateFile",
					"filename": __dirname + "/logs/logfile.log",
					"pattern": "-yyyy-MM-dd",
					"alwaysIncludePattern": true
	              }]
});

if (Cluster.isMaster) {
	var workers = {};
	
	process.title = 'MobileService Master';
	console.log(process.title + ' started');
	
	// 根據 CPU 個數來啟動相應數量的 worker
	for (var i = 0; i < 1; i++) {
		newThread();	
	}
	
	process.on('SIGHUP', function() {
		// master 進程忽略 SIGHUP 信號
	});

	Cluster.on('exit', function(worker) {
		delete workers[worker.process.pid];
		console.log('MobileService #' + worker.process.pid + ' worker died');
		newThread();
	});
	
	// 監測文件改動，如果有修改，就將所有的 worker kill 掉
	Fs.watch(__dirname, function(event, filename) {		
		killAllThread();
	});	
	
	function newThread(){
		var worker = Cluster.fork();
		workers[worker.process.pid] = worker.id;
	};
	
	function killAllThread(){
		for(var pid in workers){
			Cluster.workers[workers[pid]].kill();	
			delete workers[pid];					
		}
	};
	
	
} else {
	process.title = 'MobileService@' + app.get('port') + ' #' + process.pid;
	console.log(process.title + ' worker started');

	process.on('SIGHUP', function() {
		// 接收到 SIGHUP 信號時，關閉 worker
		process.exit(0);
	});
	
	var eventsAdmin = new EventsAdminAreaRegistration(app);
	var api = new APIAreaRegistration(app);
	
	Http.createServer(app).listen(app.get('port'));
}

