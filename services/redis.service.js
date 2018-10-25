

'use strict';

const config = require('../config/environment');
const redis = require("redis");
const logger = require('../logger/winston')('redis');

class Client {
  constructor(options) {
    this.opts = Object.assign({
      retry_strategy: () => 'nope' // do not retry
    }, config.codis, options);
  }

  get(...params) {
    if(!this.connected) {
      this.createClient();
    }

    this.client.get(...params);
  }

  set(...params) {
    if(!this.connected) {
      this.createClient();
    }

    this.client.set(...params);
  }

  mget(...params){
    if(!this.connected) {
      this.createClient();
    }

    this.client.mget(...params);
  }
  createClient() {
    let client = redis.createClient(this.opts);

    client.on('ready', () => {
      this.connected = true;
      logger.info('redis ready');
    });

    // client.on('connect', () => {
    //   this.connected = true;
    //   logger.info('redis connected');
    // });

    client.on('reconnecting', data => {
      this.connected = false;
      logger.info(`redis reconnecting: delay ${data.delay}ms, attempt ${data.attempt}`);
    });

    client.on('error', (err) => {
      this.connected = false;
      logger.error(err);
    });

    client.on('end', () => {
      this.connected = false;
      logger.info('redis end');
    });

    this.client = client;
  }
}

module.exports.Client = Client;
