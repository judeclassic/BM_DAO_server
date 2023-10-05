import _BaseValidator from "../../../../../lib/modules/validator/validator";
import ErrorInterface from "../../../../../types/interfaces/error";
import { ServiceAccountTypeEnum } from "../../../../../types/interfaces/response/services/enums";


class UserServiceValidator extends _BaseValidator {

  validateServiceBeforeCreation =  ({
    accountType,
  }: { accountType: ServiceAccountTypeEnum, userId: string }): ErrorInterface[] => {
    const errors: ErrorInterface[] = [];

    // if (!accountType) {
    //   errors.push({ field: "accountType", message: 'accountType can not be null' });
    // } else {
    //   if (!(Object.values(ServiceAccountTypeEnum).find((c) => c === accountType ))) {
    //     errors.push({field: 'accountType', message: `entry is a valid account type '${Object.values(ServiceAccountTypeEnum).join("', '")}'` });
    //   }
    //   if (accountType === ServiceAccountTypeEnum.chatter) {
    //     errors.push({field: 'accountType', message: `chatter is not available now` });
    //   }
    //   if (accountType === ServiceAccountTypeEnum.moderators) {
    //     errors.push({field: 'accountType', message: `moderators is not available now` });
    //   }
    //   if (accountType === ServiceAccountTypeEnum.collab_manager) {
    //     errors.push({field: 'accountType', message: `collab manager is not available now` });
    //   }
    // }

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

export default UserServiceValidator;
