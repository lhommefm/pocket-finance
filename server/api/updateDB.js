const router = require('express').Router();
const { updateStocks, updateBudget, updateAssets, updateTaxSettings, deleteEntry } = require('../db/updateDatabase');
const { insertStock, insertBudget, insertAssets } = require('../db/insertDatabase');

// all routes automatically start with /api/update to be routed here

// update the stock inputs in the database
router.post('/updateStock', async function (req, res, next) {
    if(!req.user){res.send("Guests cannot make updates")}
    const result = await updateStocks(req.body, req.user.user_id);
    res.send(result);
});

// update the budget inputs in the database
router.post('/updateBudget', async function (req, res, next) {
    if(!req.user){res.send("Guests cannot make updates")}
    const result = await updateBudget(req.body, req.user.user_id);
    res.send(result);
});

// update the asset table in the database
router.post('/updateAssets', async function (req, res, next) {
    if(!req.user){res.send("Guests cannot make updates")}
    const result = await updateAssets(req.body, req.user.user_id);
    res.send(result);
});

// update the tax settings in the database
router.post('/updateTaxSettings', async function (req, res, next) {
    if(!req.user){res.send("Guests cannot make updates")}
    const result = await updateTaxSettings(req.body, req.user.user_id);
    res.send(result);
});

// add stock input in the database
router.post('/insertStock', async function (req, res, next) {
    if(!req.user){res.send("Guests cannot make updates")}
    const result = await insertStock(req.body, req.user.user_id);
    res.send({result});
});

// add budget line item to the database
router.post('/insertBudget', async function (req, res, next) {
    if(!req.user){res.send("Guests cannot make updates")}
    const result = await insertBudget(req.body, req.user.user_id);
    res.send({result});
});

// add assets line item to the database
router.post('/insertAssets', async function (req, res, next) {
    if(!req.user){res.send("Guests cannot make updates")}
    const result = await insertAssets(req.body, req.user.user_id);
    res.send({result});
});

// deletes line item from the database
router.delete('/delete', async function (req, res, next) {
    if(!req.user){res.send("Guests cannot make updates")}
    const result = await deleteEntry(req.body.id, req.user.user_id, req.body.db);
    res.send({result});
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