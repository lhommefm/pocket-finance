const chalk = require('chalk');
const { db } = require('./index')

// get budget information
const getBudget = async (user_id) => {
    try {
      const res = await db.query(`
        SELECT activity, budget, item_type
        FROM income_expenses 
        WHERE user_id = '${user_id}'
      `); 
    //   console.log(chalk.blue('getBudget ==> ', JSON.stringify(res.rows)));  
      return(res.rows)
    } catch (error) {
      console.log(chalk.red('getBudget error ==>', error));
    }
}

// get asset information
const getAssets = async (user_id) => {
    try {
      const res = await db.query(`
        SELECT asset_type, account_type, value 
        FROM asset_summary 
        WHERE user_id = '${user_id}'
      `); 
    //   console.log(chalk.blue('getAssets ==> ', JSON.stringify(res.rows)));  
      return(res.rows)
    } catch (error) {
      console.log(chalk.red('getAssets error ==>', error));
    }
}

// get asset information and format for ChartJS
const getAssetAllocation = async (user_id) => {
  try {
    const res = await db.query(`
      SELECT asset_class, value, percent
      FROM asset_class_summary
      WHERE user_id = '${user_id}'
    `); 
    // console.log(chalk.blue('getAssetAllocation ==> ', JSON.stringify(res.rows)));
    // let asset_class = [];
    // let values = [];
    // for (let i = 0; i < res.rows.length; i++) {
    //   asset_class.push(res.rows[i].asset_class);
    //   values.push(Math.round(res.rows[i].value,0))
    // }
    return(res.rows)
  } catch (error) {
    console.log(chalk.red('getAssetAllocation error ==>', error));
  }
}

// get asset information
const getStockAssets = async (user_id) => {
  try {
    const res = await db.query(`
      SELECT account_type, ticker, quantity, price, value
      FROM stock_value_table
      WHERE user_id = '${user_id}'
    `); 
    // console.log(chalk.blue('getStockAssets ==> ', JSON.stringify(res.rows)));  
    return(res.rows)
  } catch (error) {
    console.log(chalk.red('getAssetAllocation error ==>', error));
  }
}

// get tax settings information
const getTaxData = async (user_id) => {
  try {
    const res = await db.query(`
      SELECT "Medicare", "Social Security", "Federal Taxes", "State Taxes"
      FROM tax_user_results
      WHERE user_id = '${user_id}'
    `); 
  //   console.log(chalk.blue('getTaxData ==> ', JSON.stringify(res.rows)));  
    return(res.rows[0])
  } catch (error) {
    console.log(chalk.red('getTaxData error ==>', error));
  }
}

// get Macro data from the database
const getMacroData = async (year) => {
  try {
    const res = await db.query(`
      SELECT series_id, series_name, date, value, format, chart_group 
      FROM macro_data_view 
      WHERE date >= '${year}-01-01'
      ORDER BY chart_group, series_id, date ASC
    `); 
    const rows = res.rows;
    // console.log(chalk.green('getMacroDatabase ==> ', JSON.stringify(rows[0])));
    
    let backgroundColors = ['#e8efff', '#bacfff', '#87acff', '#5186fc'];
    // format each series_id set of data in the Chart JS object format
    let seriesDataSet = {  };
    let uniqueSeriesArray = [];
    let uniqueChartArray = [];
    for (let i = 0; i < rows.length; i++) {
      
      // if the entry's chart_group is new, push a new chart_group object shell
      if (uniqueChartArray.includes(rows[i].chart_group) === false) {
        seriesDataSet[rows[i].chart_group] = {
          format: rows[i].format, 
          labels: [],
          datasets: [],
          min: 999999
        }
      }
    
      // if the series_id is new, add to Series and Chart trackers
      // push a new dataset object shell 
      if (uniqueSeriesArray.includes(rows[i].series_id) === false) {
        uniqueSeriesArray.push(rows[i].series_id);
        uniqueChartArray.push(rows[i].chart_group);
        let matchingChartGroups = 0;
        for (let j = 0; j< uniqueChartArray.length; j++) {
          if (uniqueChartArray[j] === rows[i].chart_group) {matchingChartGroups++}
        }
        seriesDataSet[rows[i].chart_group].datasets.push(
          { 
            label: rows[i].series_name, 
            data: [], 
            showLine: true, 
            backgroundColor: backgroundColors[matchingChartGroups-1],
            borderColor: backgroundColors[matchingChartGroups-1],
            fill: false  
          }
        )
      };  

      // if the current count of matching chart_ids is 1 (first series), add the entry's date to the labels array
      let matchingChartGroups = 0;
      for (let j = 0; j< uniqueChartArray.length; j++) {
        if (uniqueChartArray[j] === rows[i].chart_group) {matchingChartGroups++}
      }
      if (matchingChartGroups === 1) {
        seriesDataSet[rows[i].chart_group].labels.push(rows[i].date)
      } 

      // add the series data to the last object within the datasets array of the appropriate chart group  
      let lastDataSetIndex = seriesDataSet[rows[i].chart_group].datasets.length-1
      seriesDataSet[rows[i].chart_group].datasets[lastDataSetIndex].data.push(
        { x: rows[i].date, y: rows[i].value }
      )
      
      // update the minimum value for that series  
      if ( rows[i].value < seriesDataSet[rows[i].chart_group].min ) {
        seriesDataSet[rows[i].chart_group].min = rows[i].value
      }

    }      
    return(seriesDataSet);
  } catch (error) {
    console.log(chalk.red('getMacroDatabase error ==>', error));
  }    
}

// get Stock history from the database
const getStockHistory = async () => {
  try {
    const res = await db.query(`
      SELECT ticker, date, price 
      FROM stock_history 
      ORDER BY ticker, date ASC
    `); 
    const rows = res.rows;
    // console.log(chalk.green('getStockHistory ==> ', JSON.stringify(rows[0])));
    
    // format each series_id set of data in the Chart JS object format
    let seriesDataSet = {  };
    let uniqueTickerArray = [];
    for (let i = 0; i < rows.length; i++) {
      
      // if the entry's ticker is new, push a new chart_group object shell
      if (uniqueTickerArray.includes(rows[i].ticker) === false) {
        seriesDataSet[rows[i].ticker] = { 
          format: 'currency',
          labels: [],
          datasets: [{ 
            label: rows[i].ticker, 
            data: [], 
            showLine: true
          }],
          min: 999999
        };
        uniqueTickerArray.push(rows[i].ticker);
      }
      
    
      // add the series date to the labels key of the appropriate chart group
      // add the series price to the data key within the datasets array of the appropriate chart group  
      seriesDataSet[rows[i].ticker].labels.push(rows[i].date)
      seriesDataSet[rows[i].ticker].datasets[0].data.push(
        { x: rows[i].date, y: rows[i].price }
      )
      
      // update the minimum value for that series  
      if ( rows[i].price < seriesDataSet[rows[i].ticker].min ) {
        seriesDataSet[rows[i].ticker].min = rows[i].price
      }

    }      
    return(seriesDataSet);
  } catch (error) {
    console.log(chalk.red('getStockDatabase error ==>', error));
  }    
}

module.exports = { getBudget, getAssets, getStockAssets, getTaxData, getAssetAllocation, getMacroData, getStockHistory }