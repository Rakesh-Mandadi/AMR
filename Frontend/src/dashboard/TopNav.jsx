import React from 'react';
import man from '../img/man.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import './TopNav.css';

const TopNav = ({ onToggleTheme, isDarkMode }) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const userNameProfile = userData?.username;

  return (
    <div>
      <header>
        <nav className="top-navbar">
          <div className="user-profile">
            <img src={man} alt="User Profile" />
            <span>{userNameProfile}</span>
          </div>
          <div className="theme-toggle">
            <label className='switch'>
              <input
                type='checkbox'
                hidden
                onChange={onToggleTheme}
                checked={isDarkMode}
              />
              <div className='switch__wrapper'>
                <div className='switch__toggle'>
                  {isDarkMode ? (
                    <FontAwesomeIcon icon={faSun} />
                  ) : (
                    <FontAwesomeIcon icon={faMoon} />
                  )}
                </div>
              </div>
            </label>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default TopNav;
