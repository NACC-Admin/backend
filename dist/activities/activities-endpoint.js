"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeActivitiesEndpointHandler;

var _errors = require("../helpers/errors");

var _httpError = _interopRequireDefault(require("../helpers/http-error"));

var _activities = _interopRequireDefault(require("./activities"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeActivitiesEndpointHandler({
  activitiesQuery
}) {
  return async function handle(httpRequest) {
    switch (httpRequest.method) {
      case 'POST':
        return postActivities(httpRequest);

      case 'GET':
        return getActivities(httpRequest);

      case 'DELETE':
        return deleteActivities(httpRequest);

      default:
        return (0, _httpError.default)({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`
        });
    }
  };

  async function getActivities(httpRequest) {
    const {
      id
    } = httpRequest.queryParams || {};
    const {
      month
    } = httpRequest.queryParams || {};
    const {
      year
    } = httpRequest.queryParams || {};
    const {
      dday,
      dmonth,
      dyear
    } = httpRequest.queryParams || {}; //category and password

    const {
      max,
      before,
      after
    } = httpRequest.queryParams || {};

    if (dday !== undefined && dmonth !== undefined && dyear !== undefined) {
      const day = dday;
      const month = dmonth;
      const year = dyear;
      const result = await activitiesQuery.findByDaynMonthnYear({
        day,
        month,
        year
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } else if (month !== undefined) {
      const result = await activitiesQuery.findByMonth({
        month
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } else if (year !== undefined) {
      const result = await activitiesQuery.findByYear({
        year
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        data: JSON.stringify(result)
      };
    } else if (id !== undefined) {
      const result = await activitiesQuery.findById({
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
      const result = await activitiesQuery.getActivities({
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

  async function postActivities(httpRequest) {
    let activitiesInfo = httpRequest.body;

    if (!activitiesInfo) {
      return (0, _httpError.default)({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.'
      });
    }

    if (typeof httpRequest.body === 'string') {
      try {
        activitiesInfo = JSON.parse(activitiesInfo);
      } catch {
        return (0, _httpError.default)({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.'
        });
      }
    }

    try {
      const activities = (0, _activities.default)(activitiesInfo);
      const result = await activitiesQuery.add(activities);
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

  async function deleteActivities(httpRequest) {
    const {
      id
    } = httpRequest.queryParams || {};

    try {
      const result = await activitiesQuery.deleteById({
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
//# sourceMappingURL=activities-endpoint.js.map