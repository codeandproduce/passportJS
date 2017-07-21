const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/passportJS');
const db = mongoose.connection;

const routes = require('./routes/index');
const users = require('./routes/users');

var port = process.env.PORT || 8000;

var app = express();

//view engine
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//public folder
app.use(express.static(path.join(__dirname, 'public')));

//express session
app.use(session({
    secret: 'secret',
    saveUnitialized: true,
    resave:true
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());



//express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//connect flash
app.use(flash());

//lobal vars for flash
app.use(function (req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//use the routes
app.use('/', routes);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
