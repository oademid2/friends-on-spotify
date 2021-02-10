//app.js

//
const express = require('express');
const cors = require('cors');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./friend.route'); // Imports routes for the products
const app = express();

require('dotenv').config();

//set up cross-origin
app.use(cors({
  origin: '*'
})).use(cookieParser());


///MONGO DB
    // Set up mongoose connection
    const mongoose = require('mongoose');

    //get the uri variables
    let dev_db_url = process.env.dev_db_url;
    let mongoDB = process.env.MONGODB_URI || dev_db_url;

    //connect to the database
    mongoose.connect(mongoDB);
    mongoose.Promise = global.Promise;
    let db = mongoose.connection;

    //listen for error
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//body parser for requests
  app.use(bodyParser.json()); //parses requests
  app.use(bodyParser.urlencoded({extended: false}));//parses requests


//Route the requests 
    app.use('/', routes);

// Serve static files from the React app
  //app.use(express.static(path.join(__dirname, 'client/build')));
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });





////////Listen for requests/////
const port = process.env.PORT || 1234;
app.listen(port, () => {
    console.log('Server is up and running on port numner ' +`${port}`);

});
