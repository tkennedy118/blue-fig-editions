const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require('express-session');
const routes = require('./routes');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 6001;

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
} else {
  app.use(express.static(process.env.STATIC_DIR));
}

// Define middleware here
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

// Setup app to use sessions to keep track of user's login status.
app.use(session({ secret: 'wild horse', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/blue-fig-editions', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true 
});

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});