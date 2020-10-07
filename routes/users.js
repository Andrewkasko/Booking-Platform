const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const url = require('../config/keys').MongoURI;
const mongoose = require('mongoose');


//User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('Login'));

//Register Page
router.get('/register', (req, res) => res.render('Register'));

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

    mongoose.connect(url, function (err, db) {
        console.log('connected');

        db.collection('users').findOne({
            email: req.body.email
        }, function (err, result) {
            if (err) throw err;
            console.log(result.accountType);
            if (result.accountType == "Patient") {
                passport.authenticate('local', {
                    successRedirect: '/dashboard',
                    failureRedirect: '/users/login',
                    failureFlash: true
                })(req, res, next);
            } else {
                passport.authenticate('local', {
                    successRedirect: '/doctorDashboard',
                    failureRedirect: '/users/login',
                    failureFlash: true
                })(req, res, next);
            }
        });
    });
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;

