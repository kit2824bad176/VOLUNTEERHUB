const express = require('express');
const router = express.Router();
const {
    getActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    registerForActivity,
    getMyActivities,
    updateVolunteerStatus
} = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

// Middleware to check for admin role
const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.isAdmin)) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

router.get('/', getActivities);
router.get('/my-activities', protect, getMyActivities); // Changed from /my to match requirements
router.get('/:id', getActivityById);

router.post('/', protect, admin, createActivity);
router.put('/:id', protect, admin, updateActivity);
router.delete('/:id', protect, admin, deleteActivity);
router.patch('/:id/volunteer/:userId', protect, admin, updateVolunteerStatus);

router.post('/:id/register', protect, registerForActivity); // Changed from PUT to match requirements POST /api/activities/:id/register

module.exports = router;
