const chalk = require('chalk');
const { db } = require('./index')

// get stock information
const updateStocks = async (data, user_id) => {
  console.log('number of changed rows ==>',data.length)
  for (let i = 0; i<data.length; i++) {
    try {
      const res = await db.query(`
        UPDATE stock_assets
        SET account_type = '${data[i].account_type}', ticker = '${data[i].ticker}', quantity = '${data[i].quantity}'
        WHERE id = '${data[i].id}' 
      `); 
    } catch (error) {
      console.log(chalk.red('updateStocks id, error ==>', data[i].id, error));
    }
  }
 
}

module.exports = { updateStocks }