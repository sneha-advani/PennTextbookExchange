var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_259kjx3v:4fefrqnro282dc5oajstmt800t@ds137256.mlab.com:37256/heroku_259kjx3v');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var postSchema = new Schema({
  title: {type: String, required: true},
  price: {type: Number, required: true},
  class: {type: String},
  email: {type: String},
  details: {type: String},
  likes: {type: Number}
});

var PostSchema = mongoose.model('PostSchema', postSchema);

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  posts: { type: [postSchema], required: false }
});

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.statics.addUser = function(username, password, callback) {
  var newUser = new this({ username: username, password: password, posts: []});
  newUser.save(callback);
}

userSchema.statics.checkIfLegit = function(username, password, callback) {
  this.findOne({ username: username }, function(err, user) {
    if (err) {
      callback(err);
    }
    if (!user) {
      callback('no user');
    }
    else {
      bcrypt.compare(password, user.password, function(err, isRight) {
        if (err) {
          return callback(err);
        }
        callback(null, isRight);
      });
    };
  });
}

userSchema.statics.addPost = function(username, title, price, className, email, details, callback) {
  var newPostSchema = new PostSchema({title: title, price: price, class: className, email: email, details: details, likes: 0});
  this.findOne({username: username}, function(err, user) {
    if (err) {
      callback(err);
    }
    if (!user) {
      callback('no user');
    }
    else {
      user.posts.push(newPostSchema);
      user.save(callback);
    }
  });
}

userSchema.statics.getUserPosts = function(username, callback) {
  this.findOne({username: username}, 'posts', function(err, user) {
    callback(user.posts);
  });
}

userSchema.statics.searchPosts = function (searchTerm, callback) {
  this.find({}, 'posts', function(err, docs) {
    var output = [];
    for (var i = 0; i < docs.length; i++) {
      if (docs[i].posts.length > 0) {
        for (var j = 0; j < docs[i].posts.length; j++) {
          if (docs[i].posts[j].title.includes(searchTerm)) {
            output.push(docs[i].posts[j]);
          }
        }
      }
    }
    callback(output);
  });
}

userSchema.statics.searchPostsByClass = function (searchTerm, callback) {
  this.find({}, 'posts', function(err, docs) {
    var output = [];
    for (var i = 0; i < docs.length; i++) {
      if (docs[i].posts.length > 0) {
        for (var j = 0; j < docs[i].posts.length; j++) {
          if (docs[i].posts[j].class.includes(searchTerm)) {
            output.push(docs[i].posts[j]);
          }
        }
      }
    }
    callback(output);
  });
}

userSchema.statics.getPosts = function (callback) {
  this.find({}, 'posts', function(err, docs) {
    var output = [];
    for (var i = 0; i < docs.length; i++) {
      if (docs[i].posts.length > 0) {
        for (var j = 0; j < docs[i].posts.length; j++) {
          output.push(docs[i].posts[j]);
        }
      }
    }
    callback(output);
  });
}

userSchema.statics.deletePost = function(username, postID, callback) {
  this.findOne({username: username}, function (err, user) {
    if (err) {
      callback(err);
    }
    if (!user) {
      callback('no user');
    }
    user.posts.id(postID).remove();
    user.save(function (err) {
      if (err) {
       callback(err);
      }
    });
  });
}

userSchema.statics.addLike = function(postID, callback) {
  this.find({}, 'posts', function(err, docs) {
    var output = [];
    for (var i = 0; i < docs.length; i++) {
      if (docs[i].posts.length > 0) {
        for (var j = 0; j < docs[i].posts.length; j++) {
          if (docs[i].posts[j].id == postID) {
            docs[i].posts[j].likes = docs[i].posts[j].likes + 1;
          }
        }
      }
      docs[i].save(function (err) {
      if (err) {
       callback(err);
      }
    });
    }
  });
}

module.exports = mongoose.model('User', userSchema);
