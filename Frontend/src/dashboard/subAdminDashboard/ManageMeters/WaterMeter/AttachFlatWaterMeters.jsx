import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AttachFlatMeters.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../../../config';


const AttachFlatWaterMeters = () => {
//  const [facilityDetails, setFacilityDetails] = useState({ facilityName: '', facilityId: '' });
const facilityId = localStorage.getItem('facilityId');

  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedFlat, setSelectedFlat] = useState('');
  const [meters, setMeters] = useState([]);
  const [showMeters, setShowMeters] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  /*
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
  */

  useEffect(() => {
    const fetchBuildings = async () => {
     // if (!facilityDetails.facilityId) return;

      try {
        const tokenD = localStorage.getItem('token');
       
        const response = await axios.get(`${config.backendurl}/api/v1/users/subAdminBuilding/${facilityId}`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          }
        });
        setBuildings(response.data.data);
      } catch (error) {
        console.error('Error fetching buildings:', error);
      }
    };

    fetchBuildings();
  }, [facilityId]);

  useEffect(() => {
    const fetchFloors = async () => {
      if (!selectedBuilding) return;

      try {
        const tokenD = localStorage.getItem('token');
        const response = await axios.get(`${config.backendurl}/api/v1/users/subAdminfloor/${selectedBuilding}`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          }
        });
        setFloors(response.data.data);
      } catch (error) {
        console.error('Error fetching floors:', error);
      }
    };

    fetchFloors();
  }, [selectedBuilding]);

  useEffect(() => {
    const fetchFlats = async () => {
      if (!selectedFloor) return;

      try {
        const tokenD = localStorage.getItem('token');
        const response = await axios.get(`${config.backendurl}/api/v1/users/subAdminflat/${selectedFloor}`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          }
        });
        setFlats(response.data.data);
      } catch (error) {
        console.error('Error fetching flats:', error);
      }
    };

    fetchFlats();
  }, [selectedFloor]);

  const handleAddMeterClick = async () => {
    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityId}/W/unassigned-status`, {
        headers: {
          'Authorization': `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        }
      });
      setMeters(response.data);
      console.log("hshsdf", response.data)
      setShowMeters(true);
    } catch (error) {
      console.error('Error fetching meters:', error);
    }
  };

  const handleLinkFlatWithMeters = async () => {
    try {
      const tokenD = localStorage.getItem('token');
      const selectedMeterIds = meters.filter(meter => meter.selected).map(meter => meter.meterTypeId);
  
      const requestData = {
        flatId: selectedFlat,
        flatNumber: flats.find(flat => flat.flatId === selectedFlat)?.flatNumber || 0,
        meterTypeIds: selectedMeterIds,
      };
  
      const response = await axios.post(`${config.backendurl}/api/v1/users/${facilityId}/linkflatwithMeter`, requestData, {
        headers: {
          'Authorization': `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        }
      });
  
      toast.success('Meter linked to flat successfully');
      setSelectedBuilding('');
      setSelectedFloor('');
      setSelectedFlat('');
      setMeters([]);
      setShowMeters(false);
    } catch (error) {
      console.error('Error linking flat with meters:', error);
      toast.error('Failed to link meter to flat');
    }
  };
  
  return (
    <div className="AttachFlatMetersPage">
      <div className="AttachFlatMeters">
        <h3>Attach Flat Meters</h3>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="AttachFlatMetersForm">
          <div className="AttachFlatMetersForm_element">
            <label htmlFor="selectBuilding" className="AttachFlatMetersFormElementLabels">Select Building</label>
            <select
              id="selectBuilding"
              className="AttachFlatMetersFormElementInputs"
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
            >
              <option value="">--Select Building--</option>
              {buildings.map((building) => (
                <option key={building.buildingId} value={building.buildingId}>
                  {building.buildingName}
                </option>
              ))}
            </select>
          </div>
          <div className="AttachFlatMetersForm_element">
            <label htmlFor="selectFloor" className="AttachFlatMetersFormElementLabels">Select Floor</label>
            <select
              id="selectFloor"
              className="AttachFlatMetersFormElementInputs"
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              <option value="">--Select Floor--</option>
              {floors.map((floor) => (
                <option key={floor.floorId} value={floor.floorId}>
                  {floor.floorNumber}
                </option>
              ))}
            </select>
          </div>
          <div className="AttachFlatMetersForm_element">
            <label htmlFor="selectFlat" className="AttachFlatMetersFormElementLabels">Select Flat</label>
            <select
              id="selectFlat"
              className="AttachFlatMetersFormElementInputs"
              value={selectedFlat}
              onChange={(e) => setSelectedFlat(e.target.value)}
            >
              <option value="">--Select Flat--</option>
              {flats.map((flat) => (
                <option key={flat.flatId} value={flat.flatId}>
                  {flat.flatNumber}
                </option>
              ))}
            </select>
          </div><br />
          {selectedFlat && (
            <div className="AttachFlatMetersForm_element">
              <h4>Flat Details:</h4>
              <p>Flat No: {flats.find(flat => flat.flatId === selectedFlat)?.flatNumber || 0}</p>
            </div>
          )}
          <div className="AttachFlatMetersForm_element">
            <button type="button" className="AttachFlatMetersForm_button" onClick={handleAddMeterClick}>
              Add Meter
            </button>
          </div>
          {showMeters && (
            <div className="AttachFlatMetersForm_element meters-list">
              <h4>Select Meters:</h4>
              {meters.map((meter) => (
                <div key={meter.meterTypeId}>
                  <label className="AttachFlatMetersFormElementLabels">
                    <input
                      type="checkbox"
                      value={meter.meterTypeId}
                      disabled={!meter.available}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setMeters(prevMeters =>
                          prevMeters.map(prevMeter =>
                            prevMeter.meterTypeId === meter.meterTypeId
                              ? { ...prevMeter, selected: checked }
                              : prevMeter
                          )
                        );
                      }} required
                    />
                    {meter.meterTypeName}
                  </label>
                </div>
              ))}
            </div>
          )}
          <div className="AttachFlatMetersForm_element">
            <button type="button" className="AttachFlatMetersForm_button" onClick={handleLinkFlatWithMeters}>
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
  
  };
  
  export default AttachFlatWaterMeters;
