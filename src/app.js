require('dotenv').config();
const createServer = require('./Infrastructure/http/createServer');
const container = require('./Infrastructure/container');

(async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();
