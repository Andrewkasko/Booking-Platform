const mongoose = require('mongoose');

const DoctorBookingPreferenceSchema = new mongoose.Schema({
    doctorId:{
        type: String,
        required: true
    },
    startTime:{
        type: String,
        required: true
    },
    finishTime:{
        type: String,
        required: true
    },
    startDate:{
        type: String,
        required: true
    },
    finishDate:{
        type: String,
        required: true
    }
});

const DoctorBookingPreference = mongoose.model('DoctorBookingPreference', DoctorBookingPreferenceSchema);

module.exports = DoctorBookingPreference;