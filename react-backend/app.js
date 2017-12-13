var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var User = require('./User.js');

var app = express();  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', 1);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
  cookie: { proxy: true }
}));

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', function (req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (session.username && session.username !== '') {
    res.redirect('/login');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (session.username && session.username !== '') {
    res.json({register: false, logged: 'in'});
  } else {
    res.json({register: false, logged: 'out'});
  }
});

app.post('/login', function(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.body.button === 'link') {
    res.redirect('/books');
  } else {
    username = req.body.username;
    password = req.body.password;
    User.checkIfLegit(username, password, function(err, isRight) {
      if (err) {
        res.send(err);
      } else {
        if (isRight) {
          session.username = username;
          res.redirect('/login');
        } else {
          res.redirect('/login');
        }
      }
    })
  }
});

app.post('/register', function(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.body.button === 'link') {
    res.redirect('/books');
  } else {
    User.addUser(req.body.username, req.body.password, function(err) {
    if (err) res.send(err);
    else res.send('new user registered with username ' + req.body.username);
  });
  }
});

app.get('/books', function(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (session.username && session.username !== '') {
    if (session.currSearchTerm !== '' && session.currSearchTerm !== undefined) {
      if (session.currSearchType === 'title' || session.currSearchTerm === undefined) {
        User.searchPosts(session.currSearchTerm, function (posts) {
          res.json({authenticated: true, books: posts});
        });
      } else {
        User.searchPostsByClass(session.currSearchTerm, function (posts) {
          res.json({authenticated: true, books: posts});
        });
      }
      
    } else {
      User.getPosts(function (posts) {
        res.json({authenticated: true, books: posts});
      });
    }
  } else {
    res.json({authenticated: false, books: []});
  }
});

app.post('/books', function(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.body.button === 'link') {
    res.redirect('/new');
  }
  if (req.body.button === 'account') {
    res.redirect('/account');
  }
  if (req.body.button === 'logout') {
    session.username = '';
    res.redirect('/');
  }
  if (req.body.button === 'search') {
    session.currSearchTerm = req.body.searchTerm;
    session.currSearchType = req.body.searchType;
    res.redirect('/books');
  }
  if (req.body.button === 'interested') {
    User.addLike(req.body.postID, function (err) {
    });
    res.redirect('/books');
  }
});

app.get('/new', function(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (session.username && session.username !== '') {
    res.json({authenticated: true});
  } else {
    res.json({authenticated: false});
  }
});

app.post('/new', function(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.body.button === 'link') {
    res.redirect('/books');
  } else {
    User.addPost(session.username, req.body.title, req.body.price, req.body.class, req.body.email, req.body.details, function (err) {
    if (err) {
      res.send(err);
    }
    })
  }
});

app.get('/account', function (req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (session.username && session.username !== '') {
    User.getUserPosts(session.username, function (posts) {
      res.json({authenticated: true, username: session.username, books: posts});
    })
  } else {
    res.json({authenticated: false, username: '', books: []});
  }
});

app.post('/account', function (req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.body.button === 'link') {
    res.redirect('/books');
  }
  if (req.body.button === 'login') {
    res.redirect('/login');
  }
  if (req.body.button === 'delete') {
    User.deletePost(session.username, req.body.postID, function (err) {
      res.send(err);
    });
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
