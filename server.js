var http = require('@thecoder08/http');
var render = require('@thecoder08/markdown');
var fs = require('fs');
http.server(process.env.PORT, function(req, res, redirect) {
    var filepath = __dirname + req.pathname;
    if (req.pathname == '/') {
      filepath = __dirname + '/index.md';
    }
    var filetype = filepath.split('.')[filepath.split('.').length - 1];
    fs.readFile(filepath, function(err, data) {
      if (err) {
        fs.readFile(__dirname + '/404.md', function(err, data) {
          res(404, 'text/html', render(data.toString()));
        });
      }
      else {
        if (filetype == 'ico') {
          res(200, 'image/x-icon', data);
        }
        else if (filetype == 'mp4') {
          res(200, 'video/mp4', data);
        }
        else if (filetype == 'mp3') {
          res(200, 'audio/mp3', data);
        }
        else if (filetype == 'wav') {
          res(200, 'audio/wav', data);
        }
        else if (filetype == 'css') {
          res(200, 'text/css', data);
        }
        else if (filetype == 'html') {
          res(200, 'text/html', data);
        }
        else if (filetype == 'js') {
          res(200, 'text/javascript', data);
        }
        else if (filetype == 'md') {
          res(200, 'text/html;charset=utf-8', render(data.toString()));
        }
        else if (filetype == 'json') {
          res(200, 'application/json', data)
        }
        else if (filetype == 'txt') {
          res(200, 'text/plain', data);
        }
        else {
          res(200, 'application/octet-stream', data);
        }
      }
    });
});
