var express = require('express');
var router = express.Router();
var models = require('../models/models')
var contact = models.Contact;
var message = models.Message;

// var twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/contacts');
});


module.exports = router;
