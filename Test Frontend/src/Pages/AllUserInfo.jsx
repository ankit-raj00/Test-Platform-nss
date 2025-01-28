import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../Backend/auth';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const data = await apiService.getAllUserInfo();
                console.log(data);
                setUsers(data.data.map(user => ({ ...user, isExpanded: false })));
            } catch (err) {
                console.log(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllUsers();
    }, []);

    const handleTestHistoryClick = (testId) => {
        navigate(`/test-analysis/${testId}`);
    };

    const toggleExpand = (userId) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === userId ? { ...user, isExpanded: !user.isExpanded } : user
            )
        );
    };

    const filteredUsers = users.filter((user) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            user.fullName.toLowerCase().includes(searchTermLower) ||
            user.enroll.toLowerCase().includes(searchTermLower) ||
            user.email.toLowerCase().includes(searchTermLower) ||
            user.testHistory.some((history) =>
               
                   
                        typeof history.testId.title === 'string' &&
                        history.testId.title.toLowerCase().includes(searchTermLower)
                
            )
        );
    });
    
    

    if (loading) return <div className="flex justify-center items-center h-screen text-gray-600 text-lg">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500 text-lg">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">User Management</h1>
            <div className="mb-6">
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search by name, enroll, email, or test history"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredUsers.map((user) => (
                    <div
                        key={user._id}
                        className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300"
                    >
                        <h2 className="text-xl font-bold text-gray-700 mb-2">{user.fullName}</h2>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong className="text-gray-800">Enroll:</strong> {user.enroll}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                            <strong className="text-gray-800">Email:</strong> {user.email}
                        </p>
                        <button
                            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 mb-4"
                            onClick={() => toggleExpand(user._id)}
                        >
                            {user.isExpanded ? 'Hide Test History' : 'Show Test History'}
                        </button>
                        {user.isExpanded && (
                            <div className="mt-4">
                                <h3 className="text-md font-semibold text-gray-700 mb-2">Test History</h3>
                                {user.testHistory.length > 0 ? (
                                    <ul className="space-y-2">
                                        {user.testHistory.map((response) => (
                                            <li key={response._id}>
                                                <button
                                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                                                    onClick={() => handleTestHistoryClick(response._id)}
                                                >
                                                    {response.testId.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">No test history available</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersPage;
