import _BaseValidator from "../../../lib/modules/validator/validator";
import ErrorInterface from "../../../types/interfaces/error";
import LoginRequest from "../../../types/interfaces/requests/auth/login";
import ConfirmResetPasswordRequest from "../../../types/interfaces/requests/user/confirm-reset-password";
import { ICreateUserRequest } from "../../../types/interfaces/requests/user/create-user";
import { AccountTypeEnum } from "../../../types/interfaces/response/user.response";

class UserAuthValidator  extends _BaseValidator{
  validateBeforeRegistration =  ({
    name,
    password,
    emailAddress,
    accountType
  }: ICreateUserRequest): ErrorInterface[] => {
    const errors: ErrorInterface[] = [];

    const _validateUsername = this._validateSingleName(name);
    if (_validateUsername.status === false && _validateUsername.message ) {
      errors.push({ field: 'name', message: _validateUsername.message });
    }

    const _validatePhoneNumber = this._validateEmail(emailAddress);
    if (_validatePhoneNumber.status === false && _validatePhoneNumber.message ) {
      errors.push({ field: 'phoneNumber', message: _validatePhoneNumber.message });
    }

    const _validatePassword = this._validatePassword(password);
    if (_validatePassword.status === false && _validatePassword.message ) {
      errors.push({ field: 'password', message: _validatePassword.message });
    }

    if (!accountType) {
      errors.push({ message: 'accountType can not be null' });
    } else {
      if (!(Object.values(AccountTypeEnum).find((c) => c === accountType ))) {
        errors.push({field: 'accountType', message: "entry is a valid account type"});
      }
    }

    return errors;
  }
  
  login = ({ emailAddress, password }: LoginRequest) => {
    const errors: ErrorInterface[] = [];

    const validatePhone = this._validateEmail(emailAddress);
    if (validatePhone.status === false && validatePhone.message ) {
      errors.push({ field: 'emailAddress', message: validatePhone.message });
    }

    const _validatePassword = this._validatePassword(password);
    if (_validatePassword.status === false && _validatePassword.message ) {
      errors.push({ field: 'password', message: _validatePassword.message });
    }

    return errors;
  }

  resetPassword = ({ emailAddress }: {emailAddress: string }): ErrorInterface[] => {
    const errors: ErrorInterface[] = []
    
    const _validateEmail = this._validateEmail(emailAddress);
    if (_validateEmail.status === false && _validateEmail.message ) {
      errors.push({ field: 'email', message: _validateEmail.message });
    }

    return errors;
  }

  confirmResetPassword = ({
    emailAddress,
    password,
    confirmPassword,
  }: ConfirmResetPasswordRequest): ErrorInterface[] => {
    const errors: ErrorInterface[] = [];

    const _validateEmailAddress = this._validateEmail(emailAddress);
    if (_validateEmailAddress.status === false && _validateEmailAddress.message ) {
      errors.push({ field: 'emailAddress', message: _validateEmailAddress.message });
    }

    const _validatePassword = this._validatePassword(password);
    if (_validatePassword.status === false && _validatePassword.message ) {
      errors.push({ field: 'password', message: _validatePassword.message });
    }

    const _validateConfirmPassword = this._validatePassword(password);
    if (_validateConfirmPassword.status === false && _validateConfirmPassword.message ) {
      errors.push({ field: 'confirmPassword', message: _validateConfirmPassword.message });
    }

    if (password !== confirmPassword)
      errors.push({
        field: 'confirmPassword',
        message: 'Passwords do not match.',
      });

    return errors;
  }

};

export default UserAuthValidator;
