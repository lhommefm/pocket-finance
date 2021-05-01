import React from 'react'
import { connect } from "react-redux";
import Axios from 'axios'
import { Link } from 'react-router-dom';
import { getStatus } from '../store/getStatus';

const curPage = (route) => {
  if (route === window.location.href.substring(window.location.href.lastIndexOf('/') + 1)) {
    return "tab-current"
  } else {
    return ""
  }
}

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handeLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.props.checkStatus()
  }

    async handleLogout() {
    await Axios.delete('/authentication/logout')
    this.props.checkStatus()
  }

  render() {
   
    return (
    <div className="tabs">
      <nav>
        <ul>
        <li className={curPage("budgetAssets")}><Link to="/budgetAssets">
          <img src="/navimages/home.svg" /><br />
          Summary
        </Link></li>
        <li className={curPage("stocks")}><Link to="/stocks">
         <img src="/navimages/pulse.svg" /><br />
          Stocks
        </Link></li>
        <li className={curPage("macro")}><Link to="/macro">
          <img src="/navimages/globe-alt.svg" /><br />
          Economy
        </Link></li>
        <li className={curPage("inputs")}><Link to="/inputs">
          <img src="/navimages/edit.svg" /><br />
          Inputs
        </Link></li>
        <li>
          {
            (this.props.loggedIn) ? 
            <span onClick={this.handleLogout} >[Logout]</span> :
            <Link className="link" to="/login">[Login]</Link>
          }
        </li>
      </ul>
      </nav>
    </div>
    );
  
  }

};

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

export default connect(mapState, mapDispatch)(Header);