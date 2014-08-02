$(document).foundation();

$(document).ready(function () {
	$('a').attr('target', '_blank');

	var explorer = $('#explorer')/*.mCustomScrollbar()*/;

	var socket = io('http://systemic.io');

	socket.emit('list', {
		path: '/'
	});

	socket.on('list.ed', function(data) {
		console.log(data);
		explorer.empty();
		for (var i = 0; i < data.dirs.length; i++) {
			explorer.append($('<li>').html('<a>' + data.dirs[i] + '</a>'));
		}
		explorer.append($('<li>', {
			class: 'divider'
		}));
		for (var i = 0; i < data.files.length; i++) {
			explorer.append($('<li>').html('<a>' + data.files[i] + '</a>'));
		}
	});

});




