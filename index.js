const server = require('./server/server.js');

const port = 8333;

server.listen(port, () =>
    console.log(`API running on port ${port}`));