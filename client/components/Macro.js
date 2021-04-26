import React from "react";
import { connect } from "react-redux";
import { getMacroData } from "../store/getMacro";
import { ChartCard } from './MacroCharts';

const dropdownYears = [2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020]

export class Macro extends React.Component {
  constructor (props) {
    super(props);
    this.state = { 
      year: 2014,
      consumerSpending: [1],
      consumerWealth: [22,24,25],
      governmentFinancials: [17,18,19,21],
      macroeconomic: [5,6,7,8],
      labor: [9,10],
      prices: [15,16,27],
      inflation: [12,13,20],
      stocks: [2,3,28]
    };
    this.setYear = this.setYear.bind(this)
  }

  componentDidMount() {
    this.props.getMacro(this.state.year);
  }

  setYear (event) {
    this.setState( {year: event.target.value} );
    this.props.getMacro(event.target.value);
  }

  render() {
   
    if (this.props.macro[1]) {
      return (
        <div className="flex">
          
          <div className="select">
            <span>Select a start year: </span>
            <select value={this.state.year} onChange={this.setYear}>
              {dropdownYears.map( year => {return (
                <option key={year} value={year}>{year}</option>
              )})}
            </select>  
          </div>

          <div className="card">
            <div className="card-header">Government Financials</div>
            {this.state.governmentFinancials.map( (chart_group, index) => {
              return (
                <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
              )
            })}
          </div>

          <div className="card">
            <div className="card-header">Macroeconomic Indicators</div>
            {this.state.macroeconomic.map( (chart_group, index) => {
              return (
                <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
              )
            })}
          </div>

          <div className="card">
            <div className="card-header">Labor</div>
            {this.state.labor.map( (chart_group, index) => {
              return (
                <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
              )
            })}
          </div>

          <div className="card">
            <div className="card-header">Inflation</div>
            {this.state.inflation.map( (chart_group, index) => {
              return (
                <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
              )
            })}
          </div>

          <div className="card">
            <div className="card-header">Prices</div>
            {this.state.prices.map( (chart_group, index) => {
              return (
                <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
              )
            })}
          </div>

          <div className="card">
            <div className="card-header">Consumer Spending</div>
            {this.state.consumerSpending.map( (chart_group, index) => {
              return (
                <ChartCard chart_group={this.props.macro[chart_group]} min="0" key={index} />
              )
            })}
          </div>

          <div className="card">
            <div className="card-header">Consumer Wealth</div>
            {this.state.consumerWealth.map( (chart_group, index) => {
              return (
                <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
              )
            })}
          </div>  
         
           
          <div className="card">
            <div className="card-header">Stocks</div>
            {this.state.stocks.map( (chart_group, index) => {
              return (
                <ChartCard chart_group={this.props.macro[chart_group]} key={index} />
              )
            })}
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