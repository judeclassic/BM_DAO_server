"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
var MessageType;
(function (MessageType) {
    MessageType[MessageType["DIRECT"] = 0] = "DIRECT";
    MessageType[MessageType["CHANNEL"] = 1] = "CHANNEL";
    MessageType[MessageType["SERVER_INVITE"] = 2] = "SERVER_INVITE";
})(MessageType || (MessageType = {}));
exports.default = MessageType;
