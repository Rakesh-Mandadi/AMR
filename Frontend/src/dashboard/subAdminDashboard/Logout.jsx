import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Login from '../../login/Login';

const Logout = () => {
  const history = useHistory();

  useEffect(() => {
    localStorage.clear();
    history.replace('/');
  }, [history]);

  return (
    <Login />
  );
};

export default Logout;
