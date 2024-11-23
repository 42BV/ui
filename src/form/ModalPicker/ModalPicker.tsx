import React, { ReactNode, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { Pagination } from '../../core/Pagination/Pagination';
import { t } from '../../utilities/translation/translation';
import { SearchInput } from '../../core/SearchInput/SearchInput';
import { ContentState } from '../../core/ContentState/ContentState';
import { EmptyModal } from './EmptyModal';
import {
  ModalPickerRenderOptions,
  ModalPickerRenderOptionsOption
} from './types';
import {
  compareOptions,
  FieldCompatibleWithPredeterminedOptions,
  getKeyForOption,
  isOptionSelected
} from '../option';
import { useOptions } from '../useOptions';

export type Text = {
  placeholder?: string;
  cancel?: string;
  select?: string;
  searchLabel?: string;
};

type BaseProps<T, Value> = FieldCompatibleWithPredeterminedOptions<T> & {
  /**
   * The placeholder of the form element.
   */
  placeholder: string;

  /**
   * Here the component using the ModalPicker must render in the options.
   */
  children: (options: ModalPickerRenderOptionsOption<T>[]) => React.ReactNode;

  /**
   * Whether to show the search input.
   * Defaults to true.
   */
  canSearch?: boolean;

  /**
   * Whether the search can happen synchronously. Used when the `options`
   * for the ModalPickerSingle / ModalPickerMultiple is an array, in that
   * case the query will be filtered locally so no debounce is needed.
   */
  canSearchSync: boolean;

  /**
   * Callback for when the modal should close.
   */
  closeModal: () => void;

  /**
   * Callback for when the modal is saved
   */
  modalSaved: (value?: Value) => void;

  /**
   * Optionally an add button to display in the Modal. Can
   * be used to dynamically add an option which was not there
   * before.
   */
  addButton?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  renderOptionsConfig: RenderOptionsConfig<T>;

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
   * The selected option(s)
   */
  value?: Value;

  /**
   * Optional callback to display current selection
   * @param setSelected
   * @param selected
   */
  renderSelection?: (
    setSelected: (value?: Value) => void,
    selected?: Value
  ) => ReactNode;
};

type PropsSingle<T> = BaseProps<T, T> & {
  multiple?: false;
};

type PropsMultiple<T> = BaseProps<T, T[]> & {
  multiple: true;
};

type Props<T> = PropsSingle<T> | PropsMultiple<T>;

export type RenderOptionsConfig<T> = Omit<
  FieldCompatibleWithPredeterminedOptions<T>,
  'options' | 'reloadOptions' | 'labelForOption'
> & {
  /**
   * Optional callback to customize display of options.
   */
  renderOptions?: ModalPickerRenderOptions<T>;
};

/**
 * The ModalPicker component is an abstraction used by the ModalPickerMultiple
 * and ModalPickerSingle to render a modal. It contains the code which
 * could be shared by the two components.
 *
 * It supports working with a `Page` from `@42.nl/spring-connect`.
 */
export function ModalPicker<T>(props: Props<T>) {
  const {
    placeholder,
    children,
    canSearch = true,
    canSearchSync,
    closeModal,
    modalSaved,
    addButton,
    options,
    renderOptionsConfig,
    pageSize = 10,
    value,
    isOptionEqual,
    labelForOption,
    reloadOptions,
    text = {},
    multiple,
    renderSelection
  } = props;

  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState<string>('');
  const [selected, setSelected] = useState<(typeof props)['value']>(value);

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

  const shouldRenderPagination = !(page.first && page.last);

  return (
    <Modal isOpen={true} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>{placeholder}</ModalHeader>
      <ModalBody>
        {renderSelection
          ? // @ts-expect-error Type of selected is always the same as Value
            renderSelection(setSelected, selected)
          : null}
        {canSearch ? (
          <SearchInput
            defaultValue={query}
            placeholder={t({
              overrideText: text.placeholder,
              key: 'ModalPicker.SEARCH',
              fallback: 'Search...'
            })}
            label={t({
              overrideText: text.searchLabel,
              key: 'ModalPicker.SEARCH_LABEL',
              fallback: 'Start typing to search'
            })}
            hiddenLabel={true}
            debounce={canSearchSync ? 0 : 500}
            onChange={setQuery}
            className="mb-3"
          />
        ) : null}
        {renderChildren()}
      </ModalBody>

      {shouldRenderPagination ? (
        <ModalFooter className="d-flex justify-content-center">
          <Pagination
            page={page}
            onChange={(page) => setPageNumber(page)}
            showTotalElements={false}
          />
        </ModalFooter>
      ) : null}

      <ModalFooter className="d-flex flex-row justify-content-between">
        {addButton ? (
          <Button color="primary" onClick={() => addButton.onClick()}>
            {addButton.label}
          </Button>
        ) : (
          <div />
        )}

        <div>
          <Button
            className="ms-1"
            color="secondary"
            onClick={() => closeModal()}
          >
            {t({
              overrideText: text.cancel,
              key: 'ModalPicker.CANCEL',
              fallback: 'Cancel'
            })}
          </Button>
          <Button
            className="ms-1"
            color="primary"
            // @ts-expect-error Type of selected is always equal to what modalSaved expects
            onClick={() => modalSaved(selected)}
          >
            {t({
              overrideText: text.select,
              key: 'ModalPicker.SELECT',
              fallback: 'Select'
            })}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );

  function renderChildren() {
    if (loading) {
      return <ContentState mode="loading" title="" />;
    }

    if (page.totalElements === 0) {
      return <EmptyModal userHasSearched={query !== ''} />;
    }

    if (renderOptionsConfig.renderOptions) {
      return renderOptionsConfig.renderOptions(
        mapOptions(renderOptionsConfig, setSelected)
      );
    }

    return <>{children(mapOptions(renderOptionsConfig, setSelected))}</>;
  }

  function mapOptions(
    renderOptionsConfig: RenderOptionsConfig<T>,
    setSelected: (value: T | T[]) => void
  ): ModalPickerRenderOptionsOption<T>[] {
    const { isOptionEqual, keyForOption, isOptionEnabled } =
      renderOptionsConfig;

    return page.content.map((option) => {
      const isOptionSelectedConfig = {
        option,
        labelForOption,
        isOptionEqual,
        keyForOption,
        value: selected
      };

      const isSelected = isOptionSelected(isOptionSelectedConfig);

      const enabled = isOptionEnabled ? isOptionEnabled(option) : true;

      function toggle() {
        if (multiple) {
          const selectedWithoutOption = Array.isArray(selected)
            ? selected.filter((value) =>
                isOptionEqual
                  ? !isOptionEqual(value, option)
                  : !compareOptions<T>(value, option, isOptionSelectedConfig)
              )
            : [];
          const newSelected = isSelected
            ? selectedWithoutOption
            : [...selectedWithoutOption, option];
          setSelected(newSelected);
        } else {
          // @ts-expect-error Value is of type T
          setSelected(isSelected ? undefined : option);
        }
      }

      return {
        option,
        key: getKeyForOption({ option, keyForOption, labelForOption }),
        label: labelForOption(option),
        isSelected,
        enabled,
        toggle: enabled ? () => toggle() : () => undefined
      };
    });
  }
}
