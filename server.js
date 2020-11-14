var http = require('@thecoder08/http');
var render = require('@thecoder08/markdown');
var mail = require('@thecoder08/mailer');
var fs = require('fs');
http.server(process.env.PORT, function(req, res, redirect) {
  if (req.pathname == '/refreshView') {
    res(200, 'text/html', render(decodeURI(req.query.questionData)));
  }
  else if (req.pathname == '/submitQuestion') {
    mail({
      user: 'lmmclean08@gmail.com',
      pass: 'LMylesM03'
    }, {
      to: 'lmmclean08@gmail.com',
      subject: req.query.name + ' reported a bug!',
      html: render(req.query.questionData)
    }, function(err) {
      if (err) {
        console.log(err);
        res(400, 'text/plain', 'question has encountered an error');
      }
      else {
        res(200, 'text/plain', 'question has been submitted');
      }
    });
  }
  else if (req.pathname == '/addserver') {
    fs.readFile('serverdb.json', function(err, data) {
      var servers = JSON.parse(data);
      servers.push({
        name: req.query.name,
        address: req.query.address,
        owner: req.query.owner
      });
      fs.writeFile('serverdb.json', JSON.stringify(servers), function(err) {});
      res(200, 'text/plain', 'server added');
    });
  }
  else {
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
          res(200, 'text/html', '<style>body { background-color: black; }</style>\n\n' + render(data.toString()));
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
  }
});
