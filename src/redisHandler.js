import dotenv from 'dotenv';
import { log } from 'logger-handler';
import status from 'http-status';
import Client from './redisClient';

dotenv.config();

const USE_REDIS = process.env.USE_REDIS;

class RedisHandler {
  constructor(port, host) {
    if (USE_REDIS) {
      if (USE_REDIS === 'Y') {
        this.client = (new Client()).createClient(port, host);
      } else {
        this.client = null;
      }
    } else {
      this.client = (new Client()).createClient(port, host);
    }
    this.logger = log.getLogger(process.env.LOG_LEVEL);
  }
  retrieve(key) {
    if (this.client === null) {
      if (USE_REDIS) {
        if (USE_REDIS === 'Y') {
          this.logger.log('error', 'Redis cache Client is not configured', {
            timestamp: Date.now()
          });
        }
      } else {
        this.logger.log('error', 'Redis cache Client is not configured', {
          timestamp: Date.now()
        });
      }
      return Promise.resolve({
        message: 'No Redis Client set',
        data: null,
        code: status.INTERNAL_SERVER_ERROR
      });
    }
    return new Promise((resolve) => {
      if (key) {
        this.client.get(key, (err, res) => {
          if (err) {
            this.logger.log('error', `Error - while retrieving data from cache with key ${key} in  redis cache : ${err.message}`, {
              timestamp: Date.now()
            });
            resolve({
              message: 'Unable to retrieve data from redis',
              data: null,
              code: status.INTERNAL_SERVER_ERROR,
              error: err.messgae
            });
          } else if (res) {
            this.logger.log('info', `Info - found data in cache with key ${key}`, {
              timestamp: Date.now()
            });
            resolve({
              message: 'Successfully retrieve data from redis',
              data: JSON.parse(res),
              code: status.OK
            });
          } else {
            this.logger.log('info', `Info - No data found in cache with key ${key}`, {
              timestamp: Date.now()
            });
            resolve({
              message: 'No data found from redis',
              data: res,
              code: status.NOT_FOUND
            });
          }
        });
      } else {
        this.logger.log('error', `Invalid key provided ${key} to retrieve data from redis cache`, {
          timestamp: Date.now()
        });
        resolve({
          message: 'Unable to retrieve data from redis',
          data: null,
          code: status.BAD_REQUEST,
          error: 'No valid key provided'
        });
      }
    });
  }
  store(key, data, expiry) {
    if (this.client === null) {
      if (USE_REDIS) {
        if (USE_REDIS === 'Y') {
          this.logger.log('error', 'Redis cache Client is not configured', {
            timestamp: Date.now()
          });
        }
      } else {
        this.logger.log('error', 'Redis cache Client is not configured', {
          timestamp: Date.now()
        });
      }
      return Promise.resolve({
        message: 'No Redis Client set',
        code: status.INTERNAL_SERVER_ERROR
      });
    }
    return new Promise((resolve) => {
      if (key) {
        this.client.set(key, JSON.stringify(data), 'EX', expiry, (err) => {
          if (err) {
            this.logger.log('error', `Error - while storing data in cache with key ${key} : ${err.message}`, {
              timestamp: Date.now()
            });
            resolve({
              message: 'Unable to store data in redis',
              code: status.INTERNAL_SERVER_ERROR,
              error: err.message
            });
          } else {
            this.logger.log('info', `Info - Store data in cache with key ${key}`, {
              timestamp: Date.now()
            });
            resolve({
              message: 'Data store in redis',
              code: status.OK
            });
          }
        });
      } else {
        this.logger.log('error', `Invalid key ${key} provided to store data from redis cache`, {
          timestamp: Date.now()
        });
        resolve({
          message: 'Unable to store data in redis',
          code: status.BAD_REQUEST,
          error: 'No valid key provided'
        });
      }
    });
  }
  remove(key) {
    if (this.client === null) {
      if (USE_REDIS) {
        if (USE_REDIS === 'Y') {
          this.logger.log('error', 'Redis cache Client is not configured', {
            timestamp: Date.now()
          });
        }
      } else {
        this.logger.log('error', 'Redis cache Client is not configured', {
          timestamp: Date.now()
        });
      }
      return Promise.resolve({
        message: 'No Redis Client set',
        code: status.INTERNAL_SERVER_ERROR
      });
    }
    return new Promise((resolve) => {
      if (key) {
        this.client.del(key, (err, res) => {
          if (err) {
            this.logger.log('error', `Error - while removing key ${key} from  redis cache : ${err.message}`, {
              timestamp: Date.now()
            });
            resolve({
              message: 'Unable to remove key from cache',
              code: status.INTERNAL_SERVER_ERROR,
              error: err.messgae
            });
          } else if (res) {
            this.logger.log('info', `Successfully remove key ${key} from redis cache`, {
              timestamp: Date.now()
            });
            resolve({
              message: 'Successfully remove key from cache',
              code: status.OK
            });
          } else {
            this.logger.log('info', `Info - No such key ${key} found in cache`, {
              timestamp: Date.now()
            });
            resolve({
              message: 'No such key found in cache',
              code: status.NOT_FOUND
            });
          }
        });
      } else {
        this.logger.log('error', `Invalid key provided ${key}`, {
          timestamp: Date.now()
        });
        resolve({
          message: 'No such key found in cache',
          code: status.NOT_FOUND,
          error: 'No valid key provided'
        });
      }
    });
  }
}

export default RedisHandler;
