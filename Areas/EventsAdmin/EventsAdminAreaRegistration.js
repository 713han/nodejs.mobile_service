var 
	Path = require('path'),
	Express = require('express'),
	Passport = require('passport'),
	Session = require('express-session'),
	SessionStore = require('express-mysql-session'),
	Config = require(appRoot + '/config');
	

var	
	UtilTool = require('./models/UtilTool'),	
	Home = require('./controller/HomeController'),
	Sys = require('./controller/SysController');


var cacheTime = 1000 * 60 * 60 * 1 * 1; //ms * s * min * hour * day


var EventsAdminAreaRegistration = function(app){	
	this.root = '/EventsAdmin';	

	var
		tool = new UtilTool(),	
		home = new Home(this.root),
		sys = new Sys(),		
		sessionStore = new SessionStore(Config.SessionStoreOptions);
	
	var EventsAdmin = {
		home : this.root,
		isInRole : isInRole
	};
	
	function isAuth(req, res, next) {
		
	    if (req.isAuthenticated()){
	    	app.locals.EventsAdmin.roleIDs = req.user.roles;
	    	app.locals.EventsAdmin.userProfilePhoto = req.user.photo || '/EventsAdmin/assets/images/RD2-1.png';
	        return next();
		}	    
	    res.redirect('/EventsAdmin/Home/login');
	};

	function isInRole(roles){
		for(var key in roles){
			var index = app.locals.EventsAdmin.roleIDs.indexOf(roles[key]);
			if(index >= 0){
				return true;
			}
		}
		return false;
	};
	
	app.locals.EventsAdmin = EventsAdmin;
	
	app.use(new Session({
		key: 'event_site',
	    secret: 'meir93fn58qknw83',
	    store: sessionStore,
	    resave: true,
	    saveUninitialized: false,
	    cookie: { maxAge: 1000 * 60 * 30 } //預設有效期間  ms * s * m 
	}));
	
	app.use(this.root ,Express.static(Path.join(appRoot, 'public/EventsAdmin'), { maxAge: cacheTime }));
	app.use(Passport.initialize());
	app.use(Passport.session());
	
	app.get('views').push(__dirname + '/views_angular/');
	
	app.route(this.root + '/info')
		.all(isAuth)
		.get(function(req, res){
			res.send(process.env.SERVER_env || app.get('env'));
		});
	
	app.route(this.root)
		.get(home.homePage);

	app.route(this.root + '/Home')
		.get(home.homePage);

	app.route(this.root + '/Home/login')
		.get(home.loginForm)		
		.post(home.login);

	app.route(this.root + '/Home/logout')
		.get(home.logout);

	app.route(this.root + '/Home/index')
		.all(isAuth)
		.get(home.index);

	app.route(this.root + '/Sys/createuser')
		.all(isAuth)
		.get(tool.checkRole([2],sys.createUserForm))
		.post(tool.checkRole([2],sys.createUser));

	app.route(this.root + '/Sys/rolelistinit/:pid(\\d+)')
		.all(isAuth)
		.get(tool.checkRole([2],sys.getRoleListInit));

	app.route(this.root + '/Sys/enableuser')
		.all(isAuth)
		.post(tool.checkRole([3],sys.enableUser));

	app.route(this.root + '/Sys/userlist')
		.all(isAuth)
		.get(tool.checkRole([3],sys.getListForm))
		.post(tool.checkRole([3],sys.getList));	
	
	app.route(this.root + '/Sys/profile/:id(\\d+)')
		.all(isAuth)
		.get(tool.checkRole([3],sys.getProfileForm)) //For Angular
		//.get(tool.checkRole([3],sys.getProfile)); //For jQuery
	
	//For Angular
	app.route(this.root + '/Sys/profile/getData')
		.all(isAuth)
		.post(tool.checkRole([3],sys.getProfileData));
	
	app.route(this.root + '/Sys/profile')
		.all(isAuth)		
		.post(tool.checkRole([3],sys.setProfile));

	app.route(this.root + '/Sys/profile/rolelist/:pid(\\d+)/:id(\\d+)')
		.all(isAuth)
		.get(tool.checkRole([3],sys.getRoleList));
};

module.exports = EventsAdminAreaRegistration;