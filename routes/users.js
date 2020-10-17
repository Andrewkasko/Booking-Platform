const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const url = require('../config/keys').MongoURI;
const mongoose = require('mongoose');

const Booking = require('../models/Booking');

const DoctorBookingPreference = require('../models/DoctorBookingPreference');


//User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('Login'));

//Register Page
router.get('/register', (req, res) => res.render('Register'));

// router.post('/approveBooking', (req, res) =>{
//     console.log(req.body);
//     req.flash('success_msg', 'Booking Approved');
//     res.redirect('/approveABooking');
//
// });

//Register Handle
router.post('/register', (req, res) => {
    const {name, email, accountType, address, password, password2} = req.body;
    let errors = [];

    //Check required fields
    if (!name || !email || !address || !password || !password2) {
        errors.push({msg: 'Please fill in all fields'});
    }
    if (password !== password2) {
        errors.push({msg: 'Passwords do not match'});
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({msg: 'Password should be at least 6 characters'});
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            accountType,
            address,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({email: email})
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({msg: 'Email is already registered'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        accountType,
                        address,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        accountType,
                        address,
                        password
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can login');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }));
                }
            });
    }
});

//login Handle
router.post('/login', (req, res, next) => {
    console.log('connected - REQ - ' + req.body.email);

    mongoose.connect(url, function (err, db) {

        db.collection('users').findOne({
            email: req.body.email
        }, function (err, result) {
            if (err) throw err;
            console.log(result);
            //console.log(result.accountType);
            if(!null) {
                // if (result.accountType == "Patient") {
                    passport.authenticate('local', {
                        successRedirect: '/dashboard',
                        failureRedirect: '/users/login',
                        failureFlash: true
                    })(req, res, next);
                // } else {
                //     passport.authenticate('local', {
                //         successRedirect: '/dashboard',
                //         failureRedirect: '/users/login',
                //         failureFlash: true
                //     })(req, res, next);
                // }
            }else{
                res.flash("error_msg", "Email not found")
            }
        });
    });
});


//Logout Handle
// router.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success_msg', 'You are logged out');
//     res.redirect('/users/login');
// });

router.get('users/createABooking', (req, res) => res.render('createABooking'));
//User model


router.post('/UpdateDoctorBookingPreferences', (req, res) => {
    //const {}
    console.log("status: " + req.body.topic);
    const {doctorId, startTime, finishTime, startDate, finishDate} = req.body;

    let errors = [];
    //Check required fields
    if (!doctorId || !startTime || !finishTime || !startDate || !finishDate) {
        errors.push({msg: 'Please fill in all fields'});
    }
    if (errors.length > 0) {
        console.log("error in Update Doctor Booking Settings");
        req.flash('error_msg', 'Please Fill in all the Fields');
        res.redirect('/DoctorBookingSettings');
    } else {
        const newDoctorBookingPreference = new DoctorBookingPreference({
            doctorId,
            startTime,
            finishTime,
            startDate,
            finishDate
        });

        newDoctorBookingPreference.save()
            .then(booking => {
                req.flash('success_msg', 'Settings Updated Successfully');
                //res.redirect('/users/login');
                res.redirect('/DoctorBookingSettings');

            })
            .catch(err => console.log(err));
    }
});

// router.post('/UpcomingBookingsFilter', (req, res) => {
//
//     const {filter} = req.body;
//
//     switch (filter) {
//         case "Emergency":
//             mongoose.connect(url, function (err, db) {
//                 db.collection('bookings').find(
//                     {
//                         status: "Approved",
//                         bookingType: "Emergency",
//                         date: {"$gte": new Date()}
//                     }
//                 ).toArray().then(result => {
//                     console.log(result);
//                     res.render('dashboard\\UpcomingBookings', {
//                         name: req.user.name,
//                         bookings: result
//                     });
//                 }).catch(error => console.error(error));
//             });
//             break;
//         case "Normal":
//             mongoose.connect(url, function (err, db) {
//                 db.collection('bookings').find(
//                     {
//                         status: "Approved",
//                         bookingType: "Normal",
//                         date: {"$gte": new Date()}
//                     }
//                 ).toArray().then(result => {
//                     console.log(result);
//                     res.render('dashboard\\UpcomingBookings', {
//                         name: req.user.name,
//                         bookings: result
//                     });
//                 }).catch(error => console.error(error));
//             });
//             break;
//         default:
//             res.redirect('/UpcomingBookings');
//
//             break;
//     }
//
// });


//Register Handle
router.post('/createABooking', (req, res) => {
    console.log("status: " + req.body.topic);
    const {name, status, doctorName, bookingType, date, time, topic, description} = req.body;

    var occupiedBooking = false;
    console.log("DATE TYPE: " + typeof (date));
    console.log("DATE TYPE: " + typeof (new Date(date)));
    console.log(new Date(date));
    console.log("time TYPE: " + typeof (time));

    mongoose.connect(url, function (err, db) {
        db.collection('bookings').find(
            {
                date: new Date(date),
                time: time
            }
        ).toArray().then(result => {
            console.log("RESULT: " + result);
            console.log("RESULT LENGTH: " + result.length);
            if(result.length > 0){
                occupiedBooking = true;
            }
        }).catch(error => console.error(error));
    });

    let errors = [];
    //Check required fields
    if (!name || !status || !doctorName || !bookingType || !date || !time || !topic || !description) {
        errors.push({msg: 'Please fill in all fields'});
    }
    if (errors.length > 0) {
        console.log("error in booking");
        req.flash('error_msg', 'Please Fill in all the Fields');
        res.redirect('/createABooking');
    } else if(occupiedBooking){
        req.flash('error_msg', 'Please Fill in all the Fields');
        res.redirect('/createABooking');
    } else {
        const newBooking = new Booking({
            name,
            status,
            doctorName,
            bookingType,
            date,
            time,
            topic,
            description
        });

        newBooking.save()
            .then(booking => {
                req.flash('success_msg', 'Booking requested');
                //res.redirect('/users/login');
                res.redirect('/createABooking');

            })
            .catch(err => console.log(err));
    }

});

module.exports = router;

