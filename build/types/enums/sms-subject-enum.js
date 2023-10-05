"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsMessage = exports.SmsSubJectEnum = void 0;
var SmsSubJectEnum;
(function (SmsSubJectEnum) {
    SmsSubJectEnum["ORDER_PLACED_SMS"] = "Order from Bakely have been placed";
    SmsSubJectEnum["REMINDER_COMPLETE_ORDER"] = "Reminder to complete order from Bakely";
})(SmsSubJectEnum = exports.SmsSubJectEnum || (exports.SmsSubJectEnum = {}));
class SmsMessage {
}
exports.SmsMessage = SmsMessage;
SmsMessage.ORDER_PLACED_SMS = (order) => {
    return `Hi ${order.store.ownerName},
You’ve received an order on Bakely from  ${order.buyer.username}
            
Order type: ${order.product.category}
            
Delivery date: ${order.deliveryDate}
            
Visit your store to view order details & accept/reject it: ${'https://mybakely.com/login'}`;
};
