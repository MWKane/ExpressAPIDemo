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
	if (!verifyBook(req.body)) {
		res.send('Error processing book data.');
		res.end();

		return console.log('POST book failed.');
	};

	console.log(`POST book: ${req.body.title}`);
	res.json(req.body);
});

app.put('/api/books', (req, res) => {
	res.send(`PUT book: ${req.body}`);
});

app.delete('/api/books/:id', (req, res) => {
	res.send(`DELETE book: ${req.params.id}`);
});


function verifyBook(book = {}) {
	if (book.hasOwnProperty('title') && book.hasOwnProperty('author')) return true;
	return false;
};