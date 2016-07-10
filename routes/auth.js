var express = require('express');
var router = express.Router();
var models = require('../models/models');
var contact = models.Contact;
var message = models.Message;


// router.get('/', function(req, res, next){
// 	if (req.user) {
// 		res.redirect('/index');
// 	}
// 	else {
// 		res.redirect('/login');
// 	}
// });

router.get('/', function(req, res, next){
	res.redirect('/index');	
});

router.get('/signup', function(req, res, next){
	res.render('signup');
});

router.post('/signup', function(req, res, next){

	if (!(req.body.email && req.body.pass && req.body.pass2)){
		throw new Error("input all fields");
	}

	var pass = req.body.pass;
	var pass2 = req.body.pass2;
	if (pass === pass2){
		var newUser = new models.User(
		{
			email: req.body.email,
			password: req.body.pass
		});

		newUser.save(function(err, success){
			if (err) {
				console.log(err);
			}
			else {
				console.log("CREATED NEW USER SUCCESSFULLY ON SIGNUP" + success);
				res.redirect('/login');
			}
		})
	}
	else {
		res.redirect('/signup');
	}
});

router.get('/login', function(req, res, next){
	res.render('login');
});


module.exports = function(passport) {
// passport.authenticate('local')
// by default has callback function that returns err, user, info??
// info:

	router.get('/auth/facebook',
	  passport.authenticate('facebook'));

	router.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login' }),
	  function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/');
	    // DO SHIT HERE
	  });

	router.get('/auth/soundcloud',
	  passport.authenticate('soundcloud'));

	router.get('/auth/soundcloud/callback', 
	  passport.authenticate('soundcloud', { failureRedirect: '/login' }),
	  function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/');
	    // DO SHIT HERE
	  });


	// router.post('/login', passport.authenticate('local'), function(req, res){
	// 	res.send("POSTED TO LOGIN !!!");
	// 	console.log("POSTED TO LOGIN");
	// 	res.redirect('/index');
	// });

	router.get('/logout', function(req, res, next){
		req.logout();
		res.redirect('/login');
	}); 

    return router;
}