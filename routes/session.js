/**
 * Session
 *
 * Route schema
 *  /session
 *      GET
 */

'use strict';

var express = require('express'),
    router = express.Router();

router.route('/')

    // GET session
    .get(function(req, res, next) {
        console.log('##### routes/session.js : router.route(/)');

        // View count -> session test
        if(!req.session['viewCount']){ req.session['viewCount'] = 1; }
        else { req.session['viewCount'] += 1; }

        // Response
        res.format({
            // JSON
            json: function(){
                res.json(req.session);
            }
        });
    });

module.exports = router;
