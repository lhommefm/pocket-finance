const chalk = require('chalk');
const { db } = require('./index')

// get budget assumption settings
const getBudgetAssumptions = async (user_id) => {
    try {
      const res = await db.query(`
        SELECT id, activity, budget, item_type, ticker, person
        FROM budget_assumptions 
        WHERE user_id = '${user_id}'
        ORDER BY item_type, budget DESC, activity
      `); 
    //   console.log(chalk.blue('getBudgetAssumptions ==> ', JSON.stringify(res.rows)));  
      return(res.rows)
    } catch (error) {
      console.log(chalk.red('getBudgetAssumptions error ==>', error));
      return('getBudgetAssumptions error');
    }
}

// get asset assumption setttings
const getAssetsAssumptions = async (user_id) => {
    try {
      const res = await db.query(`
        SELECT id, asset_type, account_type, value, interest_rate 
        FROM cash_loan_assets
        WHERE user_id = '${user_id}'
        ORDER BY asset_type, value DESC
      `); 
    //   console.log(chalk.blue('getAssetsAssumptions ==> ', JSON.stringify(res.rows)));  
      return(res.rows)
    } catch (error) {
      console.log(chalk.red('getAssetsAssumptions error ==>', error));
      return('getAssetsAssumptions error');
    }
}

// get tax settings
const getTaxAssumptions = async (user_id) => {
  try {
    const res = await db.query(`
      SELECT filing_status, state, city
      FROM tax_settings
      WHERE user_id = '${user_id}'
    `); 
    return(res.rows)
  } catch (error) {
    console.log(chalk.red('getTaxAssumptions error ==>', error));
    return('getTaxAssumptions error');
  }
}



module.exports = { getBudgetAssumptions, getAssetsAssumptions, getTaxAssumptions }