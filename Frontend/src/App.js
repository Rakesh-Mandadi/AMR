import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import SubAdminDashboard from './dashboard/SubAdminDashboard';
import SuperAdminDashboard from './dashboard/SuperAdminDashboard';
import UserDashboard from './dashboard/UserDashboard';
import Forbidden from './login/Forbidden';
import PrivateRoute from './login/PrivateRoute';
import AddSubAdmin from './dashboard/superAdminDashboard/AddSubAdmin';
import UpdateSubAdmin from './dashboard/superAdminDashboard/UpdateSubAdmin';
import CreateFacility from './dashboard/superAdminDashboard/CreateFacility';
import Settings from './dashboard/superAdminDashboard/Settings';
import Miscellaneous from './dashboard/superAdminDashboard/Miscellaneous';
import UpdateFacility from './dashboard/subAdminDashboard/ManageFacilities/UpdateFacility';
import './App.css';
import AddBuilding from './dashboard/subAdminDashboard/ManageFacilities/AddBuilding';
import AttachFlatElectricityMeters from './dashboard/subAdminDashboard/ManageMeters/ElectricityMeter/AttachFlatElectricityMeters';
import AttachFlatGasMeters from './dashboard/subAdminDashboard/ManageMeters/GasMeter/AttachFlatGasMeters';
import AttachFlatWaterMeters from './dashboard/subAdminDashboard/ManageMeters/WaterMeter/AttachFlatWaterMeters';
import AddNewElectricityMeters from './dashboard/subAdminDashboard/ManageMeters/ElectricityMeter/AddNewElectricityMeters';
import AddNewGasMeters from './dashboard/subAdminDashboard/ManageMeters/GasMeter/AddNewGasMeters';
import AddNewWaterMeters from './dashboard/subAdminDashboard/ManageMeters/WaterMeter/AddNewWaterMeters';
import AddElectricityMeterType from './dashboard/subAdminDashboard/ManageMeters/ElectricityMeter/AddElectricityMeterType';
import AddGasMeterType from './dashboard/subAdminDashboard/ManageMeters/GasMeter/AddGasMeterType';
import AddWaterMeterType from './dashboard/subAdminDashboard/ManageMeters/WaterMeter/AddWaterMeterType';
import SubSettings from './dashboard/subAdminDashboard/SubSettings';
import AddResident from './dashboard/subAdminDashboard/ManageFacilities/AddResident'
import Amr from './dashboard/subAdminDashboard/Amr';
import Readings from './dashboard/subAdminDashboard/Readings';
import GenerateBills from './dashboard/subAdminDashboard/GenerateBills';
import Billing from './dashboard/subAdminDashboard/BillPayment/Billing';
import Payment from './dashboard/subAdminDashboard/BillPayment/Payment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/SubAdminDashboard"
          element={
            <PrivateRoute roles={['ROLE_SUBADMIN']}>
              <SubAdminDashboard />
            </PrivateRoute>
          }
        >
          <Route path="UpdateFacility" element={<UpdateFacility />} />
          <Route path="AddBuilding" element={<AddBuilding />} />
          <Route path="AddResident" element={<AddResident />} />
          <Route path="AttachFlatElectricityMeters" element={<AttachFlatElectricityMeters />} />
          <Route path="AddElectricityMeterType" element={<AddElectricityMeterType />} />
          <Route path="AddNewElectricityMeters" element={<AddNewElectricityMeters />} />
          <Route path="AttachFlatGasMeters" element={<AttachFlatGasMeters />} />
          <Route path="AddGasMeterType" element={<AddGasMeterType />} />
          <Route path="AddNewGasMeters" element={<AddNewGasMeters />} />
          <Route path="AttachFlatWaterMeters" element={<AttachFlatWaterMeters />} />
          <Route path="AddWaterMeterType" element={<AddWaterMeterType />} />
          <Route path="AddNewWaterMeters" element={<AddNewWaterMeters />} />
          <Route path="Settings" element={<SubSettings/>} />
          <Route path="Amr" element={<Amr/>}/>
          <Route path="Readings" element={<Readings/>}/>
          <Route path="GenerateBills" element={<GenerateBills/>}/>
          <Route path="Billing" element={<Billing/>}/>
          <Route path="Payment" element={<Payment/>}/>
        </Route>
        <Route
          path="/SuperAdminDashboard"
          element={
            <PrivateRoute roles={['ROLE_SUPERADMIN']}>
              <SuperAdminDashboard />
            </PrivateRoute>
          }
        >
          <Route path="AddSubAdmin" element={<AddSubAdmin />} />
          <Route path="UpdateSubAdmin" element={<UpdateSubAdmin />} />
          <Route path="CreateFacility" element={<CreateFacility />} />
          <Route path="Settings" element={<Settings />} />
          <Route path="Miscellaneous" element={<Miscellaneous />} />
        </Route>
        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute roles={['ROLE_USER']}>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </Router>
  );
}

export default App;
