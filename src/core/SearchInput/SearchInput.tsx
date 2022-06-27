import React, { KeyboardEvent, useEffect, useRef } from 'react';
import { debounce as lodashDebounce, DebounceSettings, uniqueId } from 'lodash';
import { FormGroup, Input, InputGroup, InputProps, Label } from 'reactstrap';

import { Icon } from '../Icon';
import { BootstrapSize } from '../types';
import { AddonIcon } from '../../form/addons/AddonIcon/AddonIcon';

export type SearchInputApi = {
  /**
   * Sets the value of the SearchInput's inner <input> element
   * cancels any active debounce, and calls props.onChange with
   * the value.
   */
  setValue: (value: string) => void;
};

type ModifiedInputProps = Omit<InputProps,
  // We are going to override onChange so it sends out strings.
  | 'onChange'
  // We want to remove the value because we use defaultValue,
  // we do not want the user to accidentally use it.
  | 'value'
  // defaultValue is only going to accept strings.
  | 'defaultValue'
  // We are going to override size to use it for icon size.
  | 'size'
  // id is required when a label is specified.
  | 'id'
  // children is going to accept a function instead of a ReactNode.
  | 'children'
  // We are going to override some properties to be able to provide docs.
  | 'placeholder'
  | 'className'>;

export type Props = ModifiedInputProps & {
  /**
   * Optionally the id of the SearchInput. Will be automatically
   * filled in when not provided manually.
   */
  id?: string;

  /**
   * The label of the SearchInput.
   */
  label: React.ReactNode;


  /**
   * Optionally whether the label should be invisible (aria-label).
   * This only works if label is a string.
   * Defaults to false.
   */
  hiddenLabel?: boolean;

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
   */
  defaultValue: string;

  /**
   * Called when the value changes after the debounce period.
   */
  onChange: (value: string) => void;

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

  /**
   * Whether or not to show a magnifying glass icon.
   *
   * Defaults to true.
   */
  showIcon?: boolean;

  /**
   * Optional size you want to give the icon.
   */
  size?: BootstrapSize;

  /**
   * Whether or not to show a "clear" button.
   *
   * Defaults to `true`
   */
  canClear?: boolean;
};

/**
 * SearchInput is a component which shows an input field which has
 * the onChange debounced by a number of milliseconds. Useful for
 * when you want to run search queries on your back-end, and you
 * don't want to spam the back-end for every keystroke.
 *
 * For the debounce logic it uses lodash.
 */
export function SearchInput(props: Props) {
  const {
    id = uniqueId(),
    label,
    hiddenLabel,
    debounce = 500,
    debounceSettings,
    placeholder,
    defaultValue,
    onChange,
    showIcon = true,
    className = '',
    children,
    size,
    canClear = true
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = useRef(
    lodashDebounce(onChange, debounce, debounceSettings)
  );

  // When the onChange changes update the handleChange
  useEffect(() => {
    handleChange.current = lodashDebounce(onChange, debounce, debounceSettings);
  }, [ onChange, debounce, debounceSettings ]);

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onChange(event.currentTarget.value);
    }
  }

  function setValue(value: string) {
    if (inputRef.current) {
      inputRef.current.value = value;
      onChange(value);
      // if you change the value externally within the debounce time,
      // the debounce should be cancelled to prevent an overwrite
      handleChange.current.cancel();
    }
  }

  // We use the defaultValue so this component is completely
  // controlled by us. Otherwise the value of the <Input> will only
  // update after the onChange. Which would never work because it is
  // debounced.
  const inputProps: InputProps = {
    id,
    innerRef: inputRef,
    defaultValue,
    onChange: (event) => {
      handleChange.current(event.target.value);
    },
    onKeyUp: handleKeyUp,
    placeholder: placeholder,
    type: 'search',
    'aria-label': hiddenLabel && typeof label === 'string' ? label : undefined
  };

  function getInput() {
    if (showIcon) {
      return (
        <InputGroup className={className} size={size}>
          <AddonIcon icon="search" />
          <Input {...inputProps} />
        </InputGroup>
      );
    }

    return <Input className={className} {...inputProps} />;
  }

  const searchInputWrapper = (
    <div className="search-input">
      {inputRef.current?.value && canClear ? (
        <Icon
          icon="close"
          className="cancel-search"
          onClick={() => setValue('')}
        />
      ) : null}
      {children ? <>{children(getInput(), { setValue })}</> : getInput()}
    </div>
  );

  return !hiddenLabel || typeof label !== 'string' ? (
    <FormGroup>
      <Label for={id}>{label}</Label>
      {searchInputWrapper}
    </FormGroup>
  ) : (
    searchInputWrapper
  );
}
