/**
 * Package requirement
 */

var mongoose = require('mongoose');


/**
 * Models
 */

var user = require('./models/user'),
    password = require('./models/password'),
    userImage = require('./models/user-image'),
    userSession = require('./models/user-session'),
    chatMessage = require('./models/chat-message');


/**
 * Database connection
 */

var DB_PATH = 'mongodb://localhost/api';

mongoose.connect(DB_PATH, function(err) {
    if (err) throw err;
});



// Total users
mongoose.model('user').find({}, function (err, res){
    console.log('Total users: '+ res.length)
});



/**
 * Root user (Delete it on production)
 */
var User = mongoose.model('user'),
    Password = mongoose.model('password'),
    root = {
    username: 'root',
    firstname: 'root',
    lastname: 'root',
    password: 'root',
    status: 3,
    date: Date.now()
};

User.findOne({'username': root.username}, function (err, user) {
    if (user) {
        console.log('root already exist.');
        console.log(user);
    }
    else{
        // Add user
        User.create({
            username: root.username,
            firstname: root.firstname,
            lastname: root.lastname,
            status: root.status,
            date: root.date
        }, function (err, small) {
            if (err) {
                console.log(err)
            }
            else {
                console.log('Root user created');

                User.findOne({'username': root.username}, function (err, user) {

                    // Add password
                    Password.create({
                        user: user._id,
                        password: root.password
                    }, function (err, small) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log('Root password created');
                        }
                    })
                })
            }
        })
    }
});
