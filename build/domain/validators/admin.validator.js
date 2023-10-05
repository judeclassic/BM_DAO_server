"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("./_base/validator"));
class AdminValidator extends validator_1.default {
    constructor() {
        super(...arguments);
        this.register = ({ name, email, password, phoneNumber, }) => {
            const errors = [];
            const _validateUsername = this._validateSingleName(name);
            if (_validateUsername.status === false && _validateUsername.message) {
                errors.push({ field: 'name', message: _validateUsername.message });
            }
            const _validateEmail = this._validateEmail(email);
            if (_validateEmail.status === false && _validateEmail.message) {
                errors.push({ field: 'email', message: _validateEmail.message });
            }
            const _validatePhoneNumber = this._validatePhone(phoneNumber);
            if (_validatePhoneNumber.status === false && _validatePhoneNumber.message) {
                errors.push({ field: 'phoneNumber', message: _validatePhoneNumber.message });
            }
            const _validatePassword = this._validatePassword(password);
            if (_validatePassword.status === false && _validatePassword.message) {
                errors.push({ field: 'password', message: _validatePassword.message });
            }
            return errors;
        };
        this.login = ({ emailAddress, password }) => {
            const errors = [];
            const _validateEmail = this._validateEmail(emailAddress);
            if (_validateEmail.status === false && _validateEmail.message) {
                errors.push({ field: 'email', message: _validateEmail.message });
            }
            const _validatePassword = this._validatePassword(password);
            if (_validatePassword.status === false && _validatePassword.message) {
                errors.push({ field: 'password', message: _validatePassword.message });
            }
            return errors;
        };
        this.valitedToken = ({ token }) => {
            const errors = [];
            const _validateEmail = this._validateToken(token);
            if (_validateEmail.status === false && _validateEmail.message) {
                errors.push({ field: 'token', message: _validateEmail.message });
            }
            return errors;
        };
        this.resetPassword = ({ email }) => {
            const errors = [];
            const _validateEmail = this._validateEmail(email);
            if (_validateEmail.status === false && _validateEmail.message) {
                errors.push({ field: 'email', message: _validateEmail.message });
            }
            return errors;
        };
        this.confirmAmmountBeforeGrant = ({ id }) => {
            const errors = [];
            if (!id) {
                errors.push({ field: 'id', message: 'id can not be empty' });
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
        this.acountNumberRequest = ({ password, accountNumber, bankName, bankCode, name }) => {
            const errors = [];
            const _validatePassword = this._validatePassword(password);
            if (_validatePassword.status === false && _validatePassword.message) {
                errors.push({ field: 'password', message: _validatePassword.message });
            }
            const _validateBankName = this._validateSingleName(bankName);
            if (_validateBankName.status === false && _validateBankName.message) {
                errors.push({ field: 'bankName', message: _validateBankName.message });
            }
            if (!bankCode) {
                errors.push({ field: 'bankCode', message: 'Bank code can not be null' });
            }
            else {
                if (accountNumber.length < 9) {
                    errors.push({ field: 'bankCode', message: 'Bank code must be greater than 8 characters' });
                }
                try {
                    parseInt(accountNumber);
                }
                catch (error) {
                    errors.push({ field: 'bankCode', message: 'Bank code must all be digits' });
                }
            }
            const _validateSingleName = this._validateSingleName(name);
            if (_validateSingleName.status === false && _validateSingleName.message) {
                errors.push({ field: 'name', message: _validateSingleName.message });
            }
            if (!accountNumber) {
                errors.push({ field: 'accountNumber', message: 'Account number can not be null' });
            }
            else {
                if (accountNumber.length < 10) {
                    errors.push({ field: 'accountNumber', message: 'Account number must be greater than 9 characters' });
                }
                try {
                    parseInt(accountNumber);
                }
                catch (error) {
                    errors.push({ field: 'accountNumber', message: 'Account number must all be digits' });
                }
            }
            return errors;
        };
    }
}
;
exports.default = AdminValidator;
