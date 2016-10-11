var request = require("request");
var fs = require("fs");
var args = process.argv.slice(2)
//intial function which gets information from github owner, and their reponame as well as
//a desired directory (the program will create one at the directoryPath if one does
// not exist)to write information too
function getRepoContributors(repoOwner, repoName, directoryPath, cb) {
  var endpoint = "https://api.github.com/repos/" + repoOwner +"/" + repoName + "/contributors";
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

      //use avatar_url and login properties portion of the body object
      body.forEach(function(contributorData) {
        var fileURLS = getProperties(contributorData, "avatar_url");
        var fileID = getProperties(contributorData, "login");
        var fileName = directoryPath + fileID + ".jpg";
        //send to callback to download content => see downloadContentinDir()
        cb(fileURLS, fileName);
      });

  });

}

function getProperties(object, propertyType) {
  let property = object[propertyType];
  return property;
}
//gets URL from contentPaths and pipes to the directory set
//in filenames
function downloadContentInDir(contentPaths, filenames) {

  request(contentPaths, function(err, response, body){
    if(err) {
      console.log("error:", err)
        return false;
      }
      console.log("downloaded file to:", filenames);
  }).pipe(fs.createWriteStream(filenames));
}

//makes directory at name path,
function createDirectory(name) {
 fs.stat(name, function (err, stats) {
  if(err || !stats.isDirectory()) {
    fs.mkdir(name, function(err) {
      if(err) {
        console.log("failed to make directory:", err);
      }
      console.log("created directory:", name);
    });
  }
 });
}

//start of code
getRepoContributors(args[0], args[1], "./avatars/", downloadContentInDir);