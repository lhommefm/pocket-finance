const chalk = require('chalk');
const { db } = require('./index')
const axios = require('axios');

// refresh stock data in the database
const refreshStocks = async (user_id) => {
    const stockList = await getTicker(user_id);
    const stockData = await getStockData(stockList);
    const result = await addStockDataDatabase(stockData);
    return result.rowCount
}

// get unique ticker list from the database
const getTicker = async (user_id) => {
  try {
    const res = await db.query(`
      SELECT ticker
      FROM stock_unique_list
    `); 
    // console.log(chalk.yellow('getTicker example row ==> ', JSON.stringify(res.rows[0])));  
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
  let stockDataString = "";
  let missingTickers = [];
  for (let i = 0; i < stockStringArray.length; i++) {
    const marketURL = `http://api.marketstack.com/v1/eod?access_key=${process.env.MARKETSTACK_API_KEY}&symbols=${stockStringArray[i]}&limit=1000&date_from=2021-01-01`
    // console.log(chalk.yellow('URL for Marketstack API ==> ', marketURL))

    try {
      const marketStackObj = await axios.get(marketURL);
      // console.log(chalk.yellow('first marketStackAPI response entry ==> ', JSON.stringify(marketStackObj.data.data[0])));
      let rawStockData = marketStackObj.data.data;
      // console.log(chalk.yellow("raw stock data ==>", JSON.stringify(rawStockData)))
      if (rawStockData.length === 0) {
        missingTickers.push(stockStringArray[i]); 
        // console.log(chalk.yellow('missing tickers ==>', JSON.stringify(missingTickers)))
      }
      
      let submittedTickers = stockStringArray[i].split(",")
      // console.log('submitted tickers ==>', submittedTickers)
      for (let j = 0; j < rawStockData.length; j++) {
        stockDataString += `('${rawStockData[j].symbol}','${rawStockData[j].date}','${rawStockData[j].adj_close}'),`;
        if (submittedTickers.indexOf(rawStockData[j].symbol) > -1) {submittedTickers.splice(submittedTickers.indexOf(rawStockData[j].symbol),1)}
      };
      missingTickers.push(...submittedTickers)

    } catch (error) {
      console.log(chalk.red('marketStack API error ==>', error));    
    }

  }

  console.log(chalk.yellow('missing tickers to process ==>', JSON.stringify(missingTickers)))
  for (let i = 0; i < missingTickers.length; i++) {
    const alphaURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${missingTickers[i]}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
  
    try {
      const alphaObj = await axios.get(alphaURL);
      let rawStockData = alphaObj.data["Time Series (Daily)"];
      // console.log(chalk.yellow('raw stock data ==>',rawStockData));
      let rawStockDates = Object.keys(rawStockData);
      // console.log(chalk.yellow('first date key ==>',rawStockDates[0]));
      for (let j = 0; j < rawStockDates.length; j++) { 
        stockDataString += `('${missingTickers[i]}','${rawStockDates[j]}','${rawStockData[rawStockDates[j]]['5. adjusted close']}'),`;
      };
    } catch (error) {
      console.log(chalk.red('alphaVantage API error ==>', error));    
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
    console.log(chalk.blue('addStockDataDatabase ==> ', JSON.stringify(res)));
    return(res);
  } catch (error) {
    console.log(chalk.red('addStockDataDatabase error ==>', error));
  }    
}
  
module.exports = { refreshStocks }

