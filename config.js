/** Common config for bookstore. */
const jsonschema = require('jsonschema');
const ExpressError = require('../expressError');

let DB_URI = `postgresql://`;

if (process.env.NODE_ENV === 'test') {
	DB_URI = `${DB_URI}/books-test`;
} else {
	DB_URI = process.env.DATABASE_URL || `${DB_URI}/books`;
}

function validate(request, schema) {
	const result = jsonschema.validate(request, schema);
	if (!result.valid) {
		let listOfErrors = result.errors.map((error) => error.stack);
		throw new ExpressError(listOfErrors, 400);
	}
}

module.exports = { DB_URI, validate };
