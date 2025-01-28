import React, { useEffect, useState } from 'react';
import CardComponent from '../Container/TestCard'; // Correct path to CardComponent file
import { getAllTestDetails } from '../Backend/config';
import { useSelector } from 'react-redux';

const AllTest = () => {
  const [tests, setTests] = useState([]);
  const [filter, setFilter] = useState('all'); // Filter state
  

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getAllTestDetails();
        setTests(data.data); // Store fetched tests
        console.log(data.data)
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, []);

  // Filter logic
  const filteredTests = tests.filter((test) => {
    const currentDate = new Date();
    const testDate = new Date(test.testDateAndTime);

    if (filter === 'upcoming') return testDate > currentDate;
    if (filter === 'active') return testDate <= currentDate && currentDate <= new Date(testDate.getTime() + (test.validity ? test.validity * 60 * 60000 : test.duration * 60000) );
    if (filter === 'completed') return new Date(testDate.getTime() + (test.validity ? test.validity * 60 * 60000 : test.duration * 60000)) < currentDate;
    return true; // Default to "all"
  });

  return (
    <div className="min-h-screen p-4">
      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Render filtered tests */}
      <div className="flex justify-center items-center flex-wrap gap-6">
        {filteredTests.map((test) => (
          <CardComponent
            key={test._id}
            id={test._id}
            title={test.title}
            pattern={test.pattern}
            time={test.duration}
            totalMarks={test.totalMarks}
            testDate={test.testDateAndTime}
            duration={test.duration}
            validity = {test.validity}
            syllabus={test.syllabus}
          />
        ))}
        {filteredTests.length === 0 && <p>No tests available for the selected filter.</p>}
      </div>
    </div>
  );
};

export default AllTest;
