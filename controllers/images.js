// module dependencies
// ----------------------------------------

var express = require('express');



// images routes
// ----------------------------------------

// get an instance of the router
var router = express.Router();

// get the mongoose image model
var Image = require('../models/image');



// http://localhost:3000/images/
router.route('/')

// displays a list of all images
.get(function(req, res, next) {
  // get all images
  Image.find({}, function(err, images) {
    // check for errors
    if(err) {
      // go to the error handler middleware
      return next(err);
    }

    // if no errors, go to the list page
    res.render('list', { images: images });
  }).sort({ _id: 1 });
});



// http://localhost:3000/images/:id
router.route('/:id')

// display an image
.get(function(req, res, next) {
  // get an image that its id be equals the value sent by url parameter
  Image.findById(req.params.id, function(err, image) {
    // check for errors
    if(err) {
      // adds the http status code to the err object
      err.status = 422;
      
      // go to the error handler middleware
      return next(err);
    }

    // if no errors, go to the image page
    res.render('image', image);
  });
});

// export the images router
module.exports = router;