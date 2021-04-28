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
      taxSettingsToUpdate: []
    };
    this.updateState = this.updateState.bind(this);
    this.updateDatabase = this.updateDatabase.bind(this)
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

  updateDatabase (initial, updated, api) {
    let changedArray = []
    for (let i = 0; i < initial.length; i++) {
      console.log(JSON.stringify(initial[i]) === JSON.stringify(updated[i]))
      if (JSON.stringify(initial[i]) != JSON.stringify(updated[i])) {
        changedArray.push(updated[i])
      }
    }
    axios.post(api, changedArray);
  }

  render() {
   return (
     <div className="flex">

{/* Overall Stock Table */}
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
                <input index={index} type="text" name="quantity" value={stockEntry.quantity} onChange={(event) => this.updateState(event, 'stockListToUpdate')} />
              </form> 
            )})}
            <input type="submit" onClick={() => this.updateDatabase(
              this.props.stockTable,
              this.state.stockListToUpdate,
              '/api/updateStock'
            )} />
      </div>

{/* Overall Budget Table */}
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
              </form> 
            )})}
             <input type="submit" onClick={() => this.updateDatabase(
              this.props.inputs[0],
              this.state.budgetToUpdate,
              '/api/updateBudget'
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
