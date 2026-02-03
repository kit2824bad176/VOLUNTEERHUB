const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    isAdmin: { type: Boolean, default: false }, // Keeping for backward compatibility or removing? Instructions said role. Let's keep both for now to be safe, or just rely on role. The prompt asked for "role (student / admin)".
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
