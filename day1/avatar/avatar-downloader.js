var request = require("request");
var fs = require("fs");

function getRepoContributors(repoOwner, repoName, directoryPath, cb) {
  var endpoint = "https://api.github.com/repos/" + repoOwner +"/" + repoName + "/contributors";
  var options = {
    url: endpoint,
    headers: {
      "User-Agent": "request"
    },
    json: true
  };

  createDirectory(directoryPath);

  request(options, function(err, response, body) {

        //download files
      body.forEach(function(contributorData) {
        var fileURLS = getProperties(contributorData, "avatar_url");
        var fileID = getProperties(contributorData, "login");
        var fileName = directoryPath + fileID + ".jpg";
        cb(fileURLS, fileName);
      });

  });

}


function getProperties(object, propertyType) {
  let property = object[propertyType];
  return property;
}

function downloadContentInDir(contentPaths, filenames) {

  request(contentPaths, function(err, response, body){
    if(err) {
      console.log("error:", err)
        return false;
      }
      console.log("downloaded file to:", filenames);
  }).pipe(fs.createWriteStream(filenames));
}


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
var args = process.argv.slice(2)
getRepoContributors(args[0], args[1], "./avatars/", downloadContentInDir);