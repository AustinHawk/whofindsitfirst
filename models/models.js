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
	},
	userName: {
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
		else{
			// put in callback (this way length will go to 0 in prev function)
			callback(err, favorite);
		}
		if(err){
			console.log("error finding favorite");
			console.log(err);
		}
	})
}

UserSchema.methods.getScore = function(callback){
	var totalPercentage = 0;
	var denominator = 0;
	var that = this;
	console.log("THIS IS THE USER WOOOOO", this);
	Favorites.find({userId: this._id})
	.populate('songId')
	.exec(function(err, favorites){
		console.log("ERR IS : ", err, "FAVES IS", favorites)
		if(favorites && favorites.length > 0){
			var length = favorites.length;
			var cb = function(){
				length --;
				if (length === 0){
					console.log("COMPLETED USER SCORING, SCORE IS " + (totalPercentage/denominator));
					that.score = totalPercentage/denominator;
					that.save(function(err, succ){
						if(err){
							console.log(err);
						}
						if(succ){
							console.log(succ);
							callback(succ);
						}
					})
				}
			};

			favorites.forEach(function(favorite){
				var initialLikes = favorite.songId.initialLikes;
				var currentlikes;
				SC.init({
				  id: 'bfd03479aef078b87807af6b0d9787ee',
				  secret: '93229d86384dc973be18ad7b4fec3ca0',
				  uri: 'http://localhost:3000/auth/soundcloud/callback',
				  accessToken: that.scToken
				});

				var trackId = favorite.songId;
				var url = '/tracks/' + trackId.songId;
				SC.get(url, function(err, track) {
					if(track){
						currentlikes = track.favoritings_count;
						var songScore = (currentlikes - initialLikes)/initialLikes;
						totalPercentage += songScore;
						denominator ++;
						console.log("total percent is: " + totalPercentage);
						console.log("denom is : " + denominator);
						cb();
					}
					if (err){
						console.log(err);
					}
				})
			})
		}
	})
}

UserSchema.plugin(findOrCreate);
// Create all of your models/schemas here, as properties.
var models = {
	Song: mongoose.model('Song', SongSchema),
	User: mongoose.model('User', UserSchema),
	Favorites: mongoose.model('Favorites', FavoritesSchema)
};

module.exports = models;
