import React, { useState } from 'react';
import { FormGroup, Label } from 'reactstrap';
import {
  AsyncTypeahead,
  TokenProps,
  Typeahead,
  TypeaheadProps
} from 'react-bootstrap-typeahead';
import { TypeaheadOption } from '../types';
import { withJarb } from '../../withJarb/withJarb';
import { doBlur, alwaysTrue } from '../../utils';
import { optionToTypeaheadOption } from '../utils';
import {
  FieldCompatibleWithPredeterminedOptions,
  isOptionSelected
} from '../../option';
import classNames from 'classnames';
import { Tag } from '../../../core/Tag/Tag';
import { FieldCompatible } from '../../types';
import { useId } from '../../../hooks/useId/useId';
import { useOptions } from '../../useOptions';
import { t } from '../../../utilities/translation/translation';

type Text = {
  /**
   * Text to show when more than 100 items are available
   * in the dropdown. This is used by the pagination built
   * into the Typeahead of reactstrap.
   *
   * Defaults to `Display additional results...`
   */
  paginationText?: string;
};

type Props<T> = FieldCompatible<T[], T[] | undefined> &
  FieldCompatibleWithPredeterminedOptions<T> & {
    /**
     * Optionally specify the number of suggestions to fetch for the
     * dropdown.
     *
     * When `options` is an array, all options will always be used
     * and this prop has no effect.
     *
     * When `options` is a fetcher, it will determine how many options
     * are requested through the fetcher as the `page` parameter.
     * This means that when you set the pageSize to `100` that
     * `100` items are fetched from the back-end. Beware of
     * performance issues when setting the value too high.
     *
     * Beware that setting the page size too high will cause the UX
     * to deteriorate on smaller screens!
     *
     * Defaults to `10`.
     */
    pageSize?: number;

    /**
     * Optionally specify the number of suggestions to show in the
     * dropdown.
     *
     * When `options` is an array, this prop will limit the amount of
     * suggestions and display pagination.
     *
     * When `options` is a fetcher, this prop will limit the amount of
     * suggestions only when `pageSize` is larger than this prop. This
     * means the options fetched from the back-end might be a large list
     * but only a subset of them are displayed at the same time. Every
     * time the user types in the input, the options are fetched again.
     * Beware of performance issues when setting the `pageSize` too high.
     *
     * Defaults to `100`.
     */
    maxResults?: number;

    /**
     * Optionally customized text within the component.
     * This text should already be translated.
     */
    text?: Text;
  };

/**
 * The TypeaheadMultiple is a form element which allows the user
 * to select multiple options by searching for them and selecting
 * them.
 *
 * The use case is that when there are too many options to render
 * in a simple Select you can use the TypeaheadMultiple.
 *
 * Use the TypeaheadMultiple when the user knows which options he / she
 * wants to select beforehand. Scenario: you are building a system
 * for a trading company, the users need to enter some trading code
 * from a big list. The users know each code by heart since they
 * work with the system daily. This is a nice use case for the TypeaheadMultiple
 * because the user can type in faster than the can select from a
 * ModalPickerMultiple.
 */
export function TypeaheadMultiple<T>(props: Props<T>) {
  const {
    id,
    label,
    placeholder,
    value,
    color,
    error,
    labelForOption,
    onFocus,
    valid,
    className = '',
    onChange,
    onBlur,
    options,
    keyForOption,
    isOptionEqual,
    reloadOptions,
    isOptionEnabled = alwaysTrue,
    pageSize = 10,
    text = {},
    maxResults = 100
  } = props;

  const [query, setQuery] = useState('');

  const { page, loading } = useOptions<T>({
    options,
    value,
    keyForOption,
    isOptionEqual,
    labelForOption,
    reloadOptions,
    query,
    pageNumber: 1,
    size: Array.isArray(options) ? options.length : pageSize,
    optionsShouldAlwaysContainValue: false
  });

  const typeaheadOptions = page.content
    .filter((option) => isOptionEnabled(option))
    .filter(
      (option) =>
        !isOptionSelected({
          option,
          keyForOption,
          labelForOption,
          isOptionEqual,
          value
        })
    )
    .map((option) => optionToTypeaheadOption(option, labelForOption));

  function doOnChange(values: TypeaheadOption<T>[]): void {
    if (values.length === 0) {
      onChange(undefined);
    } else {
      onChange(values.map((option) => option.value));
    }

    // Due this: https://github.com/ericgio/react-bootstrap-typeahead/issues/224
    // If we invoke the input.onBlur at the typeahead onblur you would get this:
    // onBlur -> onChange, but it should be the other way around.
    // onBlur Should be called when the user navigates away from the input.
    // In this case when the user selects an item (onChange).
    doBlur(onBlur);
  }

  function renderToken(
    option: TypeaheadOption<T>,
    props: TokenProps,
    index: number
  ) {
    return (
      <Tag
        key={index}
        text={option.label}
        // @ts-expect-error The prop onRemove actually exists, the typings are wrong
        onRemove={() => props.onRemove(option)}
        className="align-self-center"
      />
    );
  }

  let selected: TypeaheadOption<T>[] = [];
  if (value && value.length) {
    selected = value.map((v) => optionToTypeaheadOption(v, labelForOption));
  }

  const classes = classNames(className, {
    'is-invalid': valid === false
  });

  const innerId = useId({ id });

  const typeaheadProps: TypeaheadProps<TypeaheadOption<T>> = {
    id,
    filterBy: alwaysTrue,
    paginationText: t({
      key: 'TypeaheadMultiple.PAGINATION_TEXT',
      fallback: 'Display additional results...',
      overrideText: text.paginationText
    }),
    multiple: true,
    placeholder,
    selected,
    options: typeaheadOptions,
    onChange: doOnChange,
    onFocus,
    inputProps: {
      id: innerId,
      // @ts-expect-error The input props value works
      value,
      className: classNames('form-control', {
        'is-invalid': valid === false
      })
    },
    renderToken,
    maxResults,
    paginate: true
  };

  return (
    <FormGroup className={classes} color={color}>
      {label ? <Label for={innerId}>{label}</Label> : null}
      <div className={selected.length === 0 ? 'showing-placeholder' : ''}>
        {Array.isArray(options) ? (
          <Typeahead {...typeaheadProps} onInputChange={setQuery} />
        ) : (
          <AsyncTypeahead
            {...typeaheadProps}
            isLoading={loading}
            delay={200}
            onSearch={setQuery}
          />
        )}
      </div>
      {error}
    </FormGroup>
  );
}

/**
 * Variant of the TypeaheadMultiple which can be used in a Jarb context.
 */
export const JarbTypeaheadMultiple = withJarb<
  any[],
  any[] | undefined,
  Props<any>
>(TypeaheadMultiple);
