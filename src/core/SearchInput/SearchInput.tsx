import React, { useRef, KeyboardEvent, useEffect } from 'react';
import { debounce as lodashDebounce, DebounceSettings } from 'lodash';
import {
  Input,
  InputProps,
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Label
} from 'reactstrap';

import { Icon } from '../Icon';

interface SearchInputApi {
  /**
   * Sets the value of the SearchInput's inner <input> element
   * cancels any active debounce, and calls props.onChange with
   * the value.
   */
  setValue: (value: string) => void;
}

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

interface BaseProps extends ModifiedInputProps {
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
   * The placeholder of the form element.
   */
  placeholder?: string;

  /**
   * The default value that the form element currently has.
   * In the future this will be called `defaultValue` instead
   * of `value`.
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

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally you can use the `children` prop to manipulate the
   * value rendered inside of the `SearchInput`.
   *
   * You will be called with the `searchInput`, which you must render, and
   * an API object, which you can use to manually alter the value.
   *
   * The `setValue` in the API will then cancel any active debounce.
   *
   * This has to be done via this unconventional api because the
   * `SearchInput` has to use an uncontrolled <input> so it can
   * debounce the value. If you would change the `props.value` from
   * outside this component nothing would normally happen.
   */
  children?: (
    searchInput: React.ReactNode,
    api: SearchInputApi
  ) => React.ReactNode;
}

interface WithoutLabel extends BaseProps {
  id?: never;
  label?: never;
}

interface WithLabel extends BaseProps {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The label of the form element.
   */
  label: string;
}

export type Props = WithoutLabel | WithLabel;

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
    placeholder,
    value,
    onChange,
    showIcon = true,
    className = '',
    children,
    ...rest
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = useRef(
    lodashDebounce(onChange, debounce, debounceSettings)
  );

  // When the onChange changes update the handleChange
  useEffect(() => {
    handleChange.current = lodashDebounce(onChange, debounce, debounceSettings);
  }, [onChange, debounce, debounceSettings]);

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onChange(event.currentTarget.value);
    }
  }

  function setValue(value: string) {
    if (inputRef.current) {
      inputRef.current.value = value;
      onChange(value);
      handleChange.current.cancel();
    }
  }

  // We map value to defaultValue so this component is completely
  // controlled by us. Otherwise the value of the <Input> will only
  // update after the onChange. Which would never work because it is
  // debounced.

  const input = (
    <Input
      id={'id' in props ? props.id : undefined}
      className={!showIcon ? className : ''}
      innerRef={inputRef}
      defaultValue={value}
      onChange={event => handleChange.current(event.target.value)}
      onKeyUp={handleKeyUp}
      placeholder={placeholder}
      {...rest}
    />
  );

  const searchInput = showIcon ? (
    <InputGroup className={className} size={rest.size}>
      <InputGroupAddon addonType="prepend">
        <Icon icon="search" />
      </InputGroupAddon>
      {input}
    </InputGroup>
  ) : (
    input
  );

  const searchInputWrapper = children ? (
    <>{children(searchInput, { setValue })}</>
  ) : (
    searchInput
  );

  return 'label' in props ? (
    <FormGroup>
      <Label for={props.id}>{props.label}</Label>
      {searchInputWrapper}
    </FormGroup>
  ) : (
    searchInputWrapper
  );
}
