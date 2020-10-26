const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FriendSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: false},
    topArtists: {type: Object, required: false},
    topSongs: {type: Object, required: false},
    display_name: {type: String, required: false}
});

module.exports = mongoose.model('Friend', FriendSchema);
