import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { Fragment, useState } from 'react';
import { Form as ReactFinalForm } from 'react-final-form';
import { Col, Row } from 'reactstrap';
import { Icon, SubmitButton, Tooltip, Card } from '../..';
import { FinalForm } from '../story-utils';
import { isDateAfter, isDateBefore, isDateBetween } from './checkers';
import DateTimeInput, { JarbDateTimeInput } from './DateTimeInput';
import {
  isDateAfterValidator,
  isDateBeforeValidator,
  isDateBetweenValidator
} from './validators';

storiesOf('Form/DateTimeInput', module)
  .add('date and time', () => {
    const [value, setValue] = useState<Date | undefined>(undefined);

    return (
      <Card className="m2">
        <DateTimeInput
          id="dateOfBirth"
          label="Date of birth"
          placeholder="Please enter your date and time of birth"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          isDateAllowed={(date) => {
            return date.isBefore(new Date());
          }}
          value={value}
          onChange={setValue}
        />

        <div>
          Date and time of birth is:
          <pre>{value?.toISOString()}</pre>
        </div>
      </Card>
    );
  })
  .add('date', () => {
    const [value, setValue] = useState<Date | undefined>(undefined);

    return (
      <Card className="m2">
        <DateTimeInput
          id="dateOfBirth"
          label="Date of birth"
          placeholder="Please enter your date of birth"
          dateFormat="YYYY-MM-DD"
          timeFormat={false}
          isDateAllowed={(date) => {
            return date.isBefore(new Date());
          }}
          value={value}
          onChange={setValue}
        />

        <div>
          Date of birth is:
          {value?.toISOString()}
        </div>
      </Card>
    );
  })
  .add('time', () => {
    const [value, setValue] = useState<Date | undefined>(undefined);

    return (
      <Card className="m2">
        <DateTimeInput
          id="startTime"
          label="Start time"
          placeholder="Please enter your start time"
          dateFormat={false}
          timeFormat="HH:mm:ss"
          isDateAllowed={(date) => {
            return date.isBefore(new Date());
          }}
          value={value}
          onChange={setValue}
        />

        <div>
          Start time is:
          <pre>{value?.toISOString()}</pre>
        </div>

        <p>Note: that a time will always come with a date</p>
      </Card>
    );
  })
  .add('with custom label', () => {
    const [value, setValue] = useState<Date | undefined>(undefined);

    return (
      <Card className="m2">
        <DateTimeInput
          id="dateOfBirth"
          label={
            <>
              <span>Date of birth</span>
              <Tooltip
                className="position-relative ms-1"
                style={{ top: 5 }}
                content="This is the date you where born on"
              >
                <Icon icon="info" />
              </Tooltip>
            </>
          }
          placeholder="Please enter your date and time of birth"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          isDateAllowed={(date) => {
            return date.isBefore(new Date());
          }}
          value={value}
          onChange={setValue}
        />

        <div>
          Date and time of birth is:
          <pre>{value?.toISOString()}</pre>
        </div>
      </Card>
    );
  })
  .add('open in modal', () => {
    const [value, setValue] = useState<Date | undefined>();

    return (
      <Card className="m2">
        <DateTimeInput
          id="dateOfBirth"
          label="Date of birth"
          placeholder="Please enter your date and time of birth"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          isDateAllowed={(date) => {
            return date.isBefore(new Date());
          }}
          value={value}
          onChange={setValue}
          mode="modal"
        />

        <div>
          Date and time of birth is:
          <pre>{value?.toISOString()}</pre>
        </div>
      </Card>
    );
  })
  .add('range', () => {
    const [start, setStart] = useState<Date | undefined>(undefined);
    const [end, setEnd] = useState<Date | undefined>(undefined);

    return (
      <Card className="m2">
        <DateTimeInput
          id="start"
          label="Start"
          placeholder="Please enter your start date and time"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          value={start}
          onChange={setStart}
          isDateAllowed={isDateBefore(end)}
        />

        <DateTimeInput
          id="end"
          label="End"
          placeholder="Please enter your end date and time"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          value={end}
          onChange={setEnd}
          isDateAllowed={isDateAfter(start)}
        />

        <div>
          Start time:
          <pre>{start?.toISOString()}</pre>
        </div>

        <div>
          End time:
          <pre>{end?.toISOString()}</pre>
        </div>

        <p>
          Note: isDateAllowed is not a validator, it only disables selectable
          dates to prevent users from selecting invalid dates. Manually typing a
          date that is out of range should be validated using validators,
          preferably using the JarbDateTimeInput.
        </p>
      </Card>
    );
  })
  .add('range inclusive', () => {
    const [start, setStart] = useState<Date | undefined>(undefined);
    const [end, setEnd] = useState<Date | undefined>(undefined);

    return (
      <Card className="m2">
        <DateTimeInput
          id="start"
          label="Start"
          placeholder="Please enter your start date and time"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          value={start}
          onChange={setStart}
          isDateAllowed={isDateBefore(end, { inclusive: true })}
        />

        <DateTimeInput
          id="end"
          label="End"
          placeholder="Please enter your end date and time"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          value={end}
          onChange={setEnd}
          isDateAllowed={isDateAfter(start, { inclusive: true })}
        />

        <div>
          Start time:
          <pre>{start?.toISOString()}</pre>
        </div>

        <div>
          End time:
          <pre>{end?.toISOString()}</pre>
        </div>

        <p>
          This example shows ranges can also be inclusive this allows the start
          and end date to be the same
        </p>
      </Card>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbDateTimeInput
          id="dateOfBirth"
          name="dateOfBirth"
          label="Date of birth"
          placeholder="Please enter your date of birth"
          dateFormat="DD-MM-YYYY"
          timeFormat={false}
          isDateAllowed={(date) => {
            return date.isBefore(new Date());
          }}
          jarb={{
            validator: 'User.birthday',
            label: 'Birthday'
          }}
        />

        <JarbDateTimeInput
          id="weddingDay"
          name="weddingDay"
          label="Wedding day"
          placeholder="Please enter your wedding day"
          dateFormat="DD-MM-YYYY"
          timeFormat={false}
          isDateAllowed={(date) => {
            return date.isAfter(new Date());
          }}
          mode="modal"
          jarb={{
            validator: 'User.weddingDay',
            label: 'Weddingday'
          }}
        />

        <JarbDateTimeInput
          id="sunset"
          name="sunset"
          label="Sunset"
          placeholder="Please enter the time the sun sets"
          dateFormat={false}
          timeFormat="HH:mm:ss"
          isDateAllowed={(date) => {
            return date.isBefore(new Date());
          }}
          jarb={{
            validator: 'User.sunset',
            label: 'Sunset'
          }}
        />

        <JarbDateTimeInput
          id="dueDate"
          name="dueDate"
          label="Due date"
          placeholder="Please enter the due date for when the ticket needs to be resolved"
          dateFormat="DD-MM-YYYY"
          timeFormat="HH:mm:ss"
          jarb={{
            validator: 'Issue.dueDate',
            label: 'Due date'
          }}
        />
      </FinalForm>
    );
  })
  .add('jarb range', () => {
    type AppointmentFormData = {
      start: Date;
      end: Date;
    };

    return (
      <ReactFinalForm<AppointmentFormData>
        onSubmit={() => action('form submitted')}
        initialValues={{ start: new Date(), end: new Date() }}
        render={({ handleSubmit, submitting, values, errors }) => (
          // Do not render a <form> here as it will submit the form when
          // the submit button is pressed.
          <Fragment>
            <Row>
              <Col lg={6}>
                <Card className="m2">
                  <JarbDateTimeInput
                    id="start"
                    name="start"
                    label="Start"
                    placeholder="Please enter your start date and time"
                    dateFormat="YYYY-MM-DD"
                    timeFormat="HH:mm:ss"
                    isDateAllowed={isDateBefore(values.end)}
                    validators={[
                      isDateBeforeValidator({
                        label: 'start',
                        end: {
                          path: 'end',
                          label: 'end'
                        }
                      })
                    ]}
                    jarb={{
                      validator: 'Issue.start',
                      label: 'Start date'
                    }}
                  />

                  <JarbDateTimeInput
                    id="end"
                    name="end"
                    label="End"
                    placeholder="Please enter your end date and time"
                    dateFormat="YYYY-MM-DD"
                    timeFormat="HH:mm:ss"
                    isDateAllowed={isDateAfter(values.start)}
                    validators={[
                      isDateAfterValidator({
                        label: 'end',
                        start: {
                          path: 'start',
                          label: 'start'
                        }
                      })
                    ]}
                    jarb={{
                      validator: 'Issue.end',
                      label: 'End date'
                    }}
                  />

                  <JarbDateTimeInput
                    id="reminder"
                    name="reminder"
                    label="Reminder"
                    placeholder="Please select a reminder date"
                    dateFormat="YYYY-MM-DD"
                    timeFormat="HH:mm:ss"
                    isDateAllowed={isDateBetween(values.start, values.end)}
                    validators={[
                      isDateBetweenValidator({
                        label: 'reminder',
                        start: {
                          path: 'start',
                          label: 'start'
                        },
                        end: {
                          path: 'end',
                          label: 'end'
                        }
                      })
                    ]}
                    jarb={{
                      validator: 'Issue.reminder',
                      label: 'Reminder date'
                    }}
                  />

                  <SubmitButton
                    onClick={() => handleSubmit()}
                    inProgress={submitting}
                    className="float-end"
                  >
                    Submit
                  </SubmitButton>
                </Card>
              </Col>
              <Col lg={6}>
                <h2>Values</h2>
                <pre>{JSON.stringify(values, null, 2)}</pre>
                <h2>Errors</h2>
                <pre>{JSON.stringify(errors, null, 2)}</pre>
              </Col>
            </Row>
          </Fragment>
        )}
      />
    );
  })
  .add('jarb range inclusive', () => {
    return (
      <ReactFinalForm
        onSubmit={() => action('form submitted')}
        render={({ handleSubmit, submitting, values, errors }) => (
          // Do not render a <form> here as it will submit the form when
          // the submit button is pressed.
          <Fragment>
            <Row>
              <Col lg={6}>
                <Card className="m2">
                  <JarbDateTimeInput
                    id="start"
                    name="start"
                    label="Start"
                    placeholder="Please enter your start date and time"
                    dateFormat="YYYY-MM-DD"
                    timeFormat="HH:mm:ss"
                    isDateAllowed={isDateBefore(values.end, {
                      inclusive: true
                    })}
                    validators={[
                      isDateBeforeValidator({
                        label: 'start',
                        end: {
                          path: 'end',
                          label: 'end',
                          inclusive: true
                        }
                      })
                    ]}
                    jarb={{
                      validator: 'Issue.start',
                      label: 'Start date'
                    }}
                  />

                  <JarbDateTimeInput
                    id="end"
                    name="end"
                    label="End"
                    placeholder="Please enter your end date and time"
                    dateFormat="YYYY-MM-DD"
                    timeFormat="HH:mm:ss"
                    isDateAllowed={isDateAfter(values.start, {
                      inclusive: true
                    })}
                    validators={[
                      isDateAfterValidator({
                        label: 'end',
                        start: {
                          path: 'start',
                          label: 'start',
                          inclusive: true
                        }
                      })
                    ]}
                    jarb={{
                      validator: 'Issue.end',
                      label: 'End date'
                    }}
                  />

                  <JarbDateTimeInput
                    id="reminder"
                    name="reminder"
                    label="Reminder"
                    placeholder="Please select a reminder date"
                    dateFormat="YYYY-MM-DD"
                    timeFormat="HH:mm:ss"
                    isDateAllowed={isDateBetween(values.start, values.end, {
                      startInclusive: true,
                      endInclusive: true
                    })}
                    validators={[
                      isDateBetweenValidator({
                        label: 'reminder',
                        start: {
                          path: 'start',
                          label: 'start',
                          inclusive: true
                        },
                        end: {
                          path: 'end',
                          label: 'end',
                          inclusive: true
                        }
                      })
                    ]}
                    jarb={{
                      validator: 'Issue.reminder',
                      label: 'Reminder date'
                    }}
                  />

                  <SubmitButton
                    onClick={() => handleSubmit()}
                    inProgress={submitting}
                    className="float-end"
                  >
                    Submit
                  </SubmitButton>
                </Card>
              </Col>
              <Col lg={6}>
                <h2>Values</h2>
                <pre>{JSON.stringify(values, null, 2)}</pre>
                <h2>Errors</h2>
                <pre>{JSON.stringify(errors, null, 2)}</pre>
              </Col>
            </Row>
          </Fragment>
        )}
      />
    );
  });
