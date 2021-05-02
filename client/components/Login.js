import React from 'react';
import { connect } from "react-redux";
import { getStatus } from '../store/getStatus';

export class Login extends React.Component {
  
  render() {
    if(!this.props.loggedIn) {
      return (
        <div className="login">
          <span>You are not logged in - financial reports will show demo data for illustrative purposes.</span>
          <form  method='get' action='/authentication/google'>
            <button type='submit'>Login with Google</button>
          </form>
          <form method='get' action='/authentication/facebook'>
            <button type='submit'>Login with Facebook</button>
          </form>
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