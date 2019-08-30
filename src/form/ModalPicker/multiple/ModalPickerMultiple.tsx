import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { debounce, isArray } from 'lodash';
import { emptyPage, Page } from '@42.nl/spring-connect';
import { Button, Row, Col } from 'reactstrap';

import withJarb from '../../withJarb/withJarb';
import { doBlur } from '../../utils';
import MoreOrLess from '../../../core/MoreOrLess/MoreOrLess';
import Tag from '../../../core/Tag/Tag';
import { Color } from '../../types';
import ModalPicker from '../ModalPicker';
import EmptyModal from '../EmptyModal';
import {
  FetchOptionsCallback,
  AddButtonCallback,
  AddButtonOptions
} from '../types';

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
  optionForValue: (value: T) => string;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: T[] | null) => void;

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
  value?: T[];

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
}

export interface State<T> {
  isOpen: boolean;
  page: Page<T>;
  selected: T[];
  query: string;
  userHasSearched: boolean;
}

/**
 * The ModalPickerMultiple is a form element which allows the user
 * to select multiple options from a modal.
 *
 * The use case is that when there are too many options to render
 * in a simple Select you can use the ModalPickerMultiple.
 *
 * Use the ModalPickerMultiple when the user does not precisely know
 * which options he / she is going to select. Otherwise use the
 * TypeaheadMultiple which is useful when the user is an expert and
 * can type in the selections quicker than he can select it from
 * the modal.
 */
export default class ModalPickerMultiple<T> extends React.Component<
  Props<T>,
  State<T>
> {
  state = {
    isOpen: false,
    page: emptyPage<T>(),
    selected: [],
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
    const selected = this.state.selected;
    this.setState({ isOpen: false });
    this.props.onChange([...selected]);

    doBlur(this.props.onBlur);
  }

  closeModal() {
    this.setState({ isOpen: false });
  }

  openModal() {
    const selected = isArray(this.props.value) ? this.props.value : [];

    this.setState({ selected, isOpen: true, query: '' }, () => {
      this.loadPage(1);
    });
  }

  itemClicked(item: T, isChecked: boolean) {
    let selected = this.state.selected as T[];

    if (isChecked) {
      selected = selected.filter(v => v !== item);
    } else {
      selected.push(item);
    }

    this.setState({ selected });
  }

  tagClicked(tag: T) {
    const value = this.props.value as T[];
    const selected = value.filter(v => v !== tag);

    this.props.onChange(selected);
    doBlur(this.props.onBlur);
  }

  fetchOptions(query: string) {
    this.debouncedSearch(query);
  }

  async loadPage(pageNumber: number) {
    const query = this.state.query;

    this.setState({ userHasSearched: query !== '' });
    const page: Page<T> = await this.props.fetchOptions(query, pageNumber);

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

      this.itemClicked(item, true);
      page.content.unshift(item);

      this.setState({ isOpen: true, page });
    } catch (error) {
      this.setState({ isOpen: true });
    }
  }

  render() {
    const selected = this.props.value;
    const { id, label, placeholder, error, color, className = '' } = this.props;

    return (
      <FormGroup className={className} color={color}>
        <Label for={id}>{label}</Label>
        <div className="mb-2">
          <div className="mb-2">{this.renderTagsInMoreOrLess(selected)}</div>
          <Button color="primary" onClick={() => this.openModal()}>
            {placeholder}
          </Button>
        </div>
        {error}
        {this.renderModal()}
      </FormGroup>
    );
  }

  renderModal() {
    const { placeholder, addButton, canSearch = true } = this.props;
    const { page, isOpen, selected } = this.state;

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
        {this.renderModalCurrentSelection()}
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

    return page.content.map(value => {
      const label = optionForValue(value);

      const isChecked = selected.some(
        selected => optionForValue(selected) === label
      );

      return (
        <FormGroup key={label} check>
          <Label check>
            <Input
              type="checkbox"
              name={label}
              checked={isChecked}
              onChange={() => this.itemClicked(value, isChecked)}
            />
            {label}
          </Label>
        </FormGroup>
      );
    });
  }

  renderTagsInMoreOrLess(values?: T[]) {
    const content = this.renderTags(v => this.tagClicked(v), values);

    if (!content) {
      return null;
    }

    return <MoreOrLess limit={3} content={content} />;
  }

  renderModalCurrentSelection() {
    const { selected } = this.state;

    if (!selected || selected.length === 0) {
      return null;
    }

    return (
      <Row
        className="mt-3 p-2"
        style={{
          backgroundColor: '#edecf1'
        }}
      >
        <Col>{this.renderTags(v => this.itemClicked(v, true), selected)}</Col>
      </Row>
    );
  }

  renderTags(onClick: (value: T) => void, values?: T[]): JSX.Element[] | null {
    if (!values) {
      return null;
    }

    const { optionForValue } = this.props;

    return values.map(value => {
      const label = optionForValue(value);
      return <Tag key={label} onRemove={() => onClick(value)} text={label} />;
    });
  }
}

/**
 * Variant of the ModalPickerMultiple which can be used in a Jarb context.
 */
export const JarbModalPickerMultiple = withJarb<
  any[],
  any[] | null,
  Props<any>
>(ModalPickerMultiple);
