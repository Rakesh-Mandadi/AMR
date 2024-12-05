

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AddBuilding.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmSubmitModal from '../../../elements/ConfirmSubmit';
import { Link } from 'react-router-dom';
import config from '../../../config';

const AddBuilding = ({ isDarkMode, onToggleTheme }) => {
  const [showBuildingForm, setShowBuildingForm] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [facilityDetails, setFacilityDetails] = useState({ facilityName: '', facilityId: '' });
  const [buildingName, setBuildingName] = useState('');
  const [numFloors, setNumFloors] = useState('');
  const [floorInputs, setFloorInputs] = useState([]);
  const [floorRanges, setFloorRanges] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const facilityId = localStorage.getItem('facilityId');
  const facilityName = localStorage.getItem('facilityName');
  const maxBuilding = Number(localStorage.getItem('maxBuilding'));
  const maxFloorPerBuilding = Number(localStorage.getItem('maxFloorPerBuilding'));
  const maxFlatPerFloor = Number(localStorage.getItem('maxFlatPerFloor'));

  
  useEffect(() => {
    const fetchBuildingData = async () => {
      try {
        const tokenD = localStorage.getItem('token');
        console.log('facility id from local', facilityId);
        console.log('facility name from local', facilityName);

        const response = await axios.get(`${config.backendurl}/api/v1/users/subAdminBuilding/${facilityId}`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setBuildings(response.data.data);
        } else {
          setErrorMessage('Failed to fetch building data.');
          console.error('Building read error', response.data);
        }
      } catch (error) {
        console.error('Error fetching building data:', error);
        setErrorMessage('Error fetching building data.');
      }
    };

    fetchBuildingData();
  }, []);

  const handleAddBuildingClick = (e) => {
    e.preventDefault();
    setShowBuildingForm(true);
  };

  const handleNumFloorsChange = (e) => {
    const value = e.target.value;
    setNumFloors(value);
    const defaultFloorInputs = Array.from({ length: value }, () => '');
    const defaultFloorRanges = Array.from({ length: value }, (_, index) => ({ from: (index + 1) * 100 + 1, to: (index + 1) * 100 + 10 }));
    setFloorInputs(defaultFloorInputs);
    setFloorRanges(defaultFloorRanges);
  };

  const handleFloorInputChange = (index, value) => {
    const newFloorInputs = [...floorInputs];
    newFloorInputs[index] = value;
    setFloorInputs(newFloorInputs);
    const from = floorRanges[index].from;
    const to = from + parseInt(value) - 1;
    handleFloorRangeChange(index, 'to', to);
  };

  const handleFloorRangeChange = (index, field, value) => {
    const newFloorRanges = [...floorRanges];
    newFloorRanges[index] = { ...newFloorRanges[index], [field]: value };
    setFloorRanges(newFloorRanges);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (buildings.length >= maxBuilding) {
      setErrorMessage(`You cannot add more than ${maxBuilding} buildings.`);
      return;
    }
    if (Number(numFloors) > maxFloorPerBuilding) {
      setErrorMessage(`The number of floors cannot exceed ${maxFloorPerBuilding}.`);
      console.log("floor error msg");
      return;
    }
    if (floorInputs.some(floor => Number(floor) > maxFlatPerFloor)) {
      setErrorMessage(`The number of flats on any floor cannot exceed ${maxFlatPerFloor}.`);
      return;
    }
    setShowModal(true);
    setErrorMessage('');
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();

    const floorsData = floorRanges.map((range, index) => ({
      floorNumber: index + 1,
      totalFlat: parseInt(floorInputs[index]),
      startFlatN: range.from,
      lastFlatN: range.to,
    }));

    const newBuilding = {
      buildingName: buildingName,
      floorDto: floorsData,
    };

    try {
      const tokenD = localStorage.getItem('token');

      const response = await axios.post(
        `${config.backendurl}/api/v1/users/${facilityId}/buildings`,
        newBuilding,
        {
          headers: {
            Authorization: `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(`Building "${newBuilding.buildingName}" added successfully!`);
        setSubmitted(true);
        setErrorMessage('');
        setBuildings([...buildings, newBuilding]);
        setShowBuildingForm(false);

        setBuildingName('');
        setNumFloors('');
        setFloorInputs([]);
        setFloorRanges([]);
      } else {
        toast.error('Failed to add building.');
        console.error('Failed to add building', response.data);
      }
    } catch (error) {
      console.error('Error submitting form', error);
      if (error.response && error.response.status === 409) {
        toast.error('Building already exists. Please choose a different name.');
      } else {
        toast.error('Error submitting form.');
      }
    }
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formattedFloorRanges = floorRanges.map((range, index) => (
    `Floor ${index + 1}: ${range.from} - ${range.to}`
  )).join('\n');

  return (
    <div>
      {/* <div className='pathwayDiv'>
        <Link to="/SubAdminDashboard" className='pathway'>Dashboard</Link>
        <p className='pathway'>&gt;</p>
        <p className='pathway'>Add Building</p>
      </div> */}
      <div className={`AddBuildingPage ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="AddBuilding">
          <form className="AddBuildingForm">
          <h3 style={{ textAlign: 'center' }}>{facilityName}</h3>
            {/* <div className="AddBuilding_element">
              <label htmlFor="FacilityName" className="AddBuildingFormElementLabels">Facility Name</label>
              <input
                type="text"
                id="FacilityName"
                className="AddBuildingFormElementInputs"
                value={facilityName}
                readOnly
              />
            </div> */}
            <div className="BuildingsList">
              <h3>Buildings List</h3>
              {buildings.length > 0 ? (
                buildings.map((building, index) => (
                  <div key={index} className="BuildingDetails">
                    <h4>{building.buildingName}</h4>
                  </div>
                ))
              ) : (
                <p>No buildings found for this facility.</p>
              )}
            </div>
            <div className="AddBuilding_element">
              <button className="AddBuildingForm_button" onClick={handleAddBuildingClick}>
                Add Building
              </button>
            </div>
          </form>
        </div>
        {showBuildingForm && (
          <div className='AddBuilding'>
            <div className="BuildingForm">
              <h3>Building Details</h3>
              <form className="AddBuildingForm" onSubmit={handleSubmit}>
                <div className="AddBuilding_element">
                  <label htmlFor="BuildingName" className="AddBuildingFormElementLabels">Building Name</label>
                  <input
                    type="text"
                    id="BuildingName"
                    className="AddBuildingFormElementInputs"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                  />
                </div>
                <div className="AddBuilding_element">
                  <label htmlFor="TotalFloors" className="AddBuildingFormElementLabels">Total Floors</label>
                  <input
                    type="number"
                    id="TotalFloors"
                    className="AddBuildingFormElementInputs"
                    value={numFloors}
                    onChange={handleNumFloorsChange}
                  />
                </div>
                {floorInputs.map((_, index) => (
                  <div className="AddBuilding_element" key={index}>
                    <label className="AddBuildingFormElementLabels">Number of Flats on Floor {index + 1}</label>
                    <input
                      type="number"
                      className="AddBuildingFormElementInputs"
                      value={floorInputs[index]}
                      onChange={(e) => handleFloorInputChange(index, e.target.value)}
                    />
                    <label className="AddBuildingFormElementLabels">Apartment Range</label>
                    <input
                      type="number"
                      className="AddBuildingFormElementInputs"
                      value={floorRanges[index]?.from || ''}
                      onChange={(e) => handleFloorRangeChange(index, 'from', parseInt(e.target.value))}
                    />
                    <input
                      type="number"
                      className="AddBuildingFormElementInputs"
                      value={floorRanges[index]?.to || ''}
                      onChange={(e) => handleFloorRangeChange(index, 'to', parseInt(e.target.value))}
                    />
                  </div>
                ))}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="AddBuilding_element">
                  <button className="AddBuildingForm_button" type="submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ConfirmSubmitModal
          show={showModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmSubmit}
          Name={`Facility Name: <span class="highlight">${facilityDetails.facilityName}</span>\nBuilding Name: <span class="highlight">${buildingName}</span>\nNo.of Floors: <span class="highlight">${numFloors}</span>\nFloor Ranges:\n<span class="highlight">${formattedFloorRanges}</span>`}
        />
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddBuilding;





/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AddBuilding.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmSubmitModal from '../../../elements/ConfirmSubmit';
import Modal from './Modal'; // Import the modal component
import config from '../../../config';

const AddBuilding = ({ isDarkMode }) => {
  const [showBuildingForm, setShowBuildingForm] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [facilityDetails, setFacilityDetails] = useState({ facilityName: '', facilityId: '' });
  const [buildingName, setBuildingName] = useState('');
  const [numFloors, setNumFloors] = useState('');
  const [floorInputs, setFloorInputs] = useState([]);
  const [floorRanges, setFloorRanges] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const facilityId = localStorage.getItem('facilityId');
  const facilityName = localStorage.getItem('facilityName');

  useEffect(() => {
    // Fetch building data as before...
  }, []);

  const handleAddBuildingClick = () => {
    setShowBuildingForm(true);
  };

  const handleSubmit = (event) => {
    // Handle form submission as before...
  };

  return (
    <div>
      <div className={`AddBuildingPage ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="AddBuilding">
          <h3 style={{ textAlign: 'center' }}>{facilityName}</h3>
          <div className="BuildingsList">
            <h3>Buildings List</h3>
            {buildings.length > 0 ? (
              buildings.map((building, index) => (
                <div key={index} className="BuildingDetails">
                  <h4>{building.buildingName}</h4>
                </div>
              ))
            ) : (
              <p>No buildings found for this facility.</p>
            )}
          </div>
          <div className="AddBuilding_element">
            <button className="AddBuildingForm_button" onClick={handleAddBuildingClick}>
              Add Building
            </button>
          </div>
        </div>

       
        <Modal show={showBuildingForm} onClose={() => setShowBuildingForm(false)}>
          <div className="BuildingForm">
            <h3>Building Details</h3>
            <form className="AddBuildingForm" onSubmit={handleSubmit}>
             
              <div className="AddBuilding_element">
                <label htmlFor="BuildingName" className="AddBuildingFormElementLabels">Building Name</label>
                <input
                  type="text"
                  id="BuildingName"
                  className="AddBuildingFormElementInputs"
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                />
              </div>
              
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="AddBuilding_element">
                <button className="AddBuildingForm_button" type="submit">Submit</button>
              </div>
            </form>
          </div>
        </Modal>

        <ConfirmSubmitModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmSubmit}
          Name={`...`}
        />
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddBuilding;

*/



/* import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AddBuilding.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmSubmitModal from '../../../elements/ConfirmSubmit';
import { Link } from 'react-router-dom';
import config from '../../../config';

const AddBuilding = ({ isDarkMode, onToggleTheme }) => {
  const [showBuildingForm, setShowBuildingForm] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [facilityDetails, setFacilityDetails] = useState({ facilityName: '', facilityId: '' });
  const [buildingName, setBuildingName] = useState('');
  const [numFloors, setNumFloors] = useState('');
  const [floorInputs, setFloorInputs] = useState([]);
  const [floorRanges, setFloorRanges] = useState([]);
  const [submitted, setSubmitted] = useState(false); // Define submitted state
  const [errorMessage, setErrorMessage] = useState(''); // Define errorMessage state
  const [showModal, setShowModal] = useState(false);

  const facilityId = localStorage.getItem('facilityId');
  const facilityName = localStorage.getItem('facilityName');
  const maxBuilding = localStorage.getItem('maxBuilding');
  const maxFloorPerBuilding = localStorage.getItem('maxFloorPerBuilding');
  const maxFlatPerFloor = localStorage.getItem('maxFlatPerFloor');


  useEffect(() => {
    const fetchBuildingData = async () => {
      try {
        // Retrieve facilityDetails from localStorage
       

        const tokenD = localStorage.getItem('token');
        console.log('facility id from local', facilityId);
        console.log('facility name from local', facilityName);
  
        const response = await axios.get(`${config.backendurl}/api/v1/users/subAdminBuilding/${facilityId}`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          setBuildings(response.data.data);
        } else {
          setErrorMessage('Failed to fetch building data.');
          console.error('Building read error', response.data);
        }
      } catch (error) {
        console.error('Error fetching building data:', error);
        setErrorMessage('Error fetching building data.');
      }
    };
  
    fetchBuildingData();
  }, []);

  const handleAddBuildingClick = (e) => {
    e.preventDefault();
    setShowBuildingForm(true);
  };

  const handleNumFloorsChange = (e) => {
    const value = e.target.value;
    setNumFloors(value);
    const defaultFloorInputs = Array.from({ length: value }, () => '');
    const defaultFloorRanges = Array.from({ length: value }, (_, index) => ({ from: (index + 1) * 100 + 1, to: (index + 1) * 100 + 10 }));
    setFloorInputs(defaultFloorInputs);
    setFloorRanges(defaultFloorRanges);
  };

  const handleFloorInputChange = (index, value) => {
    const newFloorInputs = [...floorInputs];
    newFloorInputs[index] = value;
    setFloorInputs(newFloorInputs);
    const from = floorRanges[index].from;
    const to = from + parseInt(value) - 1;
    handleFloorRangeChange(index, 'to', to);
  };

  const handleFloorRangeChange = (index, field, value) => {
    const newFloorRanges = [...floorRanges];
    newFloorRanges[index] = { ...newFloorRanges[index], [field]: value };
    setFloorRanges(newFloorRanges);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
  
    const floorsData = floorRanges.map((range, index) => ({
      floorNumber: index + 1,
      totalFlat: parseInt(floorInputs[index]),
      startFlatN: range.from,
      lastFlatN: range.to,
    }));
  
    const newBuilding = {
      buildingName: buildingName,
      floorDto: floorsData,
    };
  
    try {
      const tokenD = localStorage.getItem('token');
  
      const response = await axios.post(
        `${config.backendurl}/api/v1/users/${facilityId}/buildings`,
        newBuilding,
        {
          headers: {
            Authorization: `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        toast.success(`Building "${newBuilding.buildingName}" added successfully!`);
        setSubmitted(true);
        setErrorMessage('');
        setBuildings([...buildings, newBuilding]);
        setShowBuildingForm(false);
        
        setBuildingName('');
        setNumFloors('');
        setFloorInputs([]);
        setFloorRanges([]);
      } else {
        toast.error('Failed to add building.');
        console.error('Failed to add building', response.data);
      }
    } catch (error) {
      console.error('Error submitting form', error);
      toast.error('Error submitting form.');
    }
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formattedFloorRanges = floorRanges.map((range, index) => (
    `Floor ${index + 1}: ${range.from} - ${range.to}`
  )).join('\n');

  return (
    <div>
      <div className='pathwayDiv'>
        <Link to="/SubAdminDashboard" className='pathway'>Dashboard</Link>
        <p className='pathway'>&gt;</p>
        <p className='pathway'>Add Building</p>
      </div>
      <div className={`AddBuildingPage ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="AddBuilding">
        <form className="AddBuildingForm">
          <h3>Add Building</h3>
          <div className="AddBuilding_element">
            <label htmlFor="FacilityName" className="AddBuildingFormElementLabels">Facility Name</label>
            <input
              type="text"
              id="FacilityName"
              className="AddBuildingFormElementInputs"
              value={facilityName}
              readOnly
            />
          </div>
          <div className="BuildingsList">
            <h3>Buildings List</h3>
            {buildings.length > 0 ? (
              buildings.map((building, index) => (
                <div key={index} className="BuildingDetails">
                  <h4>{building.buildingName}</h4>
                </div>
              ))
            ) : (
              <p>No buildings found for this facility.</p>
            )}
          </div>
          <div className="AddBuilding_element">
            <button className="AddBuildingForm_button" onClick={handleAddBuildingClick}>
              Add Building
            </button>
          </div>
        </form>
      </div>
      {showBuildingForm && (
        <div className='AddBuilding'>
          <div className="BuildingForm">
            <h3>Building Details</h3>
            <form className="AddBuildingForm" onSubmit={handleSubmit}>
              <div className="AddBuilding_element">
                <label htmlFor="BuildingName" className="AddBuildingFormElementLabels">Building Name</label>
                <input
                  type="text"
                  id="BuildingName"
                  className="AddBuildingFormElementInputs"
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                />
              </div>
              <div className="AddBuilding_element">
                <label htmlFor="TotalFloors" className="AddBuildingFormElementLabels">Total Floors</label>
                <input
                  type="number"
                  id="TotalFloors"
                  className="AddBuildingFormElementInputs"
                  value={numFloors}
                  onChange={handleNumFloorsChange}
                />
              </div>
              {floorInputs.map((_, index) => (
                <div className="AddBuilding_element" key={index}>
                  <label className="AddBuildingFormElementLabels">Number of Flats on Floor {index + 1}</label>
                  <input
                    type="number"
                    className="AddBuildingFormElementInputs"
                    value={floorInputs[index]}
                    onChange={(e) => handleFloorInputChange(index, e.target.value)}
                  />
                  <label className="AddBuildingFormElementLabels">Apartment Range</label>
                  <input
                    type="number"
                    className="AddBuildingFormElementInputs"
                    value={floorRanges[index]?.from || ''}
                    onChange={(e) => handleFloorRangeChange(index, 'from', parseInt(e.target.value))}
                  />
                  <input
                    type="number"
                    className="AddBuildingFormElementInputs"
                    value={floorRanges[index]?.to || ''}
                    onChange={(e) => handleFloorRangeChange(index, 'to', parseInt(e.target.value))}
                  />
                </div>
              ))}
              <div className="AddBuilding_element">
                <button className="AddBuildingForm_button" type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmSubmitModal
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSubmit}
        Name={`Facility Name: <span class="highlight">${facilityDetails.facilityName}</span>\nBuilding Name: <span class="highlight">${buildingName}</span>\nNo.of Floors: <span class="highlight">${numFloors}</span>\nFloor Ranges:\n<span class="highlight">${formattedFloorRanges}</span>`}
      />
      <ToastContainer />
    </div>
    </div>
  );
};

export default AddBuilding;
*/