import _BaseValidator from "../../../../lib/modules/validator/validator";
import ErrorInterface from "../../../../types/interfaces/error";
import { ICreateUserRequest } from "../../../../types/interfaces/requests/user/create-user";
import { IUpdateUserRequest } from "../../../../types/interfaces/requests/user/update-user";
import { AccountTypeEnum } from "../../../../types/interfaces/response/user.response";

class UserProfileValidator extends _BaseValidator {

  validateBuyerBeforeRegistration =  ({
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

  validateBeforePersonalUpdate =  ({
    name,
    phoneNumber,
    emailAddress,
  }: IUpdateUserRequest): ErrorInterface[] => {
    const errors: ErrorInterface[] = [];

    if (name) {
      const _validateUsername = this._validateSingleName(name);
      if (_validateUsername.status === false && _validateUsername.message ) {
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
      if (_validatePassword.status === false && _validatePassword.message ) {
        errors.push({ field: 'password', message: _validatePassword.message });
      }
    }

    return errors;
  }
}

export default UserProfileValidator;
