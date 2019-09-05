import { ValidationError } from '@42.nl/jarb-final-form';
import { MetaError } from '../types';
import {
  Translation,
  getTranslator
} from '../../utilities/translation/translator';

export function keyForError(error: MetaError) {
  if (typeof error === 'string') {
    return error;
  }

  if ((error as ValidationError).type === undefined) {
    return (error as Translation).key;
  }

  return (error as ValidationError).type;
}

export function errorMessage(error: MetaError): string {
  const translator = getTranslator();

  if (typeof error === 'string') {
    return translator({ key: error, fallback: error });
  }

  if ((error as ValidationError).type === undefined) {
    return translator(error as Translation);
  }

  const validationError = error as ValidationError;

  switch (validationError.type) {
    case 'ERROR_REQUIRED':
      return translator({
        key: 'JarbFinalForm.VALIDATION.REQUIRED',
        data: validationError,
        fallback: `${validationError.label} is required`
      });
    case 'ERROR_MINIMUM_LENGTH':
      return translator({
        key: 'JarbFinalForm.VALIDATION.MINIMUM_LENGTH',
        data: validationError,
        fallback: `${validationError.label} must be bigger than ${validationError.reasons.minimumLength} characters`
      });
    case 'ERROR_MAXIMUM_LENGTH':
      return translator({
        key: 'JarbFinalForm.VALIDATION.MAXIMUM_LENGTH',
        data: validationError,
        fallback: `${validationError.label} must be smaller than ${validationError.reasons.maximumLength} characters`
      });
    case 'ERROR_MIN_VALUE':
      return translator({
        key: 'JarbFinalForm.VALIDATION.MIN_VALUE',
        data: validationError,
        fallback: `${validationError.label} must be more than ${validationError.reasons.minValue}`
      });
    case 'ERROR_MAX_VALUE':
      return translator({
        key: 'JarbFinalForm.VALIDATION.MAX_VALUE',
        data: validationError,
        fallback: `${validationError.label} must be less than ${validationError.reasons.maxValue}`
      });
    case 'ERROR_NUMBER':
      return translator({
        key: 'JarbFinalForm.VALIDATION.NUMBER',
        data: validationError,
        fallback: `${validationError.label} is not a number`
      });
    case 'ERROR_NUMBER_FRACTION':
      return translator({
        key: 'JarbFinalForm.VALIDATION.NUMBER_FRACTION',
        data: validationError,
        fallback: `${validationError.label} is not a number. Number may have ${validationError.reasons.fractionLength} digits behind the comma`
      });

    default:
      return translator({
        key: 'FormError.UNKNOWN_ERROR',
        fallback: 'Something is wrong'
      });
  }
}
