import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Billing.css'; 
import Payment from './Payment';
import config from '../../../config';
import BillView from './BillView';
import Modal from './Modal';

const Billing = () => {
  const facilityId = localStorage.getItem('facilityId');
  const [buildings, setBuildings] = useState([]);
  const [meterTypes, setMeterTypes] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedMeterType, setSelectedMeterType] = useState('');
  const [billStatusTable, setBillStatusTable] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState();
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const tokenD = localStorage.getItem('token');
        const response = await axios.get(`${config.backendurl}/api/v1/users/subAdminBuilding/${facilityId}`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          }
        });
        setBuildings(response.data.data);
        console.log("get data list building", response.data.data);
      } catch (error) {
        setErrorMessage("Error fetching buildings:");
        console.error('Error fetching buildings:', error);
      }
    };
    fetchBuildings();
  }, [facilityId]);

  useEffect(() => {
    const fetchMeterTypes = async () => {
      try {
        const tokenD = localStorage.getItem('token');
        const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityId}/allMeterType`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          }
        });
        setMeterTypes(response.data.data);
        console.log("get data list meterType", response.data.data);
      } catch (error) {
        setErrorMessage("Error fetching Meter Types:");
        console.error('Error fetching Meter Types:', error);
      }
    };
    fetchMeterTypes();
  }, [facilityId]);

  const handleBuildingChange = (e) => {
    const buildingId = e.target.value;
    setSelectedBuilding(buildingId); 
  };

  const handleSearch = async () => {
    if (!selectedBuilding || !selectedMeterType) {
      setErrorMessage("Please select both building and meter type");
      return;
    }

    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityId}/${selectedBuilding}/${selectedMeterType}/getBillStatus`, {
        headers: {
          'Authorization': `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        }
      });
      setBillStatusTable(response.data); 
      console.log("Billing data", response.data);
      setErrorMessage(""); 
    } catch (error) {
      setErrorMessage("Error fetching billing data:");
      console.error('Error fetching billing data:', error);
    }
  };

  const handleAction = (billNumber, amount) => {
    console.log(`Opening payment for bill : ${billNumber}`);
    setPaymentDetails({ billNumber, amount });
  };

  const handleViewBill = async (billNumber) => {
    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityId}/${billNumber}/billnumber`, {
        headers: {
          'Authorization': `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        }
      });
      console.log("response.data", response.data)
      setSelectedBill(response.data.data); // Set the selected bill data
    } catch (error) {
      console.error('Error fetching bill details:', error);
    }
  };

  // const handleView = (bill) => {
  //   setSelectedBill(bill);
  // };

  const closeModal = () => {
    setSelectedBill(null);
  };

  return (
    <div>
      <h3>Billing</h3>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="generate-bills-container">
        <div className="select-container">
          <label htmlFor="buildingSelect">Select Building: </label>
          <select
            id="buildingSelect"
            value={selectedBuilding}
            onChange={handleBuildingChange}
          >
            <option value="">--Select Building--</option>
            {buildings.map((building) => (
              <option key={building.buildingId} value={building.buildingId}>
                {building.buildingName}
              </option>
            ))}
          </select>
        </div>
        <div className="select-container">
          <label htmlFor="meterTypeSelect">Select Meter Type: </label>
          <select
            id="meterTypeSelect"
            value={selectedMeterType}
            onChange={(e) => setSelectedMeterType(e.target.value)}
          >
            <option value="">--Select Meter Type--</option>
            {meterTypes.map((meterType) => (
              <option key={meterType.id} value={meterType.id}>
                {meterType.meterTypeName}
              </option>
            ))}
          </select>
        </div>
        <button className="BlueButton" onClick={handleSearch}>Search</button>
      </div>
      <div className="billing-details-table">
        <table className='billing-details-table'>
          <thead>
            <tr>
              <th>Sr.no</th>
              <th>Bill Number</th>
              <th>Flat Number</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {billStatusTable.map((billing, index) => (
              <tr key={billing.id}>
                <td>{index + 1}</td>
                <td>{billing.billNumber}</td>
                <td>{billing.flatNumber}</td>
                <td>{billing.totalAmount}</td>
                <td>
                  {billing.dueStatus ? "Paid" : "Unpaid"}
                </td>
                <td>
                <button className='BlueButton' onClick={() => handleViewBill(billing.billNumber)}>View</button>
                  <button onClick={() => handleAction(billing.billNumber, billing.amount)} className='BlueButton'>Pay</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedBill && (
        <Modal onClose={closeModal}>
          <BillView bill={selectedBill} />
        </Modal>
      )}
      {paymentDetails && (
        <Payment billNumber={paymentDetails.billNumber} amount={paymentDetails.amount} />
      )}
    </div>
  );
};
export default Billing;






/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Billing.css'; 
import Payment from './Payment';
import config from '../../../config';

const Billing = () => {
  const facilityId = localStorage.getItem('facilityId');
  const [buildings, setBuildings] = useState([]);
  const [meterTypes, setMeterTypes] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedMeterType, setSelectedMeterType] = useState('');
  const [billStatusTable, setBillStatusTable] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState();

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const tokenD = localStorage.getItem('token');
        const response = await axios.get(`${config.backendurl}/api/v1/users/subAdminBuilding/${facilityId}`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          }
        });
        setBuildings(response.data.data);
        console.log("get data list building", response.data.data);
      } catch (error) {
        setErrorMessage("Error fetching buildings:");
        console.error('Error fetching buildings:', error);
      }
    };
    fetchBuildings();
  }, [facilityId]);

  useEffect(() => {
    const fetchMeterTypes = async () => {
      try {
        const tokenD = localStorage.getItem('token');
        const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityId}/allMeterType`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          }
        });
        setMeterTypes(response.data.data);
        console.log("get data list meterType", response.data.data);
      } catch (error) {
        setErrorMessage("Error fetching Meter Types:");
        console.error('Error fetching Meter Types:', error);
      }
    };
    fetchMeterTypes();
  }, [facilityId]);

  const handleBuildingChange = (e) => {
    const buildingId = e.target.value;
    setSelectedBuilding(buildingId); 
  };

  const handleSearch = async () => {
    if (!selectedBuilding || !selectedMeterType) {
      setErrorMessage("Please select both building and meter type");
      return;
    }

    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityId}/${selectedBuilding}/${selectedMeterType}/getBillStatus`, {
        headers: {
          'Authorization': `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        }
      });
      setBillStatusTable(response.data); 
      console.log("Billing data", response.data);
      setErrorMessage(""); 
    } catch (error) {
      setErrorMessage("Error fetching billing data:");
      console.error('Error fetching billing data:', error);
    }
  };

  const handleAction = (billNumber, amount) => {
    console.log(`Opening payment for bill : ${billNumber}`);
    setPaymentDetails({ billNumber, amount });
  };

  return (
    <div>
      <h3>Billing</h3>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="generate-bills-container">
        <div className="select-container">
          <label htmlFor="buildingSelect">Select Building: </label>
          <select
            id="buildingSelect"
            value={selectedBuilding}
            onChange={handleBuildingChange}
          >
            <option value="">--Select Building--</option>
            {buildings.map((building) => (
              <option key={building.buildingId} value={building.buildingId}>
                {building.buildingName}
              </option>
            ))}
          </select>
        </div>
        <div className="select-container">
          <label htmlFor="meterTypeSelect">Select Meter Type: </label>
          <select
            id="meterTypeSelect"
            value={selectedMeterType}
            onChange={(e) => setSelectedMeterType(e.target.value)}
          >
            <option value="">--Select Meter Type--</option>
            {meterTypes.map((meterType) => (
              <option key={meterType.id} value={meterType.id}>
                {meterType.meterTypeName}
              </option>
            ))}
          </select>
        </div>
        <button className="BlueButton" onClick={handleSearch}>Search</button>
      </div>
      <div className="billing-details-table">
        <table className='billing-details-table'>
          <thead>
            <tr>
              <th>Sr.no</th>
              <th>Bill Number</th>
              <th>Flat Number</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {billStatusTable.map((billing, index) => (
              <tr key={billing.id}>
                <td>{index + 1}</td>
                <td>{billing.billNumber}</td>
                <td>{billing.flatNumber}</td>
                <td>{billing.totalAmount}</td>
                <td>
                  {billing.dueStatus ? "Paid" : "Unpaid"}
                </td>
                <td>
                  <button className='BlueButton' >View</button>
                  <button onClick={() => handleAction(billing.billNumber, billing.amount)} className='BlueButton'>Pay</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paymentDetails && (
        <Payment billNumber={paymentDetails.billNumber} amount={paymentDetails.amount} />
      )}
    </div>
  );
};

export default Billing;
*/