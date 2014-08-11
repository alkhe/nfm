module.exports = function(io) {
	var express = require('express'),
		router = express.Router(),
		fs = require('fs'),
		path = require('path'),
		fstack = require('fstack'),
		async = require('async');

	router.get('/', function (req, res) {
		res.render('index', {

		});
	});

	io.on('connection', function(socket) {
		socket.on('client.list', function(data) {
			async.parallel({
				files: function(next) {
					fstack.files(data.path, next);
				},
				dirs: function(next) {
					fstack.dirs(data.path, next);
				}
			}, function(err, data) {
				if (err)
					return console.log(err);
				socket.emit('server.list', data);
			});
		});
	});

	return router;
};
