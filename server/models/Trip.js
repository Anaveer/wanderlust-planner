const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    imageUrl: { type: String },
    
    summary: { type: String },
    itinerary: { type: Array, default: [] },
    totalMaxCost: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);