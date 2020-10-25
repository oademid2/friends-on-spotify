//app.js
const express = require('express');
const cors = require('cors');
var cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');

const friend = require('./friend.route'); // Imports routes for the products


const app = express();

app.use(cors({
  origin: '*'
})).use(cookieParser());

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb+srv://someuser:abcd1234@productstutorial-vqjwi.mongodb.net/test?retryWrites=true&w=majority';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//body parser
app.use(bodyParser.json()); //parses requests
app.use(bodyParser.urlencoded({extended: false}));//parses requests


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/', friend);

////////AUTHENTICATION//////
/////////////////////////
const port = process.env.PORT || 1234;
app.listen(port, () => {
    console.log('Server is up and running on port numner ' +`${port}`);

});
