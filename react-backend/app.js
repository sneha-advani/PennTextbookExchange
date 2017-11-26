var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var User = require('./User.js');

var app = express();  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  secret: 'SHHisASecret',
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  if (req.session.username && req.session.username !== '') {
    res.redirect('/login');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  console.log(req.session);
  if (req.session.username && req.session.username !== '') {
    console.log('logged in');
    res.json({register: false, logged: 'in'});
  } else {
    res.json({register: false, logged: 'out'});
  }
});

app.post('/login', function(req, res) {
  //console.log(req.session.username);
  username = req.body.username;
  password = req.body.password;
  User.checkIfLegit(username, password, function(err, isRight) {
    if (err) {
      console.log('err');
      res.send('Error! ' + err);
    } else {
      if (isRight) {
        req.session.username = username;
        console.log('login');
        console.log(req.session);
        req.session.save();
        //res.redirect('/books');
      } else {
        res.redirect('/login');
      }
    }
  });
});

app.post('/register', function(req, res) {
  User.addUser(req.body.username, req.body.password, function(err) {
    if (err) res.send('error' + err);
    else res.send('new user registered with username ' + req.body.username);
  });
});

app.get('/books', function(req, res) {
  console.log('go to books');
  if (req.session.username && req.session.username !== '') {
    console.log('access granted');
    res.json({authenticated: true, books: User.getPosts()});
  } else {
    console.log('must log in');
    res.json({authenticated: false, books: []});
  }
});

app.post('/books', function(req, res) {
  User.addPost(req.session.username, req.body.title, req.body.price, req.body.class, req.body.email, req.body.details, function (err) {
    if (err) {
      res.send(err);
    }
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
