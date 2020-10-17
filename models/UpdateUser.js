const mongoose = require('mongoose');

const UpdateUserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }
    //Need to include password
});

const UpdateUser = mongoose.model('UpdateUser', UpdateUserSchema);

module.exports = UpdateUser;