import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';// Import useParams to fetch dynamic route params

import { getTestDetail } from '../Backend/config';

export default function TestAuth({ children }) {
  const { id } = useParams(); // Retrieve test id from the dynamic route
  const navigate = useNavigate();
  const currentDate = new Date();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log(id)
        
        
        const data = await getTestDetail({id}) 
        console.log(data.data)// Parse the JSON data

        // Find the test with the selected testId
        const selectedTest = data.data

        if (selectedTest) {
          const { testDateAndTime, duration , validity } = selectedTest; // Get test date and duration
          const testDateObj = new Date(testDateAndTime);
          const testDurationMs = validity * 60 * 60 * 1000; // Convert duration (hours) to milliseconds
          const testEndTime = new Date(testDateObj.getTime() + testDurationMs);

          if (currentDate >= testDateObj && currentDate <= testEndTime) {
            // Test is ongoing
            console.log("Test is ongoing");
            setLoader(false); // Allow children (Testpage) to render
          } else if (currentDate < testDateObj) {
            // Test is upcoming
            console.log("Test is upcoming");
            navigate('/'); // Redirect to home
          } else {
            // Test has completed
            console.log("Test has ended");
            navigate('/'); // Redirect to home
          }
        } else {
          console.log(`Test with ID ${id} not found.`);
          navigate('/'); // Redirect to home if test is not found
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        navigate('/'); // Redirect to home in case of an error
      }
    };

    fetchQuestions();
  }, [id, currentDate, navigate]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}
