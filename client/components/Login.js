import React from 'react';

export const Login = () => {
  return (
    <div>
      <form  method='get' action='/authentication/google'>
        <button type='submit'>Login with Google</button>
      </form>
      <form method='get' action='/authentication/facebook'>
        <button type='submit'>Login with Facebook</button>
      </form>
    </div> 
  )
}