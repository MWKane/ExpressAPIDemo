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


app.get('/api/books/:id', (req, res) => {
	res.send(`GET book: ${req.params.id}`);
});

app.post('/api/books', (req, res) => {
	let book = req.body;

	if (!verifyBookProps(book)) {
		res.send('ERROR: Book failed validation process.');
		res.end();

		return console.log('POST book failed.');
	};


	var sql = '';
	var values = [];
	if (book.hasOwnProperty('published')) {
		sql = 'INSERT INTO books (title, author, published) VALUES (?, ?, ?)';
		values = [book.title, book.author, book.published];
	} else {
		sql = 'INSERT INTO books (title, author) VALUES (?, ?)';
		values = [book.title, book.author];
	}

	db.run(sql, values, function(err) {
		if (err) {
			res.send('ERROR: Problem posting book to database.');
			return console.error(err.message);
		};

		console.log(`A book (${book.title}) has been POSTED: id = ${this.lastID}`);
		res.send(`${this.lastID}`);
	});

});

app.put('/api/books', (req, res) => {
	res.send(`PUT book: ${req.body}`);
});

app.delete('/api/books/:id', (req, res) => {
	res.send(`DELETE book: ${req.params.id}`);
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