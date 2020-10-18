/*var addressModel = require('../models/Distance');*/
var User = require('../models/User').findUser;
module.exports = {

    fetchData: function (req, res) {

        User(req.query.id, function(error, userFound) {
            console.log(userFound);
            var doctorData = userFound;
            res.render('dashboard\\profile',{DoctorInfo:doctorData});
        });
        /*var id = req.query.id;
        var doctorData = User.findOne({_id:id});
        console.log(doctorData);
        console.log(doctorData.address);*/
    }
}