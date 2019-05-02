/*eslint node: true */
"use strict";

const fs = require("fs");
const util = require("util");
const console = require("better-console");
const writeFile = util.promisify(fs.writeFile);

module.exports = (data, onComplete) => {

  const datestring = Date.now();
  const inputFile = "input.txt";
  const outputFile = "output-"+datestring+".txt"

  // write data to input file, ready for next time
  writeFile(inputFile, data, "utf-8").then((err) => {

    if (err) return onComplete(false);

    console.info("Successfully wrote original data to "+inputFile);

    // Ignore all sub matches
    // Find new RegExp("...") and save them
    const re = /new RegExp\("(.*)"\)/g;
    let reArray;
    const results = [];
    let i = 0;

    while ((reArray = re.exec(data)) !== null) {
       results[i] = reArray[1];
       data = data.replace(reArray[0], "==="+i+"===");
       i++;
    }

    // Replace line breaks with "|"
    data = data.replace(/\n|\r/g, "|");
    // Replace "?" with "\?"
    data = data.replace(/\?/g, "\\?");
    // Replace "/" with "\/"
    data = data.replace(/\//g, "\\/");
    // Replace "." with "\."
    data = data.replace(/\./g, "\\.");
    // Replace "*" with "\*"
    data = data.replace(/\*/g, "\\*");
    // Replace "$" with "\$"
    data = data.replace(/\$/g, "\\$");
    // Add "regexp:" to front
    data = "regexp:"+data;

    // Remove final "|" if present
    if (data.substr(-1) === "|") {
      data = data.substring(0, data.length-1);
    }

    // Replace regexes
    //var reg;
    let j = 0;
    for (;j < results.length; j++) {
      var find = "==="+j+"===";
      data = data.replace(find, results[j]);
    }

    writeFile(outputFile, data, "utf-8").then((err) => {

      if (err) return onComplete(false);

      console.info("Successfully wrote updated data to "+outputFile);

      return onComplete(outputFile);

    }).catch((err) => {

      console.error("There was an error: "+err);

      return onComplete(false);

    });

  });

};
