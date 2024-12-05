const getUser = () => {
    const userString = localStorage.getItem('user');
    const tokenString = localStorage.getItem('token');
    const rolesString = localStorage.getItem('roles');
    return {
      user: userString ? JSON.parse(userString) : null,
      token: tokenString || null,
      roles: rolesString ? JSON.parse(rolesString) : [],
    };
  };
  
  const logout = () => {
    localStorage.removeItem('token'); 
  };
  
  export { getUser, logout };
  