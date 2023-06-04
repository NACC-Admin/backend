"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = adaptRequest;

function adaptRequest(req = {}) {
  return Object.freeze({
    path: req.path,
    method: req.method,
    pathParams: req.params,
    queryParams: req.query,
    headers: req.headers,
    body: req.body
  });
}
//# sourceMappingURL=adapt-request.js.map