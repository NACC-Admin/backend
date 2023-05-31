"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeSubscribersEndpointHandler;

var _errors = require("../helpers/errors");

var _httpError = _interopRequireDefault(require("../helpers/http-error"));

var _subscribers = _interopRequireDefault(require("./subscribers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeSubscribersEndpointHandler({
  subscribersQuery
}) {
  return async function handle(httpRequest) {
    switch (httpRequest.method) {
      case 'POST':
        return postSubscribers(httpRequest);

      case 'GET':
        return getSubscribers(httpRequest);

      case 'PUT':
        return updateSubscribers(httpRequest);

      case 'DELETE':
        return deleteSubscribers(httpRequest);

      default:
        return (0, _httpError.default)({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`
        });
    }
  };

  async function getSubscribers(httpRequest) {
    const {
      id
    } = httpRequest.queryParams || {}; // const { mid } = httpRequest.queryParams || {} 
    // const { memid } = httpRequest.queryParams || {} 
    // const { m_id, mem_id } = httpRequest.queryParams || {} 

    const {
      max,
      before,
      after
    } = httpRequest.queryParams || {};

    if (id !== undefined) {
      const result = await subscribersQuery.findById({
        id
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } else {
      const result = await subscribersQuery.getSubscribers({
        max,
        before,
        after
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    }
  }

  async function postSubscribers(httpRequest) {
    let subInfo = httpRequest.body;

    if (!subInfo) {
      return (0, _httpError.default)({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.'
      });
    }

    if (typeof httpRequest.body === 'string') {
      try {
        subInfo = JSON.parse(subInfo);
      } catch {
        return (0, _httpError.default)({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.'
        });
      }
    }

    try {
      if (httpRequest.path == '/follower/update-member') {
        const subscriber = (0, _subscribers.default)(subInfo);
        const result = await subscribersQuery.updateSub(subscriber);
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 201,
          data: JSON.stringify(result)
        };
      } else {
        const subscriber = (0, _subscribers.default)(subInfo);
        const result = await subscribersQuery.add(subscriber);
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 201,
          data: JSON.stringify(result)
        };
      }
    } catch (e) {
      return (0, _httpError.default)({
        errorMessage: e.message,
        statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
      });
    }
  }

  async function updateSubscribers(httpRequest) {
    let subInfo = httpRequest.body;

    if (!subInfo) {
      return (0, _httpError.default)({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.'
      });
    }

    if (typeof httpRequest.body === 'string') {
      try {
        subInfo = JSON.parse(subInfo);
      } catch {
        return (0, _httpError.default)({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.'
        });
      }
    }

    try {
      const subscriber = makeSubscriber(subInfo);
      const result = await subscriberQuery.update(subscriber);
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 201,
        data: JSON.stringify(result)
      };
    } catch (e) {
      return (0, _httpError.default)({
        errorMessage: e.message,
        statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
      });
    }
  }

  async function deleteSubscribers(httpRequest) {
    const {
      id
    } = httpRequest.queryParams || {}; // const { customer_id } = httpRequest.pathParams || {}

    try {
      const result = await subscriberQuery.deleteById({
        id
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } catch (e) {
      return (0, _httpError.default)({
        errorMessage: e.message,
        statusCode: e instanceof _errors.UniqueConstraintError ? 409 : e instanceof _errors.InvalidPropertyError || e instanceof _errors.RequiredParameterError ? 400 : 500
      });
    }
  }
}
//# sourceMappingURL=subscribers-endpoint.js.map