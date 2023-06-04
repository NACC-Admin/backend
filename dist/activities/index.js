"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _activitiesQuery = _interopRequireDefault(require("./activities-query"));

var _activitiesEndpoint = _interopRequireDefault(require("./activities-endpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = (0, _db.default)();
const activitiesQuery = (0, _activitiesQuery.default)({
  database
});
const activitiesEndpointHandler = (0, _activitiesEndpoint.default)({
  activitiesQuery
});
var _default = activitiesEndpointHandler;
exports.default = _default;
//# sourceMappingURL=index.js.map