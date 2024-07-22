const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String },
    videos: [{ title: String, description: String, url: String }]
});

module.exports = mongoose.model('User', UserSchema);
