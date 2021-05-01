const chalk = require('chalk');
const { db } = require('./index')

// insert new stock 
const insertStock = async (data, user_id) => {
  // console.log('number of changed rows ==>',data.length)
    try {
      const res = await db.query(`
        INSERT INTO stock_assets (user_id, account_type, ticker, asset_class, quantity)
        VALUES (${user_id}, '${data.account_type}', '${data.ticker}', '${data.asset_class}', '${data.quantity}')  
      `); 
      return('Success');
    } catch (error) {
      console.log(chalk.red('insertStocks error ==>', error));
      return(error);
    }
}

// insert budget line item
const insertBudget = async (data, user_id) => {
  // console.log('number of changed rows ==>',data.length)  
  try {
      const res = await db.query(`
      INSERT INTO budget_assumptions (user_id, activity, budget, item_type, ticker)
      VALUES (${user_id}, '${data.activity}', '${data.budget}', '${data.item_type}', ${!data.ticker ? null : `'${data.ticker}'`}) 
    `); 
    return('Success');
  } catch (error) {
    console.log(chalk.red('insertBudget error ==>', error));
    return(error);
  }
}

// insert asset line item
const insertAssets = async (data, user_id) => {
  // console.log('number of changed rows ==>',data.length)
  console.log(data)
  try {
    const res = await db.query(`
      INSERT INTO cash_loan_assets (user_id, asset_type, account_type, value, interest_rate)
      VALUES (${user_id}, '${data.asset_type}', '${data.account_type}', '${data.value}', '${data.interest_rate}')
    `); 
    return('Success');
  } catch (error) {
    console.log(chalk.red('insertAsset error ==>', error));
    return(error);
  }
}

module.exports = { insertStock, insertBudget, insertAssets }