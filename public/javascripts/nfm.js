$(document).ready(function () {
	$('a').attr('target', '_blank');

	var socket = io('http://systemic.io'),
		body = $(document),
		viewport = $('#viewport').mCustomScrollbar(),
		dragging = false;

	body.on('mousedown', function(e) {
		dragging = true;
	}).on('mouseup', function(e) {
		dragging = false;
		sep.dragging = false;
	}).on('mousemove', function(e) {
		if (dragging) {
			if (sep.dragging) {
				sep.handle(e);
			}
		}
	});

	var Explorer = can.Control.extend({
		busy: false,
		init: function(el, options) {
			this.root = options.root || '/';
			this.path = options.path || this.root;
			this.log = options.log || $('#logbar');
			el.find('#exfs').mCustomScrollbar({
				axis: 'y',
				theme: 'light-thin',
				scrollInertia: 300
			});
			this.container = this.element.find('.mCSB_container');
			this.requestDirectory();
		},
		listDirectory: function(p) {
			if (!(this.busy || path.relative(this.root, p).match(/\.\./))) {
				this.busy = true;
				this.path = p;
				this.requestDirectory();
			}
		},
		requestDirectory: function() {
			this.log.log('Get directory ' + this.path);
			socket.emit('client.list', {
				path: this.path
			});
		},
		populateDirectory: function(dirs, files) {
			this.container.empty();
			for (i = 0; i < dirs.length; i++) {
				this.container.append($('<div>', {
					class: 'item folder',
					text: dirs[i]
				}));
			}
			for (i = 0; i < files.length; i++) {
				this.container.append($('<div>', {
					class: 'item file',
					html: files[i]
				}));
			}
			this.busy = false;
			this.log.success('Got directory ' + this.path);
		},
		'.item click': function(item) {
			if (item.hasClass('folder')) {
				this.listDirectory(path.join(this.path, item.text()));
			}
		},
		'#root click': function() {
			this.listDirectory(this.root);
		},
		'#up click': function() {
			this.listDirectory(path.dirname(this.path));
		}
	});

	var Separator = can.Control.extend({
		dragging: false,
		init: function(el, options) {
			this.ex = options.ex || $('#explorer');
			this.vp = options.vp || $('#viewport');
			this.log = options.log || $('#logbar');
		},
		handle: function (e) {
			this.ex.css({
				width: e.pageX
			});
			this.element.css({
				left: e.pageX
			});
			this.vp.css({
				left: e.pageX + 1
			});
		},
		'mousedown': function() {
			this.dragging = true;
		}
	});

	var Viewport = can.Control.extend({
		init: function(el, options) {
			this.log = options.log || $('#logbar');
		}
	});

	var Logbar = can.Control.extend({
		log: function(message) {
			this.element.empty().append($('<span>', {
				class: 'log',
				text: message
			}));
		},
		warn: function(message) {
			this.element.empty().append($('<span>', {
				class: 'warn',
				text: message
			}));
		},
		err: function(message) {
			this.element.empty().append($('<span>', {
				class: 'err',
				text: message
			}));
		},
		success: function(message) {
			this.element.empty().append($('<span>', {
				class: 'success',
				text: message
			}));
		}
	});

	var lb = new Logbar('#logbar', {

	}), ex = new Explorer('#explorer', {
		root: '/home/befelber',
		log: lb
	}), vp = new Viewport('#viewport', {
		log: lb
	}), sep = new Separator('#separator', {
		ex: ex.element,
		vp: vp.element,
		log: lb
	});

	socket.on('server.list', function(data) {
		ex.populateDirectory(data.dirs, data.files);
	});
});
