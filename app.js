// module dependencies
// ----------------------------------------

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');



// server configuration
// ----------------------------------------

// creates an express framework app
var app = express();

// get the configuration file
var config = require('./config');

// set the environment variable
app.set('env', config.env);

// connect to the data base
mongoose.connect(config.database);

// use body parser to get data from post and/or url parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// set the view engine to jade and specify the views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// all routes
// ----------------------------------------

// add the root routes with the prefix /
app.use('/', require('./controllers/root'));

// add the images routes with the prefix /images
app.use('/images', require('./controllers/images'));



// catch 404 and go to error handler
// ----------------------------------------

app.use(function(req, res, next) {
  // creates an error object
  var err = new Error('Page Not Found');

  // adds the http status code to the err object
  err.status = 404;

  // go to the error handler middleware
  next(err);
});



// error handlers
// ----------------------------------------

// verify if the environment variable equals development or production
if (app.get('env') === 'development') {
  // if equals development, will print stacktrace
  app.use(function(err, req, res, next) {
    // set the http status code
    res.status(err.status || 500);

    // go to the error page
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  // if equals production, no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    // set the http status code
    res.status(err.status || 500);
    
    // go to the error page
    res.render('error', {
      message: err.message,
      error: false
    });
  });
}



// start the server
// ----------------------------------------

app.listen(config.port, function() {
  // when the server start, log this message in the console
  console.log('Listening at http://localhost:%s/', config.port);
});