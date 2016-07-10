var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var SC = require('node-soundcloud');

// Create a connect.js inside the models/ directory that
// exports your MongoDB URI!
var connect = process.env.MONGODB_URI || require('./connect');

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);



var UserSchema = new mongoose.Schema({
	fId: {
		type: String
	},
	soundcloudId: {
		type: String
	},
	scToken: {
		type: String
	},
	score: {
		type: Number
	},
	img: {
		type: String
	}
});


var SongSchema = new mongoose.Schema({
	songId: {
		type: String,
		required: true
	},
	initialLikes: {
		type: Number,
		required: true
	}
});


var FavoritesSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	songId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Song',
		required: true
	}
});

FavoritesSchema.methods.getDifference = function(accessToken, callback) {
	var initialLikes = this.songId.initialLikes
	var currentlikes;
	SC.init({
	  id: 'bfd03479aef078b87807af6b0d9787ee',
	  secret: '93229d86384dc973be18ad7b4fec3ca0',
	  uri: 'http://localhost:3000/auth/soundcloud/callback',
	  accessToken: accessToken
	});

	// var trackId = this.songId;
	// var url = '/tracks/' + encodeURIComponent(trackId);
	var url = '/tracks/' + this.songId.songId;
	// console.log(url);
	SC.get(url, function(err, track) {
		if (err){
			return console.log(err);
		}
		if(track){

			currentlikes = track.favoritings_count;
			var songScore = (currentlikes - initialLikes)/initialLikes;
			// console.log(songScore);
			// console.log("total percent is: " + totalPercentage);
			// console.log("denom is : " + denominator);
			callback(null, songScore)
		}
	})
}

var Favorites = mongoose.model('Favorites', FavoritesSchema);

UserSchema.methods.assignFavorites = function(newSongId, callback){
	var newFavorite = new Favorites ({
		userId: this._id,
		songId: newSongId
	});
	console.log("THIS IS THE SONG ID " + newSongId)
	Favorites.find({userId: this._id, songId: newSongId}, function(err, favorite){
		if(favorite && favorite.length === 0) {
			newFavorite.save(function(err, succ){
				if(err){
					console.log("cannot save favorite to databse");
					console.log(err);
				}
				if(succ){
					console.log("favorite stored to database");
					console.log(succ);
					callback(err, favorite);
				}
			})
		}
		if(err){
			console.log("error finding favorite");
			console.log(err);
		}
	})
}

UserSchema.methods.getScore = function(callback){
	var totalPercentage = 0;
	// var denominator = 0;

	var that = this;

	// get all a user's "favorites"
	Favorites
		.find({userId: this._id})
		.populate('songId')
		.exec(function(err, favorites) {
			if (err) {
				console.log(error)
				return callback(err);
			}
			var favLength = favorites.length;
			console.log("where the fuck is this shit", favLength);
			if (favLength === 0) {
				return callback(null, 0);
			}

			// iterate through favorites to calculate "score"
			favorites.forEach(function(fav, i) {
				// for every favorite, get percentage difference since first check
				fav.getDifference(that.scToken, function(err, perDiff) {
					// add total percentages
					totalPercentage += perDiff;

					// return callback in here on the last iteration bc async shit
					if (i + 1 === favLength) {
						that.score = totalPercentage / favLength;
						console.log(that.score);
						that.save(function(err, user) {
							return callback(null, user);
						})
					}

				})
			})
		// return callback(null, that)
	})

	// Favorites.find({userId: this._id}).populate('songId').exec(function(err, favorites){
	// 	// console.log("favorites before the conditional", favorites);

	// 	if(favorites && favorites.length > 0){
	// 		// console.log("this is favorites!!", favorites);
	// 		// console.log("Favorites.length", favorites.length);
	// 		var length = favorites.length;
	// 		// console.log("testing!!!", length);
	// 		var cb = function(){
	// 			length --;
	// 			if (length === 0){
	// 				// console.log("YOU GOT IN!! LENGTH IS : " + length);
	// 				// console.log("COMPLETED USER SCORING, SCORE IS " + (totalPercentage/denominator));
	// 				that.score = totalPercentage/denominator;
	// 				that.save(function(err, succ){
	// 					if(err){
	// 						console.log(err);
	// 						console.error("ERROR!!!!!", err);
	// 					}
	// 					if(succ){
	// 						// console.log(succ);
	// 						callback(succ);
	// 					}
	// 					if (!err && !succ) {
	// 						console.error("GOT NEITHER!!!");
	// 					}
	// 				})
	// 			}
	// 		};

	// 		favorites.forEach(function(favorite){
		// var currentlikes;
		// 		SC.init({
		// 		  id: 'bfd03479aef078b87807af6b0d9787ee',
		// 		  secret: '93229d86384dc973be18ad7b4fec3ca0',
		// 		  uri: 'http://localhost:3000/auth/soundcloud/callback',
		// 		  accessToken: that.scToken
		// 		});

		// 		var trackId = favorite.songId;
		// 		// var url = '/tracks/' + encodeURIComponent(trackId);
		// 		var url = '/tracks/' + trackId.songId;
		// 		// console.log(url);
		// 		SC.get(url, function(err, track) {
		// 			if(track){
		// 				currentlikes = track.favoritings_count;
		// 				var songScore = (currentlikes - initialLikes)/initialLikes;
		// 				totalPercentage += songScore;
		// 				denominator ++;
		// 				// console.log("total percent is: " + totalPercentage);
		// 				// console.log("denom is : " + denominator);
		// 				cb();
		// 			}
		// 			if (err){
		// 				console.log(err);
		// 			}
		// 		})
	// 		})
	// 	}
	// })
}

UserSchema.plugin(findOrCreate);
// Create all of your models/schemas here, as properties.
var models = {
	Song: mongoose.model('Song', SongSchema),
	User: mongoose.model('User', UserSchema),
	Favorites: mongoose.model('Favorites', FavoritesSchema)
};

module.exports = models;
