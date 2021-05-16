import React from "react";
import { connect } from "react-redux";
import Axios from 'axios'

// import functions and modules
import { getAssetAllocation } from "../store/getAssetAllocation";
import { getStockAssets } from '../store/getStockAssets';
import { getStockHistory } from "../store/getStocks";
import { getStockDetail } from "../store/getStockDetail";
import { ChartCard } from './MacroCharts';

export class Stocks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStock: 'TOTAL',
      messages: []
    };
    this.setStock = this.setStock.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentDidMount() {
    await this.props.stockAssets();
    await this.props.assetAllocation();
    await this.props.stockHistory();
    await this.props.stockDetail();
  }
  
  async handleSubmit(event) {
    event.preventDefault();
    const response = await Axios.get(event.target[0].value);
    this.setState({
      messages: [
        ...this.state.messages,
        `Updated ${response.data.number} Stock entries`,
      ]
    });
    setTimeout( () => {
      this.setState({
        messages: []
      });
    }, 5000);
  }

  setStock (event) {
    this.setState( {selectedStock: event.target.value} );
  }

  render() {
    if (typeof(this.props.stocks.FB)==="undefined") {return ("Data Loading")}
    else {return (
     <div className="stock-vertical">
          {!!this.props.loggedIn ? 
          (<div className="update-button">
            <form onSubmit={this.handleSubmit} className='refreshButton'>
              <button type='submit' value="/api/refreshStockData">Refresh Stock Data</button>
            </form>
            <form onSubmit={this.handleSubmit} className='refreshButton'>
              <button type='submit' value="/api/refreshStockDetail">Refresh Stock Detail</button>
            </form>
            {this.state.messages.map( (message, index) => { return (
              <p key={index}>{message}</p>
            )})} 
          </div>) :
          <div></div>}
       <div className="flex">
{/* Overall Asset Table */}
      <div className="card stock">
        <div className="card-header stock-header">Allocation Overview</div>
        <table>
          <thead>
              <tr>
                  <td className="table-label allocation-a">Asset Type</td>
                  <td className="numbers">Value</td>
                  <td className="allocation-p">%</td>
              </tr>
          </thead>
          <tbody>
            {this.props.assetTable.map( (assetEntry, index) => { return (
              <tr key = {index}>
                <td className="table-label allocation">{assetEntry.asset_class}</td>
                <td className="numbers">{new Intl.NumberFormat("en-US", { 
                  style: "decimal", 
                  maximumFractionDigits: 0
                }).format(assetEntry.value)}</td>
                <td className="numbers allocation-p">{new Intl.NumberFormat("en-US", { 
                  style: "percent", 
                  maximumFractionDigits: 0
                }).format(assetEntry.percent)}</td>
              </tr> 
            )})}
           <tr className="total">
                <td className="table-label">Total</td>
                <td className="numbers">
                  {new Intl.NumberFormat("en-US", { 
                      style: "currency", 
                      currency: "USD", 
                      maximumFractionDigits: 0 
                    }).format( this.props.assetTable.reduce( (acc, curVal) => {return (acc + (curVal.value))}, 0) 
                  )}
                </td>
                <td>100%</td>
            </tr>         
          </tbody>
        </table>
      </div>

{/* Overall Stock Table */}
      <div className="card stock">
        <div className="card-header stock-header">Stocks Snapshot</div>
        <table>
          <thead>
              <tr>
                  <td className="table-label">Account</td>
                  <td>Ticker</td>
                  <td>Shares</td>
                  <td>Price</td>
                  <td className="numbers">Value</td>
              </tr>
          </thead>
          <tbody>
            {this.props.stockTable.map( (stockEntry, index) => { return (
              <tr key = {index}>
                <td className="table-label">{stockEntry.account_type}</td>
                <td>{stockEntry.ticker}</td>
                <td className="numbers">{new Intl.NumberFormat("en-US", { 
                  style: "decimal", 
                  maximumFractionDigits: 1 
                }).format(stockEntry.quantity)}</td>
                <td className="numbers">{new Intl.NumberFormat("en-US", { 
                  style: "currency", 
                  currency: "USD", 
                  minimumFractionDigits: 2 
                }).format(stockEntry.price)}</td>
                <td className="numbers">{new Intl.NumberFormat("en-US", { 
                  style: "currency", 
                  currency: "USD", 
                  maximumFractionDigits: 0 
                }).format(stockEntry.value)}</td>
              </tr> 
            )})}
            <tr className="total">
                <td className="table-label">Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td className="numbers">
                  {new Intl.NumberFormat("en-US", { 
                      style: "currency", 
                      currency: "USD", 
                      maximumFractionDigits: 0 
                    }).format( this.props.stockTable.reduce( (acc, curVal) => {return (acc + (curVal.value))}, 0) 
                  )}
                </td>
            </tr>         
          </tbody>
        </table>
      </div>

{/* Stock History */}     
      <div className="card stock">
        <div className="card-header stock-header">Stock History</div>
        <div className="select">
            <span>Select a stock:
              <select value={this.state.selectedStock} onChange={this.setStock}>
                {Object.keys(this.props.stocks).map( stock => {return (
                  <option key={stock} value={stock}>{stock}</option>
                )})}
              </select>
            </span>  
            <ChartCard chart_group={this.props.stocks[this.state.selectedStock]} />          
        </div>
      </div>

{/* Overall Stock Detail */}
      <div className="card stock">
        <div className="card-header stock-header">Stocks Details</div>
        <table>
          <thead>
              <tr>
                  <td className="sixty">Ticker</td>
                  <td className="hundred-fifty">Name</td>
                  <td className="numbers">Yield</td>
                  <td className="numbers">PE</td>
                  <td className="numbers">P/B</td>
                  <td className="numbers">Beta</td>
              </tr>
          </thead>
          <tbody>
            {this.props.stockDetailData.map( (stockDetail, index) => { return (
              <tr key = {index}>
                <td className="sixty">{stockDetail.ticker}</td>
                <td className="hundred-fifty">{stockDetail.short_name}</td>
                <td>{new Intl.NumberFormat("en-US", { 
                  style: "percent", 
                  minimumFractionDigits: 1 
                }).format(stockDetail.yield)}</td>
                <td className="numbers">{new Intl.NumberFormat("en-US", { 
                  style: "decimal", 
                  maximumFractionDigits: 0 
                }).format(stockDetail.price_earnings)}</td>
                <td className="numbers">{new Intl.NumberFormat("en-US", { 
                  style: "decimal", 
                  maximumFractionDigits: 1 
                }).format(stockDetail.price_book)}</td>
                <td className="numbers">{new Intl.NumberFormat("en-US", { 
                  style: "decimal", 
                  maximumFractionDigits: 1 
                }).format(stockDetail.beta)}</td>
              </tr> 
            )})}
          </tbody>
        </table>
      </div>


     </div>
    </div>
    )};

  }

}

const mapState = (state) => {
  return {
    stockTable: state.stockTable,
    assetTable: state.assetTable,
    stocks: state.stocks,
    stockDetailData: state.stockDetail,
    loggedIn: state.status
  };
};

const mapDispatch = (dispatch) => {
  return {
    stockAssets: () => dispatch(getStockAssets()),
    assetAllocation: () => dispatch(getAssetAllocation()),
    stockHistory: () => dispatch(getStockHistory()),
    stockDetail: () => dispatch(getStockDetail())
  };
};

export default connect(mapState, mapDispatch)(Stocks);
