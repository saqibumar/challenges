'use strict';

const server = require('./server');

const { port } = require('./config').server;
const { host } = process.env.HOST;

const http = require('http');
const https = require('https');
const Koa = require('koa');
const app = new Koa();
// Settings
const HOST = process.env.HOST; //'localhost';
const HTTP_PORT = process.env.PORT; //3000;

async function bootstrap() {
  /**
   * Add external services init as async operations (db, redis, etc...)
   * e.g.
   * await sequelize.authenticate()
   */
  // Listen
  return http.createServer(server.callback()).listen(HTTP_PORT, HOST, ()=>{
    //console.log(HOST);
  })
  // return http.createServer(server.callback()).listen(HTTP_PORT);
  
}

bootstrap()
  .then(server => {
      console.log(server.address())
      console.log(`🚀 Server listening on ${server.address().address} port ${server.address().port}!`);
      //console.log(`Server started on ${protocol}://${address}:${port}`);
    }
  )
  .catch(err => {
    setImmediate(() => {
      console.error('Unable to run the server because of the following error:');
      console.error(err);
      process.exit();
    });
  });
