import _BaseValidator from "../../../../../lib/modules/validator/validator";
import ErrorInterface from "../../../../../types/interfaces/error";
import { ICreateRaiderGigRequest, ICreateRaiderTaskRequest } from "../../../../../types/interfaces/requests/task/raider";
import { ServiceAccountTypeEnum } from "../../../../../types/interfaces/response/services/enums";
import { RaidActionEnum } from "../../../../../types/interfaces/response/task/raider_task.response";

class RaidersTaskRaidValidator extends _BaseValidator {

  validateBeforeRaiderGigCreation = ({serviceType, raidersNumber, startDate, weeks, dailyPost, compaignCaption, raidLink }: ICreateRaiderGigRequest) => {
    const errors: ErrorInterface[] = [];

    if (!serviceType) {
      errors.push({ field: 'serviceType', message: 'serviceType can not be empty' });
    } else {
      if (!(Object.values(ServiceAccountTypeEnum).find((c) => c === serviceType ))) {
        errors.push({field: 'serviceType', message: `entry is a valid account type '${Object.values(ServiceAccountTypeEnum).join("', '")}'` });
      }
    }

    if (!raidersNumber) {
      errors.push({ field: 'raidersNumber', message: 'raidersNumber can not be empty' });
    } else {
      try {
        parseInt(raidersNumber.toString());
      } catch (er) {
        errors.push({ field: 'raidersNumber', message: 'raidersNumber must be an interger' });
      }
    }

    if (!weeks) {
      errors.push({ field: 'weeks', message: 'weeks can not be empty' });
    } else {
      try {
        parseInt(weeks.toString());
      } catch (er) {
        errors.push({ field: 'weeks', message: 'weeks must be an interger' });
      }
    }

    if (!dailyPost) {
      errors.push({ field: 'dailyPost', message: 'dailyPost can not be empty' });
    } else {
      try {
        parseInt(dailyPost.toString());
      } catch (er) {
        errors.push({ field: 'dailyPost', message: 'dailyPost must be an interger' });
      }
    }

    if (!startDate) {
      errors.push({ field: 'startDate', message: 'startDate can not be empty' });
    } else {
      try {
        new Date(startDate).toISOString();
      } catch (er) {
        errors.push({ field: 'startDate', message: 'startDate must be date' });
      }
    }
    
    if (!compaignCaption || compaignCaption === "") {
      errors.push({ field: 'compaignCaption', message: 'compaignCaption can not be empty' });
    }

    const raidLinkError = this._validateLink(raidLink) 
    if ( raidLinkError.message ){
      errors.push({ field: 'raidLink', message: raidLinkError.message });
    }

    return errors;
  }

  validateOptions = ({ limit, page}: { limit: number; page: number}) => {
    const errors: ErrorInterface[] = [];

    if (!limit) {
      errors.push({ field: 'limit', message: 'limit can not be empty query' });
    } else {
      try {
        parseInt(limit.toString());
      } catch (er) {
        errors.push({ field: 'limit', message: 'limit must be an interger' });
      }
    }

    if (!page) {
      errors.push({ field: 'page', message: 'page can not be empty query' });
    } else {
      try {
        parseInt(page.toString());
      } catch (er) {
        errors.push({ field: 'page', message: 'page must be an interger' });
      }
    }

    return errors;
  }

  validateIdBeforeCreation = (id: string) => {
    const errors: ErrorInterface[] = [];

    const validateId = this._validateID(id);
    if (validateId.message) {
      errors.push({ field: 'taskId', message: validateId.message });
    }

    return errors;
  }
}

export default RaidersTaskRaidValidator;
