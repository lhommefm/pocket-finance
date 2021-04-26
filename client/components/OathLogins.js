import React from 'react'

export const GoogleLogin = () => (
  <form method='get' action='/authentication/google'>
    <button type='submit'>Login with Google</button>
  </form>
)

export const FacebookLogin = () => (
  <form method='get' action='/authentication/facebook'>
    <button type='submit'>Login with Facebook</button>
  </form>
)