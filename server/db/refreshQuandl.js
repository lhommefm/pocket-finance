const chalk = require('chalk');
const { db } = require('./index');
const axios = require('axios')

// refresh Quandl data in the database
const refreshQuandl = async () => {
    const quandlSeriesList = await getQuandlSeries();
    const dataString = await fetchQuandlData(quandlSeriesList);
    const result = await addQuandlDatabase(dataString);
    return result.rowCount
}

// get the list of unique Quandl series from the db
const getQuandlSeries = async () => {
    try {
      const res = await db.query(`
        SELECT series_id
        FROM quandl_series
      `); 
      // console.log(chalk.blue('getQuandlSeries ==> ', JSON.stringify(res.rows)));  
      return(res.rows);
    } catch (error) {
      console.log(chalk.red('getQuandlSeries error ==>', error));
  }
}

// get Quandl data from Quandl JSON API
const fetchQuandlData = async function (quandlSeriesList) {
  let dataString = "";
  for (let i = 0; i < quandlSeriesList.length; i++) {
    const url = `https://www.quandl.com/api/v3/datasets/${quandlSeriesList[i].series_id}/data.json?&api_key=${process.env.QUANDL_API_KEY}&collapse=monthly&start_date=2015-01-01`;
    // console.log(chalk.yellow('URL ==>',url))
    const response = await axios.get(url);
    const data = response.data.dataset_data.data
    // console.log(chalk.yellow('Dataset data first entry ==>',JSON.stringify(data[0])))
    for (let j = 0; j < data.length; j++) {
      dataString += `('${quandlSeriesList[i].series_id}','${data[j][0]}','${data[j][1]}'),`;
    } 
  }
  dataString = dataString.slice(0,dataString.length-1);
  // console.log(chalk.yellow('dataString ==>',dataString));
  return dataString
}

// upload Quandl data to database
const addQuandlDatabase = async (dataString) => {
    try {
      const res = await db.query(`
        INSERT INTO quandl_series_data (series_id, date, value) 
        VALUES ${dataString}
        ON CONFLICT (series_id, date) DO NOTHING
      `); 
      // console.log(chalk.blue('addQuandlDatabase ==> ', JSON.stringify(res)));
      return(res);
    } catch (error) {
      console.log(chalk.red('addQuandlDatabase error ==>', error));
    }    
  }

module.exports = { refreshQuandl }