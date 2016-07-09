var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

// Create a connect.js inside the models/ directory that
// exports your MongoDB URI!
var connect = process.env.MONGODB_URI || require('./connect');

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

var UserSchema = new mongoose.Schema({
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		fId: {
			type: String
		},
		soundcloudId: {
			type: String
		}
	});

UserSchema.plugin(findOrCreate);
// Create all of your models/schemas here, as properties.
var models = {
	Contact: mongoose.model('Contact', {
		email: {
			type: String,
			required: true
		},
		phone: {
			type: String,
			required: true
		},
		owner: {
			type: String,
			required: true
		}
	}),

	User: mongoose.model('User', UserSchema)
};

module.exports = models;
