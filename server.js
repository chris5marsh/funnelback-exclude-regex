/*eslint node: true */
"use strict";

var connect = require('connect');
var http = require('http');
var compression = require('compression');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var convert = require('./convert');
var console = require('better-console');

var app = connect();

// gzip/deflate outgoing responses
app.use(compression());

// parse urlencoded request bodies into req.body
app.use(bodyParser.urlencoded({extended: false}));

// Deal with calls to /api
app.use('/api', function api(req, res, next) {
  console.log("API called");
  if (req.body.value) {
    convert(req.body.value, (r) => {
      //console.log("r is "+r);
      if (r !== false) {
        // send content back as text file
        res.end('{ "success" : "'+r+'" }');
        next();
      } else {
        res.end('{ "error" : "The form was not filled in properly" }');
        next();
      }
    })
  } else {
    res.end('{ "error" : "The form was not filled in properly" }');
    next();
  }
});

var port = (process.env.NODE_ENV === 'production') ? 80 : 8080 ;

// Deal with all other static files
app.use(serveStatic(__dirname)).listen(port, function(){
  console.info('Server running on '+port+'...');
});