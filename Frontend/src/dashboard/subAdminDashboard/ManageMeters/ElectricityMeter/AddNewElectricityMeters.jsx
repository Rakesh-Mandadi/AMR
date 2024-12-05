import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AddNewMeters.css';
import config from '../../../../config';

const AddNewElectricityMeters = () => {
  const [meterTypes, setMeterTypes] = useState([]);
  const [facilityDetails, setFacilityDetails] = useState({ facilityName: '', facilityId: '' });
  const [formData, setFormData] = useState({
    meterType: '',
    meterNumber: '',
    ieeeAdd: '',
    status: ''
  });
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

    const fetchMeterTypes = async () => {
      try {
        const tokenD = localStorage.getItem('token');
        const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/E`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          }
        });
        if (Array.isArray(response.data.data)) {
          setMeterTypes(response.data.data);
        } else {
          console.error('MeterType response is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching meter types:', error);
      }
    };

    fetchFacilityDetails();
    fetchMeterTypes();
  }, [facilityDetails.facilityId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: id === 'meterType' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const tokenD = localStorage.getItem('token');
      const dataToSend = {
        ...formData,
        meterTypeId: formData.meterType // Add this line
      };
      
      const response = await axios.post(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/addmeter`, dataToSend, {
        headers: {
          Authorization: `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        console.log('IEEE add', formData.ieeeAdd);
        console.log('Successfully added:', response.data);
        toast.success('New meter added successfully');
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add new meter');
    }
  };
  return (
    <div className="AddNewMetersPage">
      <div className="AddNewMeters">
        <h3>Add New Meters</h3>
        <form className="AddNewMetersForm" onSubmit={handleSubmit}>
          <div className="AddNewMetersForm_element">
            <label htmlFor="meterType" className="AddNewMetersFormElementLabels">Meter Type</label>
            <select
              id="meterType"
              className="AddNewMetersFormElementInputs"
              value={formData.meterType}
              onChange={handleChange}
              required
            >
              <option value="">Select a meter type</option>
              {Array.isArray(meterTypes) && meterTypes.map(meterType => (
                <option key={meterType.id} value={meterType.id}>
                  {meterType.meterTypeName}
                </option>
              ))}
            </select>
          </div>
          <div className="AddNewMetersForm_element">
            <label htmlFor="meterNumber" className="AddNewMetersFormElementLabels">Meter Number</label>
            <input
              type="text"
              id="meterNumber"
              className="AddNewMetersFormElementInputs"
              value={formData.meterNumber}
              onChange={handleChange}
              required
            />
          </div>
       
          <div className="AddNewMetersForm_element">
            <label htmlFor="ieeeAdd" className="AddNewMetersFormElementLabels">IEEE Address</label>
            <input
              type="text"
              id="ieeeAdd"
              className="AddNewMetersFormElementInputs"
              value={formData.ieeeAdd}
              onChange={handleChange}
              required
            />
          </div>
          <div className="AddNewMetersForm_element">
            <label htmlFor="status" className="AddNewMetersFormElementLabels">Status</label>
            <select
              id="status"
              className="AddNewMetersFormElementInputs"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value='true'>True</option>
              <option value='false'>False</option>
            </select>
          </div>
          <button type="submit" className="AddNewMetersForm_button">
            Submit
          </button>
        </form>
        <ToastContainer/>
      </div>
    </div>
  ); 
};

export default AddNewElectricityMeters;
