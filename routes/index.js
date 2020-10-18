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

var addressController= require('../controllers/DistanceController');
router.get('/map', addressController.fetchData);


// router.get('/dashboard', ensureAuthenticated, (req,res) =>
//     res.sendFile(path.join(__dirname+'\\..\\views\\dashboard\\index.html'))
// )

module.exports = router;