const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var path = require('path');

//Search Doctors
router.get('/searchDoctor', function (request, response, ) {
    response.render('searchDoctor.ejs');
});

module.exports = router;

//DOESNT WORK?????????