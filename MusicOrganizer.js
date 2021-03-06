/* Created by JONATHAN KU at 7/9/16 */

var MusicOrganizer = function(songs) {

	this.allSongs = songs;
	this.orderedSongs = [];
	this.unorderedSongs = [];

	this.Song = function(songID, percentIncrease, songName) {
		this.songID = songID;
		this.percentIncrease = percentIncrease;
		this.songName = songName;
	}
};

// MusicOrganizer.prototype.getOrderedSongs = function() {

// 	for (var i = 0; i < songs.length; i++) {
// 		var currentSong = songs[i];
// 		var currentSongInitialLikes = currentSong.initialLikes;
// 		var currentSongCurrentLikes = currentSong.currentLikes;
// 		var songName = currentSong.songName;
// 		var songId = currentSong.songID;

// 		if (currentSongInitialLikes === 0) {
// 			throw new Error('Song has 0 initial likes. This should not happen...');
// 		}
		
// 		var percentIncrease = (currentSongCurrentLikes - currentSongInitialLikes) / currentSongInitialLikes;
// 		var newSong = this.Song(songId, percentIncrease, songName);
// 		this.unorderedSongs.push(newSong);
// 	}

// 	var intermediaryArray = this.unorderedSongs;

// 	intermediaryArray.sort(function(a, b) {
// 		return b.percentIncrease - a.percentIncrease;
// 	});

// 	this.orderedSongs = intermediaryArray;
// 	return this.orderedSongs;
// };

// MusicOrganizer.prototype.getSongs = function() {

// 	if (this.unorderedSongs.length === 0) {
// 		throw new Error('No songs stored...');
// 	}

// 	return this.unorderedSongs;
// };

MusicOrganizer.prototype.getPercentIncreaseOfSong = function(song) {

	if (this.unorderedSongs.length === 0) {
		throw new Error('No songs stored...');
	}

	var thisSong = songs;
	var thisSongId = thisSong.songID;

	for (var i = 0; i < this.orderedSongs.length; i++) {
		var currentSong = this.orderedSongs[i];
		if (currentSong.songID === song.songID) {
			return currentSong.percentIncrease;
		}
	}

	throw new Error("Didn't find the song you searched for...");
};

MusicOrganizer.prototype.averageIncrease = function() {
	//IMPLEMENT
	if (this.unorderedSongs.length === 0) {
		throw new Error('No songs stored...');
	}

	var currentTotal = 0;
	for (var i = 0; i < this.unorderedSongs.length; i++) {
		currentTotal += this.unorderedSongs[i].percentIncrease;
	}

	return currentTotal / this.unorderedSongs.length;
};

module.exports = MusicOrganizer;
