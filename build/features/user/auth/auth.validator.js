"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("../../../lib/modules/validator/validator"));
const user_response_1 = require("../../../types/interfaces/response/user.response");
class UserAuthValidator extends validator_1.default {
    constructor() {
        super(...arguments);
        this.validateBeforeRegistration = ({ name, password, emailAddress, accountType }) => {
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
        this.login = ({ emailAddress, password }) => {
            const errors = [];
            const validatePhone = this._validateEmail(emailAddress);
            if (validatePhone.status === false && validatePhone.message) {
                errors.push({ field: 'emailAddress', message: validatePhone.message });
            }
            const _validatePassword = this._validatePassword(password);
            if (_validatePassword.status === false && _validatePassword.message) {
                errors.push({ field: 'password', message: _validatePassword.message });
            }
            return errors;
        };
        this.resetPassword = ({ emailAddress }) => {
            const errors = [];
            const _validateEmail = this._validateEmail(emailAddress);
            if (_validateEmail.status === false && _validateEmail.message) {
                errors.push({ field: 'email', message: _validateEmail.message });
            }
            return errors;
        };
        this.confirmResetPassword = ({ emailAddress, password, confirmPassword, }) => {
            const errors = [];
            const _validateEmailAddress = this._validateEmail(emailAddress);
            if (_validateEmailAddress.status === false && _validateEmailAddress.message) {
                errors.push({ field: 'emailAddress', message: _validateEmailAddress.message });
            }
            const _validatePassword = this._validatePassword(password);
            if (_validatePassword.status === false && _validatePassword.message) {
                errors.push({ field: 'password', message: _validatePassword.message });
            }
            const _validateConfirmPassword = this._validatePassword(password);
            if (_validateConfirmPassword.status === false && _validateConfirmPassword.message) {
                errors.push({ field: 'confirmPassword', message: _validateConfirmPassword.message });
            }
            if (password !== confirmPassword)
                errors.push({
                    field: 'confirmPassword',
                    message: 'Passwords do not match.',
                });
            return errors;
        };
    }
}
;
exports.default = UserAuthValidator;
