import React from 'react';
import { connect } from "react-redux";
import { getStatus } from '../store/getStatus';

const message = () =>{
  const url = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
  if (url === "summary" || url === "stocks") {
    return(<div className="login-message">You are not logged in - financial reports show illustrative data.</div>)}
  if (url === "inputs") {
    return(<div className="login-message">Illustrative interface below - guests cannot update data.</div>)}
}

export class Login extends React.Component {
  
  render() {
    if(!this.props.loggedIn) {
      return (
        <div className="login">
          {message()}
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