"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _auth = _interopRequireDefault(require("./auth"));

var _staff = _interopRequireDefault(require("./staff"));

var _activities = _interopRequireDefault(require("./activities"));

var _subscribers = _interopRequireDefault(require("./subscribers"));

var _mailer = _interopRequireDefault(require("./mailer"));

var _adaptRequest = _interopRequireDefault(require("./helpers/adapt-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cors = require('cors');

const app = (0, _express.default)();
app.use(_bodyParser.default.json());
const port = process.env.PORT || 9090; //Middleware

app.use(_express.default.urlencoded({
  extended: true
}));
app.use(_express.default.json());
app.use(cors());

function authenticate(req, res, next) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _auth.default)(httpRequest).then(({
    statusCode
  }) => {
    if (statusCode == 200) {
      next();
    } else {
      console.log("Unauthorized access");
      res.json({
        message: "Unauthorized access"
      });
    }
  }).catch(e => {
    console.log(e);
  });
}

app.post('/sendmail', authenticate, sendmailController);
app.get('/sendmail', authenticate, sendmailController);

function sendmailController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _mailer.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.all('/staff', authenticate, staffController);
app.put('/staff', authenticate, staffController);
app.post('/staff/add', staffController);
app.post('/staff/auth', staffController);
app.post('/staff/reset', staffController);
app.get('/staff/:id', staffController); // app.delete('/staff/?id=:id', staffController);

app.get('/staff/?id=:id', staffController);
app.get('/staff/find/?email=:email', staffController);

function staffController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _staff.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.get('/activities', activitiesController);
app.post('/activities/add', activitiesController);
app.delete('/activities/:id', activitiesController);
app.get('/activities?month=:month', activitiesController);
app.get('/activities?year=:year', activitiesController);
app.get('/activities?dday=:dday&dmonth=:dmonth&dyear=:dyear', activitiesController);

function activitiesController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _activities.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.all('/subscriber', subscriberController);
app.post('/subscriber/add', subscriberController);
app.put('/subscriber', subscriberController);
app.post('/subscriber/update', subscriberController);
app.delete('/subscriber?id=:id', subscriberController);
app.get('/subscriber/:id', subscriberController);
app.get('/subscriber?id=:id', subscriberController);

function subscriberController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _subscribers.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.all('/auth', authController);
app.get('/auth/:id', authController);
app.get('/auth/check_token', authController);

function authController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _auth.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.listen(port, () => console.log(`Listening on port 9090` + process.env.PORT || 9090));
//# sourceMappingURL=index.js.map