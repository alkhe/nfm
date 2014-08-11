$(document).ready(function () {
	$('a').attr('target', '_blank');

	var body = $(document),
		explorer = $('#explorer').mCustomScrollbar({
			axis: 'y',
			theme: 'light-thin',
			scrollInertia: 300
		}),
		explorerinternal = explorer.find('.mCSB_container'),
		separator = $('#separator'),
		viewport = $('#viewport').mCustomScrollbar(),
		socket = io('http://systemic.io'),
		quickroot = $('#root'),
		quickup = $('#up'),
		explorerpath = '/',
		requestDirectory = function (p) {
			if (!explorerbusy) {
				socket.emit('client.list', {
					path: p
				});
				explorerbusy = true;
			}
		},
		drag = false,
		dragseparator = false,
		explorerbusy = false;

	body.on('mousedown', function (e) {
		drag = true;
	}).on('mouseup', function (e) {
		drag = false;
		dragseparator = false;
	}).on('mousemove', function (e) {
		if (drag) {
			if (dragseparator) {
				explorer.css({
					width: e.pageX
				});
				separator.css({
					left: e.pageX
				});
				viewport.css({
					left: e.pageX + 1
				});
			}
		}
	});

	separator.on('mousedown', function () {
		dragseparator = true;
	});

	explorer.on('click', '.item', function () {
		var self = $(this);
		if (self.hasClass('folder')) {
			explorerpath = path.join(explorerpath, self.text());
			requestDirectory(explorerpath);
		}
	});

	requestDirectory(explorerpath);

	socket.on('server.list', function (data) {
		explorerinternal.empty();
		for (var i = 0; i < data.dirs.length; i++) {
			explorerinternal.append($('<div>', {
				class: 'item folder'
			}).html('<a>' + data.dirs[i] + '</a>'));
		}
		for (var i = 0; i < data.files.length; i++) {
			explorerinternal.append($('<div>', {
				class: 'item file'
			}).html('<a>' + data.files[i] + '</a>'));
		}
		explorerbusy = false;
	});

	quickroot.on('click', function () {
		explorerpath = '/';
		requestDirectory(explorerpath);
	});

	quickup.on('click', function () {
		explorerpath = path.dirname(explorerpath);
		requestDirectory(explorerpath);
	});

});
