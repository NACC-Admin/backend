"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeMailerEndpointHandler;

var _errors = require("../helpers/errors");

var _httpError = _interopRequireDefault(require("../helpers/http-error"));

var _mailer = _interopRequireDefault(require("./mailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeMailerEndpointHandler({
  mailerQuery
}) {
  return async function handle(httpRequest) {
    switch (httpRequest.method) {
      case 'POST':
        return postMailer(httpRequest);

      case 'GET':
        return getMessages(httpRequest);

      default:
        return (0, _httpError.default)({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`
        });
    }
  };

  async function getMessages(httpRequest) {
    const {
      max,
      before,
      after
    } = httpRequest.queryParams || {};
    const result = await mailerQuery.getMessages({
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

  async function postMailer(httpRequest) {
    let mailerInfo = httpRequest.body;

    if (!mailerInfo) {
      return (0, _httpError.default)({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.'
      });
    }

    if (typeof httpRequest.body === 'string') {
      try {
        mailerInfo = JSON.parse(mailerInfo);
      } catch {
        return (0, _httpError.default)({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.'
        });
      }
    }

    try {
      const mailer = (0, _mailer.default)(mailerInfo);
      const result = await mailerQuery.add(mailer);
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
}
//# sourceMappingURL=mailer-endpoint.js.map