/*jslint node: true */
"use strict";

var fs = require("fs");
var path = require("path");
var yargs = require("yargs");
var console = require('better-console');

var args = yargs.options({
  "i": {
    alias: "input",
    demandOption: true,
    default: "input.txt",
    describe: "Input file for processing",
    type: "string"
  },
  "o": {
    alias: "output",
    demandOption: true,
    default: "output.txt",
    describe: "File to write the output",
    type: "string"
  }
}).argv;

var inputFile = path.resolve(args.i);
var outputFile = path.resolve(args.o);

fs.readFile(inputFile, "utf-8", function(err, output){

  if (err) throw err;

  // Ignore all sub matches
  // Find new RegExp("...") and save them
  var re = /new RegExp\("(.*)"\)/g;
  var reArray;
  var results = [];
  var i = 0;

  //console.log(reArray = re.exec(output));

  while ((reArray = re.exec(output)) !== null) {
     results[i] = reArray[1];
     output = output.replace(reArray[0], "==="+i+"===");
     i++;
  }

  // Replace line breaks with "|"
  output = output.replace(/\n|\r/g, "|");
  // Replace "?" with "\?"
  output = output.replace(/\?/g, "\\?");
  // Replace "/" with "\/"
  output = output.replace(/\//g, "\\/");
  // Replace "." with "\."
  output = output.replace(/\./g, "\\.");
  // Replace "*" with "\*"
  output = output.replace(/\*/g, "\\*");
  // Replace "$" with "\$"
  output = output.replace(/\$/g, "\\$");
  // Add "regexp:" to front
  output = "regexp:"+output;

  // Remove final "|" if present
  if (output.substr(-1) === "|") {
    output = output.substring(0, output.length-1);
  }

  // Replace regexes
  var reg;
  var j = 0;
  for (;j < results.length; j++) {
    var find = "==="+j+"===";
    output = output.replace(find, results[j]);
  }

  fs.writeFile(outputFile, output, "utf-8", function(err) {

    if (err) throw err;

    console.info("Successfully wrote file to "+outputFile);

  });

});


