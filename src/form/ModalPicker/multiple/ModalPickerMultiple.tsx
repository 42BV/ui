import React, { useState } from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';

import { withJarb } from '../../withJarb/withJarb';
import { alwaysTrue, doBlur } from '../../utils';
import { Tag } from '../../../core/Tag/Tag';
import { ModalPicker, Text } from '../ModalPicker';
import {
  ModalPickerAddButtonCallback,
  ModalPickerAddButtonOptions,
  ModalPickerButtonAlignment,
  ModalPickerRenderOptions
} from '../types';
import {
  FieldCompatibleWithPredeterminedOptions,
  getKeyForOption,
  isOptionSelected
} from '../../option';
import { ModalPickerOpener } from '../ModalPickerOpener/ModalPickerOpener';
import { ModalPickerValueTruncator } from '../ModalPickerValueTruncator/ModalPickerValueTruncator';
import { FieldCompatible } from '../../types';
import { useOptions } from '../../useOptions';
import { IconType } from '../../../core/Icon';
import { t } from '../../../utilities/translation/translation';
import { withField } from '../../withField/withField';

export type ModalPickerMultipleRenderValues<T> = (
  value?: T[]
) => React.ReactNode;

export type Props<T> = Omit<
  FieldCompatible<T[], T[] | undefined>,
  'valid' | 'placeholder'
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
     * Optionally callback to display the selected items.
     */
    renderValue?: ModalPickerMultipleRenderValues<T>;

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
 * The ModalPickerMultiple is a form element which allows the user
 * to select multiple options from a modal.
 *
 * The use case is that when there are too many options to render
 * in a simple Select you can use the ModalPickerMultiple.
 *
 * Use the ModalPickerMultiple when the user does not precisely know
 * which options he / she is going to select. Otherwise, use the
 * TypeaheadMultiple which is useful when the user is an expert and
 * can type in the selections quicker than he can select it from
 * the modal.
 */
export function ModalPickerMultiple<T>(props: Props<T>) {
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
    canSearch = true,
    pageSize = 10,
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
    onBlur,
    canClear = true,
    text
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState<string>('');
  const [userHasSearched, setUserHasSearched] = useState(false);
  const [selected, setSelected] = useState<T[]>([]);

  const { page, loading } = useOptions({
    options,
    value,
    isOptionEqual,
    labelForOption,
    reloadOptions,
    pageNumber,
    query,
    size: pageSize,
    optionsShouldAlwaysContainValue: false
  });

  function modalSaved() {
    setIsOpen(false);
    onChange([...selected]);

    doBlur(onBlur);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    // Always copy the `value` so the `selected` is a fresh array.
    // Otherwise, the selection will be the same as the value, which
    // causes values to be committed and the cancel button will not
    // do anything.
    const newSelected = Array.isArray(value) ? [...value] : [];

    setSelected(newSelected);
    setIsOpen(true);
    setQuery('');
    setPageNumber(1);
    setUserHasSearched(false);
  }

  function optionClicked(option: T, isSelected: boolean) {
    // Always copy the `value` so the `selected` is a fresh array.
    // Otherwise, the selection will be the same as the value, which
    // causes values to be committed and the cancel button will not
    // do anything.
    let newSelected = [...selected];

    if (isSelected) {
      newSelected = selected.filter(
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
      newSelected.push(option);
    }

    setSelected(newSelected);
  }

  async function addButtonClicked(callback: ModalPickerAddButtonCallback<T>) {
    setIsOpen(false);

    try {
      const item = await callback();

      optionClicked(item, false);
      page.content.unshift(item);

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
      : (value: T[]) => (
          <ModalPickerValueTruncator
            value={value}
            labelForOption={labelForOption}
          />
        ),
    onClear: canClear ? () => onChange(undefined) : undefined,
    // Only render the clear button when it has a value
    value: value && value.length > 0 ? value : undefined
  };

  return (
    <FormGroup className={className} color={color}>
      {!hiddenLabel ? <Label>{label}</Label> : null}

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
          onClick: () => addButtonClicked(addButton.onClick)
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
                onChange: optionClicked
              }
            : undefined
        }
        text={text}
      >
        {renderModalCurrentSelection()}

        {renderModalContent()}
      </ModalPicker>
    );
  }

  function renderModalContent(): React.ReactNode {
    return page.content.map((option) => {
      const label = labelForOption(option);
      const key = getKeyForOption({ option, keyForOption, labelForOption });

      const isSelected = isOptionSelected({
        option,
        labelForOption,
        isOptionEqual,
        keyForOption,
        value: selected
      });

      return (
        <FormGroup key={key} check>
          <Label check>
            <Input
              type="checkbox"
              checked={isSelected}
              disabled={!isOptionEnabled(option)}
              onChange={() => optionClicked(option, isSelected)}
            />
            {label}
          </Label>
        </FormGroup>
      );
    });
  }

  function renderModalCurrentSelection() {
    return (
      <Row className="mb-3 py-2 bg-dark bg-opacity-10">
        <Col className="bg-opacity-100">
          {selected && selected.length > 0 ? (
            selected.map((value) => {
              const label = labelForOption(value);

              return (
                <Tag
                  key={label}
                  onRemove={() => optionClicked(value, true)}
                  text={label}
                />
              );
            })
          ) : (
            <span className="text-muted">
              {t({
                key: 'ModalPickerMultiple.NO_OPTION_SELECTED',
                fallback: 'No option selected'
              })}
            </span>
          )}
        </Col>
      </Row>
    );
  }
}

/**
 * Variant of the ModalPickerMultiple which can be used in a Jarb context.
 */
export const JarbModalPickerMultiple = withJarb<
  any[],
  any[] | null | undefined,
  Props<any>
>(ModalPickerMultiple);

/**
 * Variant of the ModalPickerMultiple which can be used in a final form.
 */
export const FieldModalPickerMultiple = withField<
  any[],
  any[] | null | undefined,
  Props<any>
>(ModalPickerMultiple);
