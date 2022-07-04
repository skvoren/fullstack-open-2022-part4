const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
	title: String,
	author: {
		type: String,
		required: true
	},
	url: String,
	likes: {
		type: Number,
		default: 0
	}
})

blogSchema.set('toJSON', {
	transform: (returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject.__id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Blog', blogSchema)
