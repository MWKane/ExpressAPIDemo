'use strict';

const express = require('express');
const app = express();
const port = 3000;


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


app.listen(port, () => {
	console.log(`book_directory listening at http://localhost:${port}`);
});