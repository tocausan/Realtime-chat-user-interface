/**
 * Index route
 * GET
 * POST
 */

var chalk = require('chalk'),
    consoleLog = chalk.yellow('routes/index.js'),
    express = require('express'),
    app = express(),
    router = express.Router(),
    server = require('http').Server(app);

module.exports = router;



/**
 * Root
 */

router.get('/', function(req, res, next) {

    console.log(consoleLog, 'router.route(/).get()');

    res.render('index', {
        auth: req.session.auth,
        title: 'Home',
        description: 'NodeJS application using ExpressJS, MongoDB, Foundation and Socket.io.'
    });
});

