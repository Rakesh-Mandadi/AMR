import React, { useState, useEffect } from 'react';
import './styles/UpdateFacility.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmSubmitModal from '../../../elements/ConfirmSubmit';
import { Link } from 'react-router-dom';
import config from '../../../config';

const UpdateFacility = () => {
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

  const [configData, setConfigData] = useState({
    buildings: '',
    maxFloors: '',
    maxFlats: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [configFormCompleted, setConfigFormCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const states = [
    { value: 'Select state', label: 'Select state' },
    { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
    { value: 'Assam', label: 'Assam' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Chandigarh', label: 'Chandigarh' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Dadra and Nagar Haveli', label: 'Dadra and Nagar Haveli' },
    { value: 'Daman and Diu', label: 'Daman and Diu' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
    { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Ladakh', label: 'Ladakh' },
    { value: 'Lakshadweep', label: 'Lakshadweep' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Manipur', label: 'Manipur' },
    { value: 'Meghalaya', label: 'Meghalaya' },
    { value: 'Mizoram', label: 'Mizoram' },
    { value: 'Nagaland', label: 'Nagaland' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Puducherry', label: 'Puducherry' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Sikkim', label: 'Sikkim' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Tripura', label: 'Tripura' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Uttarakhand', label: 'Uttarakhand' },
    { value: 'West Bengal', label: 'West Bengal' },
  ];

 
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

        console.log("response sub:", response.data);

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

    fetchFacilityDetails();
  }, []);

  useEffect(() => {
    if (facilityDetails.facilityId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        facilityId: facilityDetails.facilityId,
        facilityName: facilityDetails.facilityName,
        street: facilityDetails.street,
        city: facilityDetails.city,
        state: facilityDetails.state,
        country: facilityDetails.country,
        pin: facilityDetails.pin,
      }));
    }
  }, [facilityDetails]);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleConfigChange = (event) => {
    const { id, value } = event.target;
    setConfigData({ ...configData, [id]: value });

    if (configData.buildings || configData.maxFlats) {
      if (configData.maxFloors) {
        setConfigFormCompleted(true);
      } else {
        setConfigFormCompleted(false);
      }
    } else {
      setConfigFormCompleted(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowModal(true);
  };
  

  const handleConfirmSubmit = async (event) => {
    const requestBody = {
      facilityId: formData.facilityId,
      facilityName: formData.facilityName,
      city: formData.city,
      state: formData.state,
      street: formData.street,
      pin: parseInt(formData.pin, 10),
      country: formData.country,
      maxBuilding: configData.buildings ? parseInt(configData.buildings, 10) : undefined,
      maxFloorPerBuilding: configData.maxFloors ? parseInt(configData.maxFloors, 10) : undefined,
      maxFlatPerFloor: configData.maxFlats ? parseInt(configData.maxFlats, 10) : undefined,
    };
  
    try {
      const tokenD = localStorage.getItem('token');
  
      const response = await axios.put(`${config.backendurl}/api/v1/users/updateFacilityDetails`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        toast.success(`Facility ${requestBody.facilityName} updated successfully`);
        setSubmitted(true);
        setErrorMessage('');
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
    setShowModal(false);
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleConfigForm = () => {
    setShowConfigForm(!showConfigForm);
    if (!showConfigForm) {
      setConfigData({
        buildings: '',
        maxFloors: '',
        maxFlats: '',
      });
      setConfigFormCompleted(false);
    }
  };

  return (
    <div>
      <div className='pathwayDiv'>
        <Link to="/SubAdminDashboard" className='pathway'>Dashboard</Link>
        <p className='pathway'>&gt;</p>
        <p className='pathway'>Update Facility</p>
      </div>
      <div className='UpdateFacilityPage'>
      <div className='UpdateFacility'>
        <h3>Update Facility</h3>
        <form className='UpdateFacilityForm' onSubmit={handleSubmit}>
          <div className='UpdateFacilityForm_element'>
            <label htmlFor='facilityId' className='UpdateFacilityFormElementLabels'>Facility ID</label>
            <input
              type='text'
              id='facilityId'
              className='UpdateFacilityFormElementInputs'
              placeholder='Facility ID'
              value={formData.facilityId}
              readOnly
            />
          </div>

          <div className='UpdateFacilityForm_element'>
            <label htmlFor='facilityName' className='UpdateFacilityFormElementLabels'>Facility Name</label>
            <input
              type='text'
              id='facilityName'
              className='UpdateFacilityFormElementInputs'
              placeholder='Facility Name'
              value={formData.facilityName}
              readOnly
              />
            </div>
  
            <div className='UpdateFacilityForm_element'>
              <label htmlFor='street' className='UpdateFacilityFormElementLabels'>Street</label>
              <input
                type='text'
                id='street'
                className='UpdateFacilityFormElementInputs'
                placeholder='Street'
                value={formData.street}
                onChange={handleChange}
              />
            </div>
  
            <div className='UpdateFacilityForm_element'>
              <label htmlFor='city' className='UpdateFacilityFormElementLabels'>City</label>
              <input
                type='text'
                id='city'
                className='UpdateFacilityFormElementInputs'
                placeholder='City'
                value={formData.city}
                onChange={handleChange}
              />
            </div>
  
            <div className='UpdateFacilityForm_element'>
              <label htmlFor='state' className='UpdateFacilityFormElementLabels'>State</label>
              <select
                id='state'
                className='UpdateFacilityFormElementInputs'
                value={formData.state}
                onChange={handleChange}
              >
                {states.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>
  
            <div className='UpdateFacilityForm_element'>
              <label htmlFor='pin' className='UpdateFacilityFormElementLabels'>Pin Code</label>
              <input
                type='text'
                id='pin'
                className='UpdateFacilityFormElementInputs'
                placeholder='Pin Code'
                value={formData.pin}
                onChange={handleChange}
              />
            </div>
  
            <div className='UpdateFacilityForm_element'>
              <label htmlFor='country' className='UpdateFacilityFormElementLabels'>Country</label>
              <input
                type='text'
                id='country'
                className='UpdateFacilityFormElementInputs'
                value={formData.country}
                readOnly
              />
            </div>
  
            <div className='UpdateFacilityForm_element'>
              <button type='button' className='UpdateFacilityForm_Button' onClick={toggleConfigForm}>
                {showConfigForm ? 'Hide Configurations' : 'Configure Facility'}
              </button>
            </div>
  
            {showConfigForm && (
              <div className='ConfigFacilityForm'>
                <hr className='line'></hr>
                <div className='UpdateFacilityForm_element'>
                  <label htmlFor='buildings' className='UpdateFacilityFormElementLabels'>Max Number of Buildings</label>
                  <input
                    type='number'
                    id='buildings'
                    className='UpdateFacilityFormElementInputs'
                    placeholder='Number of buildings'
                    value={configData.buildings}
                    onChange={handleConfigChange}
                    required
                  />
                </div>
  
                <div className='UpdateFacilityForm_element'>
                  <label htmlFor='maxFloors' className='UpdateFacilityFormElementLabels'>Max Floors per Building</label>
                  <input
                    type='number'
                    id='maxFloors'
                    className='UpdateFacilityFormElementInputs'
                    placeholder='Maximum floors per building'
                    value={configData.maxFloors}
                    onChange={handleConfigChange}
                    required
                  />
                </div>
  
                <div className='UpdateFacilityForm_element'>
                  <label htmlFor='maxFlats' className='UpdateFacilityFormElementLabels'>Max Flats per Floor</label>
                  <input
                    type='number'
                    id='maxFlats'
                    className='UpdateFacilityFormElementInputs'
                    placeholder='Maximum flats per floor'
                    value={configData.maxFlats}
                    onChange={handleConfigChange}
                    required
                  />
                </div>
              </div>
            )}
  
            <div className='UpdateFacilityForm_element'>
              <input
                type='submit'
                className='UpdateFacilityForm_Button'
                disabled={!configFormCompleted && showConfigForm}
                value='Submit'
              />
            </div>
          </form>
        </div>
        <ConfirmSubmitModal
          show={showModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmSubmit}
          Name={`Facility Name: <span class="highlight">${formData.facilityName}</span>\nStreet: <span class="highlight">${formData.street}</span>\nCity: <span class="highlight">${formData.city}</span>\nState: <span class="highlight">${formData.state}</span>\nPin: <span class="highlight">${formData.pin}</span>\nCountry: <span class="highlight">${formData.country}</span>`}
        />
        <ToastContainer />
      </div>
    </div>
    );
  };
  
  export default UpdateFacility;
  
