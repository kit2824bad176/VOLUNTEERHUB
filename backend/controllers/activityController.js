const Activity = require('../models/Activity');
const User = require('../models/User');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find().sort({ date: 1 });
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get activity by ID
// @route   GET /api/activities/:id
// @access  Public
const getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id).populate('registeredVolunteers.user', 'name email role');
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new activity
// @route   POST /api/activities
// @access  Private (Admin)
const createActivity = async (req, res) => {
    const { title, description, date, location, organizer, capacity } = req.body;

    if (!title || !description || !date || !location || !organizer) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const activity = await Activity.create({
            title,
            description,
            date,
            location,
            organizer,
            capacity: capacity || 0,
            createdBy: req.user.id
        });
        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private (Admin)
const updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        const updatedActivity = await Activity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedActivity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private (Admin)
const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        await activity.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register for an activity (Volunteer)
// @route   POST /api/activities/:id/register
// @access  Private
const registerForActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Check if user already registered
        if (activity.registeredVolunteers.some(v => v.user.toString() === req.user.id)) {
            return res.status(400).json({ message: 'Already registered' });
        }

        // Check capacity if set
        if (activity.capacity > 0 && activity.registeredVolunteers.length >= activity.capacity) {
            return res.status(400).json({ message: 'Activity is full' });
        }

        activity.registeredVolunteers.push({ user: req.user.id });
        await activity.save();
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's registered activities
// @route   GET /api/activities/my-activities
// @access  Private
const getMyActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ 'registeredVolunteers.user': req.user.id });
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update volunteer status
// @route   PATCH /api/activities/:id/volunteer/:userId
// @access  Private (Admin)
const updateVolunteerStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'completed'
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        const volunteer = activity.registeredVolunteers.find(v => v.user.toString() === req.params.userId);

        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found in this activity' });
        }

        volunteer.status = status;
        await activity.save();
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    registerForActivity,
    getMyActivities,
    updateVolunteerStatus
};
