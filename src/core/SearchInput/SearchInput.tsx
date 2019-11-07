import React, { useRef, KeyboardEvent } from 'react';
import { debounce as lodashDebounce, DebounceSettings } from 'lodash';
import { Input, InputProps, InputGroup, InputGroupAddon } from 'reactstrap';

import { Icon } from '../Icon';

type ModifiedInputProps = Omit<
  InputProps,
  // We are going to override onChange so it sends out strings.
  | 'onChange'
  // Value is only going to accept strings
  | 'value'
  // We want to remove the defaultValue because we are going to set it
  // ourselves, we do not want the user to accidentaly use it.
  | 'defaultValue'
>;

interface Props extends ModifiedInputProps {
  /**
   * Optionally the number of milliseconds to debounce the onChange.
   *
   * Defaults to 500 milliseconds.
   */
  debounce?: number;

  /**
   * Optionally the debounce settings. As defined by lodash
   * https://lodash.com/docs/4.17.15#debounce.
   */
  debounceSettings?: DebounceSettings;

  /**
   * The value that the form element currently has.
   */
  value: string;

  /**
   * Called when the value changes after the debounce period.
   */
  onChange: (value: string) => void;

  /**
   * Whether or not to show a magnifying glass icon.
   *
   * Defaults to true.
   */
  showIcon?: boolean;
}

/**
 * SearchInput is a component which shows an input field which has
 * the onChange debounced by a number of milliseconds. Useful for
 * when you want to run search queries on your back-end, and you
 * don't want to spam the back-end for every keystroke.
 *
 * For the debounce logic it uses lodash.
 */
export default function SearchInput(props: Props) {
  const {
    debounce = 500,
    debounceSettings,
    value,
    onChange,
    showIcon = true,
    ...rest
  } = props;

  const handleChange = useRef(
    lodashDebounce(onChange, debounce, debounceSettings)
  );

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onChange(event.currentTarget.value);
    }
  }

  // We map value to defaultValue so this component is completely
  // controlled by us. Otherwise the value of the <Input> will only
  // update after the onChange. Which would never work because it is
  // debounced.

  const input = (
    <Input
      defaultValue={value}
      onChange={event => handleChange.current(event.target.value)}
      onKeyUp={handleKeyUp}
      {...rest}
    />
  );

  if (showIcon) {
    return (
      <InputGroup size={rest.size}>
        <InputGroupAddon addonType="prepend">
          <Icon icon="search" />
        </InputGroupAddon>
        {input}
      </InputGroup>
    );
  } else {
    return input;
  }
}
