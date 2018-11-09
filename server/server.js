const express = require('express');

const projectsRouter = require('../endpoints/projects.js');
const actionsRouter = require('../endpoints/actions.js');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running' });
});

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

module.exports = server;