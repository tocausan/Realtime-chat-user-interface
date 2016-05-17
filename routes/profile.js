/**
 * Profile
 *
 * Route schema
 *  /profile
 *      GET
 *      POST
 */

'use strict';

var chalk = require('chalk'),
    consoleLog = chalk.yellow('routes/profile.js'),
    express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('user'),
    Password = mongoose.model('password'),
    UserImage = mongoose.model('user-image'),
    UserSession = mongoose.model('user-session');

module.exports = router;


/**
 * Profile middelware
 */
router.use(function(req, res, next) {
    console.log(chalk.inverse('Profile middelware'), chalk.dim(req.method), req.url)

    if(req.session.auth){
        next();
    }
    else{
        res.format({
            // HTML response
            html: function(){
                res.redirect("/login?redirect=profile");
            },
            //JSON response
            json: function(){
                res.json('access not allowed');
            }
        });
    }
});




/**
 * Profile index
 */
router.route('/')

    // GET user
    .get(function(req, res, next) {
        console.log(consoleLog, 'router.route(/).get()');

        // get user
        User.findById(req.session.auth._id, function (err, user){

            // return
            res.format({
                // HTML response
                html: function(){
                    res.render('profile/index', {
                        auth: req.session.auth,
                        title: 'Profile'
                    });
                },
                //JSON response
                json: function(){
                    res.json(user);
                }
            });
        });
    })


    // PUT user
    .put(function(req, res) {
        console.log(consoleLog, 'router.route(/).put()');

        User.findById(req.session.auth._id, function (err, user) {
            user.username = req.body.username;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.save();

            // return
            var text = 'Profile updated !';
            console.log(text);

            res.format({
                json: function () {
                    res.json({message: text});
                }
            });
        })
    })

    // DELETE user
    .delete(function(req, res) {
        console.log(consoleLog, 'router.route(/).delete()');

        User.findById(req.session.auth._id, function (err, user) {
            user.remove(function (err, user) {

                // return
                var text = 'Profile deleted !';
                console.log(text);

                res.format({
                    json: function(){
                        res.json({message : text});
                    }
                });
            });
        });
    })

    // POST profile (_method: PUT, DELETE)
    .post(function(req, res) {
        console.log(consoleLog, 'router.route(/).post()');

        if(!req.body._method){
            text = 'No method !'
        }

        switch(req.body._method){

            case('DELETE'):
                console.log('method DELETE');

                User.findById(req.session.auth._id, function (err, user) {
                    user.remove(function (err, user) {});

                    // Update session
                    req.session.auth = null;

                    // return
                    var text = 'User deleted !';
                    console.log(text);

                    res.format({
                        html: function(){
                            res.redirect("/login");
                        },
                        json: function(){
                            res.json({message : text});
                        }
                    });
                });
                break;

            case('PUT'):
                console.log('method PUT');

                // uersname existence check
                if(req.body.username != req.session.auth.username){

                    // Exist error
                    User.findOne({ 'username': req.body.username }, function (err, userCheck){
                        if(userCheck){
                            // return
                            var text = 'Username already exist.';
                            console.log(text);
                            res.format({
                                html: function () {
                                    res.redirect("/profile/edit?error="+ text);
                                },
                                json: function () {
                                    res.json({message: text});
                                }
                            });
                        }
                        else{
                            console.log('Username doesn\'t exist.');

                            User.findById(req.session.auth._id, function (err, user) {

                                // Update profile
                                user.username = req.body.username;
                                user.firstname = req.body.firstname;
                                user.lastname = req.body.lastname;
                                user.save();

                                // Update session
                                User.findById(req.session.auth._id, function (err, userSess){
                                    req.session.auth = userSess
                                });


                                // return
                                var text = 'User updated !';
                                console.log(text);

                                res.format({
                                    html: function(){
                                        res.redirect("/profile");
                                    },
                                    json: function(){
                                        res.json({message : text});
                                    }
                                });
                            });
                        }
                    });

                } else {
                    User.findById(req.session.auth._id, function (err, user) {

                        // Update profile
                        user.firstname = req.body.firstname;
                        user.lastname = req.body.lastname;
                        user.save();

                        // Update session
                        User.findById(req.session.auth._id, function (err, userSess){
                            req.session.auth = userSess
                        });


                        // return
                        var text = 'User updated !';
                        console.log(text);

                        res.format({
                            html: function(){
                                res.redirect("/profile");
                            },
                            json: function(){
                                res.json({message : text});
                            }
                        });
                    })
                }
                break;
        }

    });


/**
 * Edit profile
 */
router.route('/edit')

    // GET user
    .get(function(req, res, next) {
        console.log(consoleLog, 'router.route(/edit).get()');

        User.findById(req.session.auth._id, function (err, user){

            // response
            res.format({
                // HTML response
                html: function(){
                    res.render('profile/edit', {
                        auth: req.session.auth,
                        user: user,
                        title: 'Edit profile',
                        error: req.query.error
                    });
                }
            });
        });
    });


/**
 * Edit avatar
 */
router.route('/avatar')

    // GET user
    .get(function(req, res, next) {
        console.log(consoleLog, 'router.route(/avatar).get()');

        User.findById(req.session.auth._id, function (err, user){

            // response
            res.format({
                // HTML response
                html: function(){
                    res.render('profile/avatar', {
                        auth: req.session.auth,
                        user: user,
                        title: 'Edit avatar',
                        error: req.query.error
                    });
                }
            });
        });
    });






