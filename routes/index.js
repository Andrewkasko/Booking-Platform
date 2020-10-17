const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
var path = require('path');

const url = require('../config/keys').MongoURI;
const mongoose = require('mongoose');
//var ObjectId = mongoose.Types.ObjectId();
var ObjectId = require('mongodb').ObjectID;

router.get('/', (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, function (req, res) {

    var tempEmail = "";

    mongoose.connect(url, function (err, db) {
        console.log('connected');

        db.collection('users').findOne({
            email: req.user.email
        }, function (err, result) {
            if (err) throw err;

            if (result.accountType == "Patient") {
                mongoose.connect(url, function (err, db) {
                    db.collection('bookings').find(
                        {
                            name: req.user.name,
                            date: {"$gte": new Date()}
                        }
                    ).toArray().then(result => {
                        //console.log(result);
                        res.render('dashboard\\index', {
                            name: req.user.name,
                            email: tempEmail,
                            bookings: result
                        });
                    }).catch(error => console.error(error));
                });
            } else {

                mongoose.connect(url, function (err, db) {
                    db.collection('bookings').find(
                        {
                            doctorName: req.user.name
                        }
                    ).toArray().then(result => {
                        //console.log(result);
                        res.render('dashboard\\index', {
                            name: req.user.name,
                            email: tempEmail,
                            bookings: result
                        });
                    }).catch(error => console.error(error));
                });
            }
        });
    });
});

router.get('/index', ensureAuthenticated, (req, res) =>
    res.render('dashboard\\index', {
        name: req.user.name
    }));

router.get('/calendar', ensureAuthenticated, (req, res) =>
    res.render('dashboard\\calendar', {
        name: req.user.name
    }));

router.get('/blank', ensureAuthenticated, (req, res) =>
    res.render('dashboard\\blank', {
        name: req.user.name
    }));

router.get('/chat', ensureAuthenticated, (req, res) =>
    res.render('dashboard\\chat', {
        name: req.user.name
    }));

router.get('/bookingsPendingApproval', ensureAuthenticated, function (req, res) {
    if (req.user.accountType == "Patient") {
        mongoose.connect(url, function (err, db) {
            db.collection('bookings').find({
                    name: req.user.name,
                status: "Pending"
                }
            ).toArray().then(result => {
                //console.log(result);
                res.render('dashboard\\bookingsPendingApproval', {
                    name: req.user.name,
                    id: req.user.id,
                    bookings: result
                });

            }).catch(error => console.error(error));
        });
    }else{
        res.redirect("/booking");
    }
});

// router.get('/bookings', ensureAuthenticated, function (req, res) {
//     if (req.user.accountType == "Patient") {
//         mongoose.connect(url, function (err, db) {
//             db.collection('bookings').find({
//                     name: req.user.name
//                 }
//             ).toArray().then(result => {
//                 console.log(result);
//                 res.render('dashboard\\bookingPatient', {
//                     name: req.user.name,
//                     id: req.user.id,
//                     bookings: result
//                 });
//
//             }).catch(error => console.error(error));
//         });
//     }else{
//         res.redirect("/booking");
//     }
// });

router.get('/bookingPatient', ensureAuthenticated, function (req, res) {
    if (req.user.accountType == "Patient") {
        mongoose.connect(url, function (err, db) {
            db.collection('bookings').find({
                name: req.user.name
                }
            ).toArray().then(result => {
                console.log(result);
                res.render('dashboard\\bookingPatient', {
                    name: req.user.name,
                    id: req.user.id,
                    bookings: result
                });

            }).catch(error => console.error(error));
        });
    }else{
        res.redirect("/booking");
    }
});

router.get('/booking', ensureAuthenticated, function (req, res)
{
    if(req.user.accountType == "Patient"){
        res.redirect("/bookingPatient");
        // res.redirect("/createABooking");
    }else {
        mongoose.connect(url, function (err, db) {
            db.collection('bookings').find({}
            ).toArray().then(result => {
                console.log(result);
                res.render('dashboard\\booking', {
                    name: req.user.name,
                    id: req.user.id,
                    bookings: result
                });

            }).catch(error => console.error(error));
        });
        // res.render('dashboard\\booking', {
        //     name: req.user.name,
        //     id: req.user.id
        // })
    }
});

router.get('/DoctorBookingSettings', ensureAuthenticated, (req, res) =>
    res.render('dashboard\\DoctorBookingSettings', {
        //Place User to get access to more user data
        name: req.user.name,
        id: req.user.id
    }));

router.get('/createABooking', ensureAuthenticated, function (req, res) {
    mongoose.connect(url, function (err, db) {
        db.collection('users').find(
            {
                accountType: "Doctor"
            }
        ).toArray().then(result => {
            console.log(result);
            res.render('dashboard\\createABooking', {
                name: req.user.name,
                doctors: result
            });
        }).catch(error => console.error(error));
    });
    // res.render('dashboard\\createABooking', {
    //     //Place User to get access to more user data
    //     name: req.user.name,
    //     doctors: [{id: "1", doctorName: "Dr. Woo", doctorLocation: "123 Castle hill Road, Castle Hill, 2155, NSW"},
    //         {id: "2", doctorName: "Dr. Kahevic", doctorLocation: "33 Main Street, Rouse Hill, 2155, NSW"},
    //         {id: "3", doctorName: "Dr. Graham", doctorLocation: "33 Main Street, Rouse Hill, 2155, NSW"}]
    // })
});

router.get('/nextBooking', ensureAuthenticated, (req, res) =>
    res.render('dashboard\\nextBooking', {
        //Place User to get access to more user data
        name: req.user.name
    }));

router.get('/UpcomingBookingsPatient', ensureAuthenticated, function (req, res){
    if(req.user.accountType == "Patient") {
        mongoose.connect(url, function (err, db) {
            db.collection('bookings').find(
                {
                    name: req.user.name,
                    status: "Approved",
                    date: {"$gte": new Date()}
                }
            ).toArray().then(result => {
                console.log(result);
                res.render('dashboard\\UpcomingBookingsPatient', {
                    name: req.user.name,
                    bookings: result
                });
            }).catch(error => console.error(error));
        });
    }else{
        res.redirect("/UpcomingBookings")
    }
});

router.get('/UpcomingBookings', ensureAuthenticated, function (req, res) {

    //console.log("REQ.BODY.ACCOUNTTYPE" + req.body.accountType);
    if(req.user.accountType == "Patient"){
       res.redirect("/UpcomingBookingsPatient");
       // res.redirect("/createABooking");
    }else {
        mongoose.connect(url, function (err, db) {
            db.collection('bookings').find(
                {
                    doctorName: req.user.name,
                    status: "Approved",
                    date: {"$gte": new Date()}
                }
            ).toArray().then(result => {
                //console.log(result);
                res.render('dashboard\\UpcomingBookings', {
                    name: req.user.name,
                    bookings: result
                });
            }).catch(error => console.error(error));
        });
    }
});



router.post('/UpcomingBookingsFilter', (req, res) => {

    const {filter} = req.body;

    switch (filter) {
        case "Emergency":
            mongoose.connect(url, function (err, db) {
                db.collection('bookings').find(
                    {
                        status: "Approved",
                        bookingType: "Emergency",
                        date: {"$gte": new Date()}
                    }
                ).toArray().then(result => {
                    //console.log(result);
                    res.render('dashboard\\UpcomingBookings', {
                        name: req.user.name,
                        bookings: result
                    });
                }).catch(error => console.error(error));
            });
            break;
        case "Normal":
            mongoose.connect(url, function (err, db) {
                db.collection('bookings').find(
                    {
                        status: "Approved",
                        bookingType: "Normal",
                        date: {"$gte": new Date()}
                    }
                ).toArray().then(result => {
                    //console.log(result);
                    res.render('dashboard\\UpcomingBookings', {
                        name: req.user.name,
                        bookings: result
                    });
                }).catch(error => console.error(error));
            });
            break;
        default:
            res.redirect('/UpcomingBookings');

            break;
    }

});



router.get('/approveABooking', ensureAuthenticated, function (req, res) {

    //console.log("REQ.BODY.ACCOUNTTYPE" + req.body.accountType);
    if(req.user.accountType == "Patient"){

        res.redirect("/createABooking");
    }else {
        mongoose.connect(url, function (err, db) {
            db.collection('bookings').find(
                {
                    // "_id" : ObjectId("5f8706580ebf8b07b47f53f6")
                    status: "Pending",
                    doctorName: req.user.name
                }
            ).toArray().then(result => {
                //console.log(result);
                res.render('dashboard\\approveABooking', {
                    name: req.user.name,
                    bookings: result
                });
            }).catch(error => console.error(error));
        });
    }

});

router.post('/approveBooking', (req, res) =>{
    //console.log(req.body.id);

        mongoose.connect(url, function (err, db) {
            db.collection('bookings').findOneAndUpdate({_id: ObjectId(req.body.id)}, {$set: {status: "Approved"}}, {new: true}, (err, doc) => {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
               // console.log(doc);
            });
        });
        req.flash('success_msg', 'Booking Approved');
        res.redirect('/approveABooking');
});
router.post('/rejectBooking', (req, res) =>{
    //console.log(req.body.id);

    mongoose.connect(url, function (err, db) {
        db.collection('bookings').findOneAndUpdate({_id: ObjectId(req.body.id)}, {$set: {status: "Rejected"}}, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
                res.flash('error_msg', "ERROR MESSAGE: " + err);
            }

            console.log(doc);
        });
    });
    req.flash('success_msg', 'Booking Rejected Successfully');
    res.redirect('/approveABooking');

});

