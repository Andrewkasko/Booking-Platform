/*var addressModel = require('../models/Distance');*/
var addressModel = require('../models/User').fetchData;
module.exports = {

    fetchData: function (req, res) {
        addressModel.fetchData(function (data) {

            var origins = [req.query.origin];
            var radius = req.query.radius; //5km
            console.log(origins[0]);

            var destinations = data;

            var distance = require('google-distance-matrix');
            distance.key('AIzaSyBv7hBYAySRTtHgg73x-Hz1oykEKe3X1vk');
            distance.units('metric');
            let address_in_range = [];
            distance.matrix(origins, destinations, function (err, distances) {
                if (err) {
                    return console.log(err);
                }
                if (!distances) {
                    return console.log('no distances');
                }
                if (distances.status == 'OK') {
                    for(var i = 0; i < origins.length; i++) {
                        for (var j = 0; j < destinations.length; j++) {
                            var destination = distances.destination_addresses[j];
                            if (distances.rows[0].elements[j].status == 'OK') {
                                var distance = distances.rows[i].elements[j].distance.text;
                                console.log('Distance from ' + origins[i] + ' to ' + destination + ' is ' + distance);
                                var distance_int = distance.split(" ")[0];
                                console.log(distance_int + " " + radius);
                                if(parseFloat(distance_int,10) <= parseFloat(radius,10)) {
                                    address_in_range.push({origin:origins[i], clinic:destinations[j].name, destination, distance, id:destinations[j].id});
                                }
                            } else {
                                console.log(destination + ' is not reachable by land from ' + origins[i]);
                            }
                        }
                    }
                }
                res.render('dashboard\\search',{addressData:address_in_range, addressOrigin:origins[0]});
            });
            //console.log(data);
        });
    }
}