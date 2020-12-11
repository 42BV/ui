import React, { useEffect, useState } from 'react';
import {
  FetchOptionsCallback,
  OptionEqual,
  OptionForValue,
  UniqueKeyForValue
} from '../option';
import withJarb from '../withJarb/withJarb';

import ModalPickerMultiple from '../ModalPicker/multiple/ModalPickerMultiple';
import CheckboxMultipleSelect from '../CheckboxMultipleSelect/CheckboxMultipleSelect';

import RadioGroup from '../RadioGroup/RadioGroup';
import Select from '../Select/Select';
import ModalPickerSingle from '../ModalPicker/single/ModalPickerSingle';

import Spinner from '../../core/Spinner/Spinner';
import { t } from '../../utilities/translation/translation';
import { FieldCompatible } from '../types';

export type Text = {
  /**
   * The message to show when the ValuePicker is loading. Defaults
   * to `loading...`
   */
  loadingMessage?: string;
};

type BaseValuePickerProps<T> = Omit<FieldCompatible<T, T>, 'placeholder'> & {
  /**
   * The placeholder of the form element.
   */
  placeholder: string;

  /**
   * Optionally whether or not the user can search.
   * Defaults to `true`.
   */
  canSearch?: boolean;

  /**
   * Callback to fetch the options to display to the user.
   */
  fetchOptions: FetchOptionsCallback<T>;

  /**
   * Callback to convert an value of type T to an option to show
   * to the user.
   */
  optionForValue: OptionForValue<T>;

  /**
   * Optional callback which is used to determine if two options
   * of type T are equal.
   *
   * When `isOptionEqual` is not defined the outcome of `optionForValue`
   * is used to test equality.
   */
  isOptionEqual?: OptionEqual<T>;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  /**
   * Optional callback to get a unique key for an item.
   * This is used to provide each option in the form element a unique key.
   * Defaults to the 'id' property if it exists, otherwise uses optionForValue.
   */
  uniqueKeyForValue?: UniqueKeyForValue<T>;
};

type SingleValuePicker<T> = Omit<
  BaseValuePickerProps<T>,
  'value' | 'onChange'
> & {
  /**
   * Whether or not multiple values can be selected.
   */
  multiple: false;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: T | undefined) => void;

  /**
   * The value that the form element currently has.
   */
  value?: T;
};

type MultipleValuePicker<T> = Omit<
  BaseValuePickerProps<T>,
  'value' | 'onChange'
> & {
  /**
   * Whether or not multiple values can be selected.
   */
  multiple: true;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: T[] | undefined) => void;

  /**
   * The value that the form element currently has.
   */
  value?: T[];
};

type Props<T> = SingleValuePicker<T> | MultipleValuePicker<T>;

/**
 *
 * The `ValuePicker` component is an abstraction which automatically
 * selects the best component to use when the user has to select a value
 * from a pre-defined list.
 *
 * This is the decision matrix:
 *
 * ```
 * | multiple | items <=3              | items <= 10             | items > 10
 * | true     | CheckboxMultipleSelect | CheckboxMultipleSelect  | ModalPickerMultiple
 * | false    | RadioGroup             | Select                  | ModalPickerSingle
 * ```
 *
 * `ValuePicker` starts in a booting state in which a spinner is shown.
 * During the booting state it will call `FetchOptionsCallback` and ask
 * for a `Page` of size `1` so it can get the `totalElements`.
 */
export default function ValuePicker<T>(props: Props<T>) {
  const { text = {}, fetchOptions } = props;

  const [booting, setBooting] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    async function boot() {
      const page = await fetchOptions('', 1, 1);
      setTotalElements(page.totalElements);

      setBooting(false);
    }

    boot();
  }, [fetchOptions]);

  // Until we know the number of totalElements the ValuePicker is booting.
  // and we do not shown anything to the user yet.
  if (booting) {
    return (
      <div>
        <Spinner color="black" size={16} />{' '}
        <span>
          {t({
            key: 'ValuePicker.LOADING',
            fallback: 'Loading...',
            overrideText: text.loadingMessage
          })}
        </span>
      </div>
    );
  }

  if (props.multiple) {
    const { fetchOptions, multiple, ...rest } = props;

    if (totalElements < 11) {
      return (
        <CheckboxMultipleSelect
          options={() => fetchOptions('', 1, 10)}
          {...rest}
        />
      );
    } else {
      return <ModalPickerMultiple fetchOptions={fetchOptions} {...rest} />;
    }
  } else {
    const { fetchOptions, multiple, ...rest } = props;

    if (totalElements < 4) {
      return (
        <RadioGroup
          options={() => fetchOptions('', 1, 3)}
          canClear={true}
          {...rest}
        />
      );
    } else if (totalElements < 11) {
      return <Select options={() => fetchOptions('', 1, 10)} {...rest} />;
    } else {
      return <ModalPickerSingle fetchOptions={fetchOptions} {...rest} />;
    }
  }
}

/**
 * Variant of the ValuePicker which can be used in a Jarb context.
 */
export const JarbValuePicker = withJarb<any, any | null, Props<any>>(
  ValuePicker
);
