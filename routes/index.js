const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var path = require('path');


//Welcome
router.get('/',(req,res) => res.render('welcome'));
//Dashboard
// router.get('/dashboard', ensureAuthenticated, (req,res) =>
//     res.render('dashboard', {
//         //Place User to get access to more user data
//         name: req.user.name
//     }));
//


router.get('/dashboard', ensureAuthenticated, (req,res) =>
    res.sendFile(path.join(__dirname+'\\..\\views\\dashboard\\index.html'))
)

module.exports = router;