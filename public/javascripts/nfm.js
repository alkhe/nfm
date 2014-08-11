$(document).ready(function () {
	$('a').attr('target', '_blank');

	var socket = io('http://systemic.io'),
		body = $(document),
		separator = $('#separator').on('mousedown', function() {
			dragseparator = true;
		}),
		viewport = $('#viewport').mCustomScrollbar(),
		drag = false,
		dragseparator = false;

	body.on('mousedown', function(e) {
		drag = true;
	}).on('mouseup', function(e) {
		drag = false;
		dragseparator = false;
	}).on('mousemove', function(e) {
		if (drag) {
			if (dragseparator) {
				ex.element.css({
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

	var Explorer = can.Control.extend({
		busy: false,
		path: '/',
		init: function() {
			this.element.find('#exfs').mCustomScrollbar({
				axis: 'y',
				theme: 'light-thin',
				scrollInertia: 300
			});
			this.container = this.element.find('.mCSB_container');
			this.requestDirectory();
		},
		listDirectory: function(p) {
			if (!this.busy) {
				this.busy = true;
				this.path = p;
				this.requestDirectory();
			}
		},
		requestDirectory: function() {
			socket.emit('client.list', {
				path: this.path
			});
		},
		'.item click': function(item) {
			if (item.hasClass('folder')) {
				this.listDirectory(path.join(this.path, item.text()));
			}
		},
		'#root click': function() {
			this.listDirectory('/');
		},
		'#up click': function() {
			this.listDirectory(path.dirname(this.path));
		}
	}), ex = new Explorer('#explorer', {});

	socket.on('server.list', function (data) {
		ex.container.empty();
		for (var i = 0; i < data.dirs.length; i++) {
			ex.container.append($('<div>', {
				class: 'item folder'
			}).html('<a>' + data.dirs[i] + '</a>'));
		}
		for (var i = 0; i < data.files.length; i++) {
			ex.container.append($('<div>', {
				class: 'item file'
			}).html('<a>' + data.files[i] + '</a>'));
		}
		ex.busy = false;
	});

});
