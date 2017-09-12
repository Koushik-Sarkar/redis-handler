'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _pwcUsAgcLogger = require('pwc-us-agc-logger');

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _redisClient = require('./redisClient');

var _redisClient2 = _interopRequireDefault(_redisClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_dotenv2.default.config();

var USE_REDIS = process.env.USE_REDIS;

var RedisHandler = function () {
  function RedisHandler(port, host) {
    _classCallCheck(this, RedisHandler);

    if (USE_REDIS) {
      if (USE_REDIS === 'Y') {
        this.client = new _redisClient2.default().createClient(port, host);
      } else {
        this.client = null;
      }
    } else {
      this.client = new _redisClient2.default().createClient(port, host);
    }
    this.logger = _pwcUsAgcLogger.log.getLogger(process.env.LOG_LEVEL);
  }

  _createClass(RedisHandler, [{
    key: 'retrieve',
    value: function retrieve(key) {
      var _this = this;

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
          code: _httpStatus2.default.INTERNAL_SERVER_ERROR
        });
      }
      return new Promise(function (resolve) {
        if (key) {
          _this.client.get(key, function (err, res) {
            if (err) {
              _this.logger.log('error', 'Error - while retrieving data from cache with key ' + key + ' in  redis cache : ' + err.message, {
                timestamp: Date.now()
              });
              resolve({
                message: 'Unable to retrieve data from redis',
                data: null,
                code: _httpStatus2.default.INTERNAL_SERVER_ERROR,
                error: err.messgae
              });
            } else if (res) {
              _this.logger.log('info', 'Info - found data in cache with key ' + key, {
                timestamp: Date.now()
              });
              resolve({
                message: 'Successfully retrieve data from redis',
                data: JSON.parse(res),
                code: _httpStatus2.default.OK
              });
            } else {
              _this.logger.log('info', 'Info - No data found in cache with key ' + key, {
                timestamp: Date.now()
              });
              resolve({
                message: 'No data found from redis',
                data: res,
                code: _httpStatus2.default.NOT_FOUND
              });
            }
          });
        } else {
          _this.logger.log('error', 'Invalid key provided ' + key + ' to retrieve data from redis cache', {
            timestamp: Date.now()
          });
          resolve({
            message: 'Unable to retrieve data from redis',
            data: null,
            code: _httpStatus2.default.BAD_REQUEST,
            error: 'No valid key provided'
          });
        }
      });
    }
  }, {
    key: 'store',
    value: function store(key, data, expiry) {
      var _this2 = this;

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
          code: _httpStatus2.default.INTERNAL_SERVER_ERROR
        });
      }
      return new Promise(function (resolve) {
        if (key) {
          _this2.client.set(key, JSON.stringify(data), 'EX', expiry, function (err) {
            if (err) {
              _this2.logger.log('error', 'Error - while storing data in cache with key ' + key + ' : ' + err.message, {
                timestamp: Date.now()
              });
              resolve({
                message: 'Unable to store data in redis',
                code: _httpStatus2.default.INTERNAL_SERVER_ERROR,
                error: err.message
              });
            } else {
              _this2.logger.log('info', 'Info - Store data in cache with key ' + key, {
                timestamp: Date.now()
              });
              resolve({
                message: 'Data store in redis',
                code: _httpStatus2.default.OK
              });
            }
          });
        } else {
          _this2.logger.log('error', 'Invalid key ' + key + ' provided to store data from redis cache', {
            timestamp: Date.now()
          });
          resolve({
            message: 'Unable to store data in redis',
            code: _httpStatus2.default.BAD_REQUEST,
            error: 'No valid key provided'
          });
        }
      });
    }
  }, {
    key: 'remove',
    value: function remove(key) {
      var _this3 = this;

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
          code: _httpStatus2.default.INTERNAL_SERVER_ERROR
        });
      }
      return new Promise(function (resolve) {
        if (key) {
          _this3.client.del(key, function (err, res) {
            if (err) {
              _this3.logger.log('error', 'Error - while removing key ' + key + ' from  redis cache : ' + err.message, {
                timestamp: Date.now()
              });
              resolve({
                message: 'Unable to remove key from cache',
                code: _httpStatus2.default.INTERNAL_SERVER_ERROR,
                error: err.messgae
              });
            } else if (res) {
              _this3.logger.log('info', 'Successfully remove key ' + key + ' from redis cache', {
                timestamp: Date.now()
              });
              resolve({
                message: 'Successfully remove key from cache',
                code: _httpStatus2.default.OK
              });
            } else {
              _this3.logger.log('info', 'Info - No such key ' + key + ' found in cache', {
                timestamp: Date.now()
              });
              resolve({
                message: 'No such key found in cache',
                code: _httpStatus2.default.NOT_FOUND
              });
            }
          });
        } else {
          _this3.logger.log('error', 'Invalid key provided ' + key, {
            timestamp: Date.now()
          });
          resolve({
            message: 'No such key found in cache',
            code: _httpStatus2.default.NOT_FOUND,
            error: 'No valid key provided'
          });
        }
      });
    }
  }]);

  return RedisHandler;
}();

exports.default = RedisHandler;