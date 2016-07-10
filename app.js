var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes/index');
var auth = require('./routes/auth');

var models = require('./models/models')
var User = models.User;

var FacebookStrategy = require('passport-facebook');

var SoundCloudStrategy = require('passport-soundcloud').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport stuff here
// express-session: sets req.cookies on all requests sent to your website
var session = require('cookie-session');
app.use(session({ keys: ['keyboard cat'] }));

// Tell Passport how to set req.user
// how express attaches req.user (to current user)
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// how express sets req.user = undefined for logout
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Tell passport how to read our user models
// LocalStrategy defines strategy for which we log ppl in 
// passport.use(new LocalStrategy(function(username, password, done) {
//   // Find the user with the given username
//   console.log("GOT IN");
//   console.log("THIS IS PASSPORT LOCAL STRATEGY USERNAME" + username);
//     User.findOne({ email: username }, function (err, user) {
//       // if there's an error, finish trying to authenticate (auth failed)
//       if (err) { 
//         return done(err);
//       }
//       // if no user present, auth failed
//       if (!user) {
//         return done(null, false);
//       }
//       // if passwords do not match, auth failed
//       if (user.password !== password) {
//         return done(null, false);
//       }
//       // auth has succeeded
//       return done(null, user);
//     });
//   }
// ));

passport.use(new FacebookStrategy({
    clientID: "605028946343058",
    clientSecret: "48efa4bacb1c8986541253a1d9e80c7a",
    callbackURL: "http://whofindsitfirst.herokuapp.com//auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, {
      facebookId: profile.id,
    }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new SoundCloudStrategy({
  clientID: "bfd03479aef078b87807af6b0d9787ee",
  clientSecret: "93229d86384dc973be18ad7b4fec3ca0",
  callbackURL: "http://whofindsitfirst.herokuapp.com/auth/soundcloud/callback"
},
function(accessToken, refreshToken, profile, done) {
  console.log("USER PROFILE LOOKS LIKE THIS: ", profile);
  console.log("img is : ", profile._json.avatar_url)
  User.findOrCreate({ soundcloudId: profile.id }, {
    soundcloudId: profile.id,
    scToken: accessToken,
    img: profile._json.avatar_url,
    userName: profile._json.username
  }, function(err, user){
    if(err){
      console.log(err);
    }
    if(user){
      console.log(user);
      return done(err, user);
    }
  })
}
));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth(passport));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
