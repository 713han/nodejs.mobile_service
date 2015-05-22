var PhotoData = function(){
		
	this._id = 0;
	this.strID = '';
	this.path = '';
	this.filename = '';
	this.url = '';
	this.createDate = '';
	this.exif = {};
}

/*
 * result:function(err, obj);
 */
PhotoData.prototype.set = function(id, path, filename, url, exif, createDate, result){	
	
	this.strID = id;
	this.path = path;
	this.filename = filename;
	this.url = url;
	this.exif = exif;
	this.createDate = createDate;
	
	result(null, this);
}

module.exports = PhotoData;