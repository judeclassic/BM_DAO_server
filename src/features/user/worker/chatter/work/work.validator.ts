import _BaseValidator from "../../../../../lib/modules/validator/validator";
import ErrorInterface from "../../../../../types/interfaces/error";
import { ICreateRaiderGigRequest } from "../../../../../types/interfaces/requests/task/raider";
import { ServiceAccountTypeEnum } from "../../../../../types/interfaces/response/services/enums";

class RaidersTaskRaidValidator extends _BaseValidator {

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

  validatequery = ({ chatId, status}: { chatId: string; status: string}) => {
    const errors: ErrorInterface[] = [];

    if (!chatId) {
      errors.push({ field: 'chatId', message: 'chatId can not be empty query' });
    } else {
      try {
        chatId.toString();
      } catch (er) {
        errors.push({ field: 'chatId', message: 'chatId must be an string' });
      }
    }

    if (!status) {
      errors.push({ field: 'status', message: 'status can not be empty query' });
    } else {
      try {
        status.toString();
      } catch (er) {
        errors.push({ field: 'status', message: 'status must be an string' });
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

  validateIdAndProof = (id: string, proof: string[]) => {
    const errors: ErrorInterface[] = [];

    const validateId = this._validateID(id);
    if (validateId.message) {
      errors.push({ field: 'taskId', message: validateId.message });
    }

    if (!proof.length) {
      errors.push({ field: 'proof', message: "proof must be an array" });
    } else {
      if ( proof.length < 1 ) {
        errors.push({ field: 'proof', message: "proof must not be empty" });
      }
    }

    return errors;
  }
}

export default RaidersTaskRaidValidator;
