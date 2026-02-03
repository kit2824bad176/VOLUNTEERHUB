import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [activities, setActivities] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        organizer: '',
        capacity: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
        } else {
            fetchActivities();
        }
    }, [navigate, user]);

    const fetchActivities = async () => {
        try {
            const response = await axios.get('/api/activities');
            setActivities(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: { Authorization: `Bearer ${user.token}` },
        };

        try {
            if (isEditing) {
                await axios.put(`/api/activities/${currentId}`, formData, config);
                setIsEditing(false);
                setCurrentId(null);
            } else {
                await axios.post('/api/activities', formData, config);
            }
            setFormData({ title: '', description: '', date: '', location: '', organizer: '', capacity: '' });
            fetchActivities();
        } catch (error) {
            console.error(error);
            alert('Error saving activity');
        }
    };

    const handleEdit = (activity) => {
        setFormData({
            title: activity.title,
            description: activity.description,
            date: new Date(activity.date).toISOString().split('T')[0],
            location: activity.location,
            organizer: activity.organizer || '',
            capacity: activity.capacity || ''
        });
        setIsEditing(true);
        setCurrentId(activity._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                await axios.delete(`/api/activities/${id}`, config);
                fetchActivities();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Activity' : 'Create New Activity'}</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={onChange} required className="w-full border border-gray-300 p-2 rounded" />
                        <input type="text" name="organizer" placeholder="Organizer" value={formData.organizer} onChange={onChange} required className="w-full border border-gray-300 p-2 rounded" />
                        <input type="date" name="date" value={formData.date} onChange={onChange} required className="w-full border border-gray-300 p-2 rounded" />
                        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={onChange} required className="w-full border border-gray-300 p-2 rounded" />
                        <input type="number" name="capacity" placeholder="Capacity (0 for unlimited)" value={formData.capacity} onChange={onChange} className="w-full border border-gray-300 p-2 rounded" />
                    </div>
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={onChange} required className="w-full border border-gray-300 p-2 rounded h-24"></textarea>
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-medium">
                        {isEditing ? 'Update Activity' : 'Create Activity'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={() => { setIsEditing(false); setFormData({ title: '', description: '', date: '', location: '', organizer: '', capacity: '' }); }} className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 font-medium">
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {activities.map((activity) => (
                            <tr key={activity._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{activity.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(activity.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activity.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {activity.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleEdit(activity)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(activity._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
