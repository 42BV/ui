import React from 'react';
import { Page } from '@42.nl/spring-connect';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col
} from 'reactstrap';

import Pagination from '../../core/Pagination/Pagination';
import { t } from '../../utilities/translation/translation';
import SearchInput from '../../core/SearchInput/SearchInput';

interface Text {
  placeholder?: string;
  cancel?: string;
  select?: string;
}

interface Props {
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
  page: Page<any>;

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
   * Callback to fetch the options to display to the user.
   */
  fetchOptions: (query: string) => void;

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
   * Whether or not the save button is enabled
   */
  saveButtonEnabled: boolean;

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
}

/**
 * The ModalPicker component is an abstraction used by the ModalPickerMultiple
 * and ModalPickerSingle to render a modal. It contains the code which
 * could be shared by the two components.
 */
export default function ModalPicker(props: Props) {
  const {
    placeholder,
    isOpen,
    page,
    children,
    query,
    canSearch,
    fetchOptions,
    pageChanged,
    closeModal,
    modalSaved,
    saveButtonEnabled,
    addButton,
    text = {}
  } = props;

  const shouldRenderPagination = !(page.first && page.last);

  return (
    <Modal isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>{placeholder}</ModalHeader>
      <ModalBody>
        {canSearch ? (
          <Row>
            <Col>
              <SearchInput
                value={query}
                placeholder={t({
                  overrideText: text.placeholder,
                  key: 'ModalPicker.SEARCH',
                  fallback: 'Search...'
                })}
                onChange={value => fetchOptions(value)}
              />
            </Col>
          </Row>
        ) : null}
        {children}
      </ModalBody>

      {shouldRenderPagination ? (
        <ModalFooter className="d-flex justify-content-center">
          <Pagination page={page} onChange={page => pageChanged(page)} />
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
            className="ml-1"
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
            className="ml-1"
            color="primary"
            onClick={() => modalSaved()}
            disabled={!saveButtonEnabled}
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
}
