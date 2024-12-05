import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './GenerateBills.css'; // Import the CSS file
import config from '../../config';

const GenerateBills = () => {
  const facilityId = localStorage.getItem('facilityId');
  const [buildings, setBuildings] = useState([]);
  const [meterTypes, setMeterTypes] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedMeterType, setSelectedMeterType] = useState('');
  const [billData, setBillData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [generatedBills, setGeneratedBills] = useState(null);

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
    setSelectedBuilding(buildingId); // store the id value
  };

  const handleSearch = async () => {
    if (!selectedBuilding || !selectedMeterType) {
      setErrorMessage("Please select both building and meter type");
      return;
    }

    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityId}/${selectedBuilding}/${selectedMeterType}`, {
        headers: {
          'Authorization': `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        }
      });
      setBillData(response.data); // Assuming response.data contains the billing data array
      console.log("Billing data", response.data);
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      setErrorMessage("Error fetching billing data:");
      console.error('Error fetching billing data:', error);
    }
  };

  const handleGenerateBills = async () => {
    const meterNumbers = billData.map(bill => bill.meterNumber);

    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.post(`${config.backendurl}/api/v1/users/${facilityId}/gnrtBillByMeterNumber`, meterNumbers, {
        headers: {
          'Authorization': `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        }
      });
      setGeneratedBills(response.data); // Store the generated bills data
      setShowPopup(true); // Show the dialog with the response data
    } catch (error) {
      setErrorMessage("Error generating bills:");
      console.error('Error generating bills:', error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleAction = (billingId) => {
    console.log(`opening view : ${billingId}`);
  };

  // Transform the generatedBills object into an array of { billNumber, amount }
  const billsArray = generatedBills ? Object.entries(generatedBills).map(([billNumber, amount]) => ({ billNumber, amount })) : [];

  return (
    <div>
      <h3>Generate Bills</h3>
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

      {billData.length > 0 && (
        <div className="billing-details-table">
          <table className='generateBills-table'>
            <thead>
              <tr>
                <th>Sr.no</th>
                <th>Customer Number</th>
                <th>Meter No</th>
                <th>Units</th>
                <th>Amount / Rupees</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {billData.map((bill, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{bill.flatNumber}</td>
                  <td>{bill.meterNumber}</td>
                  <td>{bill.totalUnits}</td>
                  <td>{bill.amount}</td>
                  <td>{0}</td>
                  <td>
                    <button className='BlueButton' onClick={() => handleAction(bill.meterNumber)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='GenerateBills-button'>
            <button className='BlueButton' onClick={handleGenerateBills}>Generate Bills</button>
          </div>
        </div>
      )}

      <Dialog
        open={showPopup}
        onClose={closePopup}
        aria-labelledby="generated-bills-dialog-title"
        aria-describedby="generated-bills-dialog-description"
      >
        <DialogTitle id="generated-bills-dialog-title">Generated Bills</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bill Number</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billsArray.map((bill) => (
                  <TableRow key={bill.billNumber}>
                    <TableCell>{bill.billNumber}</TableCell>
                    <TableCell>{bill.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GenerateBills;








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './GenerateBills.css'; // Import the CSS file
// import config from '../../config';

// const GenerateBills = () => {
//   const facilityId = localStorage.getItem('facilityId');
//   const [buildings, setBuildings] = useState([]);
//   const [meterTypes, setMeterTypes] = useState([]);
//   const [selectedBuilding, setSelectedBuilding] = useState('');
//   const [selectedMeterType, setSelectedMeterType] = useState('');
//   const [billData, setBillData] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [showPopup, setShowPopup] = useState(false);
//   const [generatedBills, setGeneratedBills] = useState(null);

//   useEffect(() => {
//     const fetchBuildings = async () => {
//       try {
//         const tokenD = localStorage.getItem('token');
//         const response = await axios.get(`${config.backendurl}/api/v1/users/subAdminBuilding/${facilityId}`, {
//           headers: {
//             'Authorization': `Bearer ${tokenD}`,
//             'Content-Type': 'application/json',
//           }
//         });
//         setBuildings(response.data.data);
//         console.log("get data list building", response.data.data);
//       } catch (error) {
//         setErrorMessage("Error fetching buildings:");
//         console.error('Error fetching buildings:', error);
//       }
//     };

//     fetchBuildings();
//   }, [facilityId]);

//   useEffect(() => {
//     const fetchMeterTypes = async () => {
//       try {
//         const tokenD = localStorage.getItem('token');
//         const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityId}/allMeterType`, {
//           headers: {
//             'Authorization': `Bearer ${tokenD}`,
//             'Content-Type': 'application/json',
//           }
//         });
//         setMeterTypes(response.data.data);
//         console.log("get data list meterType", response.data.data);
//       } catch (error) {
//         setErrorMessage("Error fetching Meter Types:");
//         console.error('Error fetching Meter Types:', error);
//       }
//     };

//     fetchMeterTypes();
//   }, [facilityId]);

//   const handleBuildingChange = (e) => {
//     const buildingId = e.target.value;
//     setSelectedBuilding(buildingId); // store the id value
//   };

//   const handleSearch = async () => {
//     if (!selectedBuilding || !selectedMeterType) {
//       setErrorMessage("Please select both building and meter type");
//       return;
//     }

//     try {
//       const tokenD = localStorage.getItem('token');
//       const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityId}/${selectedBuilding}/${selectedMeterType}`, {
//         headers: {
//           'Authorization': `Bearer ${tokenD}`,
//           'Content-Type': 'application/json',
//         }
//       });
//       setBillData(response.data); // Assuming response.data contains the billing data array
//       console.log("Billing data", response.data);
//       setErrorMessage(""); // Clear any previous errors
//     } catch (error) {
//       setErrorMessage("Error fetching billing data:");
//       console.error('Error fetching billing data:', error);
//     }
//   };

//   const handleGenerateBills = async () => {
//     const meterNumbers = billData.map(bill => bill.meterNumber);

//     try {
//       const tokenD = localStorage.getItem('token');
//       const response = await axios.post(`${config.backendurl}/api/v1/users/${facilityId}/gnrtBillByMeterNumber`, meterNumbers, {
//         headers: {
//           'Authorization': `Bearer ${tokenD}`,
//           'Content-Type': 'application/json',
//         }
//       });
//       setGeneratedBills(response.data); // Store the generated bills data
//       setShowPopup(true); // Show the popup with the response data
//     } catch (error) {
//       setErrorMessage("Error generating bills:");
//       console.error('Error generating bills:', error);
//     }
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//   };

//   const handleAction = (billingId) => {
//     console.log(`opening view : ${billingId}`);
//   };

//   return (
//     <div>
//       <h3>Generate Bills</h3>
//       {errorMessage && <p className="error">{errorMessage}</p>}
//       <div className="generate-bills-container">
//         <div className="select-container">
//           <label htmlFor="buildingSelect">Select Building: </label>
//           <select
//             id="buildingSelect"
//             value={selectedBuilding}
//             onChange={handleBuildingChange}
//           >
//             <option value="">--Select Building--</option>
//             {buildings.map((building) => (
//               <option key={building.buildingId} value={building.buildingId}>
//                 {building.buildingName}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="select-container">
//           <label htmlFor="meterTypeSelect">Select Meter Type: </label>
//           <select
//             id="meterTypeSelect"
//             value={selectedMeterType}
//             onChange={(e) => setSelectedMeterType(e.target.value)}
//           >
//             <option value="">--Select Meter Type--</option>
//             {meterTypes.map((meterType) => (
//               <option key={meterType.id} value={meterType.id}>
//                 {meterType.meterTypeName}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button className="BlueButton" onClick={handleSearch}>Search</button>
//       </div>

//       {billData.length > 0 && (
//         <div className="billing-details-table">
//           <table className='generateBills-table'>
//             <thead>
//               <tr>
//                 <th>Sr.no</th>
//                 <th>Customer Number</th>
//                 <th>Meter No</th>
//                 <th>Units</th>
//                 <th>Amount</th>
//                 <th>Balance</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {billData.map((bill, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{bill.flatNumber}</td>
//                   <td>{bill.meterNumber}</td>
//                   <td>{bill.totalUnits}</td>
//                   <td>{bill.amount}</td>
//                   <td>{0}</td>
//                   <td>
//                     <button className='BlueButton' onClick={() => handleAction(bill.meterNumber)}>View</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className='GenerateBills-button'>
//             <button className='BlueButton' onClick={handleGenerateBills}>Generate Bills</button>
//           </div>
//         </div>
//       )}

//       {showPopup && (
//         <div className="popup">
//           <div className="popup-content">
//             <h4>Generated Bills</h4>
//             <pre>{JSON.stringify(generatedBills, null, 2)}</pre> 
//             <button className="close-button" onClick={closePopup}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GenerateBills;






//  import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './GenerateBills.css'; // Import the CSS file
// import config from '../../config';

// const GenerateBills = () => {
//   const facilityId = localStorage.getItem('facilityId');
//   const [buildings, setBuildings] = useState([]);
//   const [meterTypes, setMeterTypes] = useState([]);
//   const [selectedBuilding, setSelectedBuilding] = useState('');
//   const [selectedMeterType, setSelectedMeterType] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     const fetchBuildings = async () => {
//     //  if (!facilityDetails.facilityId) return;

//       try {
//         const tokenD = localStorage.getItem('token');
//         const response = await axios.get(`${config.backendurl}/api/v1/users/subAdminBuilding/${facilityId}`, {
//           headers: {
//             'Authorization': `Bearer ${tokenD}`,
//             'Content-Type': 'application/json',
//           }
//         });
//         setBuildings(response.data.data);
//         console.log("get data list building", response.data.data)
//       } catch (error) {
//         setErrorMessage("Error fetching buildings:");
//         console.error('Error fetching buildings:', error);
//       }
//     };

//     fetchBuildings();
//   }, [facilityId]);

//   useEffect(() => {
//     const fetchMeterTypestt = async () => {
//       try {
//         const tokenD = localStorage.getItem('token');
//         const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityId}/allMeterType`, {
//           headers: {
//             'Authorization': `Bearer ${tokenD}`,
//             'Content-Type': 'application/json',
//           }
//         });
//         setMeterTypes(response.data.data);
//         console.log("get data list meterType", response.data.data)
//       } catch (error) {
//         setErrorMessage("Error fetching MeterTypes:");
//         console.error('Error fetching MeterTypes:', error);
//       }
//     };

//     fetchMeterTypestt();
//   }, [facilityId]);


//   const handleAction = (billingId) => {
//     console.log(`opening view : ${billingId}`);
//   };

//   return (
//     <div>
//       <h3>Generate Bills</h3>
//       {errorMessage && <p className="error">{errorMessage}</p>}
//       <div className="generate-bills-container">
//         <div className="select-container">
//           <label htmlFor="buildingSelect">Select Building: </label>
//           <select
//             id="buildingSelect"
//             value={selectedBuilding}
//             onChange={(e) => setSelectedBuilding(e.target.value)}
//           >
//             <option value="">--Select Building--</option>
//             {buildings.map((building) => (
//               <option key={building.id} value={building.id}>
//                 {building.buildingName}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="select-container">
//           <label htmlFor="meterTypeSelect">Select Meter Type: </label>
//           <select
//             id="meterTypeSelect"
//             value={selectedMeterType}
//             onChange={(e) => setSelectedMeterType(e.target.value)}
//           >
//             <option value="">--Select Meter Type--</option>
//             { meterTypes.map((meterType) => (
//               <option key={meterType.id} value={meterType.id}>
//                 {meterType.meterTypeName}
//               </option>
//             )) }
//           </select>
//         </div>
//       </div>
//       <div className="billing-details-table">
//         { <table className='generateBills-table'>
//           <thead>
//             <tr>
//               <th>Sr.no</th>
//               <th>customer number</th>
//               <th>meter no</th>
//               <th>units</th>
//               <th>amount</th>
//               <th>balance</th>
//               <th>action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {billData.map((bill, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{bill.flatNumber}</td>
//                 <td>{billing.meterNumber}</td>
//                 <td>{billing.units}</td>
//                 <td>{billing.amount}</td>
//                 <td>{billing.balance}</td>
//                 <td>
//                   <button className='BlueButton' onClick={() => handleAction(billing.id)}>View</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table> }
      
//         <div className='GenerateBills-button'>
//           <button className='BlueButton'>Generate Bills</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GenerateBills;
