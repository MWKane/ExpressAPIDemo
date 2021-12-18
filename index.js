'use strict';

const express = require('express');
const sqlite = require('sqlite3');
const config = require('./config.json');

const app = express();

const db = new sqlite.Database(config.database, sqlite.OPEN_READWRITE, err => {
	if (err) return console.error(err.message);

	console.log('Connected to database successfully');
});


app.get('/api/books/:id', (req, res) => {
	res.send(`GET book: ${req.params.id}`);
});

app.post('/api/books', (req, res) => {
	res.send(`POST book: ${req.body}`);
});

app.put('/api/books', (req, res) => {
	res.send(`PUT book: ${req.body}`);
});

app.delete('/api/books/:id', (req, res) => {
	res.send(`DELETE book: ${req.params.id}`);
});


app.listen(config.port, config.hostname, () => {
	console.log(`book_directory listening at http://${config.hostname}:${config.port}`);
});


process.on('exit', () => {
	db.close(err => {
		if (err) console.error(err.message);
	});
});