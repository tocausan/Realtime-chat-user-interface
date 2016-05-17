/**
 * Package requirement
 */

var express = require('express'),
    app = express(),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    mongoose = require('mongoose').set('debug', true),
    multer = require('multer');


/**
 * Database config
 */

var database = require('./database/config');



/**
 * App set up
 */

// Environment
app.use(logger('dev'));


// Favicon
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Session
function createSecret(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 25; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
app.use(session({secret: createSecret()}));





/**
 * Export module
 */

module.exports = app;


/**
 * Routes
 */

// Config
// Allow CORS (cross-domain sharing)
// Set the client domain
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:7000');
    res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});


// Index
app.use('/', require('./routes/index'));
app.use('/index', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/session', require('./routes/session'));
app.use('/chat', require('./routes/chat'));
app.use('/user', require('./routes/user'));
app.use('/profile', require('./routes/profile'));
app.use('/upload', require('./routes/upload'));
app.use('/post', require('./routes/post'));


// Errors
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


