import React, { useState, useEffect } from 'react';
import './CreateFacility.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import ConfirmSubmitModal from '../../elements/ConfirmSubmit';
import config from '../../config';

const CreateFacility = () => {
  const [formData, setFormData] = useState({
    facilityName: '',
    street: '',
    city: '',
    state: '',
    pin: '',
    country: 'India',
  });

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

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitModal(false);

    const requestBody = {
      facilityName: formData.facilityName,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pin: parseInt(formData.pin, 10),
      country: formData.country,
    };

    console.log("create facility form data:", requestBody);

    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.post(`${config.backendurl}/api/v1/users/creatfacilitybysuperadmin`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(`Facility "${requestBody.facilityName}" created successfully`);
        setSubmitted(true);
        setErrorMessage('');
      } else {
        toast.error('Failed to create facility');
        console.error('Failed to create facility', response.data);
        setErrorMessage('Failed to create facility');
      }
    } catch (error) {
      toast.error('Error submitting form');
      console.error('Error submitting form', error);
      setErrorMessage('Error submitting form');
    }
  };

  const handleCloseModal = () => {
    setShowSubmitModal(false);
  };

  return (
    <div>
      <div className='pathwayDiv'>
        <Link to="/SuperAdminDashboard" className='pathway'>Super-Admin Dashboard</Link>
        <p className='pathway'>&gt;</p>
        <p className='pathway'>Create Facility</p>
      </div>
      <div className='CreateFacilityPage'>
      <div className='CreateFacility'>
        <h3>Create Facility</h3>
        <form className='CreateFacilityForm' onSubmit={handleSubmit}>
          <div className='CreateFacilityForm_element'>
            <label htmlFor='facilityName' className='CreateFacilityFormElementLabels'>Facility Name</label>
            <input
              type='text'
              id='facilityName'
              className='CreateFacilityFormElementInputs'
              value={formData.facilityName}
              onChange={handleChange}
            />
          </div>

          <div className='CreateFacilityForm_element'>
            <label htmlFor='street' className='CreateFacilityFormElementLabels'>Street</label>
            <input
              type='text'
              id='street'
              className='CreateFacilityFormElementInputs'
              value={formData.street}
              onChange={handleChange}
            />
          </div>

          <div className='CreateFacilityForm_element'>
            <label htmlFor='city' className='CreateFacilityFormElementLabels'>City</label>
            <input
              type='text'
              id='city'
              className='CreateFacilityFormElementInputs'
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className='CreateFacilityForm_element'>
            <label htmlFor='state' className='CreateFacilityFormElementLabels'>State</label>
            <select
              id='state'
              className='CreateFacilityFormElementInputs'
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

          <div className='CreateFacilityForm_element'>
            <label htmlFor='pin' className='CreateFacilityFormElementLabels'>Pin Code</label>
            <input
              type='text'
              id='pin'
              className='CreateFacilityFormElementInputs'
              value={formData.pin}
              onChange={handleChange}
            />
          </div>

          <div className='CreateFacilityForm_element'>
            <label htmlFor='country' className='CreateFacilityFormElementLabels'>Country</label>
            <input
              type='text'
              id='country'
              className='CreateFacilityFormElementInputs'
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          <div className='CreateFacilityForm_element'>
            <input type='submit' className='CreateFacilityForm_button' />
          </div>
          {errorMessage && <p className='error'>{errorMessage}</p>}
        </form>
      </div>
      <ToastContainer />
    </div>
    <ConfirmSubmitModal
      show={showSubmitModal}
      onClose={handleCloseModal}
      onConfirm={handleConfirmSubmit}
      Name={`Facility name: <span class='highlight'>${formData.facilityName}</span>\nStreet: <span class='highlight'>${formData.street}</span>\nCity: <span class='highlight'>${formData.city}</span>\nState: <span class='highlight'>${formData.state}</span>\nPin: <span class='highlight'>${formData.pin}</span>\nCountry: <span class='highlight'>${formData.country}</span>`}
    />
    </div>
  );
};

export default CreateFacility;

