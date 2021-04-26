import React from "react";
import { connect } from "react-redux";
import { getBudgetAssets } from '../store/getBudgetAssets';
import { getTaxes } from '../store/getTaxes';

export class BudgetAssets extends React.Component {

  componentDidMount() {
    this.props.budgetAssets();
    this.props.getTaxData();
  }

  incomeExpenseReducer (type) {
    if (this.props.budget.length === 0) { return 0 } 
    else {
      return this.props.budget.reduce( (acc, curVal) => {
        return (acc + ((curVal.item_type === type) ? curVal.budget : 0))
      },0) 
    }
  }  
  
  taxReducer () {
    if (this.props.taxes.length === 0) { return 0 } 
    return this.props.taxes.reduce( (acc, curVal) => {
      return (acc + curVal[1]) 
    }, 0)
  }
  
  netSavings () {
    return this.incomeExpenseReducer("income cash") - this.incomeExpenseReducer("expense")*12 - this.taxReducer()
  }

  render() {
   
    return (
     <div className="flex">

{/* Income Table */}
      <div className="card">
        <div className="card-header">{"Income & Savings"}</div>
        <table>
          <thead>
              <tr>
                  <td className="table-label">Income Type</td>
                  <td className="numbers">Value</td>
              </tr>
          </thead>
          <tbody>
            {this.props.budget.map( (budgetEntry) => {
              if (budgetEntry.item_type === 'income cash') { return (
                  <tr key = {budgetEntry.activity}>
                    <td>{budgetEntry.activity}</td>
                    <td className="numbers">{new Intl.NumberFormat("en-US", { 
                      style: "currency", 
                      currency: "USD", 
                      maximumFractionDigits: 0 
                    }).format(budgetEntry.budget)}</td>
                  </tr> 
              )};
            })}
            <tr className="total">
                <td className="table-label">Total</td>
                <td className="numbers">
                  {new Intl.NumberFormat("en-US", { 
                      style: "currency", 
                      currency: "USD", 
                      maximumFractionDigits: 0 
                    }).format(
                      this.incomeExpenseReducer("income cash")
                  )}
                </td>
            </tr>
            <tr className="total-savings">
                    <td className="table-label">Savings</td>
                    <td className="numbers"> {new Intl.NumberFormat("en-US", { 
                        style: "currency", 
                        currency: "USD", 
                        maximumFractionDigits: 0 
                      }).format(
                      this.netSavings() 
                    )}</td>
            </tr>         
          </tbody>
        </table>
     
      </div>

{/* Expenses Table */}
      <div className="card">
      <div className="card-header">Monthly Expenses</div>
        <table>
          <thead>
              <tr>
                  <td className="table-label">Expense Item</td>
                  <td className="numbers">Budget</td>
              </tr>
          </thead>
          <tbody>
            {this.props.budget.map( (budgetEntry) => {
              if (budgetEntry.item_type === 'expense') { return (
                  <tr key = {budgetEntry.activity}>
                    <td className="table-label">{budgetEntry.activity}</td>
                    <td className="numbers">{new Intl.NumberFormat("en-US", { 
                      style: "currency", 
                      currency: "USD", 
                      maximumFractionDigits: 0 
                    }).format(budgetEntry.budget)}</td>
                  </tr> 
              )}
            })}
            <tr className="total">
                <td className="table-label">Monthly Total</td>
                <td className="numbers">
                  {new Intl.NumberFormat("en-US", { 
                      style: "currency", 
                      currency: "USD", 
                      maximumFractionDigits: 0 
                    }).format(
                      this.incomeExpenseReducer("expense"), 0
                    )}
                </td>
            </tr>
            <tr className="total">
                <td className="table-label">Yearly Total</td>
                <td className="numbers">
                  {new Intl.NumberFormat("en-US", { 
                      style: "currency", 
                      currency: "USD", 
                      maximumFractionDigits: 0 
                    }).format(
                      this.incomeExpenseReducer("expense")*12
                  )}
                </td>
            </tr>                    
          </tbody>
        </table>
      </div>

  {/* Income Taxes Table */}
      <div className="card">
      <div className="card-header">Taxes</div>
        <table>
          <thead>
              <tr>
                  <td className="table-label">Tax Type</td>
                  <td className="numbers">Value</td>
              </tr>
          </thead>
          <tbody>
            {this.props.taxes.map( (tax) => { return (
                  <tr key = {tax[0]}>
                    <td className="table-label">{tax[0]}</td>
                    <td className="numbers">{new Intl.NumberFormat("en-US", { 
                      style: "currency", 
                      currency: "USD", 
                      maximumFractionDigits: 0 
                    }).format(tax[1])}</td>
                  </tr> 
            )})}
            <tr className="total">
                <td className="table-label">Total</td>
                <td className="numbers">
                  {new Intl.NumberFormat("en-US", { 
                      style: "currency", 
                      currency: "USD", 
                      maximumFractionDigits: 0 
                    }).format(
                      this.taxReducer()
                  )}
                </td>
            </tr>         
          </tbody>
        </table>
      </div>

{/* Overall Asset Table */}
      <div className="card">
      <div className="card-header">Asset Snapshot</div>
        <table>
          <thead>
              <tr>
                  <td>Asset Type</td>
                  <td className="table-label">Account Type</td>
                  <td className="numbers">Value</td>
              </tr>
          </thead>
          <tbody>
            {this.props.assets.map( (assetEntry, index) => { return (
              <tr key = {index}>
                <td>{assetEntry.asset_type}</td>
                <td className="table-label">{assetEntry.account_type}</td>
                <td className="numbers">{new Intl.NumberFormat("en-US", { 
                      style: "currency", 
                      currency: "USD",
                      currencySign: "accounting", 
                      maximumFractionDigits: 0 
                }).format(assetEntry.value)}</td>
              </tr> 
            )})}
            <tr className="total">
                <td>Total</td>
                <td className="table-label"></td>
                <td className="numbers">
                  {new Intl.NumberFormat("en-US", { 
                      style: "currency", 
                      currency: "USD", 
                      maximumFractionDigits: 0 
                    }).format( this.props.assets.reduce( (acc, curVal) => {return (acc + (curVal.value))}, 0) 
                  )}
                </td>
            </tr>         
          </tbody>
        </table>
      </div>

     </div>
    );
  
  }

}

const mapState = (state) => {
  return {
    budget: state.budget,
    assets: state.assets,
    taxes: state.taxes,
  };
};

const mapDispatch = (dispatch) => {
  return {
    budgetAssets: () => dispatch(getBudgetAssets()),
    getTaxData: () => dispatch(getTaxes())
  };
};

export default connect(mapState, mapDispatch)(BudgetAssets);
