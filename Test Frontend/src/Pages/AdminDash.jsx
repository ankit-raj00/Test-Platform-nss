import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTestCard from '../Container/AdminTestCard';
import { getAllTestDetails, getTestDetail, deleteQuestion, deleteTest } from '../Backend/config';

const MainPage = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('ascending');
  const navigate = useNavigate();

  const fetchTests = async () => {
    try {
      const data = await getAllTestDetails();
      if (!data) throw new Error(data.message || 'Failed to fetch tests');
      setTests(data.data);
    } catch (error) {
      console.error('Error fetching tests:', error.message);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    const now = new Date();
    console.log(now)
    const filtered = tests.filter((test) => {
      const testDate = new Date(test.testDateAndTime);
      const testEndTime = new Date(
        testDate.getTime() + (test.validity ? test.validity * 60 * 60 * 1000 : test.duration * 60 * 1000)
      );

      if (filterType === 'Upcoming') return testDate > now;
      if (filterType === 'Active') return now >= testDate && now <= testEndTime;
      if (filterType === 'Completed') return now > testEndTime;
      return true; // Default is "All"
    });

    // Sort the filtered tests
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.testDateAndTime);
      const dateB = new Date(b.testDateAndTime);
      return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
    });

    setFilteredTests(sorted);
  }, [filterType, sortOrder, tests]);

  const handleDelete = async (id) => {
    try {
      const data = await getTestDetail({ id });
      const questionIds = data.data.testQuestions.map((q) => q._id);

      for (let questionId of questionIds) {
        const response = await deleteQuestion({ questionId });
        if (!response) throw new Error(`Failed to delete question with ID: ${questionId}`);
      }

      await deleteTest({ id });
      alert('Test deleted successfully!');
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin-dash/edit-test/${id}`);
  };

  const handleCreateTest = () => {
    navigate('/admin-dash/create-test');
  };

  const handleStudentDetails = () => {
    navigate('/all-user');
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleCreateTest}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create Test
        </button>
        <button
          onClick={handleStudentDetails}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Student Details
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Tests</h1>
        <div className="flex space-x-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="All">All</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="ascending">Sort by Date (Ascending)</option>
            <option value="descending">Sort by Date (Descending)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTests.length > 0 ? (
          filteredTests.map((test) => (
            <AdminTestCard
              key={test._id}
              id={test._id}
              title={test.title}
              pattern={test.pattern}
              time={test.duration}
              totalMarks={test.totalMarks}
              testDate={test.testDateAndTime}
              validity={test.validity}
              duration={test.duration}
              syllabus={test.syllabus}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No tests found for the selected filter.</p>
        )}
      </div>
    </div>
  );
};

export default MainPage;
