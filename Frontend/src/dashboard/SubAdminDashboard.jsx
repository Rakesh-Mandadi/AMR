

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './SubAdminDashboard.css';
import TopNav from './TopNav';
import SubAdminSideBar from './subAdminDashboard/SubAdminSideBar';
import axios from 'axios';
import config from '../config';

function SubAdminDashboard() {
  const [facilityDetails, setFacilityDetails] = useState({ 
    facilityName: '',
    facilityId: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTable, setActiveTable] = useState('buildings');
  const [buildingsData, setBuildingsData] = useState([]);
  const[flatCount,setFlatCount] = useState([]);
  const [flatData, setFlatData] = useState([]);
   const[meterCount, setMeterCount]= useState([]);
   const [meterData, setMeterData] = useState([]);

  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [buildingToUpdate, setBuildingToUpdate] = useState(null);
  const [updatedBuildingName, setUpdatedBuildingName] = useState('');
  const[updatedFlatNumber, setUpdatedFlatNumber] =useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);
  const [meterSubTableData, setMeterSubTableData] = useState([]);



  const [detailedBuildingData, setDetailedBuildingData] = useState(null);
  const [totalFlatsData, setTotalFlatsData] = useState([]);
   const [totalMetersData, setTotalMetersData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [flashcardDetails, setFlashcardDetails] = useState({
    buildingCount: '',
    flatCount: '',
    meterCount: '',
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }

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
          const { facilityId, facilityName, maxBuilding, maxFloorPerBuilding, maxFlatPerFloor } = response.data.data;
          setFacilityDetails({ facilityName, facilityId });
          localStorage.setItem('facilityId', facilityId);
          localStorage.setItem('facilityName', facilityName);
          localStorage.setItem('maxBuilding', maxBuilding);
          localStorage.setItem('maxFloorPerBuilding', maxFloorPerBuilding);
          localStorage.setItem('maxFlatPerFloor', maxFlatPerFloor);
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
    if (!facilityDetails.facilityId) return;

    const fetchFlashcardDetails = async () => {
      try {
        const tokenD = localStorage.getItem('token');
        const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/getnumericdata`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const { buildingCount, flatCount, meterCount } = response.data.data;
          setFlashcardDetails({ buildingCount, flatCount, meterCount });

          if (buildingCount || flatCount || meterCount) {
            fetchTableData('buildings');
          }
        } else {
          setErrorMessage('Failed to fetch flashcard details.');
          console.error('Flashcard details read error', response.data);
        }
      } catch (error) {
        console.error('Error fetching flashcard details:', error);
        setErrorMessage('Error fetching flashcard details.');
      }
    };

    fetchFlashcardDetails();
  }, [facilityDetails.facilityId]);

  const handleToggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const fetchTableData = async (table) => {
    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/listOfBuildingFlat`, {
        headers: {
          'Authorization': `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("sub table: ", response.data);

      if (response.status === 200) {
        const tableData = response.data.data; // Extract the data array
        if (table === 'buildings') {
          // Ensure that tableData is an array
          setBuildingsData(Array.isArray(tableData) ? tableData : []);
        }
      } else {
        setErrorMessage('Failed to fetch table data.');
        console.error('Table data read error', response.data);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      setErrorMessage('Error fetching table data.');
    }
  };
  const fetchMeterData = async () => {
    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/allMeterType`, {
        headers: {
          'Authorization': `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        console.log("/allMeterType",response.data);
        const data = response.data.data.map((meter) => ({
          ...meter,
          meterTypes: Array.isArray(meter.meterTypes) ? meter.meterTypes : [], // Ensure array format
        }));
        setMeterData(data);
  
  //       const subTableResponse = asyc () =>{
  //         try{
  //           const tokenD = localStorage.getItem('token');
  //           const response=await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/meters/details`, {
  //         headers: {
  //           'Authorization': `Bearer ${tokenD}`,
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       if (subTableResponse.status === 200) {
  //         setMeterSubTableData(subTableResponse.data.data);
  //       } else {
  //         console.error('Failed to fetch sub-table data', subTableResponse.data);
  //       }
      } else {
        setErrorMessage('Failed to fetch meter data.');
      }
}catch (error) {
      setErrorMessage('Error fetching meter data.');
    }
  };
  
  //   }}

  const handleFlashcardClick = (table) => {
    setActiveTable(table);
    if (table === 'buildings') {
      fetchTableData(table);
     }else if (table === 'totalMeters') {
        fetchMeterData(); // Fetch meters data on click
      }
    
  };

  const handleOpenPerticularBuilding = async (buildingId) => {
    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/${buildingId}/getTblDataForPrtclrBld`, {
        headers: {
          'Authorization': `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log("/getTblDataForPrtclrBld",response.data);
        setDetailedBuildingData(response.data);
      } else {
        setErrorMessage('Failed to fetch detailed building data.');
        console.error('Detailed building data read error', response.data);
      }
    } catch (error) {
      console.error('Error fetching detailed building data:', error);
      setErrorMessage('Error fetching detailed building data.');
    }
  };
  const handleFlatUpdate =(flat)=>{
         setTotalFlatsData(flat);
         setUpdatedFlatNumber(flat.flatNumber);
         setShowUpdatePopup(true);
    
       }
       const handleFlatDelete =()=>{
    
       }

  const handleUpdateClick = (building) => {
    setBuildingToUpdate(building);
    setUpdatedBuildingName(building.buildingName); // Pre-fill the input with the current building name
    setShowUpdatePopup(true);
  };

  const handleDeleteClick = (buildingId) => {
    setBuildingToDelete(buildingId);
    setShowDeletePopup(true);
  };

  const confirmUpdate = async () => {
    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.put(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/building`, 
        { buildingId: buildingToUpdate, buildingName: updatedBuildingName },
        {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setBuildingsData(buildingsData.map((building) =>
          building.id === buildingToUpdate.id
            ? { ...building, buildingName: updatedBuildingName }
            : building
        ));
        setShowUpdatePopup(false);
        setBuildingToUpdate(null);
      } else {
        setErrorMessage('Failed to update building.');
        console.error('Update building error', response.data);
      }
    } catch (error) {
      console.error('Error updating building:', error);
      setErrorMessage('Error updating building.');
    }
  };

  const confirmDelete = async () => {
    try {
      const tokenD = localStorage.getItem('token');
      const response = await axios.delete(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/${buildingToDelete}`, {
        headers: {
          'Authorization': `Bearer ${tokenD}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204) {
        setBuildingsData(buildingsData.filter((building) => building.id !== buildingToDelete));
        setShowDeletePopup(false);
        setBuildingToDelete(null);
      } else {
        setErrorMessage('Failed to delete building.');
        console.error('Delete building error', response.data);
      }
    } catch (error) {
      console.error('Error deleting building:', error);
      setErrorMessage('Error deleting building.');
    }
  };

  const cancelUpdate = () => {
    setShowUpdatePopup(false);
    setBuildingToUpdate(null);
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setBuildingToDelete(null);
  };

  const isDashboardRoute = location.pathname === '/SubAdminDashboard';

  return (
    <div className="fullPage">
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <SubAdminSideBar isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
      <div className="content">
        <TopNav isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
        <main>
          {isDashboardRoute ? (
            <>
              <h3>Sub Admin Dashboard</h3>
              {errorMessage && <p className="error">{errorMessage}</p>}
              <div className="flashcards">
                <div className="flashcard" onClick={() => handleFlashcardClick('buildings')}>
                  <p>Buildings</p>
                  <div className="flashcardCount">{flashcardDetails.buildingCount}</div>
                </div>
                <div className="flashcard" onClick={() => handleFlashcardClick('totalFlats')}>
                  <p>Total Flats</p>
                  <div className="flashcardCount">{flashcardDetails.flatCount}</div>
                </div>
                <div className="flashcard" onClick={() => handleFlashcardClick('totalMeters')}>
                  <p>Total Meters</p>
                  <div className="flashcardCount">{flashcardDetails.meterCount}</div>
                </div>
              </div>
              {activeTable === 'buildings' && (
                <div className="buildings-table">
                  <table className="new-table">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Building Name</th>
                        <th>Total Flats</th>
                        <th>Total Meters</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buildingsData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td onClick={() => handleOpenPerticularBuilding(item.buildingId)}> {item.buildingName}</td>
                          <td>{item.totalFlats}</td>
                          <td>{item.totalMeters}</td>
                          <td className="action-buttons">
                            <button className="update_button" onClick={() => handleUpdateClick(item.buildingId)}>
                              Update
                            </button>
                            <button className="delete_button" onClick={() => handleDeleteClick(item.buildingId)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
               {activeTable === 'totalFlats' && (
                <div className="totalFlats-table">
                <table className="new-table">
                <thead>
                <tr>
                 <th>Sr.No</th>
                 <th>Floor</th>
                 <th>Flat Number</th>
                 <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {flatCount.map((flat, index) => (
          <tr key={flat.flatId}>
            <td>{index + 1}</td>
            <td>{flat.floorNumber}</td>
            <td>{flat.flatNumber}</td>
            <td className="action-buttons">
              <button className="update_button" onClick={() => handleFlatUpdate(flat.flatId)}>
                Update
              </button>
              <button className="delete_button" onClick={() => handleFlatDelete(flat.flatId)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
                </div>
              )}
    {activeTable === 'totalMeters' && (
    <div className="totalMeters-table">
    <h4>Total Meters</h4>
    <table className="new-table">
      <thead>
        <tr>
          <th rowSpan="2">Sno</th>
          <th colSpan="2">Total No of Meters</th>
          <th rowSpan="2">Type of Meters</th>
          <th rowSpan="2">Action</th>
        </tr>
        <tr>
          <th>Available</th>
          <th>Currently Using</th>
        </tr>
      </thead>
      <tbody>
        {meterData.map((meter, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
             <td>{meter.totalMeters}</td> 
            <td>{meter.availability}</td>
            <td>{meter.meterTypes}</td>
            <td>
              <button className="update_button">Update</button>
              <button className="delete_button">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    Sub-table
    <h5>Meter Details</h5>
    <table className="new-table">
      <thead>
        <tr>
          <th>Sno</th>
          <th>Flat Number</th>
          <th>Floor Number</th>
          <th>Building Name</th>
          <th>Meter Number</th>
          <th>MAC Address</th>
        </tr>
      </thead>
      <tbody>
        {meterSubTableData.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.flatNumber}</td>
            <td>{item.floorNumber}</td>
            <td>{item.buildingName}</td>
            <td>{item.meterNumber}</td>
            <td>{item.macAddress}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

              
              <br/>
                {detailedBuildingData && (
                  <div className="detailed-building-table">
                    <h4>{detailedBuildingData.buildingName} Details</h4>
                    <br/>
                    <table className="new-table">
                      <thead>
                        <tr>
                          <th>Flat Number</th>
                          <th>Floor Number</th>
                          <th>Building Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedBuildingData.floorDtoForBldTbl.map((floor) =>
                          floor.flatListDto.map((flat) => (
                            <tr key={flat.flatId}>
                              <td>{flat.flatNumber}</td>
                              <td>{floor.floorNumber}</td>
                              <td>{detailedBuildingData.buildingName}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {showUpdatePopup && (
                  <div className="update-popup">
                    <p>Update Building</p>
                    <input
                      type="text"
                      value={updatedBuildingName}
                      onChange={(e) => setUpdatedBuildingName(e.target.value)}
                      placeholder="Enter new building name"
                    />
                    <button onClick={confirmUpdate}>Update</button>
                    <button onClick={cancelUpdate}>Cancel</button>
                  </div>
                )}
                {showDeletePopup && (
                  <div className="delete-popup">
                    <p>Are you sure you want to delete this building?</p>
                    <button onClick={confirmDelete}>Yes</button>
                    <button onClick={cancelDelete}>No</button>
                  </div>
                )}
              </>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </div>
  );
  
}

export default SubAdminDashboard;






// import React, { useState, useEffect } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import './SubAdminDashboard.css';
// import TopNav from './TopNav';
// import SubAdminSideBar from './subAdminDashboard/SubAdminSideBar';
// import axios from 'axios';
// import config from '../config';



// function SubAdminDashboard() {
//   const [facilityDetails, setFacilityDetails] = useState({ 
//     facilityName: '',
//     facilityId: '',
//   });
//   // const[metersData, setMetersData] = useState({
//   //   meterType:'',
//   //   meterId:'',
//   // });
 

//   const [errorMessage, setErrorMessage] = useState('');
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [activeTable, setActiveTable] = useState('buildings');
//   const [buildingsData, setBuildingsData] = useState([]);
//   const[flatCount,setFlatCount] = useState([]);
//   const [flatData, setFlatData] = useState([]);
//   const[meterCount, setMeterCount]= useState([]);


//   const [showUpdatePopup, setShowUpdatePopup] = useState(false);
//   const [buildingToUpdate, setBuildingToUpdate] = useState(null);
//   const [updatedBuildingName, setUpdatedBuildingName] = useState('');
//   const[updatedFlatNumber, setUpdatedFlatNumber] =useState('');

//   const [showDeletePopup, setShowDeletePopup] = useState(false);
//   const [buildingToDelete, setBuildingToDelete] = useState(null);

//   const [detailedBuildingData, setDetailedBuildingData] = useState(null);
//   const [totalFlatsData, setTotalFlatsData] = useState([]);
//   const [totalMetersData, setTotalMetersData] = useState([]);


//   const navigate = useNavigate();
//   const location = useLocation();
//   const [flashcardDetails, setFlashcardDetails] = useState({
//     buildingCount: '',
//     flatCount: '',
//     meterCount: '',
//   });

//   useEffect(() => {
//     const storedTheme = localStorage.getItem('theme');
//     if (storedTheme) {
//       setIsDarkMode(storedTheme === 'dark');
//     }

//     const fetchFacilityDetails = async () => {
//       try {
//         const tokenD = localStorage.getItem('token');
//         const userData = JSON.parse(localStorage.getItem('user'));
//         const userId = parseInt(userData?.id);

//         if (!tokenD || !userId) {
//           setErrorMessage('Error verifying details from login');
//           return;
//         }

//         const response = await axios.get(`${config.backendurl}/api/v1/users/subadmin/${userId}`, {
//           headers: {
//             'Authorization': `Bearer ${tokenD}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.status === 200) {
//           const { facilityId, facilityName, maxBuilding, maxFloorPerBuilding, maxFlatPerFloor } = response.data.data;
//           setFacilityDetails({ facilityName, facilityId });
//           localStorage.setItem('facilityId', facilityId);
//           localStorage.setItem('facilityName', facilityName);
//           localStorage.setItem('maxBuilding', maxBuilding);
//           localStorage.setItem('maxFloorPerBuilding', maxFloorPerBuilding);
//           localStorage.setItem('maxFlatPerFloor', maxFlatPerFloor);
//         } else {
//           setErrorMessage('Failed to fetch facility details.');
//           console.error('Facilities read error', response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching facility details:', error);
//         setErrorMessage('Error fetching facility details.');
//       }
//     };

//     fetchFacilityDetails();
//   }, []);

    
//   useEffect(() => {
//     if (!facilityDetails.facilityId) return;

//     const fetchFlashcardDetails = async () => {
//       try {
//         const tokenD = localStorage.getItem('token');
//         const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/getnumericdata`, {
//           headers: {
//             'Authorization': `Bearer ${tokenD}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.status === 200) {
//           const { buildingCount, flatCount, meterCount } = response.data.data;
//           setFlashcardDetails({ buildingCount, flatCount, meterCount });

//           if (buildingCount || flatCount || meterCount) {
//             fetchTableData('buildings');
//           }
//         } else {
//           setErrorMessage('Failed to fetch flashcard details.');
//           console.error('Flashcard details read error', response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching flashcard details:', error);
//         setErrorMessage('Error fetching flashcard details.');
//       }
//     };

//     fetchFlashcardDetails();
//   }, [facilityDetails.facilityId]);

//   const handleToggleTheme = () => {
//     setIsDarkMode((prevMode) => {
//       const newMode = !prevMode;
//       localStorage.setItem('theme', newMode ? 'dark' : 'light');
//       return newMode;
//     });
//   };
  
//   //  useEffect(() => {
//   //   const storedTheme = localStorage.getItem('theme');
//   //   if (storedTheme) {
//   //     setIsDarkMode(storedTheme === 'dark');
//   //   }

//   //   const fetchMeterDetails = async () => {
//   //     try {
//   //       const tokenD = localStorage.getItem('token');
//   //       const meterData = JSON.parse(localStorage.getItem('meter'));
//   //       const meterId = parseInt(meterData?.id);
//   //       const response = await axios.get(`${config.backendurl}/api/v1/users/subadmin/${meterDetails.meterId}/meters`, {
//   //         headers: {
//   //           'Authorization': `Bearer ${tokenD}`,
//   //           'Content-Type': 'application/json',
//   //         },
//   //       });
    
//   //       if (response.status === 200) {
//   //         setTotalMetersData(response.data.data || []);
//   //       } else {
//   //         setErrorMessage('Failed to fetch meter details.');
//   //         console.error('Meter details read error', response.data);
//   //       }
//   //     } catch (error) {
//   //       console.error('Error fetching meter details:', error);
//   //       setErrorMessage('Error fetching meter details.');
//   //     }
//   //  };
//   //  fetchMeterDetails();
//   // }, []);

//   const fetchTableData = async (table) => {
//     try {
//       //console.log('Facility ID:', facilityDetails.facilityId);
//            //console.log('Meter ID:', meterId);

//       const tokenD = localStorage.getItem('token');
//       const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/listOfBuildingFlat`, {
//         headers: {
//           'Authorization': `Bearer ${tokenD}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log("sub table: ", response.data);

//       if (response.status === 200) {
//         const tableData = response.data.data; // Extract the data array
//         if (table === 'buildings') {
//           // Ensure that tableData is an array
//           setBuildingsData(Array.isArray(tableData) ? tableData : []);
//         }
//       } else {
//         setErrorMessage('Failed to fetch table data.');
//         console.error('Table data read error', response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching table data:', error);
//       setErrorMessage('Error fetching table data.');
//     }
//   };

//   const handleFlashcardClick = (table) => {
//     setActiveTable(table);
//     if (table === 'buildings') {
//       fetchTableData(table);
//     }
//   };

//   // const handleOpenPerticularBuilding = async (buildingId) => {
//   //   try {
//   //     const tokenD = localStorage.getItem('token');
//   //     const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/${buildingId}/getTblDataForPrtclrBld`, {
//   //       headers: {
//   //         'Authorization': `Bearer ${tokenD}`,
//   //         'Content-Type': 'application/json',
//   //       },
//   //     });

//   //     if (response.status === 200) {
//   //       console.log("/getTblDataForPrtclrBld",response.data);
//   //       setDetailedBuildingData(response.data);
//   //     } else {
//   //       setErrorMessage('Failed to fetch detailed building data.');
//   //       console.error('Detailed building data read error', response.data);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching detailed building data:', error);
//   //     setErrorMessage('Error fetching detailed building data.');
//   //   }
//   // };
  

//   const handleOpenPerticularBuilding = async (buildingId) => {
//     try {
//       const tokenD = localStorage.getItem('token');
//       const response = await axios.get(
//         `${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/${buildingId}/getTblDataForPrtclrBld`,
//         {
//           headers: {
//             'Authorization': `Bearer ${tokenD}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
  
//       if (response.status === 200) {
//         console.log("/getTblDataForPrtclrBld", response.data);
//         setDetailedBuildingData(response.data);
//         fetchFlatData(buildingId); // Fetch flat data after building details
//       } else {
//         setErrorMessage('Failed to fetch detailed building data.');
//         console.error('Detailed building data read error', response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching detailed building data:', error);
//       setErrorMessage('Error fetching detailed building data.');
//     }
//   };
  
//   const handleFlatUpdate =(flat)=>{
//     setTotalFlatsData(flat);
//     setUpdatedFlatNumber(flat.flatNumber);
//     setShowUpdatePopup(true);

//   }
//   const handleFlatDelete =()=>{

//   }
//   const handleUpdateClick = (building) => {
//     setBuildingToUpdate(building);
//     setUpdatedBuildingName(building.buildingName); // Pre-fill the input with the current building name
//     setShowUpdatePopup(true);
//   };

//   const handleDeleteClick = (buildingId) => {
//     setBuildingToDelete(buildingId);
//     setShowDeletePopup(true);
//   };

//   const confirmUpdate = async () => {
//     try {
//       const tokenD = localStorage.getItem('token');
//       const response = await axios.put(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/building`, 
//         { buildingId: buildingToUpdate, buildingName: updatedBuildingName },
//         {
//           headers: {
//             'Authorization': `Bearer ${tokenD}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.status === 200) {
//         setBuildingsData(buildingsData.map((building) =>
//           building.id === buildingToUpdate.id
//             ? { ...building, buildingName: updatedBuildingName }
//             : building
//         ));
//         setShowUpdatePopup(false);
//         setBuildingToUpdate(null);
//       } else {
//         setErrorMessage('Failed to update building.');
//         console.error('Update building error', response.data);
//       }
//     } catch (error) {
//       console.error('Error updating building:', error);
//       setErrorMessage('Error updating building.');
//     }
//   };

//   const confirmDelete = async () => {
//     try {
//       const tokenD = localStorage.getItem('token');
//       const response = await axios.delete(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/${buildingToDelete}`, {
//         headers: {
//           'Authorization': `Bearer ${tokenD}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.status === 204) {
//         setBuildingsData(buildingsData.filter((building) => building.id !== buildingToDelete));
//         setShowDeletePopup(false);
//         setBuildingToDelete(null);
//       } else {
//         setErrorMessage('Failed to delete building.');
//         console.error('Delete building error', response.data);
//       }
//     } catch (error) {
//       console.error('Error deleting building:', error);
//       setErrorMessage('Error deleting building.');
//     }
//   };

//   const cancelUpdate = () => {
//     setShowUpdatePopup(false);
//     setBuildingToUpdate(null);
//   };

//   const cancelDelete = () => {
//     setShowDeletePopup(false);
//     setBuildingToDelete(null);
//   };

//   const isDashboardRoute = location.pathname === '/SubAdminDashboard';




//   const fetchFlatData = async (buildingId) => {
//     try {
//       const tokenD = localStorage.getItem('token');
//       const response = await axios.get(
//         `${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/${buildingId}/getTblDataForPrtclrBld`,
//         {
//           headers: {
//             'Authorization': `Bearer ${tokenD}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
  
//       if (response.status === 200) {
//         setFlatData(response.data.data); // Assuming response.data.data is an array of flat objects
//       } else {
//         console.error('Failed to fetch flat data:', response.data);
//         setFlatData([]); // Clear the data if the API fails
//       }
//     } catch (error) {
//       console.error('Error fetching flat data:', error);
//       setFlatData([]);
//     }
//   };
 
  




  
//   return (
//     <div className="fullPage">
//     <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
//       <SubAdminSideBar isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
//       <div className="content">
//         <TopNav isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
//         <main>
//           {isDashboardRoute ? (
//             <>
//               <h3>Sub Admin Dashboard</h3>
//               {errorMessage && <p className="error">{errorMessage}</p>}
//               <div className="flashcards">
//                 <div className="flashcard" onClick={() => handleFlashcardClick('buildings')}>
//                   <p>Buildings</p>
//                   <div className="flashcardCount">{flashcardDetails.buildingCount}</div>
//                 </div>
//                 <div className="flashcard" onClick={() => handleFlashcardClick('totalFlats')}>
//                   <p>Total Flats</p>
//                   <div className="flashcardCount">{flashcardDetails.flatCount}</div>
//                 </div>
//                 <div className="flashcard" onClick={() => handleFlashcardClick('totalMeters')}>
//                   <p>Total Meters</p>
//                   <div className="flashcardCount">{flashcardDetails.meterCount}</div>
//                 </div>
//               </div>
//               {activeTable === 'buildings' && (
//                 <div className="buildings-table">
//                   <table className="new-table">
//                     <thead>
//                       <tr>
//                         <th>Sr.No</th>
//                         <th>Building Name</th>
//                         <th>Total Flats</th>
//                         <th>Total Meters</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {buildingsData.map((item, index) => (
//                         <tr key={index}>
//                           <td>{index + 1}</td>
//                           <td onClick={() => handleOpenPerticularBuilding(item.buildingId)}>{item.buildingName}</td>
//                           <td>{item.totalFlats}</td>
//                           <td>{item.totalMeters}</td>
//                           <td className="action-buttons">
//                             <button className="update_button" onClick={() => handleUpdateClick(item.buildingId)}>
//                               Update
//                             </button>
//                             <button className="delete_button" onClick={() => handleDeleteClick(item.buildingId)}>
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//               {activeTable === 'totalFlats' && (
//                 <div className="totalFlats-table">
//                 <table className="new-table">
//                 <thead>
//                 <tr>
//                  <th>Sr.No</th>
//                  <th>Floor</th>
//                  <th>Flat Number</th>
//                  <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {flatCount.map((flat, index) => (
//           <tr key={flat.flatId}>
//             <td>{index + 1}</td>
//             <td>{flat.floorNumber}</td>
//             <td>{flat.flatNumber}</td>
//             <td className="action-buttons">
//               <button className="update_button" onClick={() => handleFlatUpdate(flat.flatId)}>
//                 Update
//               </button>
//               <button className="delete_button" onClick={() => handleFlatDelete(flat.flatId)}>
//                 Delete
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
                   
//                   {/* Change later */}
//                 </div>
//               )}
//               {activeTable === 'totalMeters' && (
//                 <div className="totalMeters-table">
//                   <table className="new-table">
//                 <thead>
//                 <tr>
//                  <th>Sr.No</th>
//                  <th>Flat Number</th>
//                  <th>No Of Meters</th>
//                  <th>Type Of Meter</th>
//                  <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {meterCount.map((flat,meter, index) => (
//           <tr key={meter.totalMeters}>
//             <td>{index + 1}</td>
//             <td>{flat.flatNumber}</td>
//             <td>{meter.totalMeters}</td>
//             <td>{meter.meterCount}</td>
//             <td className="action-buttons">
//               <button className="update_button" onClick={() => handleFlatUpdate(flat.flatId)}>
//                 Update
//               </button>
//               <button className="delete_button" onClick={() => handleFlatDelete(flat.flatId)}>
//                 Delete
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//                   {/* Change Later */}
//                 </div>
//               )}
              
//               <br/>
//                 {detailedBuildingData && (
//                   <div className="detailed-building-table">
//                     <h4>{detailedBuildingData.buildingName} Details</h4>
//                     <br/>
//                     <table className="new-table">
//                       <thead>
//                         <tr>
//                           <th>Flat Number</th>
//                           <th>Floor Number</th>
//                           <th>Building Name</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {/* plz genrate the code for feaching the data from flat from amr database and display alll the data  */}
//                         {flatData.map((flat, index) => (
//           <tr key={flat.flatId}>
            
//             <td>{flat.flatNumber}</td>
//             <td>{flat.floorNumber}</td>
//             <td>{detailedBuildingData.buildingName}</td>
            
//           </tr>
//         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//                 {showUpdatePopup && (
//                   <div className="update-popup">
//                     <p>Update Building</p>
//                     <input
//                       type="text"
//                       value={updatedBuildingName}
//                       onChange={(e) => setUpdatedBuildingName(e.target.value)}
//                       placeholder="Enter new building name"
//                     />
//                     <button onClick={confirmUpdate}>Update</button>
//                     <button onClick={cancelUpdate}>Cancel</button>
//                   </div>
//                 )}
//                 {showDeletePopup && (
//                   <div className="delete-popup">
//                     <p>Are you sure you want to delete this building?</p>
//                     <button onClick={confirmDelete}>Yes</button>
//                     <button onClick={cancelDelete}>No</button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Outlet />
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
  
// }


// export default SubAdminDashboard;

// // import React, { useState, useEffect } from 'react';
// // import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// // import './SubAdminDashboard.css';
// // import TopNav from './TopNav';
// // import SubAdminSideBar from './subAdminDashboard/SubAdminSideBar';
// // import axios from 'axios';
// // import config from '../config';

// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';

// // const FacilityManagement = ({ facilityId }) => {
// //   const [activeTable, setActiveTable] = useState(''); // To manage active table view
// //   const [buildingCount, setBuildingCount] = useState([]); // For the buildings table
// //   const [meterCount, setMeterCount] = useState([]); // For the meters table

// //   // Fetch data for the active table
// //   const fetchTableData = async (table) => {
// //     let endpoint = '';
// //     let setterFunction = null;

// //     if (table === 'buildings') {
// //       endpoint = `/api/v1/users/${facilityId}/buildings`;
// //       setterFunction = setBuildingCount;
// //     } else if (table === 'totalMeters') {
// //       endpoint = `/api/v1/users/${facilityId}/meters`;
// //       setterFunction = setMeterCount;
// //     }

// //     if (endpoint) {
// //       try {
// //         const response = await axios.get(endpoint);
// //         const data = response.data?.data || [];
// //         setterFunction(data);
// //       } catch (error) {
// //         console.error(`Failed to fetch ${table} data:`, error);
// //       }
// //     }
// //   };

// //   // Handle flashcard clicks to switch views
// //   const handleFlashcardClick = (table) => {
// //     setActiveTable(table);
// //     if (table === 'buildings' || table === 'totalMeters') {
// //       fetchTableData(table);
// //     }
// //   };

// //   // Example action handlers for the table (to be implemented)
// //   const handleBuildingUpdate = (buildingId) => {
// //     console.log(`Update building with ID: ${buildingId}`);
// //   };

// //   const handleBuildingDelete = (buildingId) => {
// //     console.log(`Delete building with ID: ${buildingId}`);
// //   };

// //   const handleFlatUpdate = (flatId) => {
// //     console.log(`Update flat with ID: ${flatId}`);
// //   };

// //   const handleFlatDelete = (flatId) => {
// //     console.log(`Delete flat with ID: ${flatId}`);
// //   };

// //   // JSX Rendering
// //   return (
// //     <div className="facility-management">
// //       <div className="flashcards">
// //         <div className="flashcard" onClick={() => handleFlashcardClick('buildings')}>
// //           <h3>Buildings</h3>
// //         </div>
// //         <div className="flashcard" onClick={() => handleFlashcardClick('totalMeters')}>
// //           <h3>Total Meters</h3>
// //         </div>
// //       </div>

// //       {activeTable === 'buildings' && (
// //         <div className="buildings-table">
// //           <table className="new-table">
// //             <thead>
// //               <tr>
// //                 <th>Sr.No</th>
// //                 <th>Building Name</th>
// //                 <th>Total Flats</th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {buildingCount.map((building, index) => (
// //                 <tr key={building.buildingId}>
// //                   <td>{index + 1}</td>
// //                   <td>{building.name}</td>
// //                   <td>{building.totalFlats}</td>
// //                   <td className="action-buttons">
// //                     <button className="update_button" onClick={() => handleBuildingUpdate(building.buildingId)}>
// //                       Update
// //                     </button>
// //                     <button className="delete_button" onClick={() => handleBuildingDelete(building.buildingId)}>
// //                       Delete
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {activeTable === 'totalMeters' && (
// //         <div className="totalMeters-table">
// //           <table className="new-table">
// //             <thead>
// //               <tr>
// //                 <th>Sr.No</th>
// //                 <th>Flat Number</th>
// //                 <th>Total Meters</th>
// //                 <th>Type Of Meter</th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {meterCount.map((meter, index) => (
// //                 <tr key={meter.meterId}>
// //                   <td>{index + 1}</td>
// //                   <td>{meter.flatNumber}</td>
// //                   <td>{meter.totalMeters}</td>
// //                   <td>{meter.typeOfMeter}</td>
// //                   <td className="action-buttons">
// //                     <button className="update_button" onClick={() => handleFlatUpdate(meter.flatId)}>
// //                       Update
// //                     </button>
// //                     <button className="delete_button" onClick={() => handleFlatDelete(meter.flatId)}>
// //                       Delete
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default SubAdminDashboard;



// // import React, { useState, useEffect } from 'react';
// // import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// // import './SubAdminDashboard.css';
// // import TopNav from './TopNav';
// // import SubAdminSideBar from './subAdminDashboard/SubAdminSideBar';
// // import axios from 'axios';
// // import config from '../config';

// // function SubAdminDashboard() {
// //   const [facilityDetails, setFacilityDetails] = useState({ 
// //     facilityName: '',
// //     facilityId: '',
// //   });

// //   const [errorMessage, setErrorMessage] = useState('');
// //   const [isDarkMode, setIsDarkMode] = useState(false);
// //   const [activeTable, setActiveTable] = useState('buildings');
// //   const [buildingsData, setBuildingsData] = useState([]);
// //   const [flatCount, setFlatCount] = useState([]);
// //   const [totalMetersData, setTotalMetersData] = useState([]);
// //   const [flashcardDetails, setFlashcardDetails] = useState({
// //     buildingCount: '',
// //     flatCount: '',
// //     meterCount: '',
// //   });

// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   useEffect(() => {
// //     const storedTheme = localStorage.getItem('theme');
// //     if (storedTheme) {
// //       setIsDarkMode(storedTheme === 'dark');
// //     }

// //     const fetchFacilityDetails = async () => {
// //       try {
// //         const tokenD = localStorage.getItem('token');
// //         const userData = JSON.parse(localStorage.getItem('user'));
// //         const userId = parseInt(userData?.id);

// //         if (!tokenD || !userId) {
// //           setErrorMessage('Error verifying details from login');
// //           return;
// //         }

// //         const response = await axios.get(`${config.backendurl}/api/v1/users/subadmin/${userId}`, {
// //           headers: {
// //             'Authorization': `Bearer ${tokenD}`,
// //             'Content-Type': 'application/json',
// //           },
// //         });

// //         if (response.status === 200) {
// //           const { facilityId, facilityName, maxBuilding, maxFloorPerBuilding, maxFlatPerFloor } = response.data.data;
// //           setFacilityDetails({ facilityName, facilityId });
// //           localStorage.setItem('facilityId', facilityId);
// //           localStorage.setItem('facilityName', facilityName);
// //           localStorage.setItem('maxBuilding', maxBuilding);
// //           localStorage.setItem('maxFloorPerBuilding', maxFloorPerBuilding);
// //           localStorage.setItem('maxFlatPerFloor', maxFlatPerFloor);
// //         } else {
// //           setErrorMessage('Failed to fetch facility details.');
// //           console.error('Facilities read error', response.data);
// //         }
// //       } catch (error) {
// //         console.error('Error fetching facility details:', error);
// //         setErrorMessage('Error fetching facility details.');
// //       }
// //     };

// //     fetchFacilityDetails();
// //   }, []);

// //   useEffect(() => {
// //     if (!facilityDetails.facilityId) return;

// //     const fetchFlashcardDetails = async () => {
// //       try {
// //         const tokenD = localStorage.getItem('token');
// //         const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/getnumericdata`, {
// //           headers: {
// //             'Authorization': `Bearer ${tokenD}`,
// //             'Content-Type': 'application/json',
// //           },
// //         });

// //         if (response.status === 200) {
// //           const { buildingCount, flatCount, meterCount } = response.data.data;
// //           setFlashcardDetails({ buildingCount, flatCount, meterCount });

// //           if (buildingCount || flatCount || meterCount) {
// //             fetchTableData('buildings');
// //           }
// //         } else {
// //           setErrorMessage('Failed to fetch flashcard details.');
// //           console.error('Flashcard details read error', response.data);
// //         }
// //       } catch (error) {
// //         console.error('Error fetching flashcard details:', error);
// //         setErrorMessage('Error fetching flashcard details.');
// //       }
// //     };

// //     fetchFlashcardDetails();
// //   }, [facilityDetails.facilityId]);

// //   const handleToggleTheme = () => {
// //     setIsDarkMode((prevMode) => {
// //       const newMode = !prevMode;
// //       localStorage.setItem('theme', newMode ? 'dark' : 'light');
// //       return newMode;
// //     });
// //   };

// //   const fetchTableData = async (table) => {
// //     try {
// //       const tokenD = localStorage.getItem('token');
// //       const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/listOfBuildingFlat`, {
// //         headers: {
// //           'Authorization': `Bearer ${tokenD}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });

// //       if (response.status === 200) {
// //         const tableData = response.data.data;
// //         if (table === 'buildings') {
// //           setBuildingsData(Array.isArray(tableData) ? tableData : []);
// //         }
// //       } else {
// //         setErrorMessage('Failed to fetch table data.');
// //         console.error('Table data read error', response.data);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching table data:', error);
// //       setErrorMessage('Error fetching table data.');
// //     }
// //   };

// //   const fetchFlatDetails = async () => {
// //     try {
// //       const tokenD = localStorage.getItem('token');
// //       const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/flats`, {
// //         headers: {
// //           'Authorization': `Bearer ${tokenD}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });

// //       if (response.status === 200) {
// //         setFlatCount(response.data.data || []);
// //       } else {
// //         setErrorMessage('Failed to fetch flat details.');
// //         console.error('Flat details read error', response.data);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching flat details:', error);
// //       setErrorMessage('Error fetching flat details.');
// //     }
// //   };

// //   const fetchMeterDetails = async () => {
// //     try {
// //       const tokenD = localStorage.getItem('token');
// //       const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/meters`, {
// //         headers: {
// //           'Authorization': `Bearer ${tokenD}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });

// //       if (response.status === 200) {
// //         setTotalMetersData(response.data.data || []);
// //       } else {
// //         setErrorMessage('Failed to fetch meter details.');
// //         console.error('Meter details read error', response.data);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching meter details:', error);
// //       setErrorMessage('Error fetching meter details.');
// //     }
// //   };

// //   const handleFlashcardClick = (table) => {
// //     setActiveTable(table);
// //     if (table === 'buildings') {
// //       fetchTableData('buildings');
// //     } else if (table === 'totalFlats') {
// //       fetchFlatDetails();
// //     } else if (table === 'totalMeters') {
// //       fetchMeterDetails();
// //     }
// //   };

// //   const isDashboardRoute = location.pathname === '/SubAdminDashboard';

// //   return (
// //     <div className="fullPage">
// //       <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
// //         <SubAdminSideBar isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
// //         <div className="content">
// //           <TopNav isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
// //           <main>
// //             {isDashboardRoute ? (
// //               <>
// //                 <h3>Sub Admin Dashboard</h3>
// //                 {errorMessage && <p className="error">{errorMessage}</p>}
// //                 <div className="flashcards">
// //                   <div className="flashcard" onClick={() => handleFlashcardClick('buildings')}>
// //                     <p>Buildings</p>
// //                     <div className="flashcardCount">{flashcardDetails.buildingCount}</div>
// //                   </div>
// //                   <div className="flashcard" onClick={() => handleFlashcardClick('totalFlats')}>
// //                     <p>Total Flats</p>
// //                     <div className="flashcardCount">{flashcardDetails.flatCount}</div>
// //                   </div>
// //                   <div className="flashcard" onClick={() => handleFlashcardClick('totalMeters')}>
// //                     <p>Total Meters</p>
// //                     <div className="flashcardCount">{flashcardDetails.meterCount}</div>
// //                   </div>
// //                 </div>
// //                 {activeTable === 'buildings' && (
// //                   <div className="buildings-table">
// //                     <table className="new-table">
// //                       <thead>
// //                         <tr>
// //                           <th>Sr.No</th>
// //                           <th>Building Name</th>
// //                           <th>Total Flats</th>
// //                           <th>Total Meters</th>
// //                           <th>Action</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {buildingsData.map((item, index) => (
// //                           <tr key={index}>
// //                             <td>{index + 1}</td>
// //                             <td>{item.buildingName}</td>
// //                             <td>{item.totalFlats}</td>
// //                             <td>{item.totalMeters}</td>
// //                             <td className="action-buttons">
// //                              <button className="update_button" onClick={() => handleUpdateClick(item.buildingId)}>
// //                               Update
// //                              </button>
// //                              <button className="delete_button" onClick={() => handleDeleteClick(item.buildingId)}>
// //                                Delete
// //                              </button>
// //                           </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 )}
// //                 {activeTable === 'totalFlats' && (
// //                   <div className="totalFlats-table">
// //                     <table className="new-table">
// //                       <thead>
// //                         <tr>
// //                           <th>Sr.No</th>
// //                           <th>Building Name</th>
// //                           <th>Floor</th>
// //                           <th>Flat Number</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {flatCount.map((flat, index) => (
// //                           <tr key={flat.flatId}>
// //                             <td>{index + 1}</td>
// //                             <td>{flat.buildingName}</td>
// //                             <td>{flat.floorNumber}</td>
// //                             <td>{flat.flatNumber}</td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 )}
// //                 {activeTable === 'totalMeters' && (
// //                   <div className="totalMeters-table">
// //                     <table className="new-table">
// //                       <thead>
// //                         <tr>
// //                           <th>Sr.No</th>
// //                           <th>Flat Number</th>
// //                           <th>No. of Connections</th>
// //                           <th>Type of Meters</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {totalMetersData.map((meter, index) => (
// //                           <tr key={meter.meterId}>
// //                             <td>{index + 1}</td>
// //                             <td>{meter.flatNumber}</td>
// //                             <td>{meter.connectionCount}</td>
// //                             <td>{meter.meterType}</td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 )}
// //               </>
// //             ) : (
// //               <Outlet />
// //             )}
// //           </main>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default SubAdminDashboard;










// // function SubAdminDashboard() {
// //   const [facilityDetails, setFacilityDetails] = useState({
// //     facilityName: '',
// //     facilityId: '',
// //   });

// //   const [errorMessage, setErrorMessage] = useState('');
// //   const [isDarkMode, setIsDarkMode] = useState(false);
// //   const [activeTable, setActiveTable] = useState('buildings');
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [flashcardDetails, setFlashcardDetails] = useState({
// //     buildingCount: '',
// //     flatCount: '',
// //     meterCount: '',
// //   });

// //   const [buildingsData, setBuildingsData] = useState([]);

// //   useEffect(() => {
// //     const storedTheme = localStorage.getItem('theme');
// //     if (storedTheme) {
// //       setIsDarkMode(storedTheme === 'dark');
// //     }

// //     const fetchFacilityDetails = async () => {
// //       try {
// //         const tokenD = localStorage.getItem('token');
// //         const userData = JSON.parse(localStorage.getItem('user'));
// //         const userId = parseInt(userData?.id);

// //         if (!tokenD || !userId) {
// //           setErrorMessage('Error verifying details from login');
// //           return;
// //         }

// //         const response = await axios.get(`${config.backendurl}/api/v1/users/subadmin/${userId}`, {
// //           headers: {
// //             'Authorization': `Bearer ${tokenD}`,
// //             'Content-Type': 'application/json',
// //           },
// //         });

// //         if (response.status === 200) {
// //           const { facilityId, facilityName } = response.data.data;
// //           setFacilityDetails({ facilityName, facilityId });
// //         } else {
// //           setErrorMessage('Failed to fetch facility details.');
// //           console.error('Facilities read error', response.data);
// //         }
// //       } catch (error) {
// //         console.error('Error fetching facility details:', error);
// //         setErrorMessage('Error fetching facility details.');
// //       }
// //     };

// //     fetchFacilityDetails();
// //   }, []);

// //   useEffect(() => {
// //     if (!facilityDetails.facilityId) return;

// //     const fetchFlashcardDetails = async () => {
// //       try {
// //         const tokenD = localStorage.getItem('token');
// //         const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/getnumericdata`, {
// //           headers: {
// //             'Authorization': `Bearer ${tokenD}`,
// //             'Content-Type': 'application/json',
// //           },
// //         });

// //         if (response.status === 200) {
// //           const { buildingCount, flatCount, meterCount } = response.data.data;
// //           setFlashcardDetails({ buildingCount, flatCount, meterCount });
// //         } else {
// //           setErrorMessage('Failed to fetch flashcard details.');
// //           console.error('Flashcard details read error', response.data);
// //         }
// //       } catch (error) {
// //         console.error('Error fetching flashcard details:', error);
// //         setErrorMessage('Error fetching flashcard details.');
// //       }
// //     };

// //     fetchFlashcardDetails();
// //   }, [facilityDetails.facilityId]);



// //   const handleToggleTheme = () => {
// //     setIsDarkMode((prevMode) => {
// //       const newMode = !prevMode;
// //       localStorage.setItem('theme', newMode ? 'dark' : 'light');
// //       return newMode;
// //     });
// //   };



// //   const fetchTableData = async (table) => {
// //     try {
// //       const tokenD = localStorage.getItem('token');
// //       const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityDetails.facilityId}/listOfBuildingFlat`, {
// //         headers: {
// //           'Authorization': `Bearer ${tokenD}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });

// //       console.log("sub table: ",response.data)

// //       if (response.status === 200) {
// //         const tableData = response.data;
// //         if (table === 'buildings') {
// //           setBuildingsData(tableData);
// //         }
// //       } else {
// //         setErrorMessage('Failed to fetch table data.');
// //         console.error('Table data read error', response.data);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching table data:', error);
// //       setErrorMessage('Error fetching table data.');
// //     }
// //   };
 

// //   const handleFlashcardClick = (table) => {
// //     setActiveTable(table);
// //     if (table === 'buildings') {
// //       fetchTableData(table);
// //     }
// //   };

// //   const isDashboardRoute = location.pathname === '/SubAdminDashboard';

// //   return (
// //     <div className='fullPage' >
// //       <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
// //         <SubAdminSideBar isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
// //         <div className="content">
// //           <TopNav isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
// //           <main>
// //             {isDashboardRoute ? (
// //               <>
// //                 <h3>Sub Admin Dashboard</h3>
// //                 {errorMessage && <p className="error">{errorMessage}</p>}
// //                 <div className="flashcards">
// //                   <div className="flashcard" onClick={() => handleFlashcardClick('buildings')}>
// //                     <p>Buildings</p>
// //                     <div className='flashcardCount'>{flashcardDetails.buildingCount}</div>
// //                   </div>
// //                   <div className="flashcard" onClick={() => handleFlashcardClick('totalFlats')}>
// //                     <p>Total Flats</p>
// //                     <div className='flashcardCount'>{flashcardDetails.flatCount}</div>
// //                   </div>
// //                   <div className="flashcard" onClick={() => handleFlashcardClick('totalMeters')}>
// //                     <p>Total Meters</p>
// //                     <div className='flashcardCount'>{flashcardDetails.meterCount}</div>
// //                   </div>
// //                 </div>
// //                 {activeTable === 'buildings' && (
// //                   <div className="buildings-table">
// //                     <table>
// //                       <thead>
// //                         <tr>
// //                           <th>Sr.No</th>
// //                           <th>Building Name</th>
// //                           <th>Total Flats</th>
// //                           <th>Total Meters</th>
// //                           <th>Action</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {buildingsData.map((item, index) => (
// //                           <tr key={index}>
// //                             <td>{index + 1}</td>
// //                             <td>{item.buildingName}</td>
// //                             <td>{item.totalFlats}</td>
// //                             <td>{item.totalMeters}</td>
// //                             <td>
// //                               <button className="update_button">
// //                                 Update
// //                               </button>
// //                               <button className="delete_button">
// //                                 Delete
// //                               </button>
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 )}
// //                 {activeTable === 'totalFlats' && (
// //                   <div className="totalFlats-table">
// //                     {/* Change later */}
// //                   </div>
// //                 )}
// //                 {activeTable === 'totalMeters' && (
// //                   <div className="totalMeters-table">
// //                     {/* Change Later */}
// //                   </div>
// //                 )}
// //               </>
// //             ) : (
// //               <Outlet />
// //             )}
// //           </main>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default SubAdminDashboard;