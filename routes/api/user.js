/**
 * User route
 * GET
 * POST
 * PUT
 * DELETE
 */

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('user');


router.route('/user')
    /**
     * GET all users
     */
    .get(function(req, res, next) {
        console.log('GET /user');

        //retrieve all users from Monogo
        User.find({}, function (err, users) {
            if (err) {
                console.log(err);

                return console.error(err);
            } else {
                //console.log(users);

                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                res.format({
                    // HTML response
                    html: function(){
                        res.render('big-title', {
                            title: 'api user',
                            description: 'Get, post, put, delete user'
                        });
                    },
                    //JSON response will show all users in JSON format
                    json: function(){
                        res.json(users);
                    }
                });
            }
        });
    })

    /**
     * POST user
     */
    .post(function(req, res) {
        console.log('POST /user');

        User.create({
            username:       req.body.username,
            firstname:      req.body.firstname,
            lastname:       req.body.lastname,
            age:            req.body.age,
            sex:            req.body.sex,
            address:        req.body.address,
            description:    req.body.description
        }, function (err, small) {
            if (err){
                console.log(err)
            }
            else{
                res.format({
                    html: function(){
                        res.render('index', {
                            title: 'API',
                            description: 'API server using mongoDB.'
                        });;
                    },
                    json: function(){
                        res.json({message : 'User created !'});
                    }
                });
            }
        });
    });


/**
 * User middelware to validate id
 */
router.param('id', function(req, res, next, id) {
    User.findById(id, function (err, user) {
        console.log('GET /users/'+id);

        if (err) {
            console.log(err);

            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                json: function(){
                    res.json({message : err.status  + ' ' + err});
                }
            });
        } else {
            req.id = id;
            next();
        }
    });
});


router.route('user/:id')
    /**
     * GET user/:id
     */
    .get(function(req, res) {
        console.log('GET /user/'+ req.id);

        User.findById(req.id, function (err, user) {
            if (err) {
                console.log(err);
            } else {
                console.log(user);

                res.format({
                    json: function(){
                        res.json(user);
                    }
                });
            }
        });
    })

    /**
     * PUT user
     */
    .put(function(req, res) {
        console.log('PUT /user/'+ req.id);

        User.findById(req.params.id, function (err, user) {
            user.username =     req.body.username;
            user.firstname =    req.body.firstname;
            user.lastname =     req.body.lastname;
            user.age =          req.body.age;
            user.sex =          req.body.sex;
            user.address =      req.body.address;
            user.description =  req.body.description;
            user.save();

            console.log('User updated !');
            res.format({
                html: function(){
                    res.render('index', {
                        title: 'API',
                        description: 'API server using mongoDB.'
                    });
                },
                json: function(){
                    res.json({message : 'User updated !'});
                }
            });
        });
    })

    /**
     * DELETE user
     */
    .delete(function(req, res) {
        console.log('DELETE /user/'+ req.id);

        User.findById(req.params.id, function (err, user) {
            user.remove(function (err, user) {
                console.log('User deleted !');

                res.format({
                    html: function(){
                        res.render('index', {
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
    });



module.exports = router;
