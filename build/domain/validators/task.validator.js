"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../types/interfaces/response/services/enums");
const raider_task_response_1 = require("../../types/interfaces/response/task/raider_task.response");
const validator_1 = __importDefault(require("./_base/validator"));
class TaskValidator extends validator_1.default {
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
        this.validateBeforeRaiderTaskCreation = ({ taskType, actions, users, raidLink, mediaUrl, campaignCaption, startDate }) => {
            const errors = [];
            if (!taskType) {
                errors.push({ field: 'taskType', message: 'taskType can not be empty' });
            }
            else {
                if (!(Object.values(enums_1.ServiceAccountTypeEnum).find((c) => c === taskType))) {
                    errors.push({ field: 'taskType', message: `taskType is a valid account type '${Object.values(enums_1.ServiceAccountTypeEnum).join("', '")}'` });
                }
            }
            if (!actions) {
                errors.push({ field: 'actions', message: 'actions can not be empty' });
            }
            else {
                try {
                    if (!actions.length) {
                        errors.push({ field: 'actions', message: 'actions must be an array' });
                    }
                    else if (actions.length < 1) {
                        errors.push({ field: 'actions', message: 'select at least one action' });
                    }
                    else {
                        actions.forEach((action) => {
                            if (!(Object.values(raider_task_response_1.RaidActionEnum).find((c) => c === action))) {
                                errors.push({ field: 'actions', message: `actions is a valid account type '${Object.values(raider_task_response_1.RaidActionEnum).join("', '")}'` });
                                return;
                            }
                        });
                    }
                }
                catch (er) {
                    errors.push({ field: 'actions', message: `actions is a valid account type '${Object.values(raider_task_response_1.RaidActionEnum).join("', '")}'` });
                }
            }
            if (!users) {
                errors.push({ field: 'users', message: 'users can not be empty' });
            }
            else {
                try {
                    parseInt(users.toString());
                }
                catch (er) {
                    errors.push({ field: 'users', message: 'users must be an interger' });
                }
            }
            if (!raidLink) {
                errors.push({ field: 'raidLink', message: 'raidLink can not be empty' });
            }
            if (!mediaUrl) {
                errors.push({ field: 'mediaUrl', message: 'mediaUrl can not be empty' });
            }
            if (!campaignCaption) {
                errors.push({ field: 'campaignCaption', message: 'campaignCaption can not be empty' });
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
exports.default = TaskValidator;
