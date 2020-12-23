import { chunk, isArray } from 'lodash';
import React from 'react';
import { Col, FormGroup, Input as RSInput, Label, Row } from 'reactstrap';
import { Loading } from '../..';
import { useId } from '../../hooks/useId/useId';
import { t } from '../../utilities/translation/translation';
import {
  FieldCompatibleWithPredeterminedOptions,
  isOptionSelected,
  getKeyForOption
} from '../option';
import { FieldCompatible } from '../types';
import { useOptions } from '../useOptions';
import { alwaysTrue, doBlur } from '../utils';
import withJarb from '../withJarb/withJarb';

export type Text = {
  /**
   * The message to show when the CheckboxMultipleSelect is loading. Defaults
   * to `loading...`
   */
  loadingMessage?: string;
};

export type Props<T> = Omit<FieldCompatible<T[], T[]>, 'valid'> &
  FieldCompatibleWithPredeterminedOptions<T> & {
    /**
     * Optionally customized text within the component.
     * This text should already be translated.
     */
    text?: Text;

    /**
     * Whether or not to show the CheckboxMultipleSelect horizontally.
     *
     * Defaults to `false`
     */
    horizontal?: boolean;
  };

/**
 * CheckboxMultipleSelect is a form element for which the values can
 * be selected from a limited range. Is shown a grid of options as
 * checkboxes from which the user can select multiple values.
 */
export default function CheckboxMultipleSelect<T>(props: Props<T>) {
  const {
    id,
    label,
    error,
    color,
    text = {},
    className = '',
    placeholder,
    value,
    isOptionEqual,
    labelForOption,
    reloadOptions,
    keyForOption,
    horizontal = false,
    isOptionEnabled = alwaysTrue,
    onChange,
    onBlur
  } = props;

  const innerId = useId({ id });

  const { page, loading } = useOptions({
    options: props.options,
    value,
    isOptionEqual,
    labelForOption,
    reloadOptions,
    pageNumber: 1,
    query: '',
    size: 100,
    optionsShouldAlwaysContainValue: true
  });

  function optionClicked(option: T, isSelected: boolean) {
    // Always copy the `value` so the `selected` is a fresh array.
    // Otherwise the selection will be the same as the value, which
    // causes values to be committed and the cancel button will not
    // do anything.
    let selected = isArray(value) ? [...value] : [];

    if (isSelected) {
      selected = selected.filter(
        (value) =>
          !isOptionSelected({
            option,
            keyForOption,
            labelForOption,
            isOptionEqual,
            value
          })
      );
    } else {
      selected.push(option);
    }

    onChange(selected);

    doBlur(onBlur);
  }

  return (
    <FormGroup className={className} color={color}>
      {label ? <Label for={innerId}>{label}</Label> : null}
      {placeholder ? (
        <p className="text-muted">
          <em>{placeholder}</em>
        </p>
      ) : null}
      {loading ? (
        <Loading>
          {t({
            key: 'Select.LOADING',
            fallback: 'Loading...',
            overrideText: text.loadingMessage
          })}
        </Loading>
      ) : (
        renderCheckboxes()
      )}

      {error}
    </FormGroup>
  );

  function renderCheckboxes() {
    if (horizontal) {
      return renderOptions({ options: page.content, horizontal: true });
    } else {
      const chunks = chunk(page.content, 10);

      return (
        <Row>
          {chunks.map((options, index) => {
            return (
              <Col xs="auto" key={index} style={{ width: '300px' }}>
                {renderOptions({ options, horizontal: false })}
              </Col>
            );
          })}
        </Row>
      );
    }
  }

  function renderOptions({
    options,
    horizontal
  }: {
    options: T[];
    horizontal: boolean;
  }) {
    return options.map((option, index) => {
      const label = labelForOption(option);
      const key = getKeyForOption({ option, keyForOption, labelForOption });

      const isSelected = isOptionSelected({
        option,
        keyForOption,
        labelForOption,
        isOptionEqual,
        value
      });

      return (
        <FormGroup check key={key} inline={horizontal}>
          <Label check>
            <RSInput
              type="checkbox"
              checked={isSelected}
              value={index}
              disabled={!isOptionEnabled(option)}
              onChange={() => optionClicked(option, isSelected)}
            />{' '}
            {label}
          </Label>
        </FormGroup>
      );
    });
  }
}

/**
 * Variant of the CheckboxMultipleSelect which can be used in a Jarb context.
 */
export const JarbCheckboxMultipleSelect = withJarb<
  any[],
  any[] | null,
  Props<any>
>(CheckboxMultipleSelect);
