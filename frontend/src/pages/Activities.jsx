import { useState, useEffect } from 'react';
import axios from 'axios';
import ActivityCard from '../components/ActivityCard';
import { useNavigate } from 'react-router-dom';

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('/api/activities');
                setActivities(response.data);
            } catch (err) {
                setError('Failed to fetch activities');
            }
        };

        fetchActivities();
    }, []);

    const handleRegister = async (id) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.post(`/api/activities/${id}/register`, {}, config); // Changed to POST
            // Refresh activities to update status
            const response = await axios.get('/api/activities');
            setActivities(response.data);
            alert('Successfully registered!');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Volunteer Opportunities</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                    <ActivityCard
                        key={activity._id}
                        activity={activity}
                        onRegister={handleRegister}
                        isRegistered={user && activity.registeredVolunteers.some(v => v.user === user._id || v.user._id === user._id)}
                    />
                ))}
            </div>
            {activities.length === 0 && !error && (
                <p className="text-gray-500 text-center text-lg mt-8">No activities found at the moment.</p>
            )}
        </div>
    );
};

export default Activities;
