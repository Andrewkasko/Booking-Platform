const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var path = require('path');

var dd = require('../doctorData.json'); //Doctors Data file

//Welcome
router.get('/',(req,res) => res.render('welcome'));
router.get('/dashboard', ensureAuthenticated, (req,res) =>
    res.render('dashboard\\index', {
        //Place User to get access to more user data
        name: req.user.name
    }));


//Search Doctors Page
router.get('/searchDoctor', function (request, response, ) {
    response.render('searchDoctor.ejs', {title: 'Search For a Doctor', doctorsdata: dd});
});
//

// router.get('/dashboard', ensureAuthenticated, (req,res) =>
//     res.sendFile(path.join(__dirname+'\\..\\views\\dashboard\\index.html'))
// )

module.exports = router;