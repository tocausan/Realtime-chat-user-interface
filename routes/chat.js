/**
 * Chat route
 * GET
 * POST
 */

var chalk = require('chalk'),
    consoleLog = chalk.yellow('routes/chat.js'),
    express = require('express'),
    app = express(),
    chalk = require('chalk'),
    router = express.Router(),
    server = require('http').Server(app),
    socketio = require('socket.io'),
    mongoose = require('mongoose'),
    ChatMessage = mongoose.model('chat-message');

module.exports = router;



/**
 * Port
 */

var port = 3200;
io = socketio.listen(app.listen(port));
console.log('socket.io port: '+ port);


/**
 * Socket.io middelware
 */
router.use(function(req, res, next) {
    console.log(chalk.inverse('Chat middelware'), chalk.dim(req.method), req.url)

    // Redirect if not logged
    if(req.session.auth && req.session.auth.status >= 2){
        next();
    }
    else{
        res.format({
            // HTML response
            html: function(){
                res.redirect("/login?redirect=chat");
            },
            //JSON response
            json: function(){
                res.json('access not allowed');
            }
        });
    }

});




/**
 * On connection
 */

// open the channel
io.sockets.on('connection', function (client) {
    console.log(chalk.inverse('This socket '), chalk.dim(client.id));
    console.log(chalk.inverse('Connected sockets: '), Object.keys(io.sockets.clients().connected).length, chalk.dim(Object.keys(io.sockets.clients().connected)));

    // Variables
    var rooms = {
        admin: 'admin',
        public: 'public',
        private: client.id
    },
        messages = {
        public: 'public-message'
    };


    /**
     * Public room
     */

    // Join public room
    client.join(rooms.public);



    // Send public message
    client.on(messages.public, function (data) {
        // Add user
        ChatMessage.create({
            username:       data.username,
            message:      data.message,
        }, function (err, hello) {
            if (err) {
                console.log(err)
            }
            else {
                console.log('Message saved');

                io.to(rooms.public).emit(messages.public, data);
                console.log(data)
            }
        });

    });


    // Disconnect
    client.on('disconnect', function() {
        io.to(rooms.public).emit(messages.public, {
            username: '',
            message: ''
        });
    });

});





/**
 * Root
 */

router.get('/', function(req, res, next) {

    console.log(consoleLog, 'router.route(/chat)');

    res.render('chat/user', {
        auth: req.session.auth,
        title: 'Chat',
        description: 'Socket.io real-time chat.'
    });
    console.log(req.session.auth)
});


