import React from 'react';
import { FormFeedback } from 'reactstrap';
import { useErrorsForValidator } from '@42.nl/react-error-store';

import { Meta, MetaError } from '../types';
import { keyForError, errorMessage } from './utils';
import { useSettledErrors } from './useSettledErrors';

interface Props {
  /**
   * The meta object to render the errors for.
   */
  meta: Meta;

  /**
   * The validator for which the FormError should render the errors.
   */
  validator: string;
}

/**
 * The FormError component renders errors coming from the front-end
 * and the back-end. It ties the front-end and back-end errors together
 * based on the the validator.
 *
 * A validator is a string which looks like this: `User.name` the format
 * is `Entity.property`.
 */
export default function FormError(props: Props) {
  const { meta, validator } = props;
  const backEndErrors = useErrorsForValidator(validator);
  const frontEndErrors = useSettledErrors(meta);

  if (backEndErrors.length === 0 && frontEndErrors.length === 0) {
    return null;
  }

  return (
    <>
      {frontEndErrors.map((e: MetaError) => (
        <FormFeedback key={keyForError(e)}>{errorMessage(e)}</FormFeedback>
      ))}

      {backEndErrors.map((e: string) => (
        <FormFeedback key={e}>{errorMessage(e)}</FormFeedback>
      ))}
    </>
  );
}
