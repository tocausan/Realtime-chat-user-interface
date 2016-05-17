/**
 * Upload route
 * GET
 * POST
 */

var chalk = require('chalk'),
    consoleLog = chalk.yellow('routes/upload.js'),
    express = require('express'),
    app = express(),
    router = express.Router(),
    server = require('http').Server(app),
    multer = require('multer'),
    mongoose = require('mongoose'),
    UserImage = mongoose.model('user-image');

module.exports = router;



/**
 * Avatar
 */

router.route('/avatar')

    // POST image
    .post(function(req, res, next) {
        console.log(consoleLog, 'router.route(/avatar).post()');

        var avatarName;


        // set storage
        var storage =   multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, 'public/uploads/avatar/');
            },
            filename: function (req, file, callback) {

                // set mimetype restriction
                var mimetype;
                if(file.mimetype == 'image/jpeg') mimetype = '.jpg';
                if(file.mimetype == 'image/png') mimetype = '.png';

                if(mimetype){
                    // set avatar name
                    avatarName = req.session.auth._id + mimetype;
                    callback(null, avatarName);
                } else {
                    console.log(chalk.inverse('Error no mimetype.'));
                }
            }
        });

        // upload function
        var uploadAvatar = multer({ storage : storage}).single('avatar');

        // upload avatar
        uploadAvatar(req,res,function(err) {
            if(err) {
                console.log(chalk.inverse('Error uploading file.'));
                console.log(err);
            } else {
                console.log(chalk.inverse('File is uploaded.'));

                // Set the user image
                UserImage.findOne({ 'user': req.session.auth._id }, function (err, image){
                    if(image){
                        image.name = avatarName;
                        image.date = Date.now();
                        image.save();

                        console.log(consoleLog, 'User image updated.');
                    }
                    else{
                        // Add image
                        UserImage.create({
                            user:   req.session.auth._id,
                            name:   avatarName,
                            date:   Date.now()
                        }, function (err, small){
                            console.log(consoleLog, 'User image created.')
                        });
                    }
                });


            }
        });


        // redirect
        res.format({
            html: function(){
                res.redirect('/'+ req.query.redirect);
            },
            json: function(){
                res.json({message : 'file is uploaded.'});
            }
        });
    });


