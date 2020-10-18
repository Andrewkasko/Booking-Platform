const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    address:{
        type: String,
        required: true
    },
    accountType:{
        type: String,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

/*module.exports = User;*/
module.exports = User;
module.exports.fetchData = {
    fetchData:function(callback){
        var addressData=User.find({address: {$exists:true}, accountType:'Doctor'});
        addressData.exec(function(err, data){
            if(err) throw err;

            return callback(data);
        })
    }
};
module.exports.findUser = function findUser(id, callback){
    User.findOne({_id: id}, function(err, userObj){
        if(err){
            return callback(err);
        } else if (userObj){
            return callback(null,userObj);
        } else {
            return callback();
        }
    });
}

/*
const UserSchema2 = new mongoose.Schema({
    address:{
        type: String,
        required: true
    }
});

const Distance = mongoose.model('Distance', UserSchema2);

module.exports = Distance;*/