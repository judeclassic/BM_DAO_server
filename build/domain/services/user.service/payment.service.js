"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaymentService {
    constructor({ authRepo, userModel, paymentRepo }) {
        this._authRepo = authRepo;
        this._userModel = userModel;
        this._paymentRepo = paymentRepo;
    }
}
