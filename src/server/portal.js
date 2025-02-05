/* jshint node:true */

'use strict';

var log = require('./logging.js').getLogger('portal.js');
var express = require('express');
var cookieParser = require('cookie-parser');
var http = require('http');
var path = require('path');
var config = require('./config.js');
var mongoDriver = require('./mongoDriver.js');
var bodyParser = require('body-parser');


// START
var swig = require('swig');
swig.setDefaults({cache: false});
var app = express();

app.use(require('./request-logger.js')
	.getLogger(require('./logging.js')
		.getLogger('HTTP'))
	.logger()
);
app.disable('view cache');

// page mappings
app.use(cookieParser());

app.use(function(req, resp, next) {
	if (req.cookies.authToken) {
		req.portalCtx = {
			mode: 'edit'
		};
	}

	next();
});

//app.get('/article/:id', pageController.renderArticle);
swig.setFilter('httpPrefixed', function(value) {
	if (value && 
			(value.toLowerCase().indexOf('http://') === 0 || value.toLowerCase().indexOf('https://') === 0)) {
		return value;
	}

	return 'http://' + value;
});


app.use(function(err, req, res, next) {
	log.error('PAGE ERROR %s', req.path, err);
	res.status(500).send(err);
});

mongoDriver.init(config.mongoDbURI, function(err) {
	if (err) {
		throw err;
	}

	var pageController = require('./portal/page-controller.js');
	pageController.init(mongoDriver);

	app.get('/:page?', pageController.renderPage);
	app.get('/article/:aid?/:page?', pageController.renderPage);
	app.get('/competition/list', pageController.competitionsList);
	app.get('/competition/matches/:cid', pageController.competitionMatches);
	app.get('/competition/results/:cid', pageController.competitionResults);
	app.get('/competition/refereeReport/:mid', pageController.renderRefereeReport);

	app.use(express.static(path.join(process.cwd(), 'data', 'portal')));
	app.use('/portal', express.static(path.join(process.cwd(), 'data', 'portal', 'client')));
	app.use('/photos/get', express.static(path.join(process.cwd(), 'data', 'photos')));
	app.use('/uploads/get', express.static(path.join(process.cwd(), 'data', 'uploads')));

	app.put('/schema/:schema', bodyParser.json(), pageController.saveSchema);

	// If nothing worked so far show 404
	//app.use(pageController.renderNotFound);

	http.createServer(app)
	.listen(config.portalPort, config.portalHost, function() {
		log.info('Http server listening at %s:%s', config.portalHost, config.portalPort);
	});
});
