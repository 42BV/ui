import React from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { emptyPage, Page } from '@42.nl/spring-connect';

import withJarb from '../../withJarb/withJarb';
import { doBlur } from '../../utils';
import Tag from '../../../core/Tag/Tag';
import { Color } from '../../types';
import ModalPicker from '../ModalPicker';
import EmptyModal from '../EmptyModal';
import { AddButtonCallback, AddButtonOptions, ButtonAlignment } from '../types';
import {
  FetchOptionsCallback,
  isOptionSelected,
  OptionEqual,
  OptionForValue,
  RenderOptions,
  RenderOptionsOption
} from '../../option';
import {
  DisplayValues,
  ModalPickerOpener
} from '../ModalPickerOpener/ModalPickerOpener';

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
   * Callback to convert an value of type T to an option to show
   * to the user.
   */
  optionForValue: OptionForValue<T>;

  /**
   * Optional callback which is used to determine if two options
   * of type T are equal.
   *
   * When `isOptionEqual` is not defined the outcome of `optionForValue`
   * is used to test equality.
   */
  isOptionEqual?: OptionEqual<T>;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value?: T[]) => void;

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

  /**
   * Optionally the position the button should be aligned to
   * within it's container.
   */
  alignButton?: ButtonAlignment;

  /**
   * Optionally callback to display the selected items.
   */
  displayValues?: DisplayValues<T>;
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

interface WithoutLabelButRenderOptions<T> extends WithLabel<T> {
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
  | WithoutLabelButRenderOptions<T>
  | WithLabelAndRenderOptions<T>;

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
    // Always copy the `value` so the `selected` is a fresh array.
    // Otherwise the selection will be the same as the value, which
    // causes values to be committed and the cancel button will not
    // do anything.
    const selected = Array.isArray(this.props.value)
      ? [...this.props.value]
      : [];

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

      this.itemClicked(item, true);
      page.content.unshift(item);

      this.setState({ isOpen: true, page });
    } catch (error) {
      this.setState({ isOpen: true });
    }
  }

  render() {
    const value = this.props.value;
    const {
      placeholder,
      error,
      color,
      className = '',
      optionForValue,
      alignButton,
      displayValues,
      ...props
    } = this.props;

    const modalPickerOpenerProps = {
      openModal: () => this.openModal(),
      label: placeholder,
      alignButton,
      displayValues,
      onClear: () => this.props.onChange(undefined),
      values:
        value && value.length > 0 ? (
          displayValues ? (
            value
          ) : (
            <>{value.map(optionForValue).join(', ')}</>
          )
        ) : (
          undefined
        )
    };

    return (
      <FormGroup className={className} color={color}>
        {'label' in props && props.label ? (
          <Label for={props.id}>{props.label}</Label>
        ) : null}

        <ModalPickerOpener {...modalPickerOpenerProps} />

        {error}
        {this.renderModal()}
      </FormGroup>
    );
  }

  renderModal() {
    const { placeholder, addButton, canSearch = true } = this.props;
    const { page, isOpen, selected, query } = this.state;

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

    const { optionForValue, isOptionEqual, ...props } = this.props;

    if ('renderOptions' in props && props.renderOptions) {
      return props.renderOptions(
        this.mapOptions({ page, selected, optionForValue, isOptionEqual })
      );
    }

    return page.content.map(option => {
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
              type="checkbox"
              name={label}
              checked={isChecked}
              onChange={() => this.itemClicked(option, isChecked)}
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
    selected: T[];
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
        toggle: () => this.itemClicked(option, isSelected)
      };
    });
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

  renderTags(onClick: (value: T) => void, values: T[]): JSX.Element[] | null {
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
  any[] | null | undefined,
  Props<any>
>(ModalPickerMultiple);
