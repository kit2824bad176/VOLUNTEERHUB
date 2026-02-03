import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [myActivities, setMyActivities] = useState([]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/login');
        } else {
            setUser(userData);
            fetchMyActivities(userData.token);
        }
    }, [navigate]);

    const fetchMyActivities = async (token) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get('/api/activities/my-activities', config); // Updated endpoint
            setMyActivities(response.data);
        } catch (error) {
            console.error('Failed to fetch activities', error);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Full name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Activities</h2>
                {myActivities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myActivities.map((activity) => {
                            const myStatus = activity.registeredVolunteers.find(v => v.user === user._id || v.user._id === user._id)?.status || 'registered';
                            return (
                                <div key={activity._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{activity.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{new Date(activity.date).toLocaleDateString()}</p>
                                        <p className="text-gray-600 mb-4">{activity.description.substring(0, 100)}...</p>
                                        <div className="flex justify-between items-center">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${myStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                                Status: {myStatus.charAt(0).toUpperCase() + myStatus.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-600">You haven't registered for any activities yet.</p>
                )}
                <button
                    onClick={() => navigate('/activities')}
                    className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium"
                >
                    Browse available opportunities &rarr;
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
