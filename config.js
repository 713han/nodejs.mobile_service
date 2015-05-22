var config = {}
switch(process.env.SERVER_env){
	case 'develop':
		config.EventsConn = {
			host: 'localhost',
			user: 'hanshuang',
			password: '0000',
			database: 'MobileService',
			multipleStatements: true
		};	

		config.SessionStoreOptions = {
			host: 'localhost',
			port: 3306,
			user: 'hanshuang',
			password: '0000',
			database: 'MobileService',
			checkExpirationInterval: 900000,
		    expiration: 1000 * 60 * 30
		};
		
		config.MongoDBConn = 'mongodb://127.0.0.1:27017/PhotoService';
		
		break;
	case 'production':
		config.EventsConn = {
			host: 'localhost',
			user: 'hanshuang',
			password: '0000',
			database: 'MobileService',
			multipleStatements: true
		};	

		config.SessionStoreOptions = {
			host: 'localhost',
			port: 3306,
			user: 'hanshuang',
			password: '0000',
			database: 'MobileService',
			checkExpirationInterval: 900000,
		    expiration: 1000 * 60 * 30
		};
		
		config.MongoDBConn = 'mongodb://127.0.0.1:27017/PhotoService';
		
		break;
	default:
		config.EventsConn = {
			host: 'localhost',
			user: 'hanshuang',
			password: '0000',
			database: 'MobileService',
			multipleStatements: true
		};	

		config.SessionStoreOptions = {
			host: 'localhost',
			port: 3306,
			user: 'hanshuang',
			password: '0000',
			database: 'MobileService',
			checkExpirationInterval: 900000,
		    expiration: 1000 * 60 * 30
		};
		
		config.MongoDBConn = 'mongodb://127.0.0.1:27017/PhotoService';
		break;
}

config.lruOptions = {
	max: 5000,					   
	dispose: function (key, n) { n = 0; }, 
	maxAge: 1000 * 60 * 60 //milliseconds in 1 hour
};

config.cacheTime = 1000 * 60 * 60 * 24 * 7; //ms * s * min * hour * day = week
config.uploadSize = 5 * 1024 * 1024; //byte * K * M = MB 
config.hostname = 'http://10.2.10.128:8080/';
config.imgHome = '/home/OriginPhoto/';
config.ipLimit = {
	'10.2.10.15' : false,
	'192.168.56.2' : false,
	'10.2.3.62' : true
};


module.exports = config;
