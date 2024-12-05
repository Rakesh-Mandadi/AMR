import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUserPlus,
  faUserEdit,
  faBuilding,
  faCog,
  faEllipsisH,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import man from '../../img/man.png';
import './SuperAdminSideBar.css';
import axios from 'axios';
import config from '../../config';

const SuperAdminSideBar = ({ isDarkMode, onToggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const tokenD = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${config.backendurl}/api/v1/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        localStorage.clear();
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="logo">
        <img src={man} alt="Company Logo" />
      </div>
      <nav>
        <ul>
          <li className={location.pathname === '/SuperAdminDashboard' ? 'active-link' : ''}>
            <Link to="/SuperAdminDashboard">
              <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
            </Link>
          </li>
          <li className={location.pathname === '/SuperAdminDashboard/AddSubAdmin' ? 'active-link' : ''}>
            <Link to="/SuperAdminDashboard/AddSubAdmin">
              <FontAwesomeIcon icon={faUserPlus} /> Add Sub Admin
            </Link>
          </li>
          <li className={location.pathname === '/SuperAdminDashboard/UpdateSubAdmin' ? 'active-link' : ''}>
            <Link to="/SuperAdminDashboard/UpdateSubAdmin">
              <FontAwesomeIcon icon={faUserEdit} /> Update Sub Admin
            </Link>
          </li>
          <li className={location.pathname === '/SuperAdminDashboard/CreateFacility' ? 'active-link' : ''}>
            <Link to="/SuperAdminDashboard/CreateFacility">
              <FontAwesomeIcon icon={faBuilding} /> Create Facility
            </Link>
          </li>
          <li className={location.pathname === '/SuperAdminDashboard/Settings' ? 'active-link' : ''}>
            <Link to="/SuperAdminDashboard/Settings">
              <FontAwesomeIcon icon={faCog} /> Settings
            </Link>
          </li>
          <li className={location.pathname === '/SuperAdminDashboard/Miscellaneous' ? 'active-link' : ''}>
            <Link to="/SuperAdminDashboard/Miscellaneous">
              <FontAwesomeIcon icon={faEllipsisH} /> Miscellaneous
            </Link>
          </li>
          <li onClick={handleLogout}>
            <Link to="/">
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SuperAdminSideBar;