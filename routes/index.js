var express = require('express');
var router = express.Router();
var models = require('../models/models')
var User = models.User;
var Song = models.Song;
var SC = require('node-soundcloud');
// var SCC = require('soundcloud');

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
	// console.log(req.user.id);
	console.log("got to index");
	res.render('index');
})

router.get('/userScore', function(req, res, next){
	User.find(function(e, user){
		// console.log("Got user data:", user);
		if(e){
			res.send(e);
			return;
		}
		console.log("total users:", user.length)
		if(user){
			var arr = [];
			// var completed = false
			user.forEach(function(singleUser, i){
<<<<<<< HEAD
				// singleUser.getScore(function(succ){
				// 	console.log("Called getScore for user", i);
				// 	// console.log("User:", singleUser, ", score:", succ);
				// 	console.log("i:", i);
				// 	arr.push(succ);
				// 	if(arr.length === user.length){
				// 		console.log("ARRAY IS : "+arr);
				// 		res.render('user', {
				// 			input: arr
				// 		});
				// 	}
				// });

				// console.log("user: ", singleUser);
				console.log("user ", i, " has 'getScore' function: ", singleUser.getScore !== undefined);

				singleUser.getScore(function(err, score){
					// console.log("Called getScore for user", i);
					// console.log("User:", singleUser, ", score:", score);
					console.log("User:", i, ", score:", score.score);
					// console.log("i:", i);
					arr.push(score);
					if(i + 1 === user.length){
						// console.log("ARRAY IS : " + arr);
						console.log("Exiting /userScore");
						return res.render('user', {
							input: arr
						});
						// return res.json({
						// 	score: arr
						// })
=======
				console.log("ENTERING GET SCORE WITH ", i);
				singleUser.getScore(function(succ){
					console.log("IN GET SCORE WITH :",i);
					arr.push(succ);
					// console.log("ARRAY IS : ", arr, "i+1 = ", i+1 , "user.length =  ", user.length);
					if((arr.length) === user.length){
						// completed = true;
						console.log("UNSORTED", arr);
						arr.sort(function(a, b) {
	                        return parseFloat(b.score) - parseFloat(a.score);
	                    });
	                    console.log("SORTED", arr);
						return res.render('user', {
							input: arr
						});
						// return;
>>>>>>> master
					}
				});
				console.log("EXITING USER SCORE WITH: ", i);
				// if(completed){
				// 	res.render('user', {
				// 		input: arr
				// 	});
				// }
			});
		} else {
			return res.render('user');
		}
		
	})
});

// router.get('/follow/:id', function(req, res, next){
// 	console.log("FOLLOW BUTTON CLICKED !!!!")
// 	var toFollowId = req.params.id;
// 	var id = req.user.id;
// 	var myScId;
// 	User.findById(id, function(e, user){
// 		if(user){
// 			// var arr = [];
// 			// var completed = false
// 			myScId = user.soundcloudId;
// 			// SC.init({
// 			// 	id: 'bfd03479aef078b87807af6b0d9787ee',
// 			// 	secret: '93229d86384dc973be18ad7b4fec3ca0',
// 			// 	uri: 'http://localhost:3000/auth/soundcloud/callback',
// 			// 	accessToken: user.scToken
// 			// });

// 			SC.init({
// 			  client_id: 'bfd03479aef078b87807af6b0d9787ee',
// 			  redirect_uri: 'http://localhost:3000/auth/soundcloud/callback'
// 			});
// 			console.log("MY ID: ", myScId, "TO FOLLOW ID : ", toFollowId);

// 			SC.connect().then(function() {
// 			  // Follow user with ID 3207
// 			  SC.put('/me/followings/'+toFollowId);
// 			});

// 			// SC.put('/users/'+myScId+'/followings/'+toFollowId, function(err, followed) {
// 			// 	if(err){
// 			// 		res.send(err);
// 			// 		console.log("err when trying 2 follow a person!!!", err);
// 			// 		console.log(err);
// 			// 		return;
// 			// 	}
// 			// 	if(followed){
// 			// 		console.log("successfully followed ", followed);
// 			// 		res.send(followed)
// 			// 		return;
// 			// 	}
// 			// })
// 		}
// 	})
// })

// router.get('/filteredUserScore', function(req, res, next){
// 	var scId;
// 	var id = req.user.id;
// 	User.findById(id, function(e, user){
// 		if(user){
// 			SC.init({
// 				id: 'bfd03479aef078b87807af6b0d9787ee',
// 				secret: '93229d86384dc973be18ad7b4fec3ca0',
// 				uri: 'http://localhost:3000/auth/soundcloud/callback',
// 				accessToken: user.scToken
// 			});

// 			scId = user.soundcloudId;
// 			console.log("USER", user);
// 			SC.get('/users/'+scId+'/followings', function(err, followers) {
// 				if(err){
// 					res.send(err);
// 					console.log("err in followings!!!", err);
// 					console.log(err);
// 					return;
// 				}
// 				if(followers){
// 					res.send(followers);
// 					console.log("THESE ARE THE FOLLOWERS ", followers);
// 					return;
// 				}
// 			})
// 		}
// 		if(e){
// 			console.log("cannot follow", e);
// 			res.send(e);
// 			return;
// 		}
// 	})
// })

router.get('/fetchData', function(req,res,next){
	// console.log(req.user.id);
	
	var id = req.user.id;
	var scId;
	var fav;
	User.findById(id, function(e, user){

		if(e){
			console.log(e);
		}
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
					console.log("GOT AN ERROR !!!", err);
					console.log(err);
					return;
				}
				if(favorites){
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

						// console.log("this is the favorite id " + favorite.id);
						// favorite.addSongs(user, favorite.id, function(err, succ){
						// 	console.log("ADDING SONG");
						// })

						console.log("TRYING TO SAVE SONG");
						
						console.log("WOOT");
						

						Song.find({songId: favorite.id}, function(err, song){
							if(song && song.length === 0){
								var newSong = new Song({
									songId: favorite.id,
									initialLikes: favorite.favoritings_count
								});
								console.log("THIS IS THE SONG WE ARE TRYING TO SAVE !!", newSong);

								newSong.save(function(error,success){
									if (error){
										console.log("cannot save song to database");
										console.log(error);
									}
									if (success){
										console.log("SAVED Song");
										user.assignFavorites(success._id, cb);
										console.log("SAVED FAV");
									}
								})
							}
							if(song && song.length > 0){
								console.log("SONG LOOKS LIKE", song)
								var newSong = song[0];
								// added here because will assign favorite to user regardless of whether it is
								// already in Song databse
								user.assignFavorites(newSong._id, cb);
								// cb();
								// return;
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
	})
	// res.send(fav);

	// Fetchdata from soundcloud using node-soundcloud


	
});




module.exports = router;
