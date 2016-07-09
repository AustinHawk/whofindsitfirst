var express = require('express');
var router = express.Router();
var models = require('../models/models')
var User = models.User;
var SC = require('node-soundcloud');


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
	console.log(req.user.id);

	res.render('index');
})


router.get('/fetchData', function(req,res,next){
	// console.log(req.user.id);
	
	var id = req.user.id;
	var scId;
	var fav;
	User.findById(id, function(err, user){
		if(user){
			SC.init({
			  id: 'bfd03479aef078b87807af6b0d9787ee',
			  secret: '93229d86384dc973be18ad7b4fec3ca0',
			  uri: 'http://localhost:3000/auth/soundcloud/callback',
			  accessToken: user.scToken
			});

			scId = user.soundcloudId;
			console.log("THIS IS ID "+scId);
			SC.get('/users/'+scId+'/favorites', function(err, favorites) {
				if(err){
					res.send(err);
				}
				if(favorites){
					console.log("THE FOLLOWING IS THE FAVES");
					console.log(favorites);
					console.log("THE PREV WAS FAVES");
					fav = favorites;
				}
			// res.json(newData);
			})
		};
		if(err){
			console.log(err);
		}
	})
	// res.send(fav);

	// Fetchdata from soundcloud using node-soundcloud


	
})




module.exports = router;
