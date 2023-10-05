"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("../../../../../lib/modules/validator/validator"));
class UserServiceValidator extends validator_1.default {
    constructor() {
        super(...arguments);
        this.validateServiceBeforeCreation = ({ accountType, }) => {
            const errors = [];
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
        };
        this.validateServiceBeforeReSubscribing = ({ userServiceId, }) => {
            const errors = [];
            const validateUserServiceId = this._validateID(userServiceId);
            if (validateUserServiceId.message) {
                errors.push({ field: 'userServiceId', message: validateUserServiceId.message });
            }
            return errors;
        };
    }
}
exports.default = UserServiceValidator;
