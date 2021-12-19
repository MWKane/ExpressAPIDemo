'use strict';

const http = require('http');
const config = require('../config.json');

const book = JSON.stringify({
	title: 'To Kill a Mockingbird',
	author: 'Harper Lee',
	published: '1960-07-11'
});

const options = {
	hostname: config.hostname,
	port: config.port,
	path: '/api/books',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Content-Length': book.length
	}
};

const req = http.request(options, res => {
	console.log(`statusCode: ${res.statusCode}`);

	res.on('data', d => {
		process.stdout.write(d);
	});
});

req.on('error', err => {
	console.error(err.message);
});

req.write(book);
req.end();