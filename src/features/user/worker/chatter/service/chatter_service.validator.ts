import _BaseValidator from "../../../../../lib/modules/validator/validator";
import ErrorInterface from "../../../../../types/interfaces/error";
import { ServiceAccountTypeEnum } from "../../../../../types/interfaces/response/services/enums";

class UserRaiderServiceValidator extends _BaseValidator {

  validateServiceBeforeCreation =  ({
    accountType,
  }: { accountType: ServiceAccountTypeEnum, userId: string }): ErrorInterface[] => {
    const errors: ErrorInterface[] = [];

    if (!accountType) {
      errors.push({ field: "accountType", message: 'accountType can not be null' });
    } else {
      if (!(Object.values(ServiceAccountTypeEnum).find((c) => c === accountType ))) {
        errors.push({field: 'accountType', message: `entry is a valid account type '${Object.values(ServiceAccountTypeEnum).join("', '")}'` });
      }
      if (accountType !== ServiceAccountTypeEnum.chatter) {
        errors.push({field: 'accountType', message: `only chatter can be created using this route` });
      }
    }

    return errors;
  }

  validateServiceBeforeReSubscribing =  ({
    userServiceId,
  }: {  userServiceId: string }): ErrorInterface[] => {
    const errors: ErrorInterface[] = [];

    const validateUserServiceId = this._validateID(userServiceId);
    if (validateUserServiceId.message) {
      errors.push({ field: 'userServiceId', message: validateUserServiceId.message});
    }

    return errors;
  }
}

export default UserRaiderServiceValidator;
