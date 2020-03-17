import React, { useEffect, useState } from 'react';
import { FetchOptionsCallback } from '../option';
import withJarb from '../withJarb/withJarb';

import ModalPickerMultiple from '../ModalPicker/multiple/ModalPickerMultiple';
import CheckboxMultipleSelect from '../CheckboxMultipleSelect/CheckboxMultipleSelect';

import RadioGroup from '../RadioGroup/RadioGroup';
import Select from '../Select/Select';
import ModalPickerSingle from '../ModalPicker/single/ModalPickerSingle';

import Spinner from '../../core/Spinner/Spinner';
import { t } from '../../utilities/translation/translation';
import {
  FieldWithOptionsCompatible,
  MultiFieldWithOptionsCompatible
} from '../types';

type BaseValuePickerProps<T> = {
  /**
   * The placeholder of the form element.
   */
  placeholder: string;

  /**
   * Callback to fetch the options to display to the user.
   */
  options: FetchOptionsCallback<T>;

  /**
   * Optionally whether or not the user can search.
   * Defaults to `true`.
   */
  canSearch?: boolean;
};

type SingleValuePicker<T> = Omit<
  FieldWithOptionsCompatible<T, T | undefined>,
  'placeholder' | 'options' | 'isOptionEnabled'
> &
  BaseValuePickerProps<T> & {
    /**
     * Whether or not multiple values can be selected.
     */
    multiple: false;
  };

type MultipleValuePicker<T> = Omit<
  MultiFieldWithOptionsCompatible<T, T[] | undefined>,
  'placeholder' | 'options' | 'isOptionEnabled'
> &
  BaseValuePickerProps<T> & {
    /**
     * Whether or not multiple values can be selected.
     */
    multiple: true;
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
  const { text = {}, options } = props;

  const [booting, setBooting] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    async function boot() {
      const page = await options('', 1, 1);
      setTotalElements(page.totalElements);

      setBooting(false);
    }

    boot();
  }, [options]);

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
    const { options, multiple, ...rest } = props;

    if (totalElements < 11) {
      return (
        <CheckboxMultipleSelect options={() => options('', 1, 10)} {...rest} />
      );
    } else {
      return <ModalPickerMultiple options={options} {...rest} />;
    }
  } else {
    const { options, multiple, ...rest } = props;

    if (totalElements < 4) {
      return (
        <RadioGroup
          options={() => options('', 1, 3)}
          canClear={true}
          {...rest}
        />
      );
    } else if (totalElements < 11) {
      return <Select options={() => options('', 1, 10)} {...rest} />;
    } else {
      return <ModalPickerSingle options={options} {...rest} />;
    }
  }
}

/**
 * Variant of the ValuePicker which can be used in a Jarb context.
 */
export const JarbValuePicker = withJarb<any, any | null, Props<any>>(
  ValuePicker
);
