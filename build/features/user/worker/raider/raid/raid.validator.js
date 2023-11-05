"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("../../../../../lib/modules/validator/validator"));
const enums_1 = require("../../../../../types/interfaces/response/services/enums");
class RaidersTaskRaidValidator extends validator_1.default {
    constructor() {
        super(...arguments);
        this.validateBeforeRaiderGigCreation = ({ serviceType, raidersNumber, startDate, weeks, dailyPost, compaignCaption, raidLink }) => {
            const errors = [];
            if (!serviceType) {
                errors.push({ field: 'serviceType', message: 'serviceType can not be empty' });
            }
            else {
                if (!(Object.values(enums_1.ServiceAccountTypeEnum).find((c) => c === serviceType))) {
                    errors.push({ field: 'serviceType', message: `entry is a valid account type '${Object.values(enums_1.ServiceAccountTypeEnum).join("', '")}'` });
                }
            }
            if (!raidersNumber) {
                errors.push({ field: 'raidersNumber', message: 'raidersNumber can not be empty' });
            }
            else {
                try {
                    parseInt(raidersNumber.toString());
                }
                catch (er) {
                    errors.push({ field: 'raidersNumber', message: 'raidersNumber must be an interger' });
                }
            }
            if (!weeks) {
                errors.push({ field: 'weeks', message: 'weeks can not be empty' });
            }
            else {
                try {
                    parseInt(weeks.toString());
                }
                catch (er) {
                    errors.push({ field: 'weeks', message: 'weeks must be an interger' });
                }
            }
            if (!dailyPost) {
                errors.push({ field: 'dailyPost', message: 'dailyPost can not be empty' });
            }
            else {
                try {
                    parseInt(dailyPost.toString());
                }
                catch (er) {
                    errors.push({ field: 'dailyPost', message: 'dailyPost must be an interger' });
                }
            }
            if (!startDate) {
                errors.push({ field: 'startDate', message: 'startDate can not be empty' });
            }
            else {
                try {
                    new Date(startDate).toISOString();
                }
                catch (er) {
                    errors.push({ field: 'startDate', message: 'startDate must be date' });
                }
            }
            if (!compaignCaption || compaignCaption === "") {
                errors.push({ field: 'compaignCaption', message: 'compaignCaption can not be empty' });
            }
            const raidLinkError = this._validateLink(raidLink);
            if (raidLinkError.message) {
                errors.push({ field: 'raidLink', message: raidLinkError.message });
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
exports.default = RaidersTaskRaidValidator;
