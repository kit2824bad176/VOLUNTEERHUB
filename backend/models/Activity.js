const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { type: String, required: true },
    status: { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' },
    registeredVolunteers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['registered', 'completed'],
            default: 'registered'
        }
    }],
    capacity: { type: Number, default: 0 },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
