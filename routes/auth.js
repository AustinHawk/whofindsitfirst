var express = require('express');
var router = express.Router();
var models = require('../models/models');
var contact = models.Contact;
var message = models.Message;


router.get('/', function(req, res, next){
	console.log("TESTINGs");
	if (req.user) {
		res.redirect('/contacts');
	}
	else {
		res.redirect('/login');
	}
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
				console.log(success);
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


	router.post('/login', passport.authenticate('local'), function(req, res){
		res.redirect('/contacts');
	});

	router.use(function(req, res, next){
		if(!req.user){
			res.redirect('/login');
		}
		else{
			next();
		}

	})

	router.get('/logout', function(req, res, next){
		req.logout();
	}); 

    return router;
}