const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    name:{
        type: String,
        required: false
    },
    status:{
        type: String,
        required: false
    },
    doctorName:{
        type: String,
        required: true
    },
    bookingType:{
        type: String,
        required: false
    },
    date:{
        type: Date,
        required: false
    },
    time:{
        type: String,
        required: false
    },
    topic:{
        type: String,
        required: false
    },
    description:{
        type: String,
        required: false
    }
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;