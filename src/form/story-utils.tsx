import React, { Fragment } from 'react';
import { Form as ReactFinalForm } from 'react-final-form';
import { Alert, Col, Row } from 'reactstrap';
import { SubmitButton } from '../core/SubmitButton/SubmitButton';
import { action } from '@storybook/addon-actions';
import { Page } from '@42.nl/spring-connect';
import { FetchOptionsCallbackConfig } from './option';
import { pageOf } from '../utilities/page/page';
import { Card } from '..';

type Props = {
  children: React.ReactNode;
};

export function FinalForm({ children }: Props) {
  return (
    <ReactFinalForm
      onSubmit={() => action('form submitted')}
      render={({ handleSubmit, submitting, values, errors }) => (
        // Do not render a <form> here as it will submit the form when
        // the submit button is pressed.
        <Fragment>
          <Row>
            <Col lg={6}>
              <Card className="m-2">
                {children}

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
}

export function resolveAfter<T>(value: T, after = 1000): Promise<T> {
  return new Promise((resolve) => {
    return setTimeout(() => {
      resolve(value);
    }, after);
  });
}

export function IsOptionEqualInfo() {
  return (
    <>
      <p>
        By default when <code>isOptionEqual</code> is not provided the ids
        of the objects will be compared. If id does not exist the labels for the
        options coming from <code>labelForOption</code> will be compared.
      </p>

      <p>
        <strong>
          You will rarely need <em>isOptionEqual</em> in practice.
        </strong>
      </p>

      <p>
        You will only need to provide a custom <code>isOptionEqual</code> when
        your objects do not have an <code>id</code> or when options will have
        the same <code>label</code>.
      </p>
    </>
  );
}

export function KeyForOptionInfo() {
  return (
    <>
      <p>
        By default when <code>keyForOption</code> is not provided the id of
        the object will be used the key. If id does not exist the labels for the
        options coming from <code>labelForOption</code> will be used as the
        key.
      </p>

      <p>
        <strong>
          You will rarely need <em>keyForOption</em> in practice.
        </strong>
      </p>

      <p>
        You will rarely need <code>keyForOption</code> in practice. You will
        only need to provide a custom <code>keyForOption</code> when your
        objects do not have an <code>id</code> or when options will have the
        same <code>label</code>.
      </p>
    </>
  );
}

export function ReloadOptionsInfo() {
  return (
    <p>
      Whenever <code>reloadOptions</code> changes the options are fetched
      again. Should only be used when <code>options</code> is a function
      which fetches data.
    </p>
  );
}

export function JarbFormElementDependencies() {
  return (
    <Alert color="warning" className="mb-4">
      <p>To be able to use jarb variants of form elements, you have to add @42.nl/jarb-final-form, @42.nl/react-error-store, final-form, react-final-form and
        react-display-name to your dependencies:</p>
      <code>npm install --save @42.nl/spring-connect @42.nl/react-error-store final-form react-final-form react-display-name</code>
    </Alert>
  );
}

export type Province = {
  id: number;
  label: string;
  value: string;
  north: boolean;
};

export function provinceFetcher({
  query,
  page,
  size
}: FetchOptionsCallbackConfig): Promise<Page<Province>> {
  const content = provinces().filter((province) =>
    province.label.toLowerCase().includes(query.toLowerCase())
  );

  const result = pageOf(content, page, size);

  return resolveAfter(result);
}

export function nonExistingProvince(): Province {
  // Used to test if the option which came from the back-end is
  // always added even though it does not exist.
  return {
    id: 13,
    value: 'VLAANDEREN',
    label: 'Vlaanderen',
    north: false
  };
}

export function provinces(): Province[] {
  return [
    { id: 1, value: 'GRONINGEN', label: 'Groningen', north: true },
    { id: 2, value: 'FRIESLAND', label: 'Friesland', north: true },
    { id: 3, value: 'DRENTHE', label: 'Drenthe', north: true },
    { id: 4, value: 'OVERIJSSEL', label: 'Overijssel', north: false },
    { id: 5, value: 'FLEVOLAND', label: 'Flevoland', north: false },
    { id: 6, value: 'GELDERLAND', label: 'Gelderland', north: false },
    { id: 7, value: 'UTRECHT', label: 'Utrecht', north: false },
    {
      id: 8,
      value: 'NOORD-HOLLAND',
      label: 'Noord-Holland',
      north: true
    },
    {
      id: 9,
      value: 'ZUID-HOLLAND',
      label: 'Zuid-Holland',
      north: false
    },
    { id: 10, value: 'ZEELAND', label: 'Zeeland', north: false },
    {
      id: 11,
      value: 'NOORD-BRABANT',
      label: 'Noord-Brabant',
      north: false
    },
    { id: 12, value: 'LIMBURG', label: 'Limburg', north: false }
  ];
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
