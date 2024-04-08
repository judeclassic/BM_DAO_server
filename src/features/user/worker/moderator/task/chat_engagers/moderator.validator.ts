import _BaseValidator from "../../../../../../lib/modules/validator/validator";
import ErrorInterface from "../../../../../../types/interfaces/error";


class ModeratorTaskValidator extends _BaseValidator {
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

  validateRaidIdBeforeCreation = (id: string) => {
    const errors: ErrorInterface[] = [];

    const validateId = this._validateID(id);
    if (validateId.message) {
      errors.push({ field: 'chatId', message: validateId.message });
    }

    return errors;
  }
}

export default ModeratorTaskValidator;
