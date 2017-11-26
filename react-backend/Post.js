var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/newDb');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  title: {type: String, required: true},
  price: {type: Number, required: true},
  class: {type: Number},
  email: {type: String},
  details: {type: String}
});

postSchema.statics.newPost = function(title, price, className, email, details, callback) {
  var newPostSchema = new this({title: title, price: price, class: className, email: email, details: details});
  newPostSchema.save(callback);
}

module.exports = mongoose.model('Post', postSchema);