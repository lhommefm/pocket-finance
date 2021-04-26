import React from 'react';
import { GoogleLogin , FacebookLogin } from './OathLogins';

const Login = () => {

  return (
    <div>
      <GoogleLogin />
      <FacebookLogin />
    </div> 
  );

};

export default Login;