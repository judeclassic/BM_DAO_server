"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("../../../../../lib/modules/validator/validator"));
const enums_1 = require("../../../../../types/interfaces/response/services/enums");
class UserRaiderServiceValidator extends validator_1.default {
    constructor() {
        super(...arguments);
        this.validateServiceBeforeCreation = ({ accountType, }) => {
            const errors = [];
            if (!accountType) {
                errors.push({ field: "accountType", message: 'accountType can not be null' });
            }
            else {
                if (!(Object.values(enums_1.ServiceAccountTypeEnum).find((c) => c === accountType))) {
                    errors.push({ field: 'accountType', message: `entry is a valid account type '${Object.values(enums_1.ServiceAccountTypeEnum).join("', '")}'` });
                }
                if (accountType !== enums_1.ServiceAccountTypeEnum.chatter) {
                    errors.push({ field: 'accountType', message: `only chatter can be created using this route` });
                }
            }
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
exports.default = UserRaiderServiceValidator;
