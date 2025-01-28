import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import apiService from "../Backend/auth";
import HistCard from "../Container/UserHistCard";
import { getResponse, getTestDetail } from "../Backend/config";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [testDetails, setTestDetails] = useState([]);
  const [response, setResponse] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      const response = await apiService.getCurrentUser(); // Replace with your API call
      setUser(response.data);

      // Fetch test details for each test ID in user.testHistory
      if (response.data.testHistory && response.data.testHistory.length > 0) {
        const fetchedResponseDetails = await Promise.all(
          response.data.testHistory.map(async (Id) => {
            const Responsedetail = await getResponse({ id: Id }); // API call to fetch test details by ID
            return Responsedetail.data;
          })
        );

        setResponse(fetchedResponseDetails);
        console.log(fetchedResponseDetails);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
            <span className="text-gray-500 text-sm">User Pic</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{user.fullName}</h2>
          <p className="text-gray-600">Enrollment: {user.enroll}</p>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-semibold text-gray-700">Email:</span> {user.email}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-semibold text-gray-700">Created At:</span> {new Date(user.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-semibold text-gray-700">Last Updated:</span> {new Date(user.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bookmarked Questions Button */}
      <button
        onClick={() => navigate("/bookmarked-question")}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-6 shadow-md hover:bg-blue-700 transition"
      >
        Bookmarked Questions
      </button>

      {/* Test History Section */}
      <div className="mt-8 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Test History</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
          {response.length > 0 ? (
            response.map((resp, index) => (
              <HistCard key={index} id={resp._id} testId={resp.testId} />
            ))
          ) : (
            <p className="text-gray-500">No test history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
