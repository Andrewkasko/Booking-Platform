const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var path = require('path');
var addressController= require('../controllers/DistanceController');
var profileController= require('../controllers/ProfileController');
//router.get('',addressController.fetchData);
//router.get('/search', addressController.fetchData);
//router.post('/create',addressController.fetchData);

//router.get('/search', addressController.fetchData);
router.get('/search', ensureAuthenticated, addressController.fetchData);
router.get('/profile', ensureAuthenticated, profileController.fetchData);

// router.get('/profile',ensureAuthenticated, profileController.fetchData, (req, res) => {
//     res.render('dashboard\\profile');
//     //res.redirect('/profile' + '?id=' + req.id);
// });
/*router.get('/profile', (req, res) => {
    res.redirect('/profile?id='+req.query.id);
});*/


var distance = require('google-distance-matrix');


// Search button
/*router.get('/search', (req, res) => {
    req.flash('success_msg', 'Search Done');
    res.redirect('/map/search');
});*/

router.post('/search', (req, res) => {
    //const {origin_address} = req.body;
    console.log(req.body);
    var origin = req.body.address;
    if(origin == '' || origin == 'My Location') {
        console.log(origin);
        console.log("My Location");
    } else {
        console.log("other");
        console.log(origin);
    }


    //console.log(addressController);
    /*const new_url = new URL("localhost:5000/map/search");
    new_url.searchParams.append("address", origin);
    console.log(new_url.href);


    res.url = new_url;
    req.location(new_url);*/
    var radius = req.body.radius;
    if(radius == '') {
        radius = 5;
    }
    res.redirect('/map/search' + '?origin=' + origin + '&radius=' + radius);
    /*res.redirect('map/profile');*/
    /*.forEach(function(data) {
        console.log(data.address);
    });*/
    //let errors = [];

    //Check required fields
    /*if (!origin_address) {
        errors.push({msg: 'Please fill in all fields'});
    }
    if(errors.length > 0){
        res.render('search',{
            errors,
            origin_address
        });
    }*/
});


module.exports = router;

//apiKey = 'AIzaSyBv7hBYAySRTtHgg73x-Hz1oykEKe3X1vk';

//module.exports = router;

//getdistance route
/*router.get('/map',(req,res) => res.render(''));
*/

//getdistance handle
/*var origin1 = new google.maps.LatLng(55.930385, -3.118425);
var origin2 = 'Greenwich, England';
var destinationA = 'Stockholm, Sweden';
var destinationB = new google.maps.LatLng(50.087692, 14.421150);

var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
    {
        origins: [origin1, origin2],
        destinations: [destinationA, destinationB],
        travelMode: 'DRIVING',
        transitOptions: TransitOptions,
        drivingOptions: DrivingOptions,
        unitSystem: UnitSystem,
        avoidHighways: Boolean,
        avoidTolls: Boolean,
    }, callback);

function callback(response, status) {
    // See Parsing the Results for
    // the basics of a callback function.
    if (status == 'OK') {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;

        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
                var element = results[j];
                var distance = element.distance.text;
                console.log(distance);
                var duration = element.duration.text;
                var from = origins[i];
                var to = destinations[j];
            }
        }
    }
}*/

/*NodeDistanceMatrix = require('node-distance-matrix');*/

/*origin = 'Revesby,Sydney,NSW';
destination = 'Peakhurst,Sydney,NSW';
unitType = 'metric';
const mode = ['bicycling', 'walking', 'driving'];

const distanceMatrix = NodeDistanceMatrix.getDistanceMatrix(apiKey, origin, destination, mode, unitType);*/



/*NodeDistanceMatrix.exports = (server) => {

	const mode = ['bicycling', 'walking', 'driving'];

	server.post('/location', (req, res) => {
		const isValid = (typeof req.body.origin === 'string' && typeof req.body.destination === 'string');
		if (!isValid) BadRequestResponse(res, "Invalid data!");
		if (mode[req.body.mode] !== undefined) req.body.mode = 'driving';

		new DistanceController(req.body.origin, req.body.destination, req.body.mode).get().then(result => {
			SuccessResponse(res, 'Successfully get distance data!', result);
		}).catch(errResult => {
			InternalServerErrorResponse(res, errResult.message);
		});
	});

	server.post('/coordinates', (req, res) => {
		const isValid = (typeof req.body.origin === 'object' && typeof req.body.destination === 'object');
		if (!isValid) BadRequestResponse(res, "Invalid data!");
		if (mode[req.body.mode] !== undefined) req.body.mode = 'driving';

		const origin = `${req.body.origin[0]}, ${req.body.origin[1]}`;
		const destination = `${req.body.destination[0]}, ${req.body.destination[1]}`;
		new DistanceController(origin, destination, req.body.mode).get().then(result => {
			SuccessResponse(res, 'Successfully get distance data!', result);
		}).catch(errResult => {
			InternalServerErrorResponse(res, errResult.message);
		});
	});
};*/