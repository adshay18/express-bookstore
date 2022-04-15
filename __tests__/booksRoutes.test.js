const request = require('supertest');
const app = require('../app');
const db = require('../db');
const Book = require('../models/book');

// Set app to testing environment
process.env.NODE_ENV = 'test';

describe('Book route test', function() {
	beforeEach(async function() {
		// Empty db
		await db.query(`DELETE from books`);
		// Populate db
		let testBook = Book.create({
			isbn: '0000000001',
			amazon_url: 'http://test.website.com',
			author: 'Test Author',
			language: 'english',
			pages: 999,
			publisher: 'Test Book Publisher',
			title: 'Testing Books: How to Test',
			year: 2022
		});
	});
	/** GET / => {books: [book, ...]}  */
	describe('GET /books', function() {
		test('can get books', async function() {
			let response = await request(app).get('/books');
			expect(response.body).toEqual({
				books: [
					{
						isbn: '0000000001',
						amazon_url: 'http://test.website.com',
						author: 'Test Author',
						language: 'english',
						pages: 999,
						publisher: 'Test Book Publisher',
						title: 'Testing Books: How to Test',
						year: 2022
					}
				]
			});
			expect(response.statusCode).toEqual(200);
		});
	});
});

// Sever db connection
afterAll(async function() {
	await db.end();
});
