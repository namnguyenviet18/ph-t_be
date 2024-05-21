const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

const UserShema = new mongoose.Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    location: { type: String },
    description: { type: String },
    occupation: { type: String },
    login_name: {type: String, require: true},
    password: {type: String, require: true}
});

module.exports = mongoose.model('User', UserShema);