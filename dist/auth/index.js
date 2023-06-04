"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _authQuery = _interopRequireDefault(require("./auth-query"));

var _authEndpoint = _interopRequireDefault(require("./auth-endpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = (0, _db.default)();
const authQuery = (0, _authQuery.default)({
  database
});
const authEndpointHandler = (0, _authEndpoint.default)({
  authQuery
});
var _default = authEndpointHandler;
exports.default = _default;
//# sourceMappingURL=index.js.map