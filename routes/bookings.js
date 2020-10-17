const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const url = require('../config/keys').MongoURI;
const mongoose = require('mongoose');


// //User model
// const Booking = require('../models/Booking');
//
// //Register Handle
// router.post('/booking', (req, res) => {
//     const {name, status, doctorName, bookingType, date, time, topic, description} = req.body;
//     let errors = [];
//
//     //Check required fields
//     if (!name || !status || !doctorName || !bookingType || !date || !time || !topic || !description) {
//         errors.push({msg: 'Please fill in all fields'});
//     }
//
//     if (errors.length > 0) {
//         res.render('booking', {
//             name,
//             status,
//             doctorName,
//             bookingType,
//             date,
//             time,
//             topic,
//             description
//         });
//     }else{
//         const newBooking = new Booking({
//             name,
//             status,
//             doctorName,
//             bookingType,
//             date,
//             time,
//             topic,
//             description
//         });
//
//         newBooking.save()
//             .then(booking => {
//                 req.flash('success_msg', 'Booking requested');
//                 //res.redirect('/users/login');
//                 res.redirect('/users/login');
//             })
//             .catch(err => console.log(err));
//     }
// });