import React from 'react';
import { connect } from "react-redux";
import { getStatus } from '../store/getStatus';

export class Login extends React.Component {
  
  render() {
    if(!this.props.loggedIn) {
      return (
        <div className="login">
          <div className="login-message">You are not logged in - financial reports show illustrative data.</div>
          <div className="login-buttons">
            <form  method='get' action='/authentication/google'>
              <input id="google-button" type='image' src="/navimages/google-button.png" alt="Login with Google" />
            </form>
            <form method='get' action='/authentication/facebook'>
              <input id="facebook-button" type='image' src="/navimages/facebook-button.png" alt="Login with Facebook" />
            </form>
          </div>
        </div> 
      )
    } else {
      return (
        <div className="spacer"></div>
      )
    }
  }
}

const mapState = (state) => {
  return {
    loggedIn: state.status
  };
};

const mapDispatch = (dispatch) => {
  return {
    checkStatus: () => dispatch(getStatus())
  };
};

export default connect(mapState, mapDispatch)(Login);