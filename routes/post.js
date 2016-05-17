/**
 * Post
 *
 * Route schema
 *  /post
 *      GET
 *      POST
 *  /post/:id
 *      GET
 *      POST
 *      DELETE
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');
    //Post = mongoose.model('post');

module.exports = router;


/**
 * Post index
 */
router.route('/')

    // GET user
    .get(function(req, res, next) {
        console.log('##### routes/post.js : router.route(/post)');

        var r = '/post';
        res.format({
            html: function(){
                res.render('big-title', {
                    title: r
                });
            },
            json: function(){
                res.json({message : r});
            }
        });
    });


/**
 * Post middelware to validate id
 */
router.param('id', function(req, res, next, id) {
    console.log('##### routes/post.js : router.param(id)');
    next();
});


/**
 * Post by id
 */
router.route('/:id')

    // GET user/:id
    .get(function(req, res) {
        console.log('##### routes/post.js : router.route(/post/:id)');

        var r = '/post/'+ req.params.id;
        res.format({
            html: function(){
                res.render('big-title', {
                    title: r
                });
            },
            json: function(){
                res.json({message : r});
            }
        });
    });



