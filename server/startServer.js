// in a development environment, use mutate process.env object with dotenv 
// require('dotenv').config()

// start the server on the defined port, referencing primary Express routing file
const app = require('./index');
const port = process.env.PORT;

app.listen(port, function () {
    console.log(`Server started on port ==> ${port}`);
})