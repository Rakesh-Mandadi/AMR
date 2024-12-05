import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AddMeterType.css';
import config from '../../../../config';

const AddWaterMeterType = () => {
  const [meterTypeName, setMeterTypeName] = useState('');
  const [meterTypeUnitRate, setMeterTypeUnitRate] = useState('');
  const [facilityDetails, setFacilityDetails] = useState({ facilityName: '', facilityId: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFacilityDetails = async () => {
      try {
        const tokenD = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = parseInt(userData?.id);

        if (!tokenD || !userId) {
          setErrorMessage('Error verifying details from login');
          return;
        }

        const response = await axios.get(`${config.backendurl}/api/v1/users/subadmin/${userId}`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const { facilityId, facilityName } = response.data.data;
          setFacilityDetails({ facilityName, facilityId });
        } else {
          setErrorMessage('Failed to fetch facility details.');
        }
      } catch (error) {
        console.error('Error fetching facility details:', error);
        setErrorMessage('Error fetching facility details.');
      }
    };

    fetchFacilityDetails();
  }, []);

  const handleInputName = (e) => {
    setMeterTypeName(e.target.value)
    
  };
  const handleInputUnit = (e) => {
    setMeterTypeUnitRate(e.target.value);
    
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.post(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/addMeterType`,
         { MeterTypeName: meterTypeName,
          meterCat : "W",
          unitRate : meterTypeUnitRate
           }, 
         {
        headers: {
          Authorization: `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        console.log('Success:', response.data);
        toast.success(`${meterTypeName} added successfully`);
        setMeterTypeName('');
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add Meter Type');
    }
  };

  return (
    <div className="AddMeterTypePage">
      <div className="AddMeterType">
        <h3>Water Meter Type & configuration</h3>
        <form className="AddMeterTypeForm" onSubmit={handleSubmit}>
          <div className="AddMeterTypeForm_element">
            <label htmlFor="meterTypeName" className="AddMeterTypeFormElementLabels">Meter Type Name:</label>
            <input
              type="text"
              id="meterTypeName"
              className="AddMeterTypeFormElementInputs"
              value={meterTypeName}
              onChange={handleInputName}
              required
            />
          </div>
          <div className="AddMeterTypeForm_element">
            <label htmlFor="meterTypeUnitRate" className="AddMeterTypeFormElementLabels">Unit Rate:</label>
            <input
              type="text"
              id="meterTypeUnitRate"
              className="AddMeterTypeFormElementInputs"
              value={meterTypeUnitRate}
              onChange={handleInputUnit}
              required
              placeholder='/m3'
            />
          </div>
          <div className="AddMeterTypeForm_element">
            <button type="submit" className="AddMeterTypeForm_button">Submit</button>
          </div>
        </form>
        <ToastContainer />
        {errorMessage && <div className="error">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default AddWaterMeterType;
