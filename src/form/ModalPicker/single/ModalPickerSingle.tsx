import React, { MouseEventHandler, useState } from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import { FieldCompatibleWithPredeterminedOptions } from '../../option';
import { FieldCompatible } from '../../types';
import { withJarb } from '../../withJarb/withJarb';
import { ModalPicker, Text } from '../ModalPicker';
import { ModalPickerOpener } from '../ModalPickerOpener/ModalPickerOpener';
import { ModalPickerValueTruncator } from '../ModalPickerValueTruncator/ModalPickerValueTruncator';
import {
  ModalPickerAddButtonOptions,
  ModalPickerButtonAlignment,
  ModalPickerRenderOptions
} from '../types';
import { IconType } from '../../../core/Icon';
import { withField } from '../../withField/withField';

export type ModalPickerSingleRenderValue<T> = (value?: T) => React.ReactNode;

type Props<T> = Omit<
  FieldCompatible<T, T | undefined>,
  'placeholder' | 'valid'
> &
  FieldCompatibleWithPredeterminedOptions<T> & {
    /**
     * The placeholder of the form element.
     */
    placeholder: string;

    /**
     * Optionally the icon to display on the button to open the modal picker.
     */
    icon?: IconType;

    /**
     * Optionally whether the user can search.
     * Defaults to `true`.
     */
    canSearch?: boolean;

    /**
     * Optionally specify the number of options to show / fetch per
     * page in the modal.
     *
     * When `options` is an array, it will determine how many options
     * will be displayed per page.
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
     * Optionally an add button to display in the Modal. Can
     * be used to dynamically add an option which was not there
     * before.
     */
    addButton?: ModalPickerAddButtonOptions<T>;

    /**
     * Optionally the position the button should be aligned to
     * within its container.
     */
    alignButton?: ModalPickerButtonAlignment;

    /**
     * Optionally callback to display the selected item.
     */
    renderValue?: ModalPickerSingleRenderValue<T>;

    /**
     * Callback to customize display of options.
     */
    renderOptions?: ModalPickerRenderOptions<T>;

    /**
     * Whether to show a "clear" button.
     *
     * Defaults to `true`
     */
    canClear?: boolean;

    /**
     * Optionally customized text within the component.
     * This text should already be translated.
     */
    text?: Text;
  };

/**
 * The ModalPickerSingle is a form element which allows the user
 * to select an option from a modal.
 *
 * The use case is that when there are too many options to render
 * in a simple Select you can use the ModalPickerSingle.
 *
 * Use the ModalPickerSingle when the user does not precisely know
 * which option he / she is going to select. Otherwise, use the
 * TypeaheadSingle which is useful when the user is an expert and
 * can type in the selection quicker than he can select it from the
 * modal.
 */
export function ModalPickerSingle<T>(props: Props<T>) {
  const {
    label,
    hiddenLabel,
    color,
    placeholder,
    icon,
    className = '',
    value,
    onChange,
    addButton,
    canSearch,
    pageSize,
    options,
    keyForOption,
    isOptionEqual,
    isOptionEnabled,
    labelForOption,
    reloadOptions,
    renderValue,
    alignButton,
    renderOptions,
    error,
    canClear = true,
    text
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  function modalSaved(selected?: T) {
    setIsOpen(false);
    onChange(selected);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const openModal: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  const modalPickerOpenerProps = {
    openModal,
    label: placeholder,
    icon,
    alignButton,
    renderValue: renderValue
      ? renderValue
      : (value: T) => (
          <ModalPickerValueTruncator
            value={value}
            labelForOption={labelForOption}
          />
        ),
    onClear: canClear ? () => onChange(undefined) : undefined,
    value
  };

  return (
    <FormGroup className={className} color={color}>
      {!hiddenLabel ? <Label>{label}</Label> : null}

      <ModalPickerOpener {...modalPickerOpenerProps} />

      {error}

      {isOpen ? renderModal() : null}
    </FormGroup>
  );

  function renderModal() {
    return (
      <ModalPicker
        placeholder={placeholder}
        canSearch={canSearch}
        canSearchSync={Array.isArray(options)}
        closeModal={closeModal}
        modalSaved={modalSaved}
        addButton={addButton}
        value={value}
        renderOptionsConfig={{
          isOptionEqual,
          keyForOption,
          isOptionEnabled,
          renderOptions
        }}
        text={text}
        pageSize={pageSize}
        options={options}
        labelForOption={labelForOption}
        reloadOptions={reloadOptions}
      >
        {(options) =>
          options.map((option) => (
            <FormGroup key={option.key} check disabled={!option.enabled}>
              <Label check>
                <Input
                  type="radio"
                  checked={option.isSelected}
                  disabled={!option.enabled}
                  onChange={option.toggle}
                />
                {option.label}
              </Label>
            </FormGroup>
          ))
        }
      </ModalPicker>
    );
  }
}

/**
 * Variant of the ModalPickerSingle which can be used in a Jarb context.
 */
export const JarbModalPickerSingle = withJarb<any, any | null, Props<any>>(
  ModalPickerSingle
);

/**
 * Variant of the ModalPickerSingle which can be used in a final form.
 */
export const FieldModalPickerSingle = withField<any, any | null, Props<any>>(
  ModalPickerSingle
);
