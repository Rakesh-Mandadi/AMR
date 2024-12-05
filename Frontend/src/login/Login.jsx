import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './login.css'
import work from '../img/work.jpeg'
import config from '../config';


const Login = () => {

  const { register, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      pswd: "",
    }
  });
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      console.log("login.jsx");
      const response = await fetch(
        `${config.backendurl}/api/v1/auth/signin`
        , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      console.log("login.jsx");
    
      if (response.ok) {
        const data = await response.json();
        console.log("this is response data", data);

        localStorage.clear();
        // Store the token in local storage
        localStorage.setItem('token', data.token);
        // Store the user data (excluding token and roles) in local storage
        const { token, roles, ...userData } = data;
        localStorage.setItem('user', JSON.stringify(userData));

        console.log("this is user data", userData);
        // Store the roles in local storage
        localStorage.setItem('roles', JSON.stringify(roles));

        console.log("this is roles data", roles);
      
        // Check the user's roles and navigate to the appropriate route
        if (roles.includes('ROLE_SUPERADMIN')) {
            console.log("SUPER_ADMIN");
          navigate('/SuperAdminDashboard');
        } else if (roles.includes('ROLE_SUBADMIN')) {
            console.log("SUB_ADMIN");
          navigate('/SubAdminDashboard');
        } else {
            console.log("user-dashboard");
          navigate('/user-dashboard');
        }
      } else {
          console.log("Authentication failed");
        const errorData = await response.json();
        setError(errorData.message || 'Authentication failed');
      }
    } catch (error) {
        console.log("An error occurred");
      setError('An error occurred during authentication');
      console.error('Authentication error:', error);
    }
  };


  return (
    <div className='container'>
      <div className='screen'>
        <div className='screen__content'>
          <form className="login" onSubmit={handleSubmit} noValidate>
            <h3 className='h3login'>Login</h3>
            <div className='login__field'>
              <i className='login__icon fasfa-user'></i>
              <input
                type="text"
                id="username"
                className='login__input'
                placeholder='User Name'
                {...register("username", { required: "Username is required" })}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              /><br></br>
              <p className='error'>{errors.username?.message}</p>
            </div>
            <div className='login__field'>
              <i className='login__icon fasfa-lock'></i>
              <input
                type="password"
                id="password"
                className='login__input'
                placeholder='Password'
                {...register("pswd", { required: "Password is required" })}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /><br></br>
              <p className='error'>{errors.pswd?.message}</p>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button class="button login__submit">
              <span class="button__text">Log In Now</span>
              <i class="button__icon fas fa-chevron-right"></i>
            </button>
          </form>
          </div>
		<div class="screen__background">
			<span class="screen__background__shape screen__background__shape4"></span>
			<span class="screen__background__shape screen__background__shape3"></span>		
			<span class="screen__background__shape screen__background__shape2"></span>
			<span class="screen__background__shape screen__background__shape1"></span>
		</div>		
	</div>
</div>
  );
};

export default Login;