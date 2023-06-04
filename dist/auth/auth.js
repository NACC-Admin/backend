"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeUser;

var _requiredParam = _interopRequireDefault(require("../helpers/required-param"));

var _errors = require("../helpers/errors");

var _isValidEmail = _interopRequireDefault(require("../helpers/is-valid-email.js"));

var _upperFirst = _interopRequireDefault(require("../helpers/upper-first"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeUser(userInfo = (0, _requiredParam.default)('userInfo')) {
  const validUser = validate(userInfo);
  const normalUser = normalize(validUser);
  return Object.freeze(normalUser);

  function validate({ ...otherInfo
  } = {}) {
    return { ...otherInfo
    };
  }

  function validateUser(label, name) {
    if (name.length < 2) {
      throw new _errors.InvalidPropertyError(`User's ${label} must be at least 2 characters long.`);
    }
  }

  function validateUser(email) {
    if (!(0, _isValidEmail.default)(email)) {
      throw new _errors.InvalidPropertyError('Invalid email address.');
    }
  }

  function normalize({ ...otherInfo
  }) {
    return { ...otherInfo
    };
  }
}
//# sourceMappingURL=auth.js.map