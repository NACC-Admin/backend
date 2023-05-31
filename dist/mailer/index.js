"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _mailerQuery = _interopRequireDefault(require("./mailer-query"));

var _mailerEndpoint = _interopRequireDefault(require("./mailer-endpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = (0, _db.default)();
const mailerQuery = (0, _mailerQuery.default)({
  database
});
const mailerEndpointHandler = (0, _mailerEndpoint.default)({
  mailerQuery
});
var _default = mailerEndpointHandler;
exports.default = _default;
//# sourceMappingURL=index.js.map