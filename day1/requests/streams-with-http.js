var http = require("http");
var urlIn = process.argv.slice(2);


function readHTML(url, callback) {
  var requestOptions = {
    host: url,
    path: '/'
  }
  http.get(requestOptions, (response) => {

    response.setEncoding("utf8"); //set encoding
    var htmlData = null;
    response.on("data", function(data) {
      htmlData = data.toString();;
    });
    response.on("end", function(){
      console.log("stream ended:");
      callback(htmlData);
    });
  });
}


readHTML('example.com', function printHTML(dataIn) {
  console.log(dataIn);
});