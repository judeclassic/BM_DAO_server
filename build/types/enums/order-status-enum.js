"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrderStatusEnum;
(function (OrderStatusEnum) {
    OrderStatusEnum["PENDING"] = "PENDING";
    OrderStatusEnum["COMPLETED"] = "COMPLETED";
    OrderStatusEnum["CANCELLED"] = "CANCELLED";
    OrderStatusEnum["DELIVERED"] = "DELIVERED";
    OrderStatusEnum["REQUEST"] = "REQUEST";
    OrderStatusEnum["ACCEPTED"] = "ACCEPTED";
})(OrderStatusEnum || (OrderStatusEnum = {}));
exports.default = OrderStatusEnum;
