var
	Async = require('async'),
	Status = require('./DataObj/Status'),
	RoleList = require('./DataObj/RoleList'),
	DALMyAdminLogin = require('./DAL/DALMyAdminLogin'),
	DALMyAdminMapping = require('./DAL/DALMyAdminMapping'),
	DALMyAdminRole = require('./DAL/DALMyAdminRole'),
	AdminLogin = require('./DataObj/AdminLogin'),
	UtilTool = require('./UtilTool');	

var 
	dalLogin = new DALMyAdminLogin(),
	dalMapping = new DALMyAdminMapping(),
	dalRole = new DALMyAdminRole(),
	loginObj = new AdminLogin(),
	tool = new UtilTool();

var AdminLoignFactory = function(){

};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.createUser = function(username, password, nickname, roleIDs, createbyid, result){
	Async.waterfall([ 
	function(callback) {
		loginObj.set(username, password, nickname, createbyid, callback);
	}, 
	function(loginObj, callback) {
		dalLogin.getByUserName(loginObj.username, function(err, obj){
			if(err){
				callback('Check user failed', err);
			}else{				
				if(obj.length > 0){					
					callback('User already exists', null);
				}else{
					callback(null, loginObj);
				}				
			}
		});
	},
	function(loginObj, callback) {		
		dalLogin.insert(loginObj, function(err, data){
			if(err){
				callback('Create user failed', err);
			}else{
				callback(null, { id: data.id });
			}
		});		
    }, 
    function(obj, callback) {
		var insertObj = [];
			
		function each(row, next) {
			insertObj.push([obj.id, row]);
			next(null);		    	
		}

		function done() {
		   	dalMapping.insertRole(insertObj, function(err, data){
				if(err){
					callback('Create user role failed', err);
				}else{
					callback(null, obj.id);
				}					
			});
		}
		    
	    Async.eachSeries(roleIDs, each, done);
		
    }], function(err, resultObj) {
		var status = new Status();
		if (err) {			
			status.set(false, err, resultObj, result);
		}else{
			status.set(true, '', resultObj, result);
		}
	});
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.getList = function(page, itemPerPage, result){	
	
	Async.waterfall([	   
	function(callback) {
		dalLogin.getList(page, itemPerPage, function(err, data){
			if(err){
				callback('Get data Failed', err);
			}else{
				if(data.paging.totalItem > 0){	    			
	    			callback(null, data);
	    		}else{
	    			callback('Data not found', data);
	    		}
			}
		});
	}], function(err, resultObj) {
		var status = new Status();
		if (err) {			
			status.set(false, err, resultObj, result);
		}else{
			status.set(true, '', resultObj, result);
		}
	});
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.verify = function(username, pw, result){	
	Async.waterfall([	   
	function(callback) {
		dalLogin.getByUserName(username, function(err, data){
			if(err){				
				callback('Get data Failed', err);
			}else{
				if(data.length > 0){	
					var pwHash = tool.getSHA256Hash(pw);
					if(pwHash == data[0].UserPass){
						callback(null, data[0]);
					}else{
						callback('Access denied', null);
					}
	    		}else{
	    			callback('Access denied', null);
	    			//callback('User not found', null);
	    		}
			}
		});
	},
	function(user, callback) {
		dalMapping.getList(user.ID, function(err, data){
			if(err){
				callback('Get data Failed', err);
			}else{
				var roleIDs = new Array(data.length);
				for(var key in data){
					roleIDs[key] = data[key].RoleID;
				}
				callback(null, user, roleIDs);
			}
		});	
	},
	function(user, roleIDs, callback) {
		
		var updObj = {
			LastLoginDate : tool.getNowDateString()
		};
		dalLogin.update(user.ID, updObj, function(err, data){
			var obj = {
				id: user.ID,
				username: user.UserName,
				nickname: user.NickName,
				roles: roleIDs,
				photo: user.ProfilePhoto
			};
			callback(null, obj);						
		});
	
	}], function(err, resultObj) {
		var status = new Status();
		if (err) {			
			status.set(false, err, resultObj, result);
		}else{
			status.set(true, '', resultObj, result);
		}
	});
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.getData = function(id, result){	
	Async.waterfall([	   
	function(callback) {
		dalLogin.getData(id, function(err, data){	
			if(err){
				callback('Get data Failed', err);
			}else{
				if(data.length > 0){						
					callback(null, data[0]);					
	    		}else{
	    			callback('User not found', null);
	    		}
			}
		});
	}], function(err, resultObj) {
		var status = new Status();
		if (err) {			
			status.set(false, err, resultObj, result);
		}else{
			status.set(true, '', resultObj, result);
		}
	});
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.enableUser = function(id, isActive, result){	
	Async.waterfall([
	function(callback) {
		var updObj = {
			IsActive : parseInt(isActive)
		};
		
		dalLogin.update(id, updObj, function(err, data){
			if(err){
				callback('Change failed', err);
			}else{
				callback(null, data);
			}					
		});
	}], function(err, resultObj) {
		var status = new Status();
		if (err) {			
			status.set(false, err, resultObj, result);
		}else{
			status.set(true, '', resultObj, result);
		}
	});
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.getRoleListInit = function(id, callback) {
	var treeSet = [];
	
	dalRole.getList(id, function (err, rows) {
		if(err){
			callback(treeSet);
		}else{
			function each(row, next) {
			    AdminLoignFactory.prototype.getRoleListInit(row.ID, function (children) {
			    	var role = new RoleList();
					role.set(row.ID, row.UserRoleDesc, false, children, function(roleData){
						treeSet.push(roleData);
					});
							    			
		    		next(null);
		    	});
		    }

		    function done() {
		    	callback(treeSet);
		    }
	    	Async.eachSeries(rows, each, done);
		}
    });	
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.getRoleList = function(id, pid, callback) {
	var treeSet = [];
	
	dalRole.getUserRoleList(id, pid, function (err, rows) {
		if(err){
			callback(treeSet);
		}else{
			function each(row, next) {
			    AdminLoignFactory.prototype.getRoleList(id, row.ID, function (children) {
			    	var role = new RoleList();
					role.set(row.ID, row.UserRoleDesc, row.MID, children, function(roleData){
						treeSet.push(roleData);
					});
							    			
		    		next(null);
		    	});
		    }

		    function done() {
		    	callback(treeSet);
		    }
	    	Async.eachSeries(rows, each, done);
		}
    });	
};

/*
 * result:function(err, obj);
 */
AdminLoignFactory.prototype.updUser = function(userid, nickname, roleIDs, result){
	Async.waterfall([
	function(callback) {		
		var updObj = {
			NickName : nickname
		};
			
		dalLogin.update(userid, updObj, function(err, data){
			if(err){
				callback('Change failed', err);
			}else{
				callback(null, {id: userid});
			}					
		});		
    }, 
    function(obj, callback) {
		dalMapping.removeAllRole(obj.id, function(err, data){
			if(err){
				callback('Change failed', err);
			}else{
				callback(null, obj);
			}					
		});		
    }, 
    function(obj, callback) {
		var insertObj = [];
			
		function each(row, next) {
			insertObj.push([obj.id, row]);
			next(null);		    	
		}
		
		function done() {
		   	dalMapping.insertRole(insertObj, function(err, data){
				if(err){
					callback('Change failed', err);
				}else{
					callback(null, obj.id);
				}					
			});
		}
		    
	    Async.eachSeries(roleIDs, each, done);
		
    }], function(err, resultObj) {
		var status = new Status();
		if (err) {			
			status.set(false, err, resultObj, result);
		}else{
			status.set(true, '', resultObj, result);
		}
	});
};

module.exports = AdminLoignFactory;
