import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faCaretUp,
  faChartBar,
  faHome,
  faBuilding,
  faUsers,
  faTools,
  faCog,
  faSignOutAlt,
  faTachometerAlt,
  faAnchor,
  faAdd,
  faBoxes,
  faFileInvoiceDollar,
  faCreditCard,
  faChartLine,
  faGauge,
  faPlug,
  faFire,
  faTint,
  faReceipt,
  faMoneyCheckAlt
} from '@fortawesome/free-solid-svg-icons';
import building from '../../img/building_logo.avif';
import './SubAdminSideBar.css';
import axios from 'axios';
import config from '../../config';

const SubAdminSideBar = ({ isDarkMode, onToggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (submenu) => {
    setOpenSubmenu(openSubmenu === submenu ? null : submenu);
  };

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
    <div className='outerSidebar'>
      <div className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="logo">
          <span>
            <img src={building} alt="Logo" />
          </span>
        </div>
        <nav>
          <ul>
            <li className={location.pathname === '/SubAdminDashboard' ? 'active-link' : ''}>
              <Link to="/SubAdminDashboard">
                <FontAwesomeIcon className='sidebarIcons' icon={faAnchor} /> Dashboard
              </Link>
            </li>
            <li className="dropdown-container">
              <span onClick={() => toggleDropdown('manageFacilities')} className="dropdown-toggle">
                <FontAwesomeIcon className='sidebarIcons' icon={faHome} /> Manage Facility
                {openDropdown === 'manageFacilities' ? (
                  <FontAwesomeIcon icon={faCaretUp} className="dropdown-arrow" />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} className="dropdown-arrow" />
                )}
              </span>
              {openDropdown === 'manageFacilities' && (
                <ul className="dropdown-menu">
                  <li className={location.pathname === '/SubAdminDashboard/UpdateFacility' ? 'active-link' : ''}>
                    <Link to="/SubAdminDashboard/UpdateFacility">
                      <FontAwesomeIcon className='sidebarIcons' icon={faBuilding} /> Update Facility
                    </Link>
                  </li>
                  <li className={location.pathname === '/SubAdminDashboard/AddBuilding' ? 'active-link' : ''}>
                    <Link to="/SubAdminDashboard/AddBuilding">
                      <FontAwesomeIcon className='sidebarIcons' icon={faBuilding} /> Add Building
                    </Link>
                  </li>
                  <li className={location.pathname === '/SubAdminDashboard/AddResident' ? 'active-link' : ''}>
                    <Link to="/SubAdminDashboard/AddResident">
                      <FontAwesomeIcon className='sidebarIcons' icon={faUsers} /> Add Resident
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="dropdown-container">
              <span onClick={() => toggleDropdown('manageMeters')} className="dropdown-toggle">
                <FontAwesomeIcon className='sidebarIcons' icon={faTachometerAlt} /> Manage Meters
                {openDropdown === 'manageMeters' ? (
                  <FontAwesomeIcon icon={faCaretUp} className="dropdown-arrow" />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} className="dropdown-arrow" />
                )}
              </span>
              {openDropdown === 'manageMeters' && (
                <ul className="dropdown-menu">
                  <li>
                    <span onClick={() => toggleSubmenu('gasMeters')} className="dropdown-toggle">
                      <FontAwesomeIcon className='sidebarIcons' icon={faFire} /> Gas Meters
                      {openSubmenu === 'gasMeters' ? (
                        <FontAwesomeIcon icon={faCaretUp} className="dropdown-arrow" />
                      ) : (
                        <FontAwesomeIcon icon={faCaretDown} className="dropdown-arrow" />
                      )}
                    </span>
                    {openSubmenu === 'gasMeters' && (
                      <ul className="submenu">
                        <li className={location.pathname === '/SubAdminDashboard/AttachFlatGasMeters' ? 'active-link' : ''}>
                          <Link to="/SubAdminDashboard/AttachFlatGasMeters">
                            <FontAwesomeIcon className='sidebarIcons' icon={faTools} /> Attach Gas Meters
                          </Link>
                        </li>
                        <li className={location.pathname === '/SubAdminDashboard/AddGasMeterType' ? 'active-link' : ''}>
                          <Link to="/SubAdminDashboard/AddGasMeterType">
                            <FontAwesomeIcon className='sidebarIcons' icon={faAdd} /> Add Gas Meter Type
                          </Link>
                        </li>
                        <li className={location.pathname === '/SubAdminDashboard/AddNewGasMeters' ? 'active-link' : ''}>
                          <Link to="/SubAdminDashboard/AddNewGasMeters">
                            <FontAwesomeIcon className='sidebarIcons' icon={faBoxes} /> Add New Gas Meters
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li>
                    <span onClick={() => toggleSubmenu('waterMeters')} className="dropdown-toggle">
                      <FontAwesomeIcon className='sidebarIcons' icon={faTint} /> Water Meters
                      {openSubmenu === 'waterMeters' ? (
                        <FontAwesomeIcon icon={faCaretUp} className="dropdown-arrow" />
                      ) : (
                        <FontAwesomeIcon icon={faCaretDown} className="dropdown-arrow" />
                      )}
                    </span>
                    {openSubmenu === 'waterMeters' && (
                      <ul className="submenu">
                        <li className={location.pathname === '/SubAdminDashboard/AttachFlatWaterMeters' ? 'active-link' : ''}>
                          <Link to="/SubAdminDashboard/AttachFlatWaterMeters">
                            <FontAwesomeIcon className='sidebarIcons' icon={faTools} /> Attach Water Meters
                          </Link>
                        </li>
                        <li className={location.pathname === '/SubAdminDashboard/AddWaterMeterType' ? 'active-link' : ''}>
                          <Link to="/SubAdminDashboard/AddWaterMeterType">
                            <FontAwesomeIcon className='sidebarIcons' icon={faAdd} /> Add Water Meter Type
                          </Link>
                        </li>
                        <li className={location.pathname === '/SubAdminDashboard/AddNewWaterMeters' ? 'active-link' : ''}>
                          <Link to="/SubAdminDashboard/AddNewWaterMeters">
                            <FontAwesomeIcon className='sidebarIcons' icon={faBoxes} /> Add New Water Meters
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li>
                    <span onClick={() => toggleSubmenu('electricityMeters')} className="dropdown-toggle">
                      <FontAwesomeIcon className='sidebarIcons' icon={faPlug} /> Electricity Meters
                      {openSubmenu === 'electricityMeters' ? (
                        <FontAwesomeIcon icon={faCaretUp} className="dropdown-arrow" />
                      ) : (
                        <FontAwesomeIcon icon={faCaretDown} className="dropdown-arrow" />
                      )}
                    </span>
                    {openSubmenu === 'electricityMeters' && (
                      <ul className="submenu">
                        <li className={location.pathname === '/SubAdminDashboard/AttachFlatElectricityMeters' ? 'active-link' : ''}>
                          <Link to="/SubAdminDashboard/AttachFlatElectricityMeters">
                            <FontAwesomeIcon className='sidebarIcons' icon={faTools} /> Attach Electricity Meters
                          </Link>
                        </li>
                        <li className={location.pathname === '/SubAdminDashboard/AddElectricityMeterType' ? 'active-link' : ''}>
                          <Link to="/SubAdminDashboard/AddElectricityMeterType">
                            <FontAwesomeIcon className='sidebarIcons' icon={faAdd} /> Add Electricity Meter Type
                          </Link>
                        </li>
                        <li className={location.pathname === '/SubAdminDashboard/AddNewElectricityMeters' ? 'active-link' : ''}>
                          <Link to="/SubAdminDashboard/AddNewElectricityMeters">
                            <FontAwesomeIcon className='sidebarIcons' icon={faBoxes} /> Add New Electricity Meters
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>
            <li className={location.pathname === '/SubAdminDashboard/Readings' ? 'active-link' : ''}>
              <Link to="/SubAdminDashboard/Readings">
                <FontAwesomeIcon className='sidebarIcons' icon={faChartLine} /> Readings
              </Link>
            </li>
            <li className={location.pathname === '/SubAdminDashboard/GenerateBills' ? 'active-link' : ''}>
              <Link to="/SubAdminDashboard/GenerateBills">
                <FontAwesomeIcon className='sidebarIcons' icon={faFileInvoiceDollar} /> Generate Bills
              </Link>
            </li>
            <li className="dropdown-container">
              <span onClick={() => toggleDropdown('billPayment')} className="dropdown-toggle">
                <FontAwesomeIcon className='sidebarIcons' icon={faCreditCard} /> Bill Payment
                {openDropdown === 'billPayment' ? (
                  <FontAwesomeIcon icon={faCaretUp} className="dropdown-arrow" />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} className="dropdown-arrow" />
                )}
              </span>
              {openDropdown === 'billPayment' && (
                <ul className="dropdown-menu">
                  <li className={location.pathname === '/SubAdminDashboard/Billing' ? 'active-link' : ''}>
                    <Link to="/SubAdminDashboard/Billing">
                    <FontAwesomeIcon className='sidebarIcons' icon={faReceipt}/>
                      Billing
                    </Link>
                  </li>
                  <li className={location.pathname === '/SubAdminDashboard/Payment' ? 'active-link' : ''}>
                    <Link to="/SubAdminDashboard/Payment">
                      <FontAwesomeIcon className='sidebarIcons' icon={faMoneyCheckAlt}/>
                      Payment
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={location.pathname === '/SubAdminDashboard/settings' ? 'active-link' : ''}>
              <Link to="/SubAdminDashboard/settings">
                <FontAwesomeIcon className='sidebarIcons' icon={faCog} /> Settings
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
    </div>
  );
};

export default SubAdminSideBar;
