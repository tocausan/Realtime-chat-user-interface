var mongoose = require('mongoose');
var userSessionSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    logged: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
},{strict: true});

mongoose.model('user-session', userSessionSchema);