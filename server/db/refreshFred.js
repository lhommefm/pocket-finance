const chalk = require('chalk');
const { db } = require('./index');
const axios = require('axios')

// update Fred data in the database
const refreshFred = async () => {
    const fredSeriesList = await getFredSeries();
    const { dataString, tickerString } = await fetchFredData(fredSeriesList);
    const result = await addFredDatabase(dataString, tickerString);
    return result.rowCount
}

// get the list of unique Fred series from the db
const getFredSeries = async () => {
    try {
      const res = await db.query(`
        SELECT series_id, frequency
        FROM fred_series
      `); 
      // console.log(chalk.blue('getFredSeries ==> ', JSON.stringify(res.rows)));  
      return(res.rows);
    } catch (error) {
      console.log(chalk.red('getFredSeries error ==>', error));
  }
}

// retrieve Fred data from Fred JSON API
const fetchFredData = async function (fredSeriesList) {
  let dataString = "";
  let tickerString = "(";
  for (let i = 0; i < fredSeriesList.length; i++) {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${fredSeriesList[i].series_id}&api_key=${process.env.FRED_API_KEY}&observation_start=2015-01-01&frequency=${fredSeriesList[i].frequency}&file_type=json`;
    // console.log(chalk.yellow('URL ==>',url))
    const { data: {observations} } = await axios.get(url);
    if (observations) {tickerString += `'${fredSeriesList[i].series_id}',`}
    // console.log(chalk.yellow('observations[0].value ==>',JSON.stringify(observations[0].value)))
    for (let j = 0; j < observations.length; j++) {
      if( observations[j].value != '.') {
        dataString += `('${fredSeriesList[i].series_id}','${observations[j].date}','${observations[j].value}'),`;
      }
    } 
  }
  // console.log(chalk.yellow('end datastring ==>',dataString))
  dataString = dataString.slice(0,dataString.length-1);
  tickerString = tickerString.slice(0,tickerString.length-1)+")";
  // console.log(chalk.yellow('end tickerString ==>',tickerString));
  // console.log(chalk.yellow('end dataString ==>',dataString));
  return { dataString, tickerString }
}

// upload Fred data to database
const addFredDatabase = async (dataString, tickerString) => {
    try {
      const res = await db.query(`
        INSERT INTO fred_series_data (series_id, date, value) 
        VALUES ${dataString}
        ON CONFLICT (series_id, date) DO NOTHING
      `); 
      // console.log(chalk.blue('addFredDatabase ==> ', JSON.stringify(res)));
      return(res);
    } catch (error) {
      console.log(chalk.red('addFredDatabase error ==>', error));
    }    
  }

module.exports = { refreshFred }