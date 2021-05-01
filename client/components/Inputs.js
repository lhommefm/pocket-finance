import React from "react";
import { connect } from "react-redux";
import { getStockAssets } from '../store/getStockAssets';
import { getInputSettings } from '../store/getInputSettings';
import axios from 'axios'

export class Inputs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockListToUpdate: [],
      budgetToUpdate: [],
      assetsToUpdate: [],
      taxSettingsToUpdate: [],
      newStock: [{account_type: "Individual", ticker: "", asset_class: "Domestic Stocks", quantity: 0}],
      newAsset: [{asset_type: "Cash", account_type: "", value: 0, interest_rate: 0}],
      newBudget: [{activity: "", budget: 0, item_type: "expense", ticker: ""}]
    };
    this.updateState = this.updateState.bind(this);
    this.updateDatabase = this.updateDatabase.bind(this);
    this.deleteItem = this.deleteItem.bind(this)
  }
  
  async componentDidMount() {
    await Promise.all([
      this.props.stockAssets(),
      this.props.getInputs()
    ]);
    this.setState({
      stockListToUpdate: JSON.parse(JSON.stringify([...this.props.stockTable])),
      budgetToUpdate: JSON.parse(JSON.stringify([...this.props.inputs[0]])),
      assetsToUpdate: JSON.parse(JSON.stringify([...this.props.inputs[1]])),
      taxSettingsToUpdate: JSON.parse(JSON.stringify([...this.props.inputs[2]]))
    })
  }

  updateState (event, stateName) {
    let stateCopy = [...this.state[stateName]];
    stateCopy[event.target.getAttribute('index')][event.target.name] = event.target.value;
    this.setState({[stateName]: stateCopy})
  }

  async updateDatabase (initial, updated, api, type) {
    let changedArray = []
    for (let i = 0; i < updated.length; i++) {
      // console.log(JSON.stringify(initial[i]) === JSON.stringify(updated[i]))
      if (JSON.stringify(initial[i]) != JSON.stringify(updated[i])) {
        changedArray.push(updated[i])
      }
    }
    await axios.post(api, changedArray);
    this.refreshInputs(type)  
  }

  async deleteItem (id, db, event, type) {
    event.preventDefault();
    await axios.delete('/api/update/delete', {data: {id, db}});
    this.refreshInputs(type)
  }

  async insertDatabase (newEntry, api, key, type) {
    await axios.post(api, newEntry);
    const defaults = {
      'newStock': [{account_type: "Individual", ticker: "", asset_class: "Domestic Stocks",  quantity: 0}],
      'newAsset': [{asset_type: "Cash", account_type: "", value: 0, interest_rate: 0}],
      'newBudget': [{activity: "", budget: 0, item_type: "Expense", ticker: ""}]
    };
    if (key === 'newStock') {
      this.setState({
        [key]: defaults[key]
      });
    }
    if (key === 'newAsset') {
      this.setState({
        [key]: defaults[key]
      });
    }
    if (key === 'newBudget') {
      this.setState({
        [key]: defaults[key]
      });
    }
    await this.props.getInputs();
    this.refreshInputs(type)  
  }

  async refreshInputs (type) {
    if (type === 'stock') {
      await this.props.stockAssets();
      this.setState({
        stockListToUpdate: JSON.parse(JSON.stringify([...this.props.stockTable])),
      });
    } else {
      await this.props.getInputs();
    }
    if (type === 'asset') {
      this.setState({
        assetsToUpdate: JSON.parse(JSON.stringify([...this.props.inputs[1]])),
      });
    };
    if (type === 'budget') {
      this.setState({
        budgetToUpdate: JSON.parse(JSON.stringify([...this.props.inputs[0]])),
      });
    };
    if (type === 'tax') {
      this.setState({
        taxSettingsToUpdate: JSON.parse(JSON.stringify([...this.props.inputs[2]])),
      });
    }
  }

  render() {
   return (
     <div className="flex">

{/* Stock Table */}
      <div className="card">
        <div className="card-header">Update Existing Stock Info</div>
            {this.state.stockListToUpdate.map( (stockEntry, index) => { return (
              <form key={index}>
                <select index={index} name="account_type" value={stockEntry.account_type} onChange={(event) => this.updateState(event, 'stockListToUpdate')}>
                  <option value="Individual">Individual</option>
                  <option value="401K">401K</option>
                  <option value="IRA">IRA</option>
                  <option value="Roth IRA">Roth IRA</option>
                </select>
                <input index={index} type="text" name="ticker" value={stockEntry.ticker} onChange={(event) => this.updateState(event, 'stockListToUpdate')} />
                <select index={index} name="asset_class" value={stockEntry.asset_class} onChange={(event) => this.updateState(event, 'stockListToUpdate')}>
                  <option value="Commodity Stocks">Commodity Stocks</option>
                  <option value="International Stocks">International Stocks</option>
                  <option value="Domestic Stocks">Domestic Stocks</option>
                  <option value="Bonds">Bonds</option>
                  <option value="REIT Stocks">REIT Stocks</option>
                </select>
                <input index={index} type="text" name="quantity" value={stockEntry.quantity} onChange={(event) => this.updateState(event, 'stockListToUpdate')} />
                <input type="submit" value="X" onClick={(event) => this.deleteItem(stockEntry.id, 'stock_assets', event, 'stock')} />
              </form> 
            )})}
            <input type="submit" value="Update Stock Ownership" onClick={() => this.updateDatabase(
              this.props.stockTable,
              this.state.stockListToUpdate,
              '/api/update/updateStock',
              'stock'
            )} />
            <form>
              <select index="0" name="account_type" value={this.state.newStock[0].account_type} onChange={(event) => this.updateState(event, 'newStock')}>
                <option value="Individual">Individual</option>
                <option value="401K">401K</option>
                <option value="IRA">IRA</option>
                <option value="Roth IRA">Roth IRA</option>
              </select>
              <input index="0" type="text" name="ticker" value={this.state.newStock[0].ticker} onChange={(event) => this.updateState(event, 'newStock')} />
              <select index="0" name="asset_class" value={this.state.newStock[0].asset_class} onChange={(event) => this.updateState(event, 'newStock')}>
                  <option value="Commodity Stocks">Commodity Stocks</option>
                  <option value="International Stocks">International Stocks</option>
                  <option value="Domestic Stocks">Domestic Stocks</option>
                  <option value="Bonds">Bonds</option>
                  <option value="REIT Stocks">REIT Stocks</option>
                </select>
              <input index="0" type="text" name="quantity" value={this.state.newStock[0].quantity} onChange={(event) => this.updateState(event, 'newStock')} />
            </form> 
            <input type="submit" value="Add New Stock" onClick={() => this.insertDatabase(
            this.state.newStock[0],
            '/api/update/insertStock',
            'newStock',
            'stock'
            )} /> 
      </div>

{/* Budget Table */}
      <div className="card">
        <div className="card-header">Update Budget</div>
            {this.state.budgetToUpdate.map( (budgetEntry, index) => { return (
              <form key={index}>
                <span>{budgetEntry.activity}</span>
                <input index={index} type="text" name="budget" value={budgetEntry.budget} onChange={(event) => this.updateState(event, 'budgetToUpdate')} />
                <select index={index} name="item_type" value={budgetEntry.item_type} onChange={(event) => this.updateState(event, 'budgetToUpdate')}>
                  <option value="expense">Expense</option>
                  <option value="income stock">Income: stocks</option>
                  <option value="income cash">Income: cash</option>
                  <option value="income rate">Income: rate</option>
                  <option value="other">Other</option>
                </select>
                <input index={index} type="text" name="ticker" value={budgetEntry.ticker || ''} onChange={(event) => this.updateState(event, 'budgetToUpdate')} />
                <input type="submit" value="X" onClick={(event) => this.deleteItem(budgetEntry.id, 'budget_assumptions', event, 'budget')} />
              </form> 
            )})}
             <input type="submit" value="Update Budget Item"  onClick={() => this.updateDatabase(
              this.props.inputs[0],
              this.state.budgetToUpdate,
              '/api/update/updateBudget',
              'budget'
            )} />
            <form>
              <input index="0" type="text" name="activity" value={this.state.newBudget[0].activity} onChange={(event) => this.updateState(event, 'newBudget')} />
              <input index="0" type="text" name="budget" value={this.state.newBudget[0].budget} onChange={(event) => this.updateState(event, 'newBudget')} />
              <select index="0" name="item_type" value={this.state.newBudget[0].item_type} onChange={(event) => this.updateState(event, 'newBudget')}>
                  <option value="expense">Expense</option>
                  <option value="income stock">Income: stocks</option>
                  <option value="income cash">Income: cash</option>
                  <option value="income rate">Income: rate</option>
                  <option value="other">Other</option>
              </select>
              <input index="0" type="text" name="ticker" value={this.state.newBudget[0].ticker} onChange={(event) => this.updateState(event, 'newBudget')} />
            </form>
            <input type="submit" value="Add New Budget Item" onClick={() => this.insertDatabase(
            this.state.newBudget[0],
            '/api/update/insertBudget',
            'newBudget',
            'budget'
            )} /> 
      </div>

{/* Assets Table */}
<div className="card">
        <div className="card-header">Update Assets</div>
            {this.state.assetsToUpdate.map( (assetEntry, index) => { return (
              <form key={index}>
                 <select index={index} name="asset_type" value={assetEntry.asset_type} onChange={(event) => this.updateState(event, 'assetsToUpdate')}>
                  <option value="Cash">Cash</option>
                  <option value="Loan">Loan</option>
                </select>
                <input index={index} type="text" name="account_type" value={assetEntry.account_type} onChange={(event) => this.updateState(event, 'assetsToUpdate')} />
                <input index={index} type="text" name="value" value={assetEntry.value || 0} onChange={(event) => this.updateState(event, 'assetsToUpdate')} />
                <input index={index} type="text" name="interest_rate" value={assetEntry.interest_rate || 0} onChange={(event) => this.updateState(event, 'assetsToUpdate')} />
                <input type="submit" value="X" onClick={(event) => this.deleteItem(assetEntry.id, 'cash_loan_assets', event, 'asset')} />
              </form> 
            )})}
             <input type="submit" value="Update Asset Info" onClick={() => this.updateDatabase(
              this.props.inputs[1],
              this.state.assetsToUpdate,
              '/api/update/updateAssets',
              'asset'
            )} />
            <form>
              <select index="0" name="asset_type" value={this.state.newAsset[0].asset_type} onChange={(event) => this.updateState(event, 'newAsset')}>
                <option value="Cash">Cash</option>
                <option value="Loan">Loan</option>
              </select>
              <input index="0" type="text" name="account_type" value={this.state.newAsset[0].account_type} onChange={(event) => this.updateState(event, 'newAsset')} />
              <input index="0" type="text" name="value" value={this.state.newAsset[0].value} onChange={(event) => this.updateState(event, 'newAsset')} />
              <input index="0" type="text" name="interest_rate" value={this.state.newAsset[0].interest_rate} onChange={(event) => this.updateState(event, 'newAsset')} />
            </form>
            <input type="submit" value="Add New Line Item" onClick={() => this.insertDatabase(
            this.state.newAsset[0],
            '/api/update/insertAssets',
            'newAsset',
            'asset'
              )} /> 
      </div>

{/* Tax Settings */}
      <div className="card">
        <div className="card-header">Update Tax Settings</div>  
          {!this.state.taxSettingsToUpdate[0] ? "Data loading" : 
            <form>
              <select index="0" name="filing_status" value={this.state.taxSettingsToUpdate[0].filing_status} onChange={(event) => this.updateState(event, 'taxSettingsToUpdate')}>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
              <select index="0" name="state" value={this.state.taxSettingsToUpdate[0].state || ""} onChange={(event) => this.updateState(event, 'taxSettingsToUpdate')}>
                <option value="CA">CA</option>
              </select>
            </form>
          }    
        <input type="submit" onClick={() => this.updateDatabase(
          this.props.inputs[2],
          this.state.taxSettingsToUpdate,
          '/api/update/updateTaxSettings',
          'tax'
        )} />
      </div>

     </div>
  )};

}

const mapState = (state) => {
  return {
    stockTable: state.stockTable,
    inputs: state.inputs
  };
};

const mapDispatch = (dispatch) => {
  return {
    stockAssets: () => dispatch(getStockAssets()),
    getInputs: () => dispatch(getInputSettings())
  };
};

export default connect(mapState, mapDispatch)(Inputs);
