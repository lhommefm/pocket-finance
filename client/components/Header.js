import React from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom';

export default class Header extends React.Component {

  componentDidMount() {
    // let stockData = Axios.get('/api/refreshStockData');
    // let stockData = Axios.get('/api/refreshMacroData');
  }

  render() {
   
    return (
    <div className='header'>
      
      <div className="link">
        <Link className="link" to="/login">Login</Link>
        <Link className="link" to="/budgetAssets">Budgets Assets</Link>
        <Link className="link" to="/stocks">Stocks</Link>
        <Link className="link" to="/macro">Macro</Link>
        <Link className="link" to="/inputs">Inputs</Link>
      </div>
      
      <div className="buttonDiv">
        <form className='refreshButton' method='get' action="/api/refreshStockData">
          <button type='submit'>Refresh Stock Data</button>
        </form> 
        <form className='refreshButton' method='get' action="/api/refreshMacroData">
          <button type='submit'>Refresh Macro Data</button>
        </form>  
      </div>

    </div> 
    );
  
  }

};
