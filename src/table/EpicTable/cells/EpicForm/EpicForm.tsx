import React from 'react';
import classNames from 'classnames';
import { Form, FormProps } from 'react-final-form';
import { AutoSave } from '../../../../form/AutoSave/AutoSave';

interface Props<FormValues> extends FormProps<FormValues> {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The content of the cell.
   */
  children: React.ReactNode;

  /**
   * The width of the cell.
   */
  width: number;

  /**
   * The height of the cell.
   */
  height: number;

  /**
   * Optionally whether the form should be submitted on blur automatically.
   */
  submitOnChange?: boolean;
}

/**
 * The EpicForm is a wrapper around react-final-form's `Form` to
 * allow forms to be used inside an EpicRow.
 */
export function EpicForm<FormValues>(props: Props<FormValues>) {
  const { id, children, width, height, submitOnChange, odd, ...formProps } =
    props;

  const classes = classNames('epic-table-form border-bottom p-1', {
    'epic-table-form--odd': odd
  });

  return (
    <Form {...formProps}>
      {({ handleSubmit, form }) => (
        <form
          id={id}
          onSubmit={handleSubmit}
          onReset={() => form.reset()}
          className={classes}
          style={{
            minWidth: width,
            width,
            height
          }}
        >
          {submitOnChange ? (
            <AutoSave
              onSave={form.submit}
              initialValues={formProps.initialValues}
            />
          ) : null}
          {children}
        </form>
      )}
    </Form>
  );
}
