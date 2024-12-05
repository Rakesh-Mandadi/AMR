
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './AddSubAdmin.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import ConfirmSubmit from '../../elements/ConfirmSubmit';
import config from '../../config';

const AddSubAdmin = () => {
  const [facilities, setFacilities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      username: "",
      emailId: "",
      pswd: "",
      role: "",
      facilities: "",
    }
  });

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.backendurl}/api/v1/users/getListOfNewFacility`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        console.log("sub admin facility list:", response.data);

        if (Array.isArray(response.data.data)) {
          setFacilities(response.data.data);
        } else {
          console.error('Facilities response is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    };

    fetchFacilities();
  }, []);

  const handleFormSubmit = (data) => {
    setFormData(data);
    setShowModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowModal(false);
    const data = formData;
    const selectedFacility = facilities.find(facility => facility.facilityId === parseInt(data.facilities));

    const detailsSubadmin = {
      username: data.username,
      email: data.emailId,
      password: data.pswd,
      facilityId: data.facilities,
      facilityName: selectedFacility ? selectedFacility.facilityName : '',
      role: [data.role],
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${config.backendurl}/api/v1/users/creatsubadmin/signup`, 
        detailsSubadmin,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.success(`Sub-Admin ${detailsSubadmin.username} linked successfully to ${detailsSubadmin.facilityName}!`);
        reset();
      } else {
        toast.error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form', error);
      toast.error('Error submitting form');
    }
  };

  return (
    <div>
      <div className='pathwayDiv'>
        <Link to="/SuperAdminDashboard" className='pathway'>Super-Admin Dashboard</Link>
        <p className='pathway'>&gt;</p>
        <p className='pathway'>Add Sub-Admin</p>
      </div>
      <div className='AddSubAdminPage'>
        <div className='AddSubAdmin'>
          <h3>Add Sub-Admin</h3>
          <form className='AddSubAdminForm' onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <div className="AddSubAdminForm_element">
              <label htmlFor='username' className='AddSubAdminFormElementLabels'>Username</label>
              <input
                type='text'
                id='username'
                className='AddSubAdminFormElementInputs'
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && <p className='errorMsg'>{errors.username.message}</p>}
            </div>

            <div className="AddSubAdminForm_element">
              <label htmlFor='emailId' className='AddSubAdminFormElementLabels'>Email ID</label>
              <input
                type='text'
                id='emailId'
                className='AddSubAdminFormElementInputs'
                {...register('emailId', { required: 'Email ID is required' })}
              />
              {errors.emailId && <p className='errorMsg'>{errors.emailId.message}</p>}
            </div>

            <div className="AddSubAdminForm_element">
              <label htmlFor='pswd' className='AddSubAdminFormElementLabels'>Password</label>
              <input
                type='password'
                id='pswd'
                className='AddSubAdminFormElementInputs'
                {...register('pswd', { required: 'Password is required' })}
              />
              {errors.pswd && <p className='errorMsg'>{errors.pswd.message}</p>}
            </div>

            <div className="AddSubAdminForm_element">
              <label htmlFor='role' className='AddSubAdminFormElementLabels'>Role</label>
              <select
                id='role'
                className='AddSubAdminFormElementInputs'
                {...register('role', { required: 'Role is required' })}
              >
                <option value="ROLE_SUBADMIN">Sub-Admin</option>
                <option value="user">User</option>
              </select>
              {errors.role && <p className='errorMsg'>{errors.role.message}</p>}
            </div>

            <div className="AddSubAdminForm_element">
              <label htmlFor='facilities' className='AddSubAdminFormElementLabels'>Facility</label>
              <select
                id='facilities'
                className='AddSubAdminFormElementInputs'
                {...register('facilities', { required: 'Facility is required' })}
              >
                <option value="">Select Facility</option>
                {facilities.map(facility => (
                  <option key={facility.facilityId} value={facility.facilityId}>
                    {facility.facilityName}
                  </option>
                ))}
              </select>
              {errors.facilities && <p className='errorMsg'>{errors.facilities.message}</p>}
            </div>

            <div className='AddSubAdminForm_element'>
              <input type='submit' className='AddSubAdminForm_button' />
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
      <ConfirmSubmit
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmSubmit}
        Name={
          `Username: <span class="highlight">${formData?.username}</span>\n
          Email: <span class="highlight">${formData?.emailId}</span>\n
          Role: <span class="highlight">${formData?.role}</span>\n
          Facility: <span class="highlight">${facilities.find(facility => facility.facilityId === parseInt(formData?.facilities))?.facilityName || ''}</span>`
        }
      />
    </div>
  );
};

export default AddSubAdmin;
