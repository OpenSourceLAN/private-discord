import express = require("express");
import http = require("http");
var config: Config.config = require('./config.json');

//var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var hulk = require('hulk-hogan');

// var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
//app.register('.hulk', hulk);
app.engine('.html', require('hbs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../maps')));

 app.use('/', require('./routes/index'));
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req:express.Request, res:express.Response, next:express.NextFunction) {
  var err = new Error('Not Found');
  (<any>err).status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function( err: any, req :express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function( err: any,req:express.Request, res:express.Response, next:express.NextFunction) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = (<any>http).Server(app);

//require("./live/index")(server);

server.listen(config.listenPort);