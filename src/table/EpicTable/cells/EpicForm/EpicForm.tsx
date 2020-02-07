import React from 'react';
import classNames from 'classnames';
import { AnyObject, Form, FormProps } from 'react-final-form';
import { omit, pick } from 'lodash';
import { FormApi } from 'final-form';
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
   * Optionally whether or not the form should be submitted on blur automatically.
   */
  submitOnChange?: boolean;
}

// Props that will be injected by the EpicTable.
interface InjectedProps {
  odd: boolean;
}

/**
 * The EpicForm is used inside of a EpicRow to render content in.
 */
export function EpicForm<FormValues>(props: Props<FormValues>) {
  const { id, children, width, height, submitOnChange, ...rest } = props;
  const { odd } = pick(rest, ['odd']) as InjectedProps;
  const formProps = omit(rest, ['odd']) as FormProps;

  const classes = classNames('epic-table-form border-bottom p-1', {
    'epic-table-form--odd': odd
  });

  return (
    <Form {...formProps}>
      {({
        handleSubmit,
        form
      }: {
        handleSubmit: (
          event?: Partial<
            Pick<React.SyntheticEvent, 'preventDefault' | 'stopPropagation'>
          >
        ) => Promise<AnyObject | undefined> | undefined;
        form: FormApi<FormValues>;
      }) => (
        <form
          id={id}
          onSubmit={handleSubmit}
          onReset={form.reset}
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
