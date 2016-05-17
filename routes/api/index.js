/**
 * Index route
 * GET
 * POST
 */

var express = require('express'),
    router = express.Router();

module.exports = router;

/**
 * Root
 */
router.get('/', function(req, res, next) {
    res.render('big-title', {
        title: 'API'
    });
});


router.get('/user', require('./user'));


