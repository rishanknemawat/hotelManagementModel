var mongoose = require('mongoose');

var bookingSchema = new mongoose.Schema({
    from: Date,
    to: Date,
    adults: Number,
    children: Number,
    rooms: Number,
    roomtype: String,
});

module.exports = mongoose.model('Booking', bookingSchema);