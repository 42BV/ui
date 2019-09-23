import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { debounce } from 'lodash';
import { emptyPage, Page } from '@42.nl/spring-connect';
import { Button, Row, Col } from 'reactstrap';

import ModalPicker from '../ModalPicker';
import EmptyModal from '../EmptyModal';

import { AddButtonCallback, AddButtonOptions } from '../types';
import withJarb from '../../withJarb/withJarb';
import { Color, OptionForValue, FetchOptionsCallback } from '../../types';

interface Props<T> {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The label of the form element.
   */
  label: string;

  /**
   * The placeholder of the form element.
   */
  placeholder: string;

  /**
   * Optionally whether or not the user can search.
   * Defaults to `true`.
   */
  canSearch?: boolean;

  /**
   * Callback to fetch the options to display to the user.
   */
  fetchOptions: FetchOptionsCallback<T>;

  /**
   * Optionally an add button to display in the Modal. Can
   * be used to dynamically add an option which was not there
   * before.
   */
  addButton?: AddButtonOptions<T>;

  /**
   * Callback to convert an value of type T to an option to show
   * to the user.
   */
  optionForValue: OptionForValue<T>;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: T | null) => void;

  /**
   * Optional callback for when the form element is blurred.
   */
  onBlur?: () => void;

  /**
   * Optionally the error message to render.
   */
  error?: React.ReactNode;

  /**
   * Optionally the color of the FormGroup.
   */
  color?: Color;

  /**
   * The value that the form element currently has.
   */
  value?: T;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
}

export interface State<T> {
  isOpen: boolean;
  page: Page<T>;
  selected?: T;
  query: string;
  userHasSearched: boolean;
}

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
export default class ModalPickerSingle<T> extends React.Component<
  Props<T>,
  State<T>
> {
  state = {
    isOpen: false,
    page: emptyPage<T>(),
    selected: undefined,
    query: '',
    userHasSearched: false
  };

  constructor(props: Props<T>) {
    super(props);
    this.debouncedSearch = debounce(this.debouncedSearch, 500);
  }

  componentDidMount() {
    this.loadPage(1);
  }

  modalSaved() {
    this.setState({ isOpen: false });

    const selected = this.state.selected;

    /*
      The button can only be clicked when something is selected,
      but flow doesn't understand this
    */
    /* istanbul ignore next */
    if (selected) {
      this.props.onChange(selected);
    }
  }

  closeModal() {
    this.setState({ isOpen: false });
  }

  openModal() {
    const selected = this.props.value;
    this.setState({ selected, isOpen: true, query: '' }, () => {
      this.loadPage(1);
    });
  }

  itemClicked(selected: T) {
    this.setState({ selected });
  }

  fetchOptions(query: string) {
    this.debouncedSearch(query);
  }

  async loadPage(pageNumber: number) {
    const query = this.state.query;

    this.setState({ userHasSearched: query !== '' });

    const page: Page<T> = await this.props.fetchOptions(query, pageNumber, 10);

    this.setState({ page });
  }

  debouncedSearch(query: string) {
    this.setState({ query }, () => {
      this.loadPage(1);
    });
  }

  async addButtonClicked(callback: AddButtonCallback<T>) {
    this.setState({ isOpen: false });

    try {
      const item = await callback();

      const { page } = this.state;
      this.itemClicked(item);
      page.content.unshift(item);

      this.setState({ isOpen: true, page });
    } catch (error) {
      this.setState({ isOpen: true });
    }
  }

  render() {
    const selected = this.props.value;
    const {
      id,
      label,
      placeholder,
      error,
      color,
      optionForValue,
      className = ''
    } = this.props;

    return (
      <FormGroup className={className} color={color}>
        <Label for={id}>{label}</Label>

        <p>
          {selected ? (
            <span className="mr-1">{optionForValue(selected)}</span>
          ) : null}
          <Button color="primary" onClick={() => this.openModal()}>
            {placeholder}
          </Button>
        </p>

        {error}

        {this.renderModal()}
      </FormGroup>
    );
  }

  renderModal() {
    const { placeholder, addButton, canSearch = true } = this.props;
    const { page, selected, isOpen } = this.state;

    const addButtonOptions = addButton
      ? {
          label: addButton.label,
          onClick: () => {
            this.addButtonClicked(addButton.onClick);
          }
        }
      : undefined;

    return (
      <ModalPicker
        placeholder={placeholder}
        isOpen={isOpen}
        page={page}
        canSearch={canSearch}
        fetchOptions={(query: string) => this.fetchOptions(query)}
        pageChanged={(page: number) => {
          this.loadPage(page);
        }}
        closeModal={() => this.closeModal()}
        modalSaved={() => this.modalSaved()}
        saveButtonEnabled={!!selected}
        addButton={addButtonOptions}
      >
        <Row className="mt-3">
          <Col>{this.renderModalContent()}</Col>
        </Row>
      </ModalPicker>
    );
  }

  renderModalContent(): React.ReactNode {
    const { page, selected } = this.state;
    if (page.totalElements === 0) {
      return <EmptyModal userHasSearched={this.state.userHasSearched} />;
    }

    const { optionForValue } = this.props;

    return page.content.map((value: T) => {
      const label = optionForValue(value);

      const isChecked =
        // @ts-ignore
        selected !== undefined && optionForValue(selected) === label;

      return (
        <FormGroup key={optionForValue(value)} check>
          <Label check>
            <Input
              type="radio"
              name={label}
              checked={isChecked}
              onChange={() => this.itemClicked(value)}
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
