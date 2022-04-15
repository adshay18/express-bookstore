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
		let testBook2 = Book.create({
			isbn: '0000000002',
			amazon_url: 'http://test.website.com',
			author: 'Test Author2',
			language: 'english',
			pages: 123,
			publisher: 'Test Book Publisher',
			title: 'Testing Books: The SQL',
			year: 2022
		});
	});

	/** GET / => {books: [book, ...]}  */
	describe('GET /books', function() {
		test('can get list of all books', async function() {
			let response = await request(app).get('/books');
			expect(response.body.books.length).toEqual(2);
			expect(response.statusCode).toEqual(200);
		});
	});

	/** GET /[isbn]  => {book: book} */
	describe('GET /books/:isbn', function() {
		test('can get one book', async function() {
			let response = await request(app).get('/books/0000000001');
			expect(response.body).toEqual({
				book: {
					isbn: '0000000001',
					amazon_url: 'http://test.website.com',
					author: 'Test Author',
					language: 'english',
					pages: 999,
					publisher: 'Test Book Publisher',
					title: 'Testing Books: How to Test',
					year: 2022
				}
			});
			expect(response.statusCode).toEqual(200);
		});
		test('returns 404 status code for invalid isbn', async function() {
			let response = await request(app).get('/books/0000330002');
			expect(response.statusCode).toEqual(404);
		});
	});

	/** POST /   bookData => {book: newBook}  */
	describe('POST /books', function() {
		test('creates and validates book request', async function() {
			let newBook = {
				book: {
					isbn: '0000002341',
					amazon_url: 'http://test.website.com',
					author: 'Book Creator',
					language: 'english',
					pages: 1,
					publisher: 'Test Book Publisher',
					title: 'How to Make a Book Using Node',
					year: 2022
				}
			};
			let response = await request(app).post('/books').send(newBook);
			expect(response.body).toEqual(newBook);
			expect(response.statusCode).toEqual(201);
		});
		test('returns status code 400 for bad book request', async function() {
			let badBook = {
				book: {
					isbn: '0000053241',
					publisher: 'Test Book Publisher',
					title: 'How to Make a Book Using Node',
					year: 2022
				}
			};
			let response = await request(app).post('/books').send(badBook);
			console.log(response.body);
			expect(response.statusCode).toEqual(400);
		});
	});
});

// Sever db connection
afterAll(async function() {
	await db.end();
});
