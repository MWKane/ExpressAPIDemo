'use strict';

const http = require('http');
const config = require('../config.json');

const options = {
	hostname: config.hostname,
	port: config.port,
	path: '/api/books/100009',
	method: 'GET'
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

req.end();