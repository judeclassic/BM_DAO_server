"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("../../../../../../lib/modules/validator/validator"));
class ModeratorTaskValidator extends validator_1.default {
    constructor() {
        super(...arguments);
        this.validateOptions = ({ limit, page }) => {
            const errors = [];
            if (!limit) {
                errors.push({ field: 'limit', message: 'limit can not be empty query' });
            }
            else {
                try {
                    parseInt(limit.toString());
                }
                catch (er) {
                    errors.push({ field: 'limit', message: 'limit must be an interger' });
                }
            }
            if (!page) {
                errors.push({ field: 'page', message: 'page can not be empty query' });
            }
            else {
                try {
                    parseInt(page.toString());
                }
                catch (er) {
                    errors.push({ field: 'page', message: 'page must be an interger' });
                }
            }
            return errors;
        };
        this.validateIdBeforeCreation = (id) => {
            const errors = [];
            const validateId = this._validateID(id);
            if (validateId.message) {
                errors.push({ field: 'taskId', message: validateId.message });
            }
            return errors;
        };
        this.validateRaidIdBeforeCreation = (id) => {
            const errors = [];
            const validateId = this._validateID(id);
            if (validateId.message) {
                errors.push({ field: 'chatId', message: validateId.message });
            }
            return errors;
        };
    }
}
exports.default = ModeratorTaskValidator;
