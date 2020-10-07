const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var path = require('path');


//Welcome
router.get('/',(req,res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req,res) =>
    res.render('dashboard\\index', {
        //Place User to get access to more user data
        name: req.user.name
    }));

router.get('/index', ensureAuthenticated, (req,res) =>
    res.render('dashboard\\index', {
        //Place User to get access to more user data
        name: req.user.name
    }));

router.get('/calendar', ensureAuthenticated, (req,res) =>
    res.render('dashboard\\calendar', {
        //Place User to get access to more user data
        name: req.user.name
    }));

router.get('/blank', ensureAuthenticated, (req,res) =>
    res.render('dashboard\\blank', {
        //Place User to get access to more user data
        name: req.user.name
    }));

router.get('/chat', ensureAuthenticated, (req,res) =>
    res.render('dashboard\\chat', {
        //Place User to get access to more user data
        name: req.user.name
    }));

router.get('/booking', ensureAuthenticated, (req,res) =>
    res.render('dashboard\\booking', {
        //Place User to get access to more user data
        name: req.user.name
    }));
router.get('/nextBooking', ensureAuthenticated, (req,res) =>
    res.render('dashboard\\nextBooking', {
        //Place User to get access to more user data
        name: req.user.name
    }));

// router.get('/dashboard', ensureAuthenticated, (req,res) =>
//     res.sendFile(path.join(__dirname+'\\..\\views\\dashboard\\index.html'))
// )

module.exports = router;