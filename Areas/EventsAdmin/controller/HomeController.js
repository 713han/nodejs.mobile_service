var
	UUID = require('node-uuid'),
	Async = require('async'),
	Passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,	
	AdminLoginFactory = require('../models/AdminLoginFactory');

var
	loginFact = new AdminLoginFactory();

Passport.use('local', new LocalStrategy(
	function (username, password, done) {
		loginFact.verify(username, password, function(err, result){
			if(err){
				return done(null, false, err);
			}else{
				if(result.status === true){
					return done(null, result.Object);
				}else{
					return done(null, false, result);
				}
			}				
		});
    }		
));

Passport.serializeUser(function (user, done) {
	//保存user物件至session
	done(null, user);//可以通过数据库方式操作
});

Passport.deserializeUser(function (user, done) {
	//解析session內的user物件
	done(null, user);//可以通过数据库方式操作
});

var HomeController = function(root){
	this.root = root;
};

HomeController.prototype.homePage = function(req, res){
	res.redirect('Home/login');
};

HomeController.prototype.index = function(req, res){
	
	var viewData = {		
		identify:'componentsDemo',
		menu:'',
		title: 'Event Site Index',
		userName: req.user.nickname
	};
	
	res.render('Home/index',viewData);
};

HomeController.prototype.loginForm = function(req, res){
	
	if (req.isAuthenticated()){
		res.redirect('index');
	}else{		
		var viewData = {
			identify:'login',
			title: 'Login'			
		};
		
		res.render('Home/login',viewData);
	}
};

HomeController.prototype.login = function(req, res, next){
	
	if (req.body.remember) {
		//勾選記住我，登入有效期設定為14天
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 14;
    }
	
	Passport.authenticate('local', function(err, user, info) {		
		if (err) { return next(err); }
		if (!user) { return res.send(info); }
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			//return res.redirect(global.HOME_DIR + '/Home/index');
			return res.send({ status: true, redirect: 'index'});			
		});
	})(req, res, next);
};

HomeController.prototype.logout = function(req, res){
	req.logout();
	req.session.destroy();
    res.redirect('login');
};

module.exports = HomeController;