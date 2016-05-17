var mongoose = require('mongoose');
var userImageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
},{strict: true});

mongoose.model('user-image', userImageSchema);