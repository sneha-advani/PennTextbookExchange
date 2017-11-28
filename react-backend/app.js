var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var User = require('./User.js');

var app = express();  
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


app.use(cookieSession({
  secret: 'SHHisASecret',
  maxAge: 24 * 60 * 60 * 1000
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//use sessions for tracking logins
// app.use(session({
//   secret: 'work hard',
//   resave: true,
//   saveUninitialized: false
// }));


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
  if (req.body.button === 'link') {
    res.redirect('/books');
  } else {
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
          //console.log(req.session);
          req.session.save();
          res.redirect('/login');
        } else {
          res.redirect('/login');
        }
      }
    });
  }
});

app.post('/register', function(req, res) {
  if (req.body.button === 'link') {
    res.redirect('/books');
  } else {
    User.addUser(req.body.username, req.body.password, function(err) {
    if (err) res.send('error' + err);
    else res.send('new user registered with username ' + req.body.username);
  });
  }
});

app.get('/books', function(req, res) {
  console.log('go to books');
  if (req.session.username && req.session.username !== '') {
    console.log('access granted');
    User.getPosts(function (posts) {
      res.json({authenticated: true, books: posts});
    });
  } else {
    console.log('must log in');
    // res.json({authenticated: false, books: []});
    User.getPosts(function (posts) {
      res.json({authenticated: true, books: posts});
    });
  }
});

app.post('/books', function(req, res) {
  if (req.body.button === 'link') {
    res.redirect('/new');
  }
  if (req.body.button === 'account') {
    res.redirect('/account');
  }
});

app.get('/new', function(req, res) {
  if (req.session.username && req.session.username !== '') {
    res.json({authenticated: true});
  } else {
    res.json({authenticated: false});
  }
});

app.post('/new', function(req, res) {
  if (req.body.button === 'link') {
    res.redirect('/books');
  } else {
    User.addPost(req.session.username, req.body.title, req.body.price, req.body.class, req.body.email, req.body.details, function (err) {
    if (err) {
      res.send('err');
    }
    })
  }
});

app.get('/account', function (req, res) {
  req.session.username = 'sneha';
  if (req.session.username && req.session.username !== '') {
    User.getUserPosts(req.session.username, function (posts) {
      res.json({authenticated: true, username: req.session.username, books: posts});
    })
  } else {
    res.json({authenticated: false, username: '', books: []});
  }
});

app.post('/account', function (req, res) {
  if (req.body.button === 'link') {
    res.redirect('/books');
  }
  if (req.body.button === 'login') {
    res.redirect('/login');
  }
  if (req.body.button === 'delete') {
    req.session.username = 'sneha';
    User.deletePost(req.session.username, req.body.postID);
  }
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
