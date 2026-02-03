import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ActivityDetails = () => {
    const [activity, setActivity] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await axios.get(`/api/activities/${id}`);
                setActivity(response.data);
                if (user && response.data.registeredVolunteers.some(v => v.user._id === user._id || v.user === user._id)) {
                    setIsRegistered(true);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchActivity();
    }, [id, user]);

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.post(`/api/activities/${id}/register`, {}, config);
            setIsRegistered(true);
            // Refresh to update list
            const response = await axios.get(`/api/activities/${id}`);
            setActivity(response.data);
            alert('Successfully registered!');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    const markCompleted = async (userId) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.patch(`/api/activities/${id}/volunteer/${userId}`, { status: 'completed' }, config);
            const response = await axios.get(`/api/activities/${id}`);
            setActivity(response.data);
            alert('Marked as completed');
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    if (!activity) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${activity.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {activity.status}
                        </span>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-4 text-gray-600">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {new Date(activity.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {activity.location}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            Organizer: {activity.organizer}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">About this opportunity</h3>
                        <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-gray-500">Volunteers Registered: </span>
                                <span className="font-semibold">{activity.registeredVolunteers.length}</span>
                                {activity.capacity > 0 && <span className="text-gray-400"> / {activity.capacity}</span>}
                            </div>
                            {user?.role !== 'admin' && (
                                <button
                                    onClick={handleRegister}
                                    disabled={isRegistered}
                                    className={`px-6 py-3 rounded-md font-medium text-white transition-colors duration-200 ${isRegistered
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                >
                                    {isRegistered ? 'Registered' : 'Volunteer Now'}
                                </button>
                            )}
                        </div>
                    </div>

                    {user?.role === 'admin' && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Registered Volunteers</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {activity.registeredVolunteers.map((vol) => (
                                            <tr key={vol.user._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{vol.user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{vol.user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vol.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {vol.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {vol.status !== 'completed' && (
                                                        <button
                                                            onClick={() => markCompleted(vol.user._id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Mark Completed
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityDetails;
