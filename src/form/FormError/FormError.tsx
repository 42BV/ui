import React from 'react';
import { FormFeedback } from 'reactstrap';
import { useErrorsForValidator } from '@42.nl/react-error-store';

import { Meta, MetaError } from '../types';
import { errorMessage } from './utils';
import { useSettledErrors } from './useSettledErrors';
import { useOnChange } from './useOnChange';
import { FormErrorOnChange } from './types';

type Props = {
  /**
   * The value for this form error.
   */
  value: any;

  /**
   * The meta object to render the errors for.
   */
  meta: Meta;

  /**
   * The validator for which the FormError should render the errors.
   */
  validator: string;

  /**
   * Optionally: callback which is called when there are errors or
   * they are removed.
   */
  onChange?: FormErrorOnChange;

  /**
   * Optionally: classes to put on the div around the errors.
   */
  className?: string;
};

/**
 * The FormError component renders errors coming from the front-end
 * and the back-end. It ties the front-end and back-end errors together
 * based on the validator.
 *
 * A validator is a string which looks like this: `User.name` the format
 * is `Entity.property`.
 *
 * To retrieve back-end errors, we use `@42.nl/react-error-store`.
 */
export default function FormError(props: Props) {
  const { value, meta, validator, onChange, className } = props;
  const backEndErrors = useErrorsForValidator(validator);
  const frontEndErrors = useSettledErrors(meta, value);

  const hasErrors = backEndErrors.length > 0 || frontEndErrors.length > 0;

  useOnChange(hasErrors, onChange);

  if (!hasErrors) {
    return null;
  }

  return (
    <div className={className}>
      {frontEndErrors.map((e: MetaError, index: number) => (
        <FormFeedback key={`${index}`}>{errorMessage(e)}</FormFeedback>
      ))}

      {backEndErrors.map((e: string) => (
        <FormFeedback key={e}>{errorMessage(e)}</FormFeedback>
      ))}
    </div>
  );
}
