"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _subscribersQuery = _interopRequireDefault(require("./subscribers-query"));

var _subscribersEndpoint = _interopRequireDefault(require("./subscribers-endpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = (0, _db.default)();
const subscribersQuery = (0, _subscribersQuery.default)({
  database
});
const subscribersEndpointHandler = (0, _subscribersEndpoint.default)({
  subscribersQuery
});
var _default = subscribersEndpointHandler;
exports.default = _default;
//# sourceMappingURL=index.js.map