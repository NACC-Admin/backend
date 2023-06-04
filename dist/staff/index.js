"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _staffQuery = _interopRequireDefault(require("./staff-query"));

var _staffEndpoint = _interopRequireDefault(require("./staff-endpoint"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = (0, _db.default)();
const staffQuery = (0, _staffQuery.default)({
  database
});
const staffEndpointHandler = (0, _staffEndpoint.default)({
  staffQuery
});
var _default = staffEndpointHandler;
exports.default = _default;
//# sourceMappingURL=index.js.map