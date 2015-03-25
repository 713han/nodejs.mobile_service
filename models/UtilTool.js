var 
	Moment = require('moment'),
	Crypto = require('crypto');

var UtilTool = function(){

};

UtilTool.prototype.getNowDateString = function(){
	return Moment().format('YYYY-MM-DD HH:mm:ss');
};

UtilTool.prototype.isOnTime = function(targetDate){
	var nowDate = Moment().format('YYYY-MM-DD HH:mm:ss');	
	var tmpDate = Moment(targetDate, 'YYYY-M-DD HH:mm:ss');
	
	return Boolean(tmpDate.diff(nowDate, 'seconds') <= 0);
};

UtilTool.prototype.getSHA256Hash = function(string){
	var hash = Crypto.createHash('sha256').update(string).digest('base64');
	return hash;
};

UtilTool.prototype.getBFEncode = function(key, string){
	var cipher = Crypto.createCipher("blowfish", key);
	var encode = cipher.update(string, 'utf8', 'base64');
	encode += cipher.final('base64');
	
	return encode;
};

UtilTool.prototype.getBFDecode = function(key, string){
    var cipher = Crypto.createDecipher('blowfish', key);
    var decode = cipher.update(string, 'base64', 'utf8')
    decode += cipher.final('utf8');
    
    return decode;
};

UtilTool.prototype.checkRole = function (role, func){	
	return function(req, res, next){
		for(var key in role){
			var index = req.user.roles.indexOf(role[key]);
			if(index >= 0){
				return func(req, res, next);
			}
		}
		res.redirect(global.HOME_DIR + '/home/index');
	};
};

module.exports = UtilTool;