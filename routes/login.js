/**
 * Login
 *
 * Route schema
 *  /login
 *      GET
 *      POST
 */

'use strict';

var chalk = require('chalk'),
    consoleLog = chalk.yellow('routes/login.js'),
    express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose').set('debug', true),
    User = mongoose.model('user'),
    Password = mongoose.model('password'),
    UserImage = mongoose.model('user-image'),
    UserSession = mongoose.model('user-session');

module.exports = router;


/**
 * Log middelware
 */
router.use(function(req, res, next) {
    console.log(chalk.inverse('Log middelware'), chalk.dim(req.method), req.url);

    // allow if no session or /setsession or /out
    if(req.session.auth && (req.url == '/')){
        console.log(chalk.inverse('not allowed'));
        res.format({
            // HTML response
            html: function(){
                res.redirect("/");
            },
            //JSON response
            json: function(){
                res.json('access allowed');
            }
        });
    }
    else{
        console.log(chalk.inverse('allowed'));
        next();
    }
});



/**
 * Login index
 */
router.route('/')

    // GET login form
    .get(function(req, res, next) {
        console.log(consoleLog, 'router.route(/).get()');

        res.format({
            // HTML response
            html: function(){
                res.render('login/index', {
                    title: 'Login',
                    redirect: req.query.redirect,
                    error: req.query.error
                });
            }
        });
    })

    // POST user
    .post(function(req, res) {
        console.log(consoleLog, 'router.route(/).post()');

        // Find user
        User.findOne({ 'username': req.body.username }, function (err, user) {

            // if user
            if (user) {
                console.log(consoleLog, 'User found');
                console.log(user);

                // Find password
                Password.find({'user': user._id, 'password': req.body.password}, '', function (err, pass) {

                    // if password
                    if(pass.length != 0){
                        console.log(consoleLog, 'Password found & correct');

                        // set session
                        req.session.auth = user;

                        console.log(chalk.inverse('User logged'), chalk.dim(req.session.auth));


                        // redirection url
                        var redirectURL = req.query.redirect;
                        if(redirectURL == 'undefined') redirectURL = '';
                        console.log(consoleLog, 'Redirection: '+ redirectURL);

                        // Redirect
                        res.format({
                            html: function(){
                                res.redirect("/login/setsession?redirect="+ redirectURL);
                            }
                        });

                    } else {
                        console.log(consoleLog, 'Password not found');

                        // Redirect
                        res.format({
                            html: function(){
                                res.redirect("/login?error=Username or password not correct.");
                            }
                        });
                    }
                });
            } else {
                console.log(consoleLog, 'User not found');

                // Redirect
                res.format({
                    html: function(){
                        res.redirect("/login?error=Username or password not correct.");
                    }
                });
            }
        });
    });




/**
 * Login set session
 */
router.route('/setsession')

    // GET login form
    .get(function(req, res, next) {
        console.log(consoleLog, 'router.route(/setsession).get()');

        if(!req.session.auth){
            // Redirect
            res.format({
                html: function(){
                    res.redirect("/login?redirect="+ req.query.redirect);
                }
            });
        }

        UserImage.findOne({ 'user': req.session.auth._id }, function (err, image) {
            if (image) {
                console.log(consoleLog, 'Image found: ' + image.name);
                // set session
                req.session.auth.avatar = req.protocol + '://' + req.get('host') +'/uploads/avatars/'+ image.name;
                console.log('avatar: ' + req.session.auth.avatar)
            }

            // Set the user session
            UserSession.findOne({ 'user': req.session.auth._id }, function (err, session){
                if(session){
                    session.logged = 1;
                    session.date = Date.now();
                    session.save();

                    // set session
                    req.session.auth.session = session.date;
                    console.log(consoleLog, 'User session updated.');
                }
                else{
                    // Add session
                    UserSession.create({
                        user:        req.session.auth._id,
                        logged:      1,
                        date:        Date.now()
                    }, function (err, small){
                        // set session
                        req.session.auth.session = Date.now();
                        console.log(consoleLog, 'User session created.')
                    });
                }

                // Redirect
                res.format({
                    html: function(){
                        res.redirect("/"+ req.query.redirect);
                    }
                });
            });
        });
    });


/**
 * Login out
 */
router.route('/out')

    // GET login form
    .get(function(req, res, next){
        console.log(consoleLog, 'router.route(/out).get()');

        // if session
        if(req.session.auth){
            // Set the user session
            User.findOne({ 'username': req.session.auth.username }, function (err, user){
                UserSession.findOne({ 'user': user._id }, function (err, session){
                    session.logged = 0;
                    session.save();

                    console.log(consoleLog, 'User session updated.');
                });
            });
        }


        res.format({
            // HTML response
            html: function(){
                delete req.session.auth;
                res.redirect("/");
            },
            //JSON response
            json: function(){
                res.json('Bye bye');
            }
        });
    });