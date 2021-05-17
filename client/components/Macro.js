import React from "react";
import { connect } from "react-redux";
import { getMacroData } from "../store/getMacro";
import { ChartCard } from './MacroCharts';
import Axios from 'axios';

const dropdownYears = [2015,2016,2017,2018,2019,2020]

export class Macro extends React.Component {
  constructor (props) {
    super(props);
    this.state = { 
      year: 2015,
      messages: [],
      consumerSpending: [1],
      consumerWealth: [22,24,25,26],
      governmentFinancials: [17,18,19,21],
      macroeconomic: [5,6,7,8],
      labor: [9,10],
      prices: [15,16,27],
      inflation: [12,13,20],
      stocks: [3,28]
    };
    this.setYear = this.setYear.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    await this.props.getMacro(this.state.year);
  }

  async handleSubmit(event) {
    event.preventDefault()
    const response = await Axios.get(event.target[0].value)
    this.setState({
      messages: [
        ...this.state.messages,
        `Updated ${response.data[0]} Fred entries`,
        `Updated ${response.data[1]} Quandl entries`
      ]
    }); 
    setTimeout( () => {
      this.setState({
        messages: []
      });
    }, 5000);
  }

  setYear (event) {
    this.setState( {year: event.target.value} );
    this.props.getMacro(event.target.value);
  }

  render() {
   
    if (this.props.macro[1]) {
      return (
        <div className="stock-vertical">
          <div className="update-button">
            <form onSubmit={this.handleSubmit} className='refreshButton'>
              <button type='submit' value="/api/refreshMacroData">Refresh Macro Data</button>
            </form>
            {this.state.messages.map( (message, index) => { return (
              <p key={index}>{message}</p>
            )})}  
          </div>
          <div className="select">
            <span>Select a start year: 
              <select value={this.state.year} onChange={this.setYear}>
                {dropdownYears.map( year => {return (
                  <option key={year} value={year}>{year}</option>
                )})}
              </select>  
            </span>
          </div>
          <div className="flex">
            
           

            <div className="card">
              <div className="card-header chart-header">Government Financials</div>
              {this.state.governmentFinancials.map( (chart_group, index) => {
                return (
                  <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
                )
              })}
            </div>

            <div className="card">
              <div className="card-header chart-header">Macroeconomic Indicators</div>
              {this.state.macroeconomic.map( (chart_group, index) => {
                return (
                  <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
                )
              })}
            </div>

            <div className="card">
              <div className="card-header chart-header">Labor</div>
              {this.state.labor.map( (chart_group, index) => {
                return (
                  <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
                )
              })}
            </div>

            <div className="card">
              <div className="card-header chart-header">Inflation</div>
              {this.state.inflation.map( (chart_group, index) => {
                return (
                  <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
                )
              })}
            </div>

            <div className="card">
              <div className="card-header chart-header">Consumer Wealth</div>
              {this.state.consumerWealth.map( (chart_group, index) => {
                return (
                  <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
                )
              })}
            </div>    

            <div className="card">
              <div className="card-header chart-header">Consumer Spending</div>
              {this.state.consumerSpending.map( (chart_group, index) => {
                return (
                  <ChartCard chart_group={this.props.macro[chart_group]} min="0" key={index} />
                )
              })}
            </div>

            <div className="card">
              <div className="card-header chart-header">Prices</div>
              {this.state.prices.map( (chart_group, index) => {
                return (
                  <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
                )
              })}
            </div>
            
            <div className="card">
              <div className="card-header chart-header">Stocks</div>
              {this.state.stocks.map( (chart_group, index) => {
                return (
                  <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
                )
              })}
            </div>

          </div>
        </div>
      )
    } else {
      return (<p>Data Loading...</p>)  
    } 
    
  }

}

const mapState = (state) => {
  return {
    macro: state.macro
  };
};

const mapDispatch = (dispatch) => {
  return {
    getMacro: (year) => dispatch(getMacroData(year))
  };
};

export default connect(mapState, mapDispatch)(Macro);