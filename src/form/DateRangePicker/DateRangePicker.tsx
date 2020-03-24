import React, { Component } from 'react';
import { Col, FormFeedback, Row } from 'reactstrap';
import { get } from 'lodash';
import { Color, DistributiveOmit } from '../types';

import DateTimeInput, {
  Props as DateTimeInputProps
} from '../DateTimeInput/DateTimeInput';

import withJarb from '../withJarb/withJarb';
import { t } from '../../utilities/translation/translation';

interface Text {
  rangeError?: string;
}

/**
 * Represents the value of the DateRangePicker form element.
 */
export interface Value {
  from?: Date;
  to?: Date;
}

/**
 * The value of the `onChange` event of the DateRangePicker.
 */
export interface ChangeValue {
  from: Date;
  to: Date;
}

interface Props {
  /**
   * The value that the form element currently has.
   */
  value?: Value;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: ChangeValue | null) => void;

  /**
   * Callback for when the form element gets the focus.
   */
  onFocus?: () => void;

  /**
   * The properties for the `from` DateTimeInput element.
   */
  from: DistributiveOmit<
    DateTimeInputProps,
    'onFocus' | 'onBlur' | 'onChange' | 'value'
  >;

  /**
   * The properties for the `to` DateTimeInput element.
   */
  to: DistributiveOmit<
    DateTimeInputProps,
    'onFocus' | 'onBlur' | 'onChange' | 'value'
  >;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally the color of the FormGroup.
   */
  color?: Color;

  /**
   * Whether or not the form element is currently valid.
   */
  valid?: boolean;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  /**
   * Optionally the error message to render.
   */
  error?: React.ReactNode;

  /**
   * Whether or not the date picker should be displayed in a modal.
   * Defaults to opening in a tooltip-like layout.
   */
  mode?: 'modal' | 'default';
}

interface State {
  fromDate?: Date;
  toDate?: Date;
}

/**
 * The DateRangePicker component is a form element which allows the
 * user to select two dates which represent a range.
 *
 * The DateRangePicker is basically two `DateTimeInput` component's
 * side by side with a check that the `from` date is not after the `to`
 * date.
 */
export default class DateRangePicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fromDate: get(this, 'props.value.from', undefined),
      toDate: get(this, 'props.value.to', undefined)
    };
  }

  fromDateChanged(fromDate: Date | null) {
    this.setState({ fromDate: fromDate ? fromDate : undefined }, () =>
      this.afterChange()
    );
  }

  toDateChanged(toDate: Date | null) {
    this.setState({ toDate: toDate ? toDate : undefined }, () =>
      this.afterChange()
    );
  }

  onFocus() {
    const focus = this.props.onFocus;

    if (focus) {
      focus();
    }
  }

  afterChange() {
    const { fromDate, toDate } = this.state;

    if (fromDate && toDate) {
      if (fromDate < toDate) {
        this.props.onChange({ from: fromDate, to: toDate });
      } else {
        this.props.onChange(null);
      }
    } else {
      this.props.onChange(null);
    }
  }

  render() {
    const { className = '', valid, color, mode } = this.props;

    return (
      <Row className={`date-range-picker ${className}`}>
        <Col sm="12" md="6">
          <DateTimeInput
            {...this.props.from}
            value={this.state.fromDate}
            onChange={date => this.fromDateChanged(date)}
            onFocus={() => this.onFocus()}
            valid={valid}
            color={color}
            mode={mode}
          />
        </Col>
        <Col sm="12" md="6">
          <DateTimeInput
            {...this.props.to}
            value={this.state.toDate}
            onChange={date => this.toDateChanged(date)}
            onFocus={() => this.onFocus()}
            valid={valid}
            color={color}
            mode={mode}
          />
        </Col>
        <Col xs="12" className="mb-2">
          {this.renderError()}
        </Col>
      </Row>
    );
  }

  renderError() {
    const { error } = this.props;
    const { fromDate, toDate } = this.state;

    if (fromDate && toDate) {
      const isBefore = fromDate < toDate;
      if (!isBefore) {
        const { from, to, text = {} } = this.props;

        return (
          <>
            <FormFeedback>
              {t({
                key: 'DateRangePicker.DATE_RANGE_ERROR',
                fallback: `The "${from.label}" must be before the "${to.label}"`,
                data: { from: from.label, to: to.label },
                overrideText: text.rangeError
              })}
            </FormFeedback>
            {error}
          </>
        );
      }
    }

    return <>{error}</>;
  }
}

/**
 * Variant of the DateRangePicker which can be used in a Jarb context.
 */
export const JarbDateRangePicker = withJarb<Value, ChangeValue | null, Props>(
  DateRangePicker
);
