"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("../../../../../lib/modules/validator/validator"));
const enums_1 = require("../../../../../types/interfaces/response/services/enums");
class RaiderClientTaskValidator extends validator_1.default {
    constructor() {
        super(...arguments);
        this.validateBeforeTaskCreation = ({ serviceType, postLink, compaignCaption, chatterPerSession, hoursPerDay, startDate, days }) => {
            const errors = [];
            if (!serviceType) {
                errors.push({ field: 'taskType', message: 'taskType can not be empty' });
            }
            else {
                if (!(Object.values(enums_1.ServiceAccountTypeEnum).find((c) => c === serviceType))) {
                    errors.push({ field: 'taskType', message: `taskType is a valid account type '${Object.values(enums_1.ServiceAccountTypeEnum).join("', '")}'` });
                }
            }
            if (!postLink) {
                errors.push({ field: 'postLink', message: 'postLink can not be empty' });
            }
            if (!compaignCaption) {
                errors.push({ field: 'compaignCaption', message: 'compaignCaption can not be empty' });
            }
            if (!chatterPerSession) {
                errors.push({ field: 'chatterPerSession', message: 'users can not be empty' });
            }
            else {
                try {
                    parseInt(chatterPerSession.toString());
                }
                catch (er) {
                    errors.push({ field: 'chatterPerSession', message: 'users must be an interger' });
                }
            }
            if (!hoursPerDay) {
                errors.push({ field: 'hoursPerDay', message: 'hoursPerDay can not be empty' });
            }
            else {
                try {
                    parseInt(hoursPerDay.toString());
                }
                catch (er) {
                    errors.push({ field: 'hoursPerDay', message: 'hoursPerDay must be an interger' });
                }
            }
            if (!days) {
                errors.push({ field: 'days', message: 'days can not be empty' });
            }
            else {
                try {
                    parseInt(days.toString());
                }
                catch (er) {
                    errors.push({ field: 'days', message: 'days must be an interger' });
                }
            }
            if (!startDate) {
                errors.push({ field: 'startDate', message: 'startDate can not be empty' });
            }
            else {
                try {
                    const date = new Date(startDate).toISOString();
                    if (!(date)) {
                        errors.push({ field: 'startDate', message: 'startDate must be date' });
                    }
                }
                catch (er) {
                    errors.push({ field: 'startDate', message: 'startDate must be date' });
                }
            }
            return errors;
        };
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
    }
}
exports.default = RaiderClientTaskValidator;
