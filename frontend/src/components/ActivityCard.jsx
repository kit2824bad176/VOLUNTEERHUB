import { Link } from 'react-router-dom';

const ActivityCard = ({ activity, onRegister, isRegistered }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <Link to={`/activities/${activity._id}`} className="hover:underline">
                <h3 className="text-xl font-bold text-gray-900">{activity.title}</h3>
            </Link>
            <p className="text-gray-600 mt-2 line-clamp-3">{activity.description}</p>
            <div className="mt-4 flex flex-col space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{activity.location}</span>
                </div>
            </div>
            <button
                onClick={() => onRegister(activity._id)}
                disabled={isRegistered}
                className={`mt-4 w-full py-2 px-4 rounded font-medium transition-colors duration-200 ${isRegistered
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
            >
                {isRegistered ? 'Registered' : 'Volunteer Now'}
            </button>
        </div>
    );
};

export default ActivityCard;
