var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/newDb');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
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
  var newUser = new this({ username: username, password: password});
  newUser.save(callback);
}

userSchema.statics.checkIfLegit = function(username, password, callback) {
  this.findOne({ username: username }, function(err, user) {
    if (err) {
      callback(err);
    }
    if (!user) {
      console.log('no user');
      callback('no user');
    }
    else {
      bcrypt.compare(password, user.password, function(err, isRight) {
        if (err) {
          return callback(err);
        }
        console.log(isRight);
        callback(null, isRight);
      });
    };
  });
}

module.exports = mongoose.model('User', userSchema);
