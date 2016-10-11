var request = require("request");
var fs = require("fs");
var args = process.argv.slice(2);
var dotenv = require("dotenv").config();
//intial function which gets information from github owner, and their reponame as well as
//a desired directory (the program will create one at the directoryPath if one does
// not exist)to write information too
function getRepoContributors(repoOwner, repoName, directoryName, cb) {
  var token = process.env.GITHUB_KEY;
  var directoryPath = assembleDirPath(directoryName);
  if(!token) {
    //if there is no github key then program will not run
    console.log(makeErrorMessage(null, ["environment variable"], "github-key"));
  }
  //combine all information into a useable URL
  var endpoint = "https://api.github.com/repos/" + repoOwner +"/" + repoName + "/contributors" + "?access_token=" + token;
  //object for request function ln 28
  var options = {
    url: endpoint,
    headers: {
      "User-Agent": "request"
    },
    json: true
  };

  //try to create directory
  createDirectory(directoryPath);
  //get information from endpoint
  request(options, function(err, response, body) {
    if(response.statusCode === 200) {
      //use avatar_url and login properties of the body object
      body.forEach(function(contributorData) {
        var fileURLS = getProperties(contributorData, "avatar_url");
        var fileID = getProperties(contributorData, "login");
        var fileName = directoryPath + fileID + ".jpg";
        //send to callback to download content => see downloadContentinDir()
        cb(fileURLS, fileName);
      });
    } else {
      //spit out error message with possible issues
      console.log(makeErrorMessage(err, [repoOwner, repoName], "request-object"));
    }
  });

}

function getProperties(object, propertyType) {
  let property = object[propertyType];
  return property;
}
//gets URL from contentPaths and pipes to the directory set
//in filenames
function downloadContentInDir(contentPaths, filenames) {

  request(contentPaths, function(err, response, body) {
    if(err) {
      console.log("error:", err)
      return false;
    }
    console.log("downloaded file to:", filenames);
  }).pipe(fs.createWriteStream(filenames));
}

//makes directory at name path,
function createDirectory(name) {
  //if directory is not made it will make it
  fs.stat(name, function (err, stats) {
    if(err) {
      fs.mkdir(name, function(err) {
      if(err) {
        console.log(makeErrorMessage(err, [name], "directory-path"));
      }
      console.log("created directory:", name);
    });
  }
 });
}

function makeErrorMessage(error, values, valueTypes) {
  var errorMessage = "Error:\n " ;
  for(elm of values) {
    errorMessage+= `please check value ${elm}, expected ${valueTypes}\n`;
  }
  return error?(errorMessage + error): errorMessage;
}

function assembleDirPath(dirName) {
  if(!dirName) {
    dirName = "default";
  }
  return `./${dirName}/`;
}
//start of code
getRepoContributors(args[0], args[1], args[2], downloadContentInDir);