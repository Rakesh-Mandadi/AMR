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
  const [otpVisible, setOtpVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  

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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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



  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.backendurl}/api/v1/auth/sendOTP`, {
        mode: 'no-cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({"recipient": email }),
      });

      if (response.ok) {
        setOtpMessage('OTP has been sent to your email.');
        setOtpError('');
      } else {
        const errorData = await response.json();
        setOtpError(errorData.message || 'Failed to send OTP.');
      }
    } catch (error) {
      setOtpError('An error occurred while sending the OTP.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.backendurl}/api/v1/auth/verifyOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({"verifyOTP": otp,"recipient": email }),
      });

      if (response.ok) {
        setOtpMessage('OTP verified successfully. You can now reset your password.');
        setOtpError('');
      } else {
        const errorData = await response.json();
        setOtpError(errorData.message || 'Failed to verify OTP.');
      }
    } catch (error) {
      setOtpError('An error occurred while verifying the OTP.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${config.backendurl}/api/v1/auth/resetPassword`, {
        method: "POST",
        headers: {
         'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email, newPassword }),
      });

      if (response.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setError("");

        // Redirect to login after a delay
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("An error occurred while resetting your password.");
    }
  };


  return (
    <div className='container'>
      <div className='screen'>
        <div className='screen__content'>
          {!otpVisible ? (
            <form className="login" onSubmit={handleSubmit} noValidate>
              <h3 className='h3login'>Login</h3>
              <div className='login__field'>
                <input
                  type="text"
                  id="username"
                  className='login__input'
                  placeholder='User Name'
                  {...register("username", { required: "Username is required" })}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <p className='error'>{errors.username?.message}</p>
              </div>
              <div className='login__field'>
                <input
                  type="password"
                  id="password"
                  className='login__input'
                  placeholder='Password'
                  {...register("pswd", { required: "Password is required" })}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className='error'>{errors.pswd?.message}</p>
              </div>

              {error && <p style={{ color: 'red' }}>{error}</p>}

              <button className="button login__submit">
                <span className="button__text">Log In Now</span>
              </button>

              <div className="login__field">
                <a
                  href="#"
                  onClick={() => setOtpVisible(true)}
                  style={{ color: '#007bff', textDecoration: 'underline' }}
                >
                  Forgot Password? Request OTP
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRequestOtp}>
              <h3>Request OTP</h3>
              <div className='login__field'>
                <input
                  type="email"
                  id="email"
                  className='login__input'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {otpError && <p style={{ color: 'red' }}>{otpError}</p>}
              {otpMessage && <p style={{ color: 'green' }}>{otpMessage}</p>}

              <button className="button login__submit">
                <span className="button__text">Send OTP</span>
              </button>
            </form>
          )}
          {otpVisible && (
            <form onSubmit={handleVerifyOtp}>
              <h3>Verify OTP</h3>
              <div className='login__field'>
                <input
                  type="text"
                  id="otp"
                  className='login__input'
                  placeholder='Enter OTP'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              {otpError && <p style={{ color: 'red' }}>{otpError}</p>}
              {otpMessage && <p style={{ color: 'green' }}>{otpMessage}</p>}

              <button className="button login__submit">
                <span className="button__text">Verify OTP</span>
              </button>
              <div className="login__field">
                <a
                  href="#"
                  onClick={() => setOtpVisible(false)}
                  style={{ color: '#007bff', textDecoration: 'underline' }}
                >
                  Back to Login
                </a>
              </div>
            </form>
          )}
          
          </div>
          


		<div class="screen__background">
			<span className="screen__background__shape screen__background__shape4"></span>
			<span className="screen__background__shape screen__background__shape3"></span>		
			<span className="screen__background__shape screen__background__shape2"></span>
			<span className="screen__background__shape screen__background__shape1"></span>
		</div>		
	</div>
</div>
  );
};

export default Login;