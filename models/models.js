var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

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
		if(err){
			console.log("error finding favorite");
			console.log(err);
		}
	})
}

// FavoritesSchema.methods.addSongs = function(user, songId, callback){
// 	Song.find({songId: songId}, function(err, song){
// 		if(err){
// 			console.log("cannot look up song by id");
// 			console.log(err);
// 		}
		
// 		if(song && song.length === 0){
// 			newSong.save(function(error,success){
// 				if (error){
// 					console.log("cannot save song to database");
// 					console.log(error);
// 				}
// 				if (success){
// 					console.log(success);
// 					console.log("SAVED Song");
// 					user.assignFavorites(success._id, function(err, success){
// 						if (success){
// 							console.log(success);
// 							// res.send("HELLO");
// 							// res.redirect('/fetchData');
// 						}
// 					});
// 					callback(err, song);
// 					console.log("SAVED FAV");
// 				}
// 			})
// 		}
// 		else {
// 			callback(err, song);
// 		};
		// else{
		// 	res.render('update',{
		// 		data: favorites,
		// 		layout: false
		// 	})
		// }
	// })
// }

UserSchema.plugin(findOrCreate);
// Create all of your models/schemas here, as properties.
var models = {
	Song: mongoose.model('Song', SongSchema),
	User: mongoose.model('User', UserSchema),
	Favorites: mongoose.model('Favorites', FavoritesSchema)
};

module.exports = models;
