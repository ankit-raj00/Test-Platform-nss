import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-teal-100 to-gray-100 min-h-screen flex flex-col items-center justify-center py-10">
      {/* Header Section */}
      <header className="text-center mb-12 px-4">
        <h1 className="text-4xl font-bold text-teal-600 mb-4">
          Welcome to the Test Platform
        </h1>
        <p className="text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed">
          This platform is an initiative of <span className="font-semibold">NSS IIT Roorkee</span> to help students prepare and excel in their academics. 
          Here, students can participate in various tests to evaluate their knowledge and enhance their learning experience. 
          The portal is designed to be user-friendly, accessible, and a comprehensive resource for student development.
        </p>
      </header>

      {/* Test Access Section */}
      <section className="bg-white shadow-lg rounded-lg p-8 w-full sm:w-3/4 lg:w-1/2 mx-auto">
        <h2 className="text-3xl font-bold text-teal-600 text-center mb-6">
          Start Your Learning Journey
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          Access a variety of tests curated to improve your knowledge and skills. Click below to begin exploring the resources we’ve prepared for you.
        </p>

        {/* Test Access Button */}
        <div className="flex justify-center">
          <Link
            to="/all-test"
            className="bg-teal-500 text-white py-2 px-6 rounded-lg hover:bg-teal-600 transition duration-300"
          >
            Explore Tests
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-12 text-center text-gray-500 text-sm px-4">
        <p>Test Platform by NSS IIT Roorkee</p>
        <p>All rights reserved © 2024</p>
      </footer>
    </div>
  );
};

export default Home;