router.get('/UpdateUser', ensureAuthenticated, (req, res) =>
    res.render('dashboard\\UpdateUser', {
        //Place User to get access to more user data
        name: req.user.name,
        email: req.user.email,
        address: req.user.address
    }));

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

router.post('/UpdateUser', (req, res) =>{
    //console.log("UPDATE USER");
    let errors = [];
    const {email, address} = req.body;

    if (!email || !address) {
        errors.push({msg: 'Please fill in all fields'});
    }
    if (errors.length > 0) {
        req.flash('error_msg', 'Please Fill in all the Fields');
        res.redirect('/UpdateUser');
    }else {
        mongoose.connect(url, function (err, db) {
            db.collection('users').findOneAndUpdate(
                {_id: ObjectId(req.user.id)},
                {$set: {email: req.body.email, address: req.body.address}},
                {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                    req.flash('success_msg', 'Account Updated');
                    res.redirect('/UpdateUser');
                });
        });
    }
});


//
// router.post('/approveBooking', (req, res) => {
//
//
//
//     var tempEmail = "";
//     var name = "" //req.user.name
//     // mongoose.connect(url, function (err, db) {
//     //     db.collection('bookings').find(
//     //         {
//     //             // "_id" : ObjectId("5f8706580ebf8b07b47f53f6")
//     //             status: "Pending"
//     //         }
//     //     ).toArray().then(result => {
//     //         console.log(result);
//     //         res.render('dashboard\\approveABooking', {
//     //             name: req.user.name,
//     //             bookings: result
//     //         });
//     //     }).catch(error => console.error(error));
//     // });
// });

//router.post('/acceptBooking', (req, res) => res.render('approveABooking'))


// router.get('/dashboard', ensureAuthenticated, (req,res) =>
//     res.sendFile(path.join(__dirname+'\\..\\views\\dashboard\\index.html'))
// )

module.exports = router;