import React from 'react';
import { Page } from '@42.nl/spring-connect';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon
} from 'reactstrap';

import Pagination from '../../core/Pagination/Pagination';
import Icon from '../../core/Icon/Icon';
import { getTranslator } from '../translator';

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
    canSearch,
    fetchOptions,
    pageChanged,
    closeModal,
    modalSaved,
    saveButtonEnabled,
    addButton
  } = props;

  const shouldRenderPagination = !(page.first && page.last);

  const translator = getTranslator();

  return (
    <Modal isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>{placeholder}</ModalHeader>
      <ModalBody>
        {canSearch ? (
          <Row>
            <Col>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <Icon icon="search" />
                </InputGroupAddon>
                <Input
                  id="search"
                  placeholder={translator({
                    key: 'ModalPicker.SEARCH',
                    fallback: 'Search...'
                  })}
                  onChange={event => fetchOptions(event.target.value)}
                />
              </InputGroup>
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
            {translator({
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
            {translator({
              key: 'ModalPicker.SELECT',
              fallback: 'Select'
            })}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}