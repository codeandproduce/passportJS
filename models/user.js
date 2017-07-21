var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var UserSchema = mongoose.Schema({
  username:{
    type:String,
    index: true
  },
  password:{
    type:String
  },
  email: {
    type:String
  },
  name: {
    type: String
  }
});

var User = module.exports = mongoose.model('User', UserSchema);


module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash){
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getuserByUsername = (username, callback) => {
  var query = {username};
  User.findOne(query,callback);
};

module.exports.comparePassword = (inputpassword, hash, callback) => {
  //you would compare the inputted password with the hash you have of the username in mongodb.
  bcrypt.compare(inputpassword, hash, function(err, res) {
    // res === true
    if(err) throw err;
    callback(null, res);
  });
};

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};
