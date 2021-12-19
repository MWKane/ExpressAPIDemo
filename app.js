'use strict';


const express = require('express');
const sqlite = require('sqlite3');
const config = require('./config.json');


const app = express();
app.use(express.json());
app.listen(config.port, config.hostname, () => {
	console.log(`book_directory listening at http://${config.hostname}:${config.port}`);
});


const db = new sqlite.Database(config.database, sqlite.OPEN_READWRITE, err => {
	if (err) return console.error(err.message);
	console.log('Connected to database successfully');
});
process.on('exit', () => {
	db.close(err => {
		if (err) console.error(err.message);
	});
});

app.get('/api/books', (req, res) => {
	// Get all books
	var sql = 'SELECT * FROM books;';
	db.all(sql, [], (err, rows) => {
		if (err) {
			res.send('ERROR: problem retrieving books from database.');
			res.end();
			return console.error(err.message);
		};
		res.send(JSON.stringify(rows));
		res.end();
	});
});
app.get('/api/books/:id', (req, res) => {
	// Get book by id
	var sql = 'SELECT * FROM books WHERE id = ?;'
	db.all(sql, [req.params.id], (err, rows) => {
		if (err) {
			res.send('ERROR: Problem retrieving book from database.');
			res.end();
			return console.error(err.message);
		};
		res.send(JSON.stringify(rows[0]));
		res.end();
	});
});

app.post('/api/books', (req, res) => {
	var book = req.body;

	if (!verifyBookProps(book)) {
		res.send('ERROR: Book failed validation process.');
		res.end();
		return console.log('POST book failed validation.');
	};

	var sql = 'INSERT INTO books (title, author, published) VALUES (?, ?, ?);';
	db.run(sql, [book.title, book.author, book.published], function(err) {
		if (err) {
			res.send('ERROR: Problem posting book to database.');
			res.end();
			return console.error(err.message);
		};
		console.log(`A book (${book.title}) has been POSTED: id = ${this.lastID}`);
		res.send(`${this.lastID}`);
		res.end();
	});
});

app.put('/api/books', (req, res) => {
	var book = req.body;

	if (!verifyBookProps(book)) {
		res.send('ERROR: Book failed validation process.');
		res.end();
		return console.log('PUT book failed validation.');
	};

	var sql = 'INSERT INTO books (id, title, author, published) VALUES (?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET title = excluded.title, author = excluded.author, published = excluded.published;';
	db.run(sql, [book.id, book.title, book.author, book.published], function (err) {
		if (err) {
			res.send('ERROR: Problem posting book to database.');
			res.end();
			return console.error(err.message);
		};
		console.log(`A book (${book.title}) has been PUTTED: id = ${book.id || this.lastID}`);
		res.send(`${book.id || this.lastID}`);
		res.end();
	});
});

app.delete('/api/books/:id', (req, res) => {
	var sql = 'DELETE FROM books WHERE id = ?;';
	db.run(sql, [req.params.id], function(err) {
		if (err) {
			res.send('ERROR: Failed to delete book from database.');
			res.end();
			return console.error(err.message);
		};
		if (this.changes === 0) return res.send('ERROR: No book found.');

		console.log(`A book has been DELETED: id = ${req.params.id}`);
		res.send(`${this.changes}`);
		res.end();
	});
});


function verifyBookProps(book = {}) {
	if (!book.hasOwnProperty('title') || !book.hasOwnProperty('author')) return false;
	if (book.hasOwnProperty('published')) return validatePublishedDate(book.published);
	return true;
};

function validatePublishedDate(dateString = '') {
	// Test if dateString is a valid date not in yyyy-mm-dd format
	var regEx = /^\d{4}-\d{2}-\d{2}$/
	if (!dateString.match(regEx)) return false;

	// Test if given date is a valid calendar day
	var testDate = new Date(dateString);
	var dNum = testDate.getTime();
	if (!dNum && dNum !== 0) return false;
	return testDate.toISOString().slice(0,10) === dateString;
};