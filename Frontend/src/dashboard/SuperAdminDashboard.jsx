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
  const [editType, setEditType] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTable, setActiveTable] = useState('facilities');
  const location = useLocation();
  const [flashcardDetails, setFlashcardDetails] = useState({
    facilityCount: '',
    subAdminCount: '',
    flatCount: '',
    assignedMeter: '',
    // unAssignedMeter:'',
  });
  const [currentEditType, setCurrentEditType] = useState(''); // Tracks 'facility', 'subAdmin', or 'meter'
 

  const [subAdminDetails, setSubAdminDetails] = useState([]);
  const[flatDetails, setFlatDetails] = useState([]);
  const [facilityTableDetails, setFacilityTableDetails] = useState([]);
  const[assignedMeters,setAssignedMeters] = useState([])
  const[flatMeters,setFlatMeters] = useState([])
  
  const [detailedMeterData, setDetailedMeterData] = useState(null);
  const [facilityId , setfacilityId]= useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const[selectedSubAdmin,setSelectedSubAdmin]=useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    facilityId: '',
    facilityName: '',
    street: '',
    city: '',
    state: '',
    pin: '',
    country: 'India',
    userName: '',
    email: '',
    contactNumber: '',
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
      const response = await axios.get(`${config.backendurl}/api/v1/users/getNumericData`, {
        headers: {
          Authorization: `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const { facilityCount, subAdminCount, flatCount, assignedMeter } = response.data.data;
        setFlashcardDetails({ facilityCount, subAdminCount, flatCount, assignedMeter});
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
  const getSubAdmins = async () => {
    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/getSubAdmins`, {
        headers: {
          Authorization: `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });

      if (Array.isArray(response.data)) {
        setSubAdminDetails(response.data);
      } else {
        setErrorMessage('Failed to fetch subadmin table details.');
        console.error('Subadmin table details read error', response.data);
      }
    } catch (error) {
      console.error('Error fetching subadmin table details:', error);
      setErrorMessage('Error fetching subadmin table details.');
    }
  };
  const getFlatDetails = async () => {
    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/getFlatDetails`, {
        
        headers: {
          Authorization: `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });
      // console.log("Flat details received from API: ",response.data);

      if (Array.isArray(response.data)) {
        setFlatDetails(response.data);
      } else {
        setErrorMessage('Failed to fetch ResidentFlat table details.');
        console.error('ResidentFlat table details read error', response.data);
      }
    } catch (error) {
      console.error('Error fetching ResidentFlat table details:', error);
      setErrorMessage('Error fetching ResidentFlat table details.');
    }
  };
  const getAssignedMeters = async () => {
    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/getFacilityMeterDetails`, {
        
        headers: {
          Authorization: `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });
      // console.log("Flat details received from API: ",response.data);

      if (Array.isArray(response.data)) {
        setAssignedMeters(response.data);
      } else {
        setErrorMessage('Failed to fetch FacilityMeter table details.');
        console.error('FacilityMeter table details read error', response.data);
      }
    } catch (error) {
      console.error('Error fetching FacilityMeter table details:', error);
      setErrorMessage('Error fetching FacilityMeter table details.');
    }
  };

  const getFlatMeters = async () => {
    // if (!facilityDetails.facilityId) {
    //   console.error('Facility ID is null or undefined');
    //   return;
    // }
  
    try {
      
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityId}/getAssignedMeterDetails`, {
        
        headers: {
          Authorization: `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });
      // console.log("Flatmeter details received from API: ",response.data);

      if (response.status === 200) {
        console.log("/getAssignedMeterDetails",response.data);
        setFlatMeters(response.data);
      } else {
        setErrorMessage('Failed to fetch detailed building data.');
        console.error('Detailed building data read error', response.data);
      }
    } catch (error) {
      console.error('Error fetching detailed building data:', error);
      setErrorMessage('Error fetching detailed building data.');
    }
  };
useEffect(()=>{
  getFlatMeters()

},[facilityId])

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
      
      getSubAdmins();
      getFlatDetails();
      getAssignedMeters();
      //getFlatMeters();
    }
  }, [location.pathname]);
  


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

  const handleEditClick = (data, type) => {
    setCurrentEditType(type); // Set the type of form
    setShowEditForm(true);
  
    if (type === 'facility') {
      fetchFacilityDetails(data.userId, setFacilityDetails, setErrorMessage);
      setFormData({
        facilityId: data.facilityId,
        facilityName: data.facilityName,
        street: data.street,
        city: data.city,
        state: data.state,
        pin: data.pin,
        country: data.country || 'India',
      });
    } else if (type === 'subAdmin') {
      setFormData({
        userName: data.userName || '',
        email: data.email || '',
        contactNumber: data.contactNumber || '',
      });
    } else if (type === 'meter') {
      setFormData({
        noOfMeters: data.noOfMeters || '',
      });
    } else if(type=='assignedMeter'){
      setFormData({
        noOfMeters:data.noOfMeters||'',
      });
    }
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

    const tokenD = localStorage.getItem('token');

    try {
      const response = formData.facilityId
        
        ? await axios.put(
            `${config.backendurl}/api/v1/users/updateFacilityDetails`,
            {
              facilityId: formData.facilityId,
              facilityName: formData.facilityName,
              street: formData.street,
              city: formData.city,
              state: formData.state,
              pin: parseInt(formData.pin, 10),
              country: formData.country,
            },
            {
              headers: {
                Authorization: `Bearer ${tokenD}`,
                'Content-Type': 'application/json',
              },
            }
          )
          : formData.userName
          ? await axios.put(
            `${config.backendurl}/api/v1/users/updateSubAdminDetails`,
            {
              userName: formData.userName,
              email: formData.email,
              contactNumber: formData.contactNumber,
            },
            {
              headers: {
                Authorization: `Bearer ${tokenD}`,
                'Content-Type': 'application/json',
              },
            }
          )
          : await axios.put(
            `${config.backendurl}/api/v1/users/updateFlatDetails`,
            {
              noOfMeters: formData.noOfMeters,
              
            },
            {
              headers: {
                Authorization: `Bearer ${tokenD}`,
                'Content-Type': 'application/json',
              },
            }
          );
        if (response.status === 200 || response.status === 201) {
        toast.success(formData.userName ? 'Sub-admin updated successfully' : formData.facilityId ? 'Facility updated successfully' : 'Resident details updated sucessfully');
        setErrorMessage('');
        setShowEditForm(false);
        fetchFacilityTableDetails();
      } else {
        toast.error('Update failed');
        setErrorMessage('Update failed.');
        console.error('Update error', response.data);
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
    <div className="fullPage">
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
                <div className="flashcard" onClick={() => handleFlashcardClick('flat')}>
                  <p>Flats/Residents</p>
                  <div className="flashcardCount">{flashcardDetails.flatCount}</div>
                </div>
                <div className="flashcard" onClick={() => handleFlashcardClick('Meters')}>
                  <p>Assigned Meters</p>
                  <div className="flashcardCount">{flashcardDetails.assignedMeter}</div>
                </div>
                {/* <div className="flashcard" onClick={() => handleFlashcardClick('unAssignedMeters')}>
                  <p>UnAssigned Meters</p>
                  <div className="flashcardCount">{flashcardDetails.unAssignedMeter}</div>
                </div> */}
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
                            <button className="update_button" onClick={() => handleEditClick(facility, 'facility')}>
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
              
              {activeTable === 'subAdmin' && (
                <div className="subAdmin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subAdminDetails.map((subAdmin, index) => (
                        <tr key={subAdmin.subAdminId}>
                          <td>{index + 1}</td>
                          <td>{subAdmin.Name}</td>
                          <td>{subAdmin.Email}</td>
                          <td>{subAdmin.Contact}</td>
                          <td>
                            <button className="update_button" onClick={() =>handleEditClick(subAdmin, 'subAdmin')}>
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeTable === 'flat' && (
                <div className="flatsResidents-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Flat Number</th>
                        <th>No.of Meters</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flatDetails.map((flat, index) => (
                        <tr key={flat.flatId}>
                          <td>{index + 1}</td>
                          <td>{flat.flatNumber}</td>
                          <td>{flat.noOfMeters}</td>
                          <td>
                            <button className="update_button" onClick={() => handleEditClick(flat, 'flat')}>
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
                {activeTable === 'Meters' && (
                <div className="assignedMeters-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Facility Name</th>
                        <th>No.of Meters</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedMeters.map((Meters, index) => (
                        <tr key={Meters.MeterId}>
                          <td>{index + 1}</td>
                          <td onClick={()=>{setfacilityId(Meters.facilityId); }}>{Meters.facilityName}</td>
                          <td>{Meters.meterCount}</td>
                          
                          <td>
                            <button className="update_button" onClick={() => handleEditClick(Meters, 'Meters')}>
                              Update
                            </button>
                          </td>
                        </tr>
                        
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

{activeTable==='detailedMeterData' && (
  <div className="detailed-meter-table">
    
    
    <table >
      <thead>
        <tr>
          <th>Building Name</th>
          <th>Floor Number</th>
          <th>Flat Number</th>
          <th>User Name</th>
          
        </tr>
      </thead>
      <tbody>
                      {flatMeters.map((Meter, index) => (
                        <tr key={Meter.MeterId}>
                          <td>{index + 1}</td>
                          <td>{Meter.buildingName}</td>
                          <td>{Meter.floorno}</td>
                          <td>{Meter.Flatno}</td>
                          <td>{Meter.username}</td>
                          
                          <td>
                            <button className="update_button" onClick={() => handleEditClick(Meter, 'Meter')}>
                              Update
                            </button>
                          </td>
                        </tr>
                        
                      ))}
                    </tbody>
    </table>
  </div>
)}

              

  {showEditForm && currentEditType === 'facility' && (
  <div className="edit-form-container">
    <form onSubmit={handleUpdateSubmit} className="edit-form">
      <div className="edit-form-header">
        <h4>Edit Facility</h4>
        <button className="close-edit-form" onClick={handleCloseEditForm}>
          &times;
        </button>
      </div>
      <input
        type="text"
        name="facilityName"
        value={formData.facilityName}
        onChange={handleInputChange}
        placeholder="Facility Name"
        required
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
{showEditForm && currentEditType === 'subAdmin' && (
  <div className="edit-form-container">
    <form onSubmit={handleUpdateSubmit} className="edit-form">
      <div className="edit-form-header">
        <h4>Edit Sub-Admin Details</h4>
        <button className="close-edit-form" onClick={handleCloseEditForm}>
          &times;
        </button>
      </div>
      <input
        type="text"
        name="userName"
        value={formData.userName}
        onChange={handleInputChange}
        placeholder="User Name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <input
        type="text"
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleInputChange}
        placeholder="Contact Number"
      />
      <button type="submit">Save</button>
      <button type="button" onClick={handleCloseEditForm}>
        Cancel
      </button>
    </form>
  </div>
)}
{showEditForm && currentEditType === 'flatDetails' && (
  <div className="edit-form-container">
    <form onSubmit={handleUpdateSubmit} className="edit-form">
      <div className="edit-form-header">
        <h4>Edit Meter Details</h4>
        <button className="close-edit-form" onClick={handleCloseEditForm}>
          &times;
        </button>
      </div>
      <input
        type="text"
        name="noOfMeters"
        value={formData.noOfMeters}
        onChange={handleInputChange}
        placeholder="Number of Meters"
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
        name={selectedFacility?.facilityName || selectedSubAdmin?.userName}
      />
      <ToastContainer />
    </div>
    </div>
  );
}

export default SuperAdminDashboard;