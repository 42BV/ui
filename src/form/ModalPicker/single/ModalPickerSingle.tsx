import React from 'react';
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { emptyPage, Page } from '@42.nl/spring-connect';

import ModalPicker from '../ModalPicker';
import EmptyModal from '../EmptyModal';

import { AddButtonCallback, AddButtonOptions } from '../types';
import withJarb from '../../withJarb/withJarb';
import { Color } from '../../types';
import {
  FetchOptionsCallback,
  isOptionSelected,
  OptionEqual,
  OptionForValue,
  RenderOptions,
  RenderOptionsOption
} from '../../option';

interface BaseProps<T> {
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
   * Optional callback which is used to determine if two options
   * of type T are equal.
   *
   * When `isOptionEqual` is not defined the outcome of `optionForValue`
   * is used to test equality.
   */
  isOptionEqual?: OptionEqual<T>;

  /**
   * Callback to convert an value of type T to an option to show
   * to the user.
   */
  optionForValue: OptionForValue<T>;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: T) => void;

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

interface WithoutLabel<T> extends BaseProps<T> {
  id?: string;
  label?: never;
}

interface WithLabel<T> extends BaseProps<T> {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The label of the form element.
   */
  label: React.ReactNode;
}

interface WithoutLabelButWithRenderOptions<T> extends WithLabel<T> {
  /**
   * Callback to customize display of options.
   */
  renderOptions: RenderOptions<T>;
}

interface WithLabelAndRenderOptions<T> extends WithLabel<T> {
  /**
   * Callback to customize display of options.
   */
  renderOptions: RenderOptions<T>;
}

export type Props<T> =
  | WithoutLabel<T>
  | WithLabel<T>
  | WithoutLabelButWithRenderOptions<T>
  | WithLabelAndRenderOptions<T>;

export interface State<T> {
  isOpen: boolean;
  page: Page<T>;
  selected?: T | null;
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
    this.setState({ query }, () => {
      this.loadPage(1);
    });
  }

  async loadPage(pageNumber: number) {
    const query = this.state.query;

    this.setState({ userHasSearched: query !== '' });

    const page: Page<T> = await this.props.fetchOptions(query, pageNumber, 10);

    this.setState({ page });
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
      placeholder,
      error,
      color,
      optionForValue,
      className = '',
      ...props
    } = this.props;

    return (
      <FormGroup className={className} color={color}>
        {'label' in props && props.label ? (
          <Label for={props.id}>{props.label}</Label>
        ) : null}

        <div>
          {selected ? (
            <span className="mr-1">{optionForValue(selected)}</span>
          ) : null}
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
    const { page, selected, isOpen, query } = this.state;

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
        query={query}
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

    const { optionForValue, isOptionEqual, ...props } = this.props;

    if ('renderOptions' in props && props.renderOptions) {
      return props.renderOptions(
        this.mapOptions({ page, selected, optionForValue, isOptionEqual })
      );
    }

    return page.content.map((option: T) => {
      const label = optionForValue(option);

      const isChecked = isOptionSelected({
        option,
        optionForValue,
        isOptionEqual,
        value: selected
      });

      return (
        <FormGroup key={label} check>
          <Label check>
            <Input
              type="radio"
              name={label}
              checked={isChecked}
              onChange={() => this.itemClicked(option)}
            />
            {label}
          </Label>
        </FormGroup>
      );
    });
  }

  mapOptions({
    page,
    selected,
    optionForValue,
    isOptionEqual
  }: {
    page: Page<T>;
    selected?: T[];
    optionForValue: OptionForValue<T>;
    isOptionEqual?: OptionEqual<T>;
  }): RenderOptionsOption<T>[] {
    return page.content.map(option => {
      const isSelected = isOptionSelected({
        option,
        optionForValue,
        isOptionEqual,
        value: selected
      });

      return {
        option,
        isSelected,
        toggle: () => this.itemClicked(option)
      };
    });
  }
}

/**
 * Variant of the ModalPickerSingle which can be used in a Jarb context.
 */
export const JarbModalPickerSingle = withJarb<any, any | null, Props<any>>(
  ModalPickerSingle
);
