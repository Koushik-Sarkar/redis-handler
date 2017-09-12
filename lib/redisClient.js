'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _pwcUsAgcLogger = require('pwc-us-agc-logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
  function Client() {
    _classCallCheck(this, Client);

    this.client = null;
  }

  _createClass(Client, [{
    key: 'setClient',
    value: function setClient(port, host) {
      if (port && host) {
        this.client = _redis2.default.createClient(port, host);
      } else {
        this.client = null;
      }
    }
  }, {
    key: 'getClient',
    value: function getClient() {
      if (this.client) {
        return this.client;
      }
      return null;
    }
  }, {
    key: 'createClient',
    value: function createClient(port, host) {
      if (port && host) {
        this.client = _redis2.default.createClient(port, host, {
          retry_strategy: function retry_strategy(options) {
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
        this.client.on('error', function (error) {
          _pwcUsAgcLogger.logger.log('error', 'Unable to create redis client: ' + error, {
            timestamp: Date.now()
          });
        });
        this.client.on('connect', function () {
          _pwcUsAgcLogger.logger.log('debug', 'redis client successfully created', {
            timestamp: Date.now()
          });
        });
      } else {
        this.client = null;
      }
      return this.client;
    }
  }]);

  return Client;
}();

exports.default = Client;