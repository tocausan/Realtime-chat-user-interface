var mongoose = require('mongoose');
var chatMessageSchema = new mongoose.Schema({
    username: {
        type: String
    },
    message: {
        type: String
    }
});
mongoose.model('chat-message', chatMessageSchema);