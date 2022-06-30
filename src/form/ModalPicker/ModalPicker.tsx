import React from 'react';
import { Page } from '@42.nl/spring-connect';
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from 'reactstrap';

import Pagination from '../../core/Pagination/Pagination';
import { t } from '../../utilities/translation/translation';
import SearchInput from '../../core/SearchInput/SearchInput';
import { useBodyFixOnModalClose } from '../../hooks/useBodyFixOnModalClose/useBodyFixOnModalClose';
import ContentState from '../../core/ContentState/ContentState';
import EmptyModal from './EmptyModal';
import {
  ModalPickerRenderOptions,
  ModalPickerRenderOptionsOption
} from './types';
import {
  FieldCompatibleWithPredeterminedOptions,
  isOptionSelected,
  IsOptionEnabled
} from '../option';

export type Text = {
  placeholder?: string;
  cancel?: string;
  select?: string;
};

type Props<T> = {
  /**
   * The placeholder of the form element.
   */
  placeholder: string;

  /**
   * Whether or not the modal is open.
   */
  isOpen: boolean;

  /**
   * The current page of options. Used to determine if the
   * pagination should be rendered.
   */
  page: Page<T>;

  /**
   * Here the component using the ModalPicker must render in the options.
   */
  children: React.ReactNode;

  /**
   * The value to show in the search input.
   */
  query: string;

  /**
   * Whether or not to show the search input.
   */
  canSearch: boolean;

  /**
   * Whether or not the search can happen synchronously. Used
   * when the `options` for the ModalPickerSingle / ModalPickerMultiple
   * is an array, in that case the query will be filtered locally
   * so no debounce is needed.
   */
  canSearchSync: boolean;

  /**
   * Callback for when the query changes.
   */
  queryChanged: (query: string) => void;

  /**
   * Callback for when the page changes.
   */
  pageChanged: (page: number) => void;

  /**
   * Callback for when the modal should close.
   */
  closeModal: () => void;

  /**
   * Callback for when the modal is saved
   */
  modalSaved: () => void;

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
   * Whether or not the ModelPicker is loading
   */
  loading: boolean;

  /**
   * Whether or not the user has searched.
   */
  userHasSearched: boolean;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  renderOptionsConfig?: RenderOptionsConfig<T>;

  /**
   * The selected option
   */
  selected: T | T[];
};

export type RenderOptionsConfig<T> = Omit<
  FieldCompatibleWithPredeterminedOptions<T>,
  'options' | 'reloadOptions' | 'isOptionEnabled'
> & {
  // It is always provided by the ModalPickerSingle and ModalPickerMultiple
  isOptionEnabled: IsOptionEnabled<T>;

  /**
   * Callback to customize display of options.
   */
  renderOptions: ModalPickerRenderOptions<T>;

  onChange: (option: T, isSelected: boolean) => void;
};

/**
 * The ModalPicker component is an abstraction used by the ModalPickerMultiple
 * and ModalPickerSingle to render a modal. It contains the code which
 * could be shared by the two components.
 *
 * It supports working with a `Page` from `@42.nl/spring-connect`.
 */
export default function ModalPicker<T>(props: Props<T>) {
  const {
    placeholder,
    isOpen,
    page,
    children,
    query,
    canSearch,
    canSearchSync,
    queryChanged,
    pageChanged,
    closeModal,
    modalSaved,
    addButton,
    loading,
    userHasSearched,
    renderOptionsConfig,
    selected,
    text = {}
  } = props;

  useBodyFixOnModalClose(isOpen);

  const shouldRenderPagination = !(page.first && page.last);

  return (
    <Modal isOpen={isOpen} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>{placeholder}</ModalHeader>
      <ModalBody>
        {canSearch ? (
          <Row>
            <Col>
              <SearchInput
                defaultValue={query}
                placeholder={t({
                  overrideText: text.placeholder,
                  key: 'ModalPicker.SEARCH',
                  fallback: 'Search...'
                })}
                debounce={canSearchSync ? 0 : 500}
                onChange={queryChanged}
              />
            </Col>
          </Row>
        ) : null}
        <Row className="mt-3">
          <Col>{renderChildren()}</Col>
        </Row>
      </ModalBody>

      {shouldRenderPagination ? (
        <ModalFooter className="d-flex justify-content-center">
          <Pagination page={page} onChange={(page) => pageChanged(page)} />
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
            onClick={() => modalSaved()}
            disabled={!!!selected}
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
      return <EmptyModal userHasSearched={userHasSearched} />;
    }

    if (renderOptionsConfig) {
      return renderOptionsConfig.renderOptions(mapOptions(renderOptionsConfig));
    }

    return <>{children}</>;
  }

  function mapOptions(
    renderOptionsConfig: RenderOptionsConfig<T>
  ): ModalPickerRenderOptionsOption<T>[] {
    const {
      onChange,
      labelForOption,
      isOptionEqual,
      keyForOption,
      isOptionEnabled
    } = renderOptionsConfig;

    return page.content.map((option) => {
      const isSelected = isOptionSelected({
        option,
        labelForOption,
        isOptionEqual,
        keyForOption,
        value: selected
      });

      const enabled = isOptionEnabled(option);

      return {
        option,
        isSelected,
        enabled,
        toggle: enabled ? () => onChange(option, isSelected) : () => undefined
      };
    });
  }
}
