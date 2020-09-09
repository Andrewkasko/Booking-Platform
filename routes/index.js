const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var path = require('path');


//Welcome
router.get('/',(req,res) => res.render('welcome'));


router.get('/dashboard', ensureAuthenticated, (req,res) =>
    res.render('dashboard'));

module.exports = router;