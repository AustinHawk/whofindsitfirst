var express = require('express');
var router = express.Router();
var models = require('../models/models')
var contact = models.Contact;
var message = models.Message;

// var twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/* GET home page. */

router.use(function(req, res, next){
	if(!req.user){
		res.redirect('/login');		
	}
	else{
		next();
	}
})


router.get('/index', function(req,res,next){
	res.render('index');
})




module.exports = router;
