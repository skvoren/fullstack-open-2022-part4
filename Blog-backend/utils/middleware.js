const logger = require('./logger')
const {error} = require("./logger");
const {request, response} = require("express");
const jwt = require("jsonwebtoken");
const {SECRET} = require("./config");

const reqLogger = (request, response, next) => {
	logger.info('Method:', request.method)
	logger.info('Path:  ', request.path)
	logger.info('Body:  ', request.body)
	logger.info('---')
	next()
}

const unknownEndpoint = (request, response) => {
	response.status(404).send('unknown endpoint')
}

const errorHandler = (error, request, response, next) => {
	logger.info(error.message)

	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return response.status(400).send({error: 'malformatted id'})
	}
	if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({ error: 'invalid token'})
	}

	next(error)
}

const tokenExtractor = (request, response, next) => {
	const getTokenFrom = request => {
		const auth = request.get('authorization')
		if (auth && auth.toLowerCase().startsWith('bearer ')) {
			return auth.substring(7)
		}
		return null
	}
	const token = getTokenFrom(request)
	const decodedToken = jwt.verify(token, SECRET)

	if (!decodedToken.id) {
		return response.status(401).json({error: 'token missing or invalid'})
	}

	request.token = decodedToken
	next()
}

module.exports = {
	reqLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor
}
