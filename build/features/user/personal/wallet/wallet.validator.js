"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("../../../../lib/modules/validator/validator"));
const user_response_1 = require("../../../../types/interfaces/response/user.response");
class UserProfileValidator extends validator_1.default {
    constructor() {
        super(...arguments);
        this.validateBuyerBeforeRegistration = ({ name, password, emailAddress, accountType }) => {
            const errors = [];
            const _validateUsername = this._validateSingleName(name);
            if (_validateUsername.status === false && _validateUsername.message) {
                errors.push({ field: 'name', message: _validateUsername.message });
            }
            const _validatePhoneNumber = this._validateEmail(emailAddress);
            if (_validatePhoneNumber.status === false && _validatePhoneNumber.message) {
                errors.push({ field: 'phoneNumber', message: _validatePhoneNumber.message });
            }
            const _validatePassword = this._validatePassword(password);
            if (_validatePassword.status === false && _validatePassword.message) {
                errors.push({ field: 'password', message: _validatePassword.message });
            }
            if (!accountType) {
                errors.push({ message: 'accountType can not be null' });
            }
            else {
                if (!(Object.values(user_response_1.AccountTypeEnum).find((c) => c === accountType))) {
                    errors.push({ field: 'accountType', message: "entry is a valid account type" });
                }
            }
            return errors;
        };
        this.validateBeforePersonalUpdate = ({ name, phoneNumber, emailAddress, }) => {
            const errors = [];
            if (name) {
                const _validateUsername = this._validateSingleName(name);
                if (_validateUsername.status === false && _validateUsername.message) {
                    errors.push({ field: 'name', message: _validateUsername.message });
                }
            }
            // if (emailAddress) {
            //   const _validatePhoneNumber = this._validateEmail(emailAddress);
            //   if (_validatePhoneNumber.status === false && _validatePhoneNumber.message ) {
            //     errors.push({ field: 'phoneNumber', message: _validatePhoneNumber.message });
            //   }
            // }
            if (phoneNumber) {
                const _validatePassword = this._validatePhone(phoneNumber);
                if (_validatePassword.status === false && _validatePassword.message) {
                    errors.push({ field: 'password', message: _validatePassword.message });
                }
            }
            return errors;
        };
    }
}
exports.default = UserProfileValidator;
