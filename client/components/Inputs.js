import React from "react";
import { connect } from "react-redux";
import { getStockAssets } from '../store/getStockAssets';
import axios from 'axios'

export class Inputs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockListToUpdate: []
    };
    this.updateStock = this.updateStock.bind(this)
    this.updateDatabase = this.updateDatabase.bind(this)
  }
  
  async componentDidMount() {
    await this.props.stockAssets();
    this.setState({stockListToUpdate: JSON.parse(JSON.stringify([...this.props.stockTable]))})
  }
  
  updateStock (event) {
    if (
      (event.target.name === "quantity" && event.target.value.length < 7) ||
      (event.target.name === "ticker" && event.target.value.length < 6) ||
      (event.target.name === "account_type")
    ) {
      let stateCopy = [...this.state.stockListToUpdate];
      stateCopy[event.target.getAttribute('index')][event.target.name] = event.target.value;
      this.setState({stockListToUpdate: stateCopy})
    } else {
      console.log(typeof(event.target.value))
      alert("invalid data entry")
    }
  }

  updateDatabase () {
    let changedArray = []
    for (let i = 0; i < this.props.stockTable.length; i++) {
      console.log(JSON.stringify(this.props.stockTable[i]) === JSON.stringify(this.state.stockListToUpdate[i]))
      if (JSON.stringify(this.props.stockTable[i]) != JSON.stringify(this.state.stockListToUpdate[i])) {
        changedArray.push(this.state.stockListToUpdate[i])
      }
    }
    axios.post('/api/updateStock', changedArray);
  }

  render() {
   return (
     <div className="flex">

{/* Overall Stock Table */}
      <div className="card">
        <div className="card-header">Update Existing Stock Info</div>
            {this.state.stockListToUpdate.map( (stockEntry, index) => { return (
              <form key={index}>
                <select index={index} name="account_type" value={stockEntry.account_type} onChange={this.updateStock}>
                  <option value="Individual">Individual</option>
                  <option value="401K">401K</option>
                  <option value="IRA">IRA</option>
                  <option value="Roth IRA">Roth IRA</option>
                </select>
                <input index={index} type="text" name="ticker" value={stockEntry.ticker} onChange={this.updateStock} />
                <input index={index} type="text" name="quantity" value={stockEntry.quantity} onChange={this.updateStock} />
              </form> 
            )})}
            <input type="submit" onClick={this.updateDatabase} />
      </div>
      
     </div>
  )};

}

const mapState = (state) => {
  return {
    stockTable: state.stockTable,
  };
};

const mapDispatch = (dispatch) => {
  return {
    stockAssets: () => dispatch(getStockAssets()),
  };
};

export default connect(mapState, mapDispatch)(Inputs);
