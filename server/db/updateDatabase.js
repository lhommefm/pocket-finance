const chalk = require('chalk');
const { db } = require('./index')

// update stock information
const updateStocks = async (data, user_id) => {
  // console.log('number of changed rows ==>',data.length)
  for (let i = 0; i<data.length; i++) {
    try {
      const res = await db.query(`
        UPDATE stock_assets
        SET 
          account_type = '${data[i].account_type}', 
          ticker = '${data[i].ticker.slice(0,7)}', 
          quantity = '${data[i].quantity.slice(0,8)}'
        WHERE id = '${data[i].id}' AND user_id = '${user_id}' 
      `); 
      return('Success');
    } catch (error) {
      console.log(chalk.red('updateStocks id, error ==>', data[i].id, error));
      return(data[i].id, error);
    }
  }
 
}

// update budget information
const updateBudget = async (data, user_id) => {
  // console.log('number of changed rows ==>',data.length)
  for (let i = 0; i<data.length; i++) {
    try {
      console.log('ticker ==>', data[i].ticker)
      const res = await db.query(`
        UPDATE budget_assumptions
        SET 
          activity = '${data[i].activity}', 
          budget = '${data[i].budget}', 
          item_type = '${data[i].item_type}',
          ticker = ${!data[i].ticker ? null : `'${data[i].ticker}'`}
        WHERE id = '${data[i].id}' AND user_id = '${user_id}' 
      `); 
      return('Success');
    } catch (error) {
      console.log(chalk.red('updateBudget id, error ==>', data[i].id, error));
      return(data[i].id, error);
    }
  }
}

// update asset information
const updateAssets = async (data, user_id) => {
  // console.log('number of changed rows ==>',data.length)
  for (let i = 0; i<data.length; i++) {
    try {
      const res = await db.query(`
        UPDATE cash_loan_assets
        SET 
          asset_type = '${data[i].asset_type}', 
          account_type = '${data[i].account_type}', 
          value = '${data[i].value}',
          interest_rate = '${data[i].interest_rate}'
        WHERE id = '${data[i].id}' AND user_id = '${user_id}' 
      `); 
      return('Success');
    } catch (error) {
      console.log(chalk.red('updateAsset id, error ==>', data[i].id, error));
      return(data[i].id, error);
    }
  }
}

// update tax information
const updateTaxSettings = async (data, user_id) => {
  // console.log('number of changed rows ==>',data.length)
  for (let i = 0; i<data.length; i++) {
    try {
      const res = await db.query(`
        UPDATE tax_settings
        SET 
          filing_status = '${data[i].filing_status}', 
          state = '${data[i].state}'
          city = '${data[i].city}'
        WHERE user_id = '${user_id}' 
      `); 
      return('Success');
    } catch (error) {
      console.log(chalk.red('updateTaxSettings id, error ==>', data[i].id, error));
      return(data[i].id, error);
    }
  }
}


// delete an entry
const deleteEntry = async (id, user_id, table) => {
  // console.log('number of changed rows ==>',data.length)
  try {
    const res = await db.query(`
      DELETE FROM ${table}
      WHERE user_id = '${user_id}' AND id = '${id}' 
    `); 
    return('Success');
  } catch (error) {
    console.log(chalk.red('delete id, error ==>', id, error));
    return(id, error);
  }
}

module.exports = { updateStocks, updateBudget, updateAssets, updateTaxSettings, deleteEntry }