"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sendSms;

const SMSLive247API = require('smslive247api');

const SMSLiveAPI = new SMSLive247API('mospheb_biz@yahoo.com', 'MUYIWA', 'jsublime');

function sendSms(message, sendTo) {
  SMSLiveAPI.login().then(res => {
    const sessionId = res.sessionId;
    SMSLiveAPI.sendMessage(sessionId, message, ['08056678055', '08121631789', '07066064154'], 'WONGAFIX').then(res => {
      console.log(res);
    });
  }).catch(err => {
    console.log(err);
  });
}
//# sourceMappingURL=send-sms.js.map