import redis from 'redis';
import { logger } from 'pwc-us-agc-logger';

class Client {
  constructor() {
    this.client = null;
  }
  setClient(port, host) {
    if (port && host) {
      this.client = redis.createClient(port, host);
    } else {
      this.client = null;
    }
  }
  getClient() {
    if (this.client) {
      return this.client;
    }
    return null;
  }
  createClient(port, host) {
    if (port && host) {
      this.client = redis.createClient(port, host, {
        retry_strategy(options) {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
          }
          // reconnect after
          return Math.min(options.attempt * 100, 3000);
        }
      });
      this.client.on('error', (error) => {
        logger.log('error', `Unable to create redis client: ${error}`, {
          timestamp: Date.now()
        });
      });
      this.client.on('connect', () => {
        logger.log('debug', 'redis client successfully created', {
          timestamp: Date.now()
        });
      });
    } else {
      this.client = null;
    }
    return this.client;
  }
}
export default Client;
