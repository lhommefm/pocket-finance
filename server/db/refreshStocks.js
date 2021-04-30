const chalk = require('chalk');
const { db } = require('./index')
const axios = require('axios');

// refresh stock data in the database
const refreshStocks = async (user_id) => {
    const stockList = await getTicker(user_id);
    const stockData = await getStockData(stockList);
    const result = addStockDataDatabase(stockData);
    return result.rowCount
}

// get unique ticker list from the database
const getTicker = async (user_id) => {
  try {
    const res = await db.query(`
      SELECT ticker
      FROM stock_unique_list
    `); 
    console.log(chalk.yellow('getTicker example row ==> ', JSON.stringify(res.rows[0])));  
    return(res.rows);
  } catch (error) {
    console.log(chalk.red('getTicker error ==>', error));
  }
}

// get stock history data from Marketstack and format for database
const getStockData = async function (stocks) {
  
  // format stock list to an array of comma seperated strings, with each string containing 3 symbols
  let stockStringArray = [];
  while (stocks.length > 0) {
    if (stocks.length >= 3) {
      stockStringArray.push(`${stocks[0].ticker},${stocks[1].ticker},${stocks[2].ticker}`)
    } else if (stocks.length === 2) {
      stockStringArray.push(`${stocks[0].ticker},${stocks[1].ticker}`);
    } else if (stocks.length === 1) {
      stockStringArray.push(`${stocks[0].ticker}`);
    };
    stocks = stocks.slice(3)
  }
  // console.log(chalk.yellow('last string ==>',stockStringArray[stockStringArray.length-1]))
  // console.log(chalk.yellow('stocks list array for API, first index  ==>',stockStringArray[0]))

  // pull data from the API: loop through each set of 3 tickers, and loop through each row of the response to format for SQL
  let stockDataString = ""
  for (let i = 0; i < stockStringArray.length; i++) {
    const URL = `http://api.marketstack.com/v1/eod?access_key=${process.env.MARKETSTACK_API_KEY}&symbols=${stockStringArray[i]}&limit=1000&date_from=2021-01-01`
    // console.log(chalk.yellow('URL for Marketstack API ==> ', URL))

    try {
      const marketStackObj = await axios.get(URL);
      // console.log(chalk.yellow('first marketStackAPI response entry ==> ', JSON.stringify(marketStackObj.data.data[0])));
      let rawStockData = marketStackObj.data.data;
      for (let j = 0; j < rawStockData.length; j++) {
        stockDataString += `('${rawStockData[j].symbol}','${rawStockData[j].date}','${rawStockData[j].adj_close}'),`;
      };
    } catch (error) {
      console.log(chalk.red('marketStack API error ==>', error));    
    }

  }
  stockDataString = stockDataString.slice(0,stockDataString.length-1)
  // console.log(chalk.yellow('data string ==>', stockDataString))  
  return stockDataString
}

// upload stock data to database
const addStockDataDatabase = async (stockDataString) => {
  try {
    const res = await db.query(`
    INSERT INTO stock_history (ticker, date, price) 
    VALUES ${stockDataString}
    ON CONFLICT (ticker, date) DO NOTHING
    `); 
    // console.log(chalk.blue('addStockDataDatabase ==> ', JSON.stringify(res)));
    return(res);
  } catch (error) {
    console.log(chalk.red('addStockDataDatabase error ==>', error));
  }    
}
  
module.exports = { refreshStocks }


// // refresh stock data in the database
// const refreshStocks = async (user_id) => {
//   const fullStockList = await getTicker(user_id);
//   const recentStockData = await getStockData(fullStockList, 1);
//   const stockDataString = recentStockData[0];
//   const tickerString = recentStockData[1];
//   const result = addStockDataDatabase(stockDataString, tickerString);
// }

// // get ticker list
// const getTicker = async (user_id) => {
//   try {
//     const res = await db.query(`
//       SELECT ticker
//       FROM stock_unique_list
//     `); 
//     console.log(chalk.yellow('getTicker example row ==> ', JSON.stringify(res.rows[0])));  
//     return(res.rows);
//   } catch (error) {
//     console.log(chalk.red('getTicker error ==>', error));
// }
// }

// // get stock history data from Marketstack and format for database
// const getStockData = async function (stocks, months=1) {

// // format stock list to a comma seperated string
// let stockString = ""
// stocks.map( (row) => stockString += `${row.ticker},` )
// stockString = stockString.slice(0,stockString.length-1)
// console.log(chalk.green('stocks list for API ==>',JSON.stringify(stockString)))

// // setup API URL structure
// let start_date = new Date();
// start_date.setMonth(start_date.getMonth()-months);
// const date = start_date.toISOString().substr(0, 10);
// const URL = `http://api.marketstack.com/v1/eod?access_key=${process.env.MARKETSTACK_API_KEY}&symbols=${stockString}&limit=1000&date_from=${date}`
// console.log(chalk.yellow('URL for Marketstack API ==> ', URL))

// // pull data from the API
// let rawStockData = []
// try {
//   const marketStackObj = await axios.get(URL);
//   console.log(chalk.yellow('first marketStackAPI response entry ==> ', JSON.stringify(marketStackObj.data.data[0])))
//   rawStockData = marketStackObj.data.data
// } catch (error) {
//   console.log(chalk.red('marketStack API error ==>', error));    
// }

// // format data from the API to SQL string
// let stockDataString = ""
// let tickerArr = []
// for (let i = 0; i < rawStockData.length; i++) {
//   stockDataString += `('${rawStockData[i].symbol}','${rawStockData[i].date}','${rawStockData[i].adj_close}'),`;
//   if (tickerArr.includes(rawStockData[i].symbol) === false) {tickerArr.push(`${rawStockData[i].symbol}`)};
// };
// stockDataString = stockDataString.slice(0,stockDataString.length-1);
// tickerString = `'${tickerArr.join("','")}'`;
// console.log(chalk.yellow('data string ==>', stockDataString))
// console.log(chalk.yellow('ticker string ==>', tickerString))
// return [ stockDataString, tickerString ]
// }