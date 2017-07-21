var express = require('express');
var router = express.Router();
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// register
router.get('/login', (req, res) =>{
  res.render('login');
});
router.get('/register', (req, res) => {
  res.render('register');
});

//register user
router.post('/register', (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.passoword2;

  //validation
  req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if(errors){
    res.render('register',{
      errors
    });
  }else{
    var newUser = new User({
      name,
      email,
      username,
      password
    });
    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });
    req.flash('success_msg', 'You are registered and now login');

    res.redirect('/users/login');
  }
});


passport.use(new LocalStrategy(function(username, password, done) {
  User.getuserByUsername(username, function(err, user){
    if (err) throw err;
    if(!user){
      return done(null, false, {
        message:'Unknown User'
      });
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        return done(null, user);
        //is there is a match
      }else{
        return done(null, false, {message: 'Invalid password'});
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {
    //options
    successRedirect: '/',
    failureRedirect:'/users/login',
    failureFlash: true
  }),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/');
  });

router.get('/logout', (req, res)=>{
  req.logout();
  req.flash('success_msg', 'you are logged out');
  res.redirect('/users/login');
});

module.exports = router;
