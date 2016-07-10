var express = require('express');
var router = express.Router();
var models = require('../models/models')
var User = models.User;
var Song = models.Song;
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
	User.findById(id, function(e, user){
		if(user){
			SC.init({
			  id: 'bfd03479aef078b87807af6b0d9787ee',
			  secret: '93229d86384dc973be18ad7b4fec3ca0',
			  uri: 'http://localhost:3000/auth/soundcloud/callback',
			  accessToken: user.scToken
			});

			scId = user.soundcloudId;
			SC.get('/users/'+scId+'/favorites', function(err, favorites) {
				if(err){
					res.send(err);
					console.log("GOT AN ERROR !!!");
					return;
				}
				if(favorites){
					console.log(favorites);
					var len = favorites.length;

					var cb = function(){
						len --;
						if(!len){
							res.render('update', {
								data: favorites,
								layout: false
							})
						}
					};

					favorites.forEach(function(favorite){
						var newSong = new Song({
							songId: favorite.id,
							initialLikes: favorite.favoritings_count
						});

						// console.log("this is the favorite id " + favorite.id);
						// favorite.addSongs(user, favorite.id, function(err, succ){
						// 	console.log("ADDING SONG");
						// })

					

						Song.find({songId: favorite.id}, function(err, song){
							if(song && song.length === 0){
								newSong.save(function(error,success){
									if (error){
										console.log("cannot save song to database");
										console.log(error);
									}
									if (success){
										console.log(success);
										console.log("SAVED Song");
										user.assignFavorites(success._id, cb);
										console.log("SAVED FAV");
									}
								})
							}
							else{
								cb();
								return;
							}
							if(err){
								console.log("cannot look up song by id");
								console.log(err);
							}
						})
					})
				}
			// res.json(newData);
			})
		};
		if(e){
			console.log(e);
		}
	})
	// res.send(fav);

	// Fetchdata from soundcloud using node-soundcloud


	
});




module.exports = router;
