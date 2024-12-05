import React, { useState, useEffect } from 'react';
import './Readings.css';
import axios from 'axios';
import config from '../../config';

const Readings = () => {
  const facilityId = localStorage.getItem('facilityId');
  const [selectedOption, setSelectedOption] = useState('G');
  const [searchMeterNumber, setSearchMeterNumber] = useState('');
  const [searchFlatNumber, setSearchFlatNumber] = useState('');
  const [readings, setReadings] = useState([]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const tokenD = localStorage.getItem('token');
        const response = await axios.get(`${config.backendurl}/api/v1/users/${facilityId}/getMeterType/${selectedOption}`, {
          headers: {
            'Authorization': `Bearer ${tokenD}`,
            'Content-Type': 'application/json',
          },
        });

        const data = response.data.data || []; // Ensure data is always an array

        console.log("red data", data);
        console.log(" ta", response.data);
        setReadings(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setReadings([]); // Set an empty array in case of error
      }
    };
    fetchReadings();
  }, [selectedOption, facilityId]);


  const handleSearchMeterNumber = (e) => {
    setSearchMeterNumber(e.target.value);
  };

  const handleSearchFlatNumber = (e) => {
    setSearchFlatNumber(e.target.value);
  };

  const filterReadings = (readings) => {
    return readings.filter((reading) =>
      `${reading.meterNumber}`.includes(searchMeterNumber) &&
      `${reading.flatNum}`.includes(searchFlatNumber)
    );
  };

  return (
    <div>
      <h3>Readings</h3>
      <div className='readings-container'>
        <div className='radio-buttons'>
          <label>
            <input
              type="radio"
              value="G"
              checked={selectedOption === 'G'}
              onChange={handleOptionChange}
            />
            Gas
          </label>
          <label>
            <input
              type="radio"
              value="E"
              checked={selectedOption === 'E'}
              onChange={handleOptionChange}
            />
            Electricity
          </label>
          <label>
            <input
              type="radio"
              value="W"
              checked={selectedOption === 'W'}
              onChange={handleOptionChange}
            />
            Water
          </label>
          <div className='search-bars'>
            <input
              type="text"
              placeholder="Search by Meter Number"
              value={searchMeterNumber}
              onChange={handleSearchMeterNumber}
              className='SearchBarInput-readings'
            />
            <input
              type="text"
              placeholder="Search by Flat Number"
              value={searchFlatNumber}
              onChange={handleSearchFlatNumber}
              className='SearchBarInput-readings'
            />
          </div>
        </div>
        
        <div>
          {selectedOption === 'G' && (
            <table className='readings-gas-table'>
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Meter Number</th>
                  <th>DCU ID</th>
                  <th>Flat Number</th>
                  <th>Last Reading</th>
                  <th>Current Reading</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterReadings(readings).map((reading, index) => (
                  <tr key={reading.id}>
                    <td>{index + 1}</td>
                    <td>{reading.meterNumber}</td>
                    <td>{reading.dcuId}</td>
                    <td>{reading.flatNum}</td>
                    <td>{reading.lstRead}</td>
                    <td>{reading.crtRead}</td>
                    <td>
                      <button className='BlueButton' onClick={() => alert(`Viewing reading ID: ${reading.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedOption === 'E' && (
            <table className='readings-electricity-table'>
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Meter Number</th>
                  <th>DCU ID</th>
                  <th>Flat Number</th>
                  <th>Last Reading (kWH)</th>
                  <th>Current Reading (kWh)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterReadings(readings).map((reading, index) => (
                  <tr key={reading.id}>
                    <td>{index + 1}</td>
                    <td>{reading.meterNumber}</td>
                    <td>{reading.dcuId}</td>
                    <td>{reading.flatNum}</td>
                    <td>{reading.lstRead}</td>
                    <td>{reading.crtRead}</td>
                    <td>
                      <button className='BlueButton' onClick={() => alert(`Viewing reading ID: ${reading.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedOption === 'W' && (
            <table className='readings-water-table'>
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Meter Number</th>
                  <th>DCU ID</th>
                  <th>Flat Number</th>
                  <th>Last Reading (m<sup>3</sup>)</th>
                  <th>Current Reading (m<sup>3</sup>)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterReadings(readings).map((reading, index) => (
                  <tr key={reading.id}>
                    <td>{index + 1}</td>
                    <td>{reading.meterNumber}</td>
                    <td>{reading.dcuId}</td>
                    <td>{reading.flatNum}</td>
                    <td>{reading.lstRead}</td>
                    <td>{reading.crtRead}</td>
                    <td>
                      <button className='BlueButton' onClick={() => alert(`Viewing reading ID: ${reading.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Readings;












/* import React, { useState } from 'react';
import './Readings.css';

const Readings = () => {
  const [selectedOption, setSelectedOption] = useState('gas');
  const [searchMeterNumber, setSearchMeterNumber] = useState('');
  const [searchFlatNumber, setSearchFlatNumber] = useState('');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // dummy data
  const gasReadings = [
    { id: 1, meterNumber: 'G123', dcuId: 'DCU1', flatNumber: '101', lastReading: '500', currentReading: '550' },
    { id: 2, meterNumber: 'G124', dcuId: 'DCU2', flatNumber: '102', lastReading: '300', currentReading: '350' },
  ];

  const electricityReadings = [
    { id: 1, meterNumber: 'E123', dcuId: 'DCU1', flatNumber: '101', lastReading: '1000', currentReading: '1050' },
  { id: 2, meterNumber: 'E124', dcuId: 'DCU2', flatNumber: '102', lastReading: '800', currentReading: '850' },
  { id: 3, meterNumber: 'E125', dcuId: 'DCU3', flatNumber: '103', lastReading: '1200', currentReading: '1250' },
  { id: 4, meterNumber: 'E126', dcuId: 'DCU4', flatNumber: '104', lastReading: '600', currentReading: '650' },
  ];

  const waterReadings = [
    { id: 1, meterNumber: 'W123', dcuId: 'DCU1', flatNumber: '101', lastReading: '10', currentReading: '12' },
    { id: 2, meterNumber: 'W124', dcuId: 'DCU2', flatNumber: '102', lastReading: '15', currentReading: '18' },
  ];

  const handleSearchMeterNumber = (e) => {
    setSearchMeterNumber(e.target.value);
  };

  const handleSearchFlatNumber = (e) => {
    setSearchFlatNumber(e.target.value);
  };

  const filterReadings = (readings) => {
    return readings.filter((reading) =>
      reading.meterNumber.includes(searchMeterNumber) &&
      reading.flatNumber.includes(searchFlatNumber)
    );
  };

  return (
    <div>
      <h3>Readings</h3>
      <div className='readings-container'>
        <div className='radio-buttons'>
          <label>
            <input
              type="radio"
              value="gas"
              checked={selectedOption === 'gas'}
              onChange={handleOptionChange}
            />
            Gas
          </label>
          <label>
            <input
              type="radio"
              value="electricity"
              checked={selectedOption === 'electricity'}
              onChange={handleOptionChange}
            />
            Electricity
          </label>
          <label>
            <input
              type="radio"
              value="water"
              checked={selectedOption === 'water'}
              onChange={handleOptionChange}
            />
            Water
          </label>
          <div className='search-bars'>
            <input
              type="text"
              placeholder="Search by Meter Number"
              value={searchMeterNumber}
              onChange={handleSearchMeterNumber}
              className='SearchBarInput-readings'
            />
            <input
              type="text"
              placeholder="Search by Flat Number"
              value={searchFlatNumber}
              onChange={handleSearchFlatNumber}
              className='SearchBarInput-readings'
            />
          </div>
        </div>
        
        <div>
          {selectedOption === 'gas' && (
            <table className='readings-gas-table'>
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Meter Number</th>
                  <th>DCU ID</th>
                  <th>Flat Number</th>
                  <th>Last Reading</th>
                  <th>Current Reading</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterReadings(gasReadings).map((reading, index) => (
                  <tr key={reading.id}>
                    <td>{index + 1}</td>
                    <td>{reading.meterNumber}</td>
                    <td>{reading.dcuId}</td>
                    <td>{reading.flatNumber}</td>
                    <td>{reading.lastReading}</td>
                    <td>{reading.currentReading}</td>
                    <td>
                      <button className='BlueButton' onClick={() => alert(`Viewing reading ID: ${reading.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedOption === 'electricity' && (
            <table className='readings-electricity-table'>
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Meter Number</th>
                  <th>DCU ID</th>
                  <th>Flat Number</th>
                  <th>Last Reading (kWH)</th>
                  <th>Current Reading (kWh)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterReadings(electricityReadings).map((reading, index) => (
                  <tr key={reading.id}>
                    <td>{index + 1}</td>
                    <td>{reading.meterNumber}</td>
                    <td>{reading.dcuId}</td>
                    <td>{reading.flatNumber}</td>
                    <td>{reading.lastReading}</td>
                    <td>{reading.currentReading}</td>
                    <td>
                      <button className='BlueButton' onClick={() => alert(`Viewing reading ID: ${reading.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedOption === 'water' && (
            <table className='readings-water-table'>
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Meter Number</th>
                  <th>DCU ID</th>
                  <th>Flat Number</th>
                  <th>Last Reading (m<sup>3</sup>)</th>
                  <th>Current Reading (m<sup>3</sup>)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterReadings(waterReadings).map((reading, index) => (
                  <tr key={reading.id}>
                    <td>{index + 1}</td>
                    <td>{reading.meterNumber}</td>
                    <td>{reading.dcuId}</td>
                    <td>{reading.flatNumber}</td>
                    <td>{reading.lastReading}</td>
                    <td>{reading.currentReading}</td>
                    <td>
                      <button className='BlueButton' onClick={() => alert(`Viewing reading ID: ${reading.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Readings;

*/