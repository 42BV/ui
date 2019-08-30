import React, { Fragment } from 'react';
import { Form as ReactFinalForm } from 'react-final-form';
import { Row, Col, Card, CardBody } from 'reactstrap';
import SubmitButton from '../core/SubmitButton/SubmitButton';
import { action } from '@storybook/addon-actions';

interface Props {
  children: React.ReactNode;
}

export function Form({ children }: Props) {
  return (
    <Card className="m-2">
      <CardBody>{children}</CardBody>
    </Card>
  );
}

export function FinalForm({ children }: Props) {
  return (
    <ReactFinalForm
      onSubmit={() => action('form submitted')}
      render={({ handleSubmit, submitting, values, errors }) => (
        <Fragment>
          <Row>
            <Col>
              <Form>
                {children}

                <SubmitButton
                  onClick={() => handleSubmit()}
                  inProgress={submitting}
                >
                  Submit
                </SubmitButton>
              </Form>
            </Col>
            <Col>
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
}
