import _BaseValidator from "../../../../../lib/modules/validator/validator";
import ErrorInterface from "../../../../../types/interfaces/error";
import { ICreateChatterGigRequest } from "../../../../../types/interfaces/requests/task/chatter";
import { ServiceAccountTypeEnum } from "../../../../../types/interfaces/response/services/enums";

class RaiderClientTaskValidator extends _BaseValidator {

  validateBeforeTaskCreation = ({ serviceType, postLink, compaignCaption, chatterPerSession, hoursPerDay, startDate, days }: ICreateChatterGigRequest) => {
    const errors: ErrorInterface[] = [];

    if (!serviceType) {
      errors.push({ field: 'taskType', message: 'taskType can not be empty' });
    } else {
      if (!(Object.values(ServiceAccountTypeEnum).find((c) => c === serviceType ))) {
        errors.push({field: 'taskType', message: `taskType is a valid account type '${Object.values(ServiceAccountTypeEnum).join("', '")}'` });
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
    } else {
      try {
        parseInt(chatterPerSession.toString());
      } catch (er) {
        errors.push({ field: 'chatterPerSession', message: 'users must be an interger' });
      }
    }
    
    if (!hoursPerDay) {
      errors.push({ field: 'hoursPerDay', message: 'hoursPerDay can not be empty' });
    } else {
      try {
        parseInt(hoursPerDay.toString());
      } catch (er) {
        errors.push({ field: 'hoursPerDay', message: 'hoursPerDay must be an interger' });
      }
    }
    if (!days) {
      errors.push({ field: 'days', message: 'days can not be empty' });
    } else {
      try {
        parseInt(days.toString());
      } catch (er) {
        errors.push({ field: 'days', message: 'days must be an interger' });
      }
    }

    if (!startDate) {
      errors.push({ field: 'startDate', message: 'startDate can not be empty' });
    } else {
      try {
        const date = new Date(startDate).toISOString();
        if (!(date)) {
          errors.push({ field: 'startDate', message: 'startDate must be date' });
        }
      } catch (er) {
        errors.push({ field: 'startDate', message: 'startDate must be date' });
      }
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

export default RaiderClientTaskValidator;
