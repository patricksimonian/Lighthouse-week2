var request = require('request');
//declaration
function readHTML (url, callback) {

  request(url, function(error, response, body) {

    if (error) {
      console.log("Error", error, "");
      throw error;
    }
    console.log("response status code:", response.statusCode);
    callback(body);
  });
}


readHTML("http://www.example.com", function writeHTML(htmlData) {
  console.log(htmlData);
});