module.exports = function(io) {
	var express = require('express'),
		router = express.Router(),
		fs = require('fs'),
		fstack = require('fstack'),
		path = require('path');

	router.get('/', function (req, res) {
		res.render('index', {

		});
	});

	/*io.on('connection', function(socket) {
		socket.on('list', function(data) {
			socket.emit('list.ed')
		});
	});*/

	return router;
};
