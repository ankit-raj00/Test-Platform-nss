import React from 'react';
import TestComp from '../Components/TestComp';
import { useParams } from 'react-router-dom';

const Testpage = () => {
  // Extract test ID from URL parameters
  const { id } = useParams(); 

  return (
    <div className="App">
      <h1>Welcome to the Test Portal</h1>
      <TestComp testId={id} /> {/* Pass the test ID as a prop */}
    </div>
  );
};

export default Testpage;
