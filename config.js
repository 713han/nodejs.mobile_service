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
	
module.exports = config;
