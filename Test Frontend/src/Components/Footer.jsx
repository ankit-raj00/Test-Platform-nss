import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between gap-6">
          {/* Logo and Copyright */}
          <div className="w-full md:w-1/3">
            <div className="mb-6">
              <Logo width="150px" />
            </div>
            <p className="text-sm text-gray-400">
              &copy; 2023 Test Platform - IIT Roorkee. All Rights Reserved.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Designed and maintained by IIT Roorkee.
            </p>
          </div>

          {/* Key Features Section */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-4">Key Features</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>Comprehensive Online Testing</li>
              <li>Real-time Performance Analytics</li>
              <li>Support for Team-Based Evaluations</li>
              <li>Admin Dashboard for Results</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm text-gray-400 mb-2">
               IIT Roorkee, Uttarakhand, 247667
            </p>
            <p className="text-sm text-gray-400">Email: testplatform@iitr.ac.in</p>
            <p className="text-sm text-gray-400">Phone: xxx-xxxx</p>
          </div>

          {/* Social Media Links */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="text-gray-400 hover:text-blue-400 transition duration-300"
              >
                Facebook
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-pink-400 transition duration-300"
              >
                Instagram
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-blue-300 transition duration-300"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-xs text-gray-500">
            This platform is exclusively for students and faculty of IIT Roorkee.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
