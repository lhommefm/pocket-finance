import React from "react";
import { connect } from "react-redux";
import { getAssetAllocation } from "../store/getAssetAllocation";
import { getStockAssets } from '../store/getStockAssets';
import { getStockHistory } from "../store/getStocks";
import { ChartCard } from './MacroCharts';

export class Stocks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStock: 'FB',
      messages: []
    };
    this.setStock = this.setStock.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.props.stockAssets();
    this.props.assetAllocation();
    this.props.stockHistory();
  }
  
  async handleSubmit(event) {
    event.preventDefault();
    const response = await Axios.get(event.target[0].value);
    this.setState({
      messages: [
        ...this.state.messages,
        `Updated ${response.data[0]} Stock entries`,
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
     <div className="flex">
        {this.state.messages.map( (message, index) => { return (
          <p key={index}>{message}</p>
        )})}
        <form onSubmit={this.handleSubmit} className='refreshButton'>
          <button type='submit' value="/api/refreshStockData">Refresh Stock Data</button>
        </form> 

{/* Overall Asset Table */}
      <div className="card stock">
        <div className="card-header stock-header">Allocation Overview</div>
        <table>
          <thead>
              <tr>
                  <td className="table-label allocation-a">Asset_Type</td>
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
      
     </div>
    )};
      
  }

}

const mapState = (state) => {
  return {
    stockTable: state.stockTable,
    assetTable: state.assetTable,
    stocks: state.stocks
  };
};

const mapDispatch = (dispatch) => {
  return {
    stockAssets: () => dispatch(getStockAssets()),
    assetAllocation: () => dispatch(getAssetAllocation()),
    stockHistory: () => dispatch(getStockHistory())
  };
};

export default connect(mapState, mapDispatch)(Stocks);
