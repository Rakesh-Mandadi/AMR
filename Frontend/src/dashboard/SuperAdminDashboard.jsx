import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SuperAdminSideBar from './superAdminDashboard/SuperAdminSideBar';
import TopNav from './TopNav';
import ConfirmDeleteModal from '../elements/ConfirmDelete';
import './SuperAdminDashboard.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config';

const fetchFacilityDetails = async (userId, setFacilityDetails, setErrorMessage) => {
  try {
    const tokenD = localStorage.getItem('token');

    if (!tokenD || !userId) {
      setErrorMessage('Error verifying details from login');
      return;
    }

    const response = await axios.get(`${config.backendurl}/api/v1/users/subadmin/${userId}`, {
      headers: {
        Authorization: `Bearer ${tokenD}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const { city, country, facilityId, facilityName, pin, state, street } = response.data.data;
      setFacilityDetails({ city, country, facilityId, facilityName, pin, state, street });
    } else {
      setErrorMessage('Failed to fetch facility details.');
      console.error('Facilities read error', response.data);
    }
  } catch (error) {
    console.error('Error fetching facility details:', error);
    setErrorMessage('Error fetching facility details.');
  }
};

function SuperAdminDashboard() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTable, setActiveTable] = useState('facilities');
  const location = useLocation();
  const [flashcardDetails, setFlashcardDetails] = useState({
    facilityCount: '',
    subAdminCount: '',
    flatCount: '',
    meterCount: '',
  });
  const [facilityTableDetails, setFacilityTableDetails] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    facilityId: '',
    facilityName: '',
    street: '',
    city: '',
    state: '',
    pin: '',
    country: 'India',
  });
  const [facilityDetails, setFacilityDetails] = useState({
    city: '',
    country: '',
    facilityId: '',
    facilityName: '',
    pin: '',
    state: '',
    street: '',
  });

  const fetchFlashcardDetails = async () => {
    try {
      const tokenD = localStorage.getItem('token');
      console.log("get numeric api",tokenD);
     
      const response = await axios.get(`${config.backendurl}/api/v1/users/getNumericData`, {
        headers: {
          Authorization: `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const { facilityCount, subAdminCount, flatCount, meterCount } = response.data.data;
        setFlashcardDetails({ facilityCount, subAdminCount, flatCount, meterCount });
      } else {
        setErrorMessage('Failed to fetch flashcard details.');
        console.error('Flashcard details read error', response.data);
      }
    } catch (error) {
      console.error('Error fetching flashcard details:', error);
      setErrorMessage('Error fetching flashcard details.');
    }
  };

  const fetchFacilityTableDetails = async () => {
    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/getListFacilityUserName`, {
        headers: {
          Authorization: `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });

      if (Array.isArray(response.data)) {
        console.log(" table data... ", response.data)
        setFacilityTableDetails(response.data);
      } else {
        setErrorMessage('Failed to fetch facility table details.');
        console.error('Facility table details read error', response.data);
      }
    } catch (error) {
      console.error('Error fetching facility table details:', error);
      setErrorMessage('Error fetching facility table details.');
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }

    fetchFlashcardDetails();
    fetchFacilityTableDetails();
  }, []);

  useEffect(() => {
    if (location.pathname === '/SuperAdminDashboard') {
      fetchFlashcardDetails();
      fetchFacilityTableDetails();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (facilityDetails.facilityId) {
      setFormData({
        facilityId: facilityDetails.facilityId || '',
        facilityName: facilityDetails.facilityName || '',
        street: facilityDetails.street || '',
        city: facilityDetails.city || '',
        state: facilityDetails.state || '',
        country: facilityDetails.country || '',
        pin: facilityDetails.pin || '',
      });
    }
  }, [facilityDetails]);

  const handleToggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const handleFlashcardClick = (table) => {
    setActiveTable(table);
  };

  const handleDeleteClick = (facility) => {
    setSelectedFacility(facility);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.delete(`${config.backendurl}/api/v1/users/${selectedFacility.facilityId}`, {
        headers: {
          Authorization: `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        await fetchFacilityTableDetails();
        setFacilityTableDetails((prevDetails) =>
          prevDetails.filter((facility) => facility.facilityId !== selectedFacility.facilityId)
        );
        setShowDeleteModal(false);
        await fetchFlashcardDetails();
      } else {
        setErrorMessage('Failed to delete facility.');
        console.error('Facility delete error', response.data);
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
      setErrorMessage('Error deleting facility.');
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleEditClick = (facility) => {
    setShowEditForm(true);
    fetchFacilityDetails(facility.userId, setFacilityDetails, setErrorMessage);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : value,
    }));
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      facilityId: formData.facilityId,
      facilityName: formData.facilityName,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pin: parseInt(formData.pin, 10),
      country: formData.country,
    };

    try {
      const tokenD = localStorage.getItem('token');

      const response = await axios.put(`${config.backendurl}/api/v1/users/updateFacilityDetails`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Facility updated successfully');
        setErrorMessage('');
        setShowEditForm(false);
        setFacilityTableDetails((prevDetails) =>
          prevDetails.map((facility) =>
            facility.facilityId === formData.facilityId ? { ...facility, ...formData } : facility
          )
        );
      } else {
        toast.error('Failed to update facility');
        setErrorMessage('Failed to update facility.');
        console.error('Failed to update facility', response.data);
      }
    } catch (error) {
      console.error('Error submitting form', error);
      toast.error('Error submitting form');
      setErrorMessage('Error submitting form.');
    }
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  const isDashboardRoute = location.pathname === '/SuperAdminDashboard';

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <SuperAdminSideBar isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
      <div className="content">
        <TopNav isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
        <main>
          {isDashboardRoute ? (
            <>
              <h3>Super Admin Dashboard</h3>
              <div className="flashcards">
                <div className="flashcard" onClick={() => handleFlashcardClick('facilities')}>
                  <p>Facilities</p>
                  <div className="flashcardCount">{flashcardDetails.facilityCount}</div>
                </div>
                <div className="flashcard" onClick={() => handleFlashcardClick('subAdmin')}>
                  <p>Sub-Admin</p>
                  <div className="flashcardCount">{flashcardDetails.subAdminCount}</div>
                </div>
                <div className="flashcard" onClick={() => handleFlashcardClick('flatsResidents')}>
                  <p>Flats/Residents</p>
                  <div className="flashcardCount">{flashcardDetails.flatCount}</div>
                </div>
                <div className="flashcard" onClick={() => handleFlashcardClick('numberOfMeters')}>
                  <p>Number of Meters</p>
                  <div className="flashcardCount">{flashcardDetails.meterCount}</div>
                </div>
              </div>
              {activeTable === 'facilities' && (
                <div className="facilities-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Facility Name</th>
                        <th>City</th>
                        <th>Username</th>
                        <th>User E-mail</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facilityTableDetails.map((facility, index) => (
                        <tr key={facility.facilityId}>
                          <td>{index + 1}</td>
                          <td>{facility.facilityName}</td>
                          <td>{facility.city}</td>
                          <td>{facility.userName}</td>
                          <td>{facility.email}</td>
                          <td>
                            <button className="update_button" onClick={() => handleEditClick(facility)}>
                              Update
                            </button>
                            <button className="delete_button" onClick={() => handleDeleteClick(facility)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {showEditForm && (
                <div className="edit-form-container">
                  <form onSubmit={handleUpdateSubmit} className="edit-form">
                    <div className="edit-form-header">
                      <h4>Edit Facility</h4>
                      <button type="button" className="close-edit-form" onClick={handleCloseEditForm}>
                        &times;
                      </button>
                    </div>
                    <input
                      type="text"
                      name="facilityName"
                      value={formData.facilityName}
                      onChange={handleInputChange}
                      placeholder="Facility Name"
                    />
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="Street"
                    />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                    />
                    <input
                      type="text"
                      name="pin"
                      value={formData.pin}
                      onChange={handleInputChange}
                      placeholder="PIN"
                    />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCloseEditForm}>
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        Name={selectedFacility?.facilityName}
      />
      <ToastContainer/>
    </div>
  );
}

export default SuperAdminDashboard;
