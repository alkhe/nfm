module.exports = function(io) {
	var express = require('express'),
		router = express.Router(),
		fs = require('fs'),
		async = require('async'),
		dir = require('node-dir'),
		path = require('path');

	router.get('/', function (req, res) {
		res.render('index', {

		});
	});

	io.on('connection', function(socket) {
		socket.on('list', function(data) {
			dir.paths(path.join('/', data.path), function(err, paths) {
				socket.emit('list.ed', err || {
					dirs: paths.dirs,
					files: paths.files
				});
			});
		});
	});

	return router;
};
