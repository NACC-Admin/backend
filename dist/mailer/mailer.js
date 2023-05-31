"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeMailer;

var _requiredParam = _interopRequireDefault(require("../helpers/required-param"));

var _errors = require("../helpers/errors");

var _isValidEmail = _interopRequireDefault(require("../helpers/is-valid-email.js"));

var _upperFirst = _interopRequireDefault(require("../helpers/upper-first"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeMailer(mailerInfo = (0, _requiredParam.default)('mailerInfo')) {
  const validMailer = validate(mailerInfo);
  const normalMailer = normalize(validMailer);
  return Object.freeze(normalMailer);

  function validate({ // customer_id = requiredParam('customer_id'),
    // status = requiredParam('status'),
    ...otherInfo
  } = {}) {
    //validateName('surname', surname)
    //validateName('othernames', othernames)
    return { ...otherInfo
    };
  }

  function normalize({ ...otherInfo
  }) {
    return { ...otherInfo
    };
  }
}
//# sourceMappingURL=mailer.js.map