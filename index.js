const server = require('./api/server');
const { PORT } = require('./env_connect');

server.listen(PORT, () => {
    console.log(`--listening on port ${PORT}--`);
});
