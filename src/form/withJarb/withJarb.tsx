import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { JarbField, JarbFieldProps } from '@42.nl/jarb-final-form';
import getDisplayName from 'react-display-name';
import { clearErrorsForValidator } from '@42.nl/react-error-store';
import { merge, omit, pick } from 'lodash';

import { FormError } from '../FormError/FormError';
import { getState } from '../utils';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { useHasErrors } from './useHasErrors/useHasErrors';
import { useMarkedAsRequiredLabel } from './useMarkedAsRequiredLabel/useMarkedAsRequiredLabel';
import { FieldCompatible } from '../types';
import { FieldValidator } from 'final-form';

// This is a list of props that `withJarb` will pass to the `final-form`
// Field, but not the wrapper.
const passedFieldProps = [ 'initialValue', 'format', 'formatOnBlur', 'parse' ];

// These are the props that are managed by `withJarb` and should not
// be set manually by the user.
const managedProps = [
  'onChange',
  'onBlur',
  'onFocus',
  'value',
  'color',
  'valid',
  'error'
];

export type JarbFieldCompatible<Value, ChangeValue> = FieldCompatible<Value,
  ChangeValue> & {
  errorMode?: 'tooltip' | 'below';
};

export type WithJarbProps<Value, P> = JarbFieldProps<Value, any> &
  Omit<P,
    | 'onFocus'
    | 'onBlur'
    | 'onChange'
    | 'value'
    | 'color'
    | 'valid'
    | 'error'
    | 'label'>;

/**
 * withJarb is a Higher Order Component which takes an input element
 * which is `JarbFieldCompatible` as defined by the interface, and turns
 * it into a Component which uses `JarbField` so it can be used in
 * a final-form form.
 *
 * Basically all props needed in `JarbFieldCompatible` are plugged into the
 * Wrapper, by taking the `input` and `meta` from `final-form` and assigning
 * them into the correct slots.
 *
 * Also automatically adds the `FormError` component as the error
 * slot so errors are rendered.
 *
 * @param Wrapper The Component which is `JarbFieldCompatible`.
 * @param defaultValidators Optional validators the field should use by default
 */
export function withJarb<Value,
  ChangeValue,
  P extends JarbFieldCompatible<Value, ChangeValue>>(Wrapper: React.ComponentType<P>, defaultValidators?: (props: WithJarbProps<Value, P>) => FieldValidator<Value>[]) {
  const displayName = `Jarb${getDisplayName(Wrapper)}`;

  WithJarb.displayName = displayName;

  function WithJarb(props: WithJarbProps<Value, P>) {
    const illegalProps = managedProps.filter((p) => props[p] !== undefined);

    if (illegalProps.length > 0) {
      const illegalPropsAsString = prettyPropsSummation(illegalProps, 'and');
      const managedPropsAsString = prettyPropsSummation(managedProps, 'or');

      throw new Error(`
        withJarb: illegal props detected on "${displayName}".
        
        The following illegal props were detected: ${illegalPropsAsString}.
        
        This happens when providing one or multiple of the following 
        managed props: ${managedPropsAsString} manually. 
        
        You should never provide these props manually instead you should
        trust that "withJarb" will manage these props for you.

        Remove the following illegal props: ${illegalPropsAsString}.
      `);
    }

    const [ hasErrors, setHasErrors ] = useHasErrors();

    const {
      errorMode = 'below',
      name,
      jarb,
      validators,
      asyncValidators,
      asyncValidatorsDebounce,
      allowNull,
      ...rest
    } = props;

    // Bit magical this one but this makes TypeScript accept all other
    // props as the Props to the wrapped component.
    const wrapperProps = (omit(rest, passedFieldProps) as unknown) as P;

    wrapperProps.label = useMarkedAsRequiredLabel({
      label: wrapperProps.label,
      validator: jarb.validator
    });

    const fieldProps = pick(rest, [
      'initialValue',
      'format',
      'formatOnBlur',
      'parse'
    ]);

    // Listen to all props on the `Meta` object.
    const errorSubscription = {
      active: true,
      touched: true,
      error: true,
      value: true,
      validating: true
    };

    const error = (
      <Field
        name={name}
        subscription={errorSubscription}
        render={(field) => (
          <FormError
            value={field.input.value}
            meta={field.meta}
            validator={jarb.validator}
            onChange={setHasErrors}
            className={errorMode === 'tooltip' ? 'withjarb-tooltip' : undefined}
          />
        )}
      />
    );

    const fieldSubscription = {
      value: true, // Because value needs to be displayed.
      // Reset is due to `getState` needing them
      invalid: true,
      touched: true,
      validating: true
    };

    return (
      <JarbField<Value, any>
        name={name}
        jarb={jarb}
        validators={defaultValidators ? merge(defaultValidators(props), validators) : validators}
        asyncValidators={asyncValidators}
        asyncValidatorsDebounce={asyncValidatorsDebounce}
        subscription={fieldSubscription}
        render={(field) => {
          return hasErrors && errorMode === 'tooltip' ? (
            <Tooltip
              content={error}
              tag="div"
              className="w-100"
              placement="bottom"
            >
              <Wrapper
                {...wrapperProps}
                {...mapFieldRenderProps(field, jarb.validator, hasErrors)}
              />
            </Tooltip>
          ) : (
            <Wrapper
              {...wrapperProps}
              {...mapFieldRenderProps(field, jarb.validator, hasErrors)}
              error={error}
            />
          );
        }}
        {...fieldProps}
      />
    );
  }

  return WithJarb;
}

function mapFieldRenderProps<T>(
  props: FieldRenderProps<T, any>,
  validator: string,
  hasErrors: boolean
) {
  const { input, meta } = props;

  const state = getState({ hasErrors: hasErrors, touched: meta.touched });

  return {
    ...state,
    onChange: (value: T) => {
      input.onChange(value);

      // Remove any back-end errors now that the value has changed
      clearErrorsForValidator(validator);
    },
    name: input.name,
    onFocus: input.onFocus,
    onBlur: input.onBlur,
    value: input.value
  };
}

function prettyPropsSummation(
  props: string[],
  coordinatingConjunction: 'and' | 'or'
): string {
  const lastIndex = props.length - 1;

  return props
    .map((prop, index) => {
      const isFirst = index === 0;
      const isLast = index === lastIndex;

      const comma = isFirst || isLast ? '' : ', ';

      const conjunction = isLast ? ` ${coordinatingConjunction} ` : '';

      return `${comma}${conjunction}'${prop}'`;
    })
    .join('');
}
