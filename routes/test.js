/**
 * test
 *
 * Route schema
 *  /test
 *      GET
 *  /test/:id
 *      GET
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

/**
 * Test index
 */
router.route('/')

    // GET user
    .get(function(req, res, next) {
        console.log('##### routes/test.js : router.route(/test)');

        var r = '/test';
        res.format({
            html: function(){
                res.render('big-title', {
                    auth: req.session.auth,
                    title: r
                });
            },
            json: function(){
                res.json({message : r});
            }
        });
    });


/**
 * Test by id
 */
router.route('/:id')

    // GET user/:id
    .get(function(req, res) {
        console.log('##### routes/test.js : router.route(/test/:id)');
        console.log('### id : '+ req.params.id)

        var r = '/test/'+ req.params.id;
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

module.exports = router;
