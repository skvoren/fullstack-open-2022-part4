const {config} = require('dotenv')
require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
	? process.env.MONGODB_URI_TEST
	: process.env.MONGODB_URI

const SECRET = process.env.SECRET

const TEST_USERNAME = process.env.TEST_USERNAME
const TEST_PASSWORD = process.env.TEST_PASSWORD

module.exports = {
	PORT,
	MONGODB_URI,
	SECRET,
	TEST_USERNAME,
	TEST_PASSWORD
}
