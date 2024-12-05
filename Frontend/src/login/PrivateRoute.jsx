import React from 'react';

import { Navigate, useLocation } from 'react-router-dom';
import { getUser } from './auth'; // Import the getUser function

const PrivateRoute = ({ children, roles }) => {
    const location = useLocation();
    const { user, token, roles: userRoles } = getUser();
  
    if (!token) {
      // Redirect to the login page if the user is not authenticated
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  
    if (roles && !roles.some((role) => userRoles.includes(role))) {
      // Redirect to a forbidden page if the user doesn't have the required role
      return <Navigate to="/forbidden" state={{ from: location }} replace />;
    }
  
    // Render the component if the user is authenticated and has the required role
    return children;
  };
  
  export default PrivateRoute;