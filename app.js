const express = require('express');

const morgan = require('morgan');

const server = express();

server.name = 'API';

server.use(morgan("dev"))

server.use(express.json())


module.exports = server;
