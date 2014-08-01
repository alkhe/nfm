var fs = require('fs'),
	libpath = require('path');

var Driver = module.exports = {
		ls: function(callback) {
			fs.readdir(_path, callback);
		},
		cat: function(filename, stream) {
			fs.createReadStream(path.join(_path, filename)).pipe(stream);
		}
	};

Object.defineProperty(Driver, 'path', {
	get: function() {
		return path;
	},
	set: function(list) {
		path = (list instanceof Array ? libpath.join.apply(null, list) : libpath.normalize(list));
	}
});

Driver.path = '.';
