const router = require('express').Router();
const { 
    getBudget, getAssets, getStockAssets, getTaxData, 
    getAssetAllocation, getMacroData, getStockHistory 
} = require('../db/getDatabase')
const { getBudgetAssumptions, getAssetsAssumptions, getTaxAssumptions } = require('../db/getAssumptions')
const { refreshStocks } = require('../db/refreshStocks')
const { refreshFred } = require('../db/refreshFred')
const { refreshQuandl } = require('../db/refreshQuandl')
const chalk = require('chalk')

// all routes automatically start with /api to be routed here

// direct /update calls to the updateDB files
router.use('/update', require('./updateDB'))

// refresh stock price history in the database for relevant stocks
router.get('/refreshStockData', async function (req, res, next) {
    const result = await refreshStocks(req.user.user_id);
    // console.log ('budgetAssetsRoute userid ==>',req.user.user_id,'result ==>', JSON.stringify(result));
    res.send(result);
});

// get the latest Fred & Quandl economic numbers from the API
router.get('/refreshMacroData', async function (req, res, next) {
    const result = await Promise.all([refreshFred(),refreshQuandl()])
    // console.log(chalk.yellow('refreshMacro Fred result ==>', JSON.stringify(result[0]),'Quandl result ==>', JSON.stringify(result[1]),));
    res.send(result);
});

// get the Budget and Asset data for the User
router.get('/budgetAssets', async function (req, res, next) {
    const result = await Promise.all([
        getBudget(req.user.user_id),
        getAssets(req.user.user_id),
    ]);
    res.send(result);
});

// get the stock assets with latest stock price
router.get('/getAssetAllocation', async function (req, res, next) {
    const result = await getAssetAllocation(req.user.user_id);
    res.send(result);
});

// get the stock assets with latest stock price
router.get('/getStockAssets', async function (req, res, next) {
    const result = await getStockAssets(req.user.user_id);
    res.send(result);
});

// get the tax settings of a user
router.get('/getTaxData', async function (req, res, next) {
    const result = await getTaxData(req.user.user_id);
    res.send(result);
});

// get the stock history from the database
router.get('/getStockHistory', async function (req, res, next) {
    const result = await getStockHistory();
    res.send(result);
});

// get the macro economic numbers from the database
router.get('/getMacroData/year/:year', async function (req, res, next) {
    const result = await getMacroData(req.params.year);
    res.send(result);
});

// pull all inputs
router.get('/getInputs', async function (req, res, next) {
    const result = await Promise.all([
        getBudgetAssumptions(req.user.user_id), 
        getAssetsAssumptions(req.user.user_id), 
        getTaxAssumptions(req.user.user_id)
    ]);
    res.send(result);
});

// 404 if the API route doesn't exist
router.use(function (req, res, next) {
    const err = new Error('API route not found.');
    err.status = 404;
    next(err);
});

// Server error handler
router.use(function (err, req, res) {
    console.error('API routing error ==>', err);
    console.error('API routing error ==>', err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
})

// export the router
module.exports = router;