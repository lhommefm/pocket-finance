import React from 'react'
import { connect } from "react-redux";
import Axios from 'axios'
import { Link } from 'react-router-dom';
import { getStatus } from '../store/getStatus';

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handeLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.props.checkStatus()
  }

  async handleSubmit(event) {
    event.preventDefault()
    const response = await Axios.get(event.target[0].value)
    if(event.target[0].value === "/api/refreshMacroData") {
      this.setState({
      messages: [
        ...this.state.messages,
        `Updated ${response.data[0]} Fred entries`,
        `Updated ${response.data[1]} Quandl entries`
      ]
    });
    }; 
    if(event.target[0].value === "/api/refreshStockData") {
      this.setState({
        messages: [
          ...this.state.messages,
          `Updated ${response.data[0]} Stock entries`,
        ]
      })
    };
    setTimeout( () => {
      this.setState({
        messages: []
      });
    }, 5000);
  }

  async handleLogout() {
    await Axios.delete('/authentication/logout')
    this.props.checkStatus()
  }


  render() {
   
    return (
    <div className='header'>
      
      <div className="link">
        {
          (this.props.loggedIn) ? 
          <span onClick={this.handleLogout} >[Logout]</span> :
          <Link className="link" to="/login">[Login]</Link> 
        }
        <Link className="link" to="/budgetAssets">Budgets Assets</Link>
        <Link className="link" to="/stocks">Stocks</Link>
        <Link className="link" to="/macro">Macro</Link>
        <Link className="link" to="/inputs">Inputs</Link>
      </div>
      
      <div className="buttonDiv">
        {this.state.messages.map( (message, index) => { return (
          <p key={index}>{message}</p>
        )})}
        <form onSubmit={this.handleSubmit} className='refreshButton'>
          <button type='submit' value="/api/refreshStockData">Refresh Stock Data</button>
        </form> 
        <form onSubmit={this.handleSubmit} className='refreshButton'>
          <button type='submit' value="/api/refreshMacroData">Refresh Macro Data</button>
        </form>  
      </div>

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