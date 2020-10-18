const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var path = require('path');
const { ensureAuthenticated } = require('./config/auth');


const app = express();

// Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Print addresses in database
/*var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/TestDB';*/

/*mongoose.connect(url, function(err, db) {

    var adresses = db.collection('doctors_location').find();

    adresses.each(function(err, doc) {

        console.log(doc);

    });
});*/

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
var addressRouter = require('./routes/distance');
app.use('/map', addressRouter);


//router.get('/data-list',addressController.fetchData);
//app.use('/doctors_location', require('./routes/distance'));


// DASHBOARD
app.use('/dashboard', ensureAuthenticated);
app.use(ensureAuthenticated, express.static(__dirname + '/views/dashboard'));
////////////

// get the doctors address's from the database
/*app.get('/doctors_location_get', (req, res) => {

    db.collection('doctors_location').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    });
});*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

