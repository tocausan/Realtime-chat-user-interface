var mongoose = require('mongoose');
var passwordSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    }
});
mongoose.model('password', passwordSchema);