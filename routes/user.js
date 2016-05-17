/**
 * User
 *
 * Route schema
 *  /user
 *      GET
 *      POST
 *  /user/:id
 *      GET
 *      POST
 *      DELETE
 */

'use strict';

var chalk = require('chalk'),
    consoleLog = chalk.yellow('routes/user.js'),
    express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('user'),
    Password = mongoose.model('password');

module.exports = router;


/**
 * Log middelware
 */
router.use(function(req, res, next) {
    console.log(chalk.inverse('user middelware'), chalk.dim(req.method), req.url)

    if(req.session.auth && req.session.auth.status >= 2){
        next();
    }
    else{
        res.format({
            // HTML response
            html: function(){
                res.redirect("/login?redirect=user");
            },
            //JSON response
            json: function(){
                res.json('access not allowed');
            }
        });
    }
});




/**
 * User index
 */
router.route('/')

    // GET user
    .get(function(req, res, next) {
        console.log(consoleLog, 'router.route(/).get()');

        //retrieve all users from MongoDB
        User.find({}, function (err, users) {
            if (err) {
                console.log(err);

                return console.error(err);
            } else {
                res.format({
                    // HTML response
                    html: function(){
                        res.render('user/index', {
                            auth: req.session.auth,
                            title: 'User index',
                            users: users
                        });
                    },
                    //JSON response
                    json: function(){
                        res.json(users);
                    }
                });
            }
        });
    })

    // POST user
    .post(function(req, res) {
        console.log(consoleLog, 'router.route(/).post()');

        // Validation
        var validation = 1;
        // User data
        if(!req.body.username
        || !req.body.firstname
        || !req.body.lastname
        || !req.body.password
        || !req.body.passconf){
            validation = 0;
            return console.log('Something is missing.')
        }

        // Password
        if((req.body.password !== req.body.passconf)
        || (req.body.password.length < 6)){
            validation = 0;
            return console.log('Your password must contain at least 6 charaters and match the confirmation.')
        }


        // Exist error
        User.findOne({ 'username': req.body.username }, function (err, user){
            if(user){
                return console.log('Username already exist.')
            }
            else{
                // Add user
                User.create({
                    username:   req.body.username,
                    firstname:  req.body.firstname,
                    lastname:   req.body.lastname,
                    status:     1,
                    date:       Date.now()
                }, function (err, small) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('User created');

                        User.findOne({'username': req.body.username}, function (err, user) {

                            // Add password
                            Password.create({
                                user: user._id,
                                password: req.body.password
                            }, function (err, small) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    console.log('Password created');

                                    res.format({
                                        html: function () {
                                            res.location("user");
                                            res.redirect("/user");
                                        },
                                        json: function () {
                                            res.json({message: 'User created !'});
                                        }
                                    });
                                }
                            })
                        })
                    }
                })
            }
        });
    });



router.route('/create')

    // GET user/:id
    .get(function(req, res) {
        console.log(consoleLog, 'router.route(/create).get()');

        res.format({
            html: function () {
                res.render('user/create', {
                    auth: req.session.auth,
                    title: 'User create'
                });
            }
        });
    });



/**
 * User middelware to validate id
 */
router.param('id', function(req, res, next, id) {
    console.log(consoleLog, 'router.param(id)');

    User.findById(id, function (err, id){
        if (err) {
            console.log(err);

            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function () {
                    res.redirect("/user");
                },
                json: function(){
                    res.json({message : err.status  + ' ' + err});
                }
            });
            console.log('No user !')
        } else {
            req.id = id;
            next();
        }
    });
});



/**
 * User by id
 */
router.route('/id/:id')

    // GET user/:id
    .get(function(req, res) {
        console.log(consoleLog, 'router.route(/id/:id).get()');

        User.findById(req.params.id, function (err, user) {

            console.log(user)

            res.format({
                html: function () {
                    res.render('user/show', {
                        auth: req.session.auth,
                        title: 'User details',
                        user: user
                    });
                },
                json: function () {
                    res.json(user);
                }
            });
        })
    })

    // PUT user
    .put(function(req, res) {
        console.log(consoleLog, 'router.route(/id/:id).put()');

        User.findById(req.params.id, function (err, user) {
            // Update status (admin only)
            if(req.session.auth && (req.session.auth.status >= 2)){
                user.status = req.body.status;
            }
            user.username = req.body.username;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.save();

            console.log('User updated !');
            res.format({
                html: function () {
                    res.render('big-title', {
                        auth: req.session.auth,
                        title: 'User created'
                    });
                },
                json: function () {
                    res.json({message: 'User updated !'});
                }
            });
        })
    })

    // DELETE user
    .delete(function(req, res) {
        console.log(consoleLog, 'router.route(/id/:id).delete()');

        User.findById(req.params.id, function (err, user) {
            user.remove(function (err, user) {
                console.log('User deleted !');

                res.format({
                    html: function(){
                        res.render('index', {
                            auth: req.session.auth,
                            title: 'API',
                            description: 'API server using mongoDB.'
                        });
                    },
                    json: function(){
                        res.json({message : 'User deleted !'});
                    }
                });
            });
        });
    })

    // POST user (_method: PUT, DELETE)
    .post(function(req, res) {
        console.log(consoleLog, 'router.route(/id/:id).post()');

        if(!req.body._method){
            text = 'No method !'
        }

        switch(req.body._method){

            case('DELETE'):
                console.log('method DELETE');

                User.findById(req.params.id, function (err, user) {
                    user.remove(function (err, user) {});

                    var text = 'User deleted !';

                    console.log(text);

                    res.format({
                        html: function(){
                            res.location("user");
                            res.redirect("/user");
                        },
                        json: function(){
                            res.json({message : text});
                        }
                    });
                });
                break;

            case('PUT'):
                console.log('method PUT');

                User.findById(req.params.id, function (err, user) {

                    // Update status (admin only)
                    if(req.session.auth && (req.session.auth.status >= 2)){
                        user.status = req.body.status;
                    }
                    user.username = req.body.username;
                    user.firstname = req.body.firstname;
                    user.lastname = req.body.lastname;
                    user.save();

                    var text = 'User updated !';
                    console.log(req.body)
                    console.log(text);

                    res.format({
                        html: function(){
                            res.location("user");
                            res.redirect("/user");
                        },
                        json: function(){
                            res.json({message : text});
                        }
                    });
                });

                break;
        }

    });


/**
 * Edit user by id
 */
router.route('/id/:id/edit')

    // GET user/id/:id
    .get(function(req, res) {
        console.log(consoleLog, 'router.route(/id/:id/edit).get()');

        User.findById(req.params.id, function (err, user) {

            res.format({
                html: function () {
                    res.render('user/edit', {
                        auth: req.session.auth,
                        title: 'User edit',
                        user: user
                    });
                },
                json: function () {
                    res.json(user);
                }
            });
        })
    });



