var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

// Create a connect.js inside the models/ directory that
// exports your MongoDB URI!
var connect = process.env.MONGODB_URI || require('./connect');

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

var UserSchema = new mongoose.Schema({
<<<<<<< HEAD
		username: {
=======
		email: {
>>>>>>> spark
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		fId: {
			type: String
<<<<<<< HEAD
		},
		phone: {
			type: String,
			required: true
=======
>>>>>>> spark
		}
	});

UserSchema.plugin(findOrCreate);
// Create all of your models/schemas here, as properties.
var models = {
	Contact: mongoose.model('Contact', {
<<<<<<< HEAD
		name: {
=======
		email: {
>>>>>>> spark
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

	User: mongoose.model('User', UserSchema),

	Message: mongoose.model('Message', {
		created: {
			type: Date,
			required: true
		},
		content: {
			type: String,
			required: true
		},
		user: {
			type: String,
			required: true
		},
		contact: {
			type: String,
			required: true
		},
		status: {
			type: String,
			required: true
		},
		from: {
			type: String,
			required: true
		},
		timeToSend: {
			type: Date
		}
	})
};

module.exports = models;
