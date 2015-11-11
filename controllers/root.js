// module dependencies
// ----------------------------------------

var express = require('express');
var multer = require('multer');
var fs = require('fs');



// root routes
// ----------------------------------------

// get an instance of the router
var router = express.Router();

// get the mongoose image model
var Image = require('../models/image');



// http://localhost:3000/
router.route('/')

// display the home page
.get(function(req, res) {
  // go to the home page
  res.render('index');
})

// save the title and image
.post(multer({ dest: './uploads' }).single('image'), function(req, res, next) {
  // creates an object of the image model
  var image = new Image();

  // adds the fields coming from the request in the image object
  image.title = req.body.title;
  image.image.data = fs.readFileSync(req.file.path).toString('base64');
  image.image.contentType = req.file.mimetype;
  
  // save image
  image.save(function(err) {
    // check for errors
    if(err) {
      // go to the error handler middleware
      return next(err);
    }

    // if no errors, log this message in the console
    console.log('image saved in mongodb!');

    // delete image from uploads directory
    fs.unlink(req.file.path, function(err) {
      // check for errors
      if(err) {
        // go to the error handler middleware
        return next(err);
      }

      // if no errors, log this message in the console
      console.log('image deleted from server!');

      // go to the home page
      res.render('index', { message: 'Saved image!' });
    });
  });
});

// export the root router
module.exports = router;