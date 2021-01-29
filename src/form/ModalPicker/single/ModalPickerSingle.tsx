import React, { useState } from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import { useId } from '../../../hooks/useId/useId';
import {
  FieldCompatibleWithPredeterminedOptions,
  isOptionSelected,
  getKeyForOption
} from '../../option';
import { FieldCompatible } from '../../types';
import { useOptions } from '../../useOptions';
import { alwaysTrue } from '../../utils';
import withJarb from '../../withJarb/withJarb';
import ModalPicker from '../ModalPicker';
import { ModalPickerOpener } from '../ModalPickerOpener/ModalPickerOpener';
import { ModalPickerValueTruncator } from '../ModalPickerValueTruncator/ModalPickerValueTruncator';
import {
  ModalPickerAddButtonCallback,
  ModalPickerAddButtonOptions,
  ModalPickerButtonAlignment,
  ModalPickerRenderOptions
} from '../types';
import { IconType } from '../../../core/Icon';

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
     * Optionally whether or not the user can search.
     * Defaults to `true`.
     */
    canSearch?: boolean;

    /**
     * Optionally an add button to display in the Modal. Can
     * be used to dynamically add an option which was not there
     * before.
     */
    addButton?: ModalPickerAddButtonOptions<T>;

    /**
     * Optionally the position the button should be aligned to
     * within it's container.
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
     * Whether or not to show a "clear" button.
     *
     * Defaults to `true`
     */
    canClear?: boolean;
  };

/**
 * The ModalPickerSingle is a form element which allows the user
 * to select an option from a modal.
 *
 * The use case is that when there are too many options to render
 * in a simple Select you can use the ModalPickerSingle.
 *
 * Use the ModalPickerSingle when the user does not precisely know
 * which option he / she is going to select. Otherwise use the
 * TypeaheadSingle which is useful when the user is an expert and
 * can type in the selection quicker than he can select it from the
 * modal.
 */
export default function ModalPickerSingle<T>(props: Props<T>) {
  const {
    id,
    label,
    color,
    placeholder,
    icon,
    className = '',
    value,
    onChange,
    addButton,
    canSearch = true,
    options,
    keyForOption,
    isOptionEqual,
    isOptionEnabled = alwaysTrue,
    labelForOption,
    reloadOptions,
    renderValue,
    alignButton,
    renderOptions,
    error,
    canClear = true
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState<string>('');
  const [userHasSearched, setUserHasSearched] = useState(false);
  const [selected, setSelected] = useState<T | undefined>(undefined);

  const { page, loading } = useOptions({
    options,
    value,
    isOptionEqual,
    labelForOption,
    reloadOptions,
    pageNumber,
    query,
    size: 10,
    optionsShouldAlwaysContainValue: false
  });

  const innerId = useId({ id });

  function modalSaved() {
    setIsOpen(false);

    onChange(selected);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
    setSelected(value);
    setQuery('');
    setPageNumber(1);
    setUserHasSearched(false);
  }

  async function addButtonClicked(callback: ModalPickerAddButtonCallback<T>) {
    setIsOpen(false);

    try {
      const option = await callback();

      setSelected(option);
      page.content.unshift(option);

      setIsOpen(true);
    } catch (error) {
      setIsOpen(true);
    }
  }

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
      {label ? <Label for={innerId}>{label}</Label> : null}

      <ModalPickerOpener {...modalPickerOpenerProps} />

      {error}

      {renderModal()}
    </FormGroup>
  );

  function queryChanged(query: string) {
    setQuery(query);
    setUserHasSearched(true);
    setPageNumber(1);
  }

  function renderModal() {
    const addButtonOptions = addButton
      ? {
          label: addButton.label,
          onClick: () => {
            addButtonClicked(addButton.onClick);
          }
        }
      : undefined;

    return (
      <ModalPicker
        query={query}
        placeholder={placeholder}
        isOpen={isOpen}
        page={page}
        canSearch={canSearch}
        canSearchSync={Array.isArray(options)}
        queryChanged={queryChanged}
        pageChanged={setPageNumber}
        closeModal={closeModal}
        modalSaved={modalSaved}
        addButton={addButtonOptions}
        loading={loading}
        userHasSearched={userHasSearched}
        selected={selected}
        renderOptionsConfig={
          renderOptions
            ? {
                labelForOption,
                isOptionEqual,
                keyForOption,
                isOptionEnabled,
                renderOptions,
                onChange: setSelected
              }
            : undefined
        }
      >
        {renderModalContent()}
      </ModalPicker>
    );
  }

  function renderModalContent(): React.ReactNode {
    return page.content.map((option: T) => {
      const label = labelForOption(option);
      const key = getKeyForOption({ option, keyForOption, labelForOption });

      const isChecked = isOptionSelected({
        option,
        keyForOption,
        labelForOption,
        isOptionEqual,
        value: selected
      });

      return (
        <FormGroup key={key} check>
          <Label check>
            <Input
              type="radio"
              checked={isChecked}
              disabled={!isOptionEnabled(option)}
              onChange={() => setSelected(option)}
            />
            {label}
          </Label>
        </FormGroup>
      );
    });
  }
}

/**
 * Variant of the ModalPickerSingle which can be used in a Jarb context.
 */
export const JarbModalPickerSingle = withJarb<any, any | null, Props<any>>(
  ModalPickerSingle
);
