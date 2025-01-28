import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from '../Container/Container';
import LogoutBtn from './LogoutBtn';

import AdminLogoutBtn from './AdminLogoutBtn';

function Header() {
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.auth.status);
  const adminStatus = useSelector((state) => state.auth.adminstatus);

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'Login', slug: '/login', active: !authStatus },
    { name: 'Tests', slug: '/all-test', active: authStatus },
    { name: 'Profile', slug: '/profile', active: authStatus },
    { name: 'Teams', slug: '/teams', active: true },
    { name: 'About Us', slug: '/about-us', active: true },
    { name: 'Sign Up', slug: '/signup', active: !authStatus },
    { name: 'Admin Login', slug: '/admin-dash/login', active: !adminStatus },
    { name: 'Admin Dashboard', slug: '/admin-dash', active: adminStatus },
  ];

  return (
    <header className="bg-gradient-to-r from-green-500 to-teal-600 py-4 shadow-lg">
      <Container>
        <nav className="flex flex-wrap justify-between items-center">
          {/* Title */}
          <div className="flex items-center">
            <h1 className="text-white text-lg sm:text-xl lg:text-2xl font-semibold">
              Test Platform - IIT Roorkee
            </h1>
          </div>

          {/* Navigation Menu */}
          <ul className="flex flex-wrap justify-end gap-4 md:gap-6 items-center">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="text-white text-sm md:text-base lg:text-lg px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-transform duration-300 hover:bg-white hover:text-teal-600 hover:scale-110"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {/* Conditional Logout Buttons */}
            {authStatus && !adminStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
            {!authStatus && adminStatus && (
              <li>
                <AdminLogoutBtn />
              </li>
            )}{authStatus && adminStatus && (
              <>
                <li>
                  <LogoutBtn />
                </li>
                <li>
                  <AdminLogoutBtn />
                </li>
              </>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
