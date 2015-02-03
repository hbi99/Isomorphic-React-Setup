'use strict';

// enables JSX requires
require('node-jsx').install({ extension: '.jsx' });

var debug        = require('debug')('app');
var express      = require('express');
var path         = require('path');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var cachebuster  = require('./cachebuster');
var serverRender = require('./server.jsx');
var config       = require('./config');

var app = express();

app.use(logger(app.get('env') === 'production' ? 'combined' : 'dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// configuration settings
config = config[app.get('env')];
config.base = 'http://'+ config.domain +':'+ config.wp_port;

// static files with cache buster
var publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

switch (app.get('env')) {
	case 'production':
		app.get(cachebuster.path,
				cachebuster.remove,
				express.static(publicPath),
				cachebuster.restore);
		break;
	case 'development':
		// run livereload and webpack dev server
		require('./dev-tools');
		// use webpack dev server for serving js files
		app.use('/js', function (req, res) {
			res.redirect(config.base +'/js' + req.path);
		});
		break;
}

// use react routes
app.use('/', serverRender);

// error pages
app.use(function (err, req, res, next) {
	res.status(500);
	// TODO: simple page for errors not in dev environment
	res.send('<pre>' + err.stack + '</pre>');
});

app.set('port', process.env.PORT || config.ws_port);

app.listen(app.get('port'), function () {
	debug('Express ' + app.get('env') + ' server listening on port ' + this.address().port);
});
