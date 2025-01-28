import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CardComponent = ({ id, title, pattern, time, totalMarks, testDate, duration, validity, syllabus }) => {
  const [remainingTime, setRemainingTime] = useState('');
  const [isTestActive, setIsTestActive] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [status, setStatus] = useState('Upcoming');
  const [isSyllabusVisible, setIsSyllabusVisible] = useState(false); // State for toggling syllabus visibility
  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      const testDateObj = new Date(testDate);
      const validityEndTime = new Date(testDateObj.getTime() + validity * 60 * 60 * 1000); // Add validity (hours)

      const difference = testDateObj - currentDate;

      if (difference > 0) {
        // Before test starts
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        setStatus('Upcoming'); // Test is still upcoming
        setIsButtonDisabled(true); // Disable button while time is remaining
      } else if (currentDate < validityEndTime) {
        // During test validity period
        const validityRemaining = validityEndTime - currentDate;
        const hours = Math.floor(validityRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((validityRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((validityRemaining % (1000 * 60)) / 1000);

        setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
        setStatus('Ongoing'); // Test is ongoing
        setIsTestActive(true);
        setIsButtonDisabled(false); // Enable button when test starts
      } else {
        // After validity period
        setRemainingTime('Test Expired');
        setStatus('Expired'); // Test has expired
        setIsButtonDisabled(true); // Disable button after validity ends
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [testDate, validity]);

  const handleStartTest = () => {
    navigate(`/test/${id}`); // Navigate to the test page using the test ID
  };

  const toggleSyllabus = () => {
    setIsSyllabusVisible((prev) => !prev); // Toggle syllabus visibility
  };

  return (
    <div id={id} className="w-80 p-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 cursor-pointer">
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="text-left text-lg text-gray-900">
        <p className="mb-3"><strong>Pattern:</strong> 📝 {pattern}</p>
        <p className="mb-3"><strong>Time:</strong> ⏰ {time} minutes</p>
        <p className="mb-3"><strong>Total Marks:</strong> 🎯 {totalMarks}</p>
        <p className="mb-3"><strong>Test Date & Time:</strong> 📅 {new Date(testDate).toLocaleString()}</p>
        <p className="mb-3"><strong>Validity:</strong> 🕒 {validity} hours</p>
        <p className="mt-4 text-sm text-gray-700"><strong>Remaining Time:</strong> ⏳ {remainingTime}</p>
        <p className="mt-2 text-sm text-gray-700"><strong>Status:</strong> {status}</p>
      </div>
      <div className="mt-4">
        <button 
          onClick={handleStartTest} 
          disabled={isButtonDisabled} 
          className={`w-full py-2 px-4 mt-4 rounded-lg font-semibold text-white ${isButtonDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isTestActive ? 'Test is Active' : status === 'Expired' ? 'Test Expired' : 'Start Test'}
        </button>
        <button 
          onClick={toggleSyllabus} 
          className="w-full py-2 px-4 mt-4 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600"
        >
          {isSyllabusVisible ? 'Hide Syllabus' : 'Show Syllabus'}
        </button>
        {isSyllabusVisible && (
          <div className="mt-4 p-3 bg-white text-gray-900 rounded-lg shadow-md">
            <h4 className="font-semibold mb-2">Syllabus:</h4>
            <p>{syllabus}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardComponent;
