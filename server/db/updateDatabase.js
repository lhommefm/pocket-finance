const chalk = require('chalk');
const { db } = require('./index')

// get stock information
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
    } catch (error) {
      console.log(chalk.red('updateStocks id, error ==>', data[i].id, error));
    }
  }
 
}

// get budget information
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
    } catch (error) {
      console.log(chalk.red('updateBudget id, error ==>', data[i].id, error));
    }
  }
 
}

module.exports = { updateStocks, updateBudget }