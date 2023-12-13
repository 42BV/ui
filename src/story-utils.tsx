import { Fragment, ReactNode } from 'react';
import { Form as ReactFinalForm } from 'react-final-form';
import { Alert, Col, Row } from 'reactstrap';
import { SubmitButton } from './core/SubmitButton/SubmitButton';
import { action } from '@storybook/addon-actions';
import { Page } from '@42.nl/spring-connect';
import { FetchOptionsCallbackConfig } from './form/option';
import { pageOf } from './utilities/page/page';
import { Card } from './index';

type Props = {
  children: ReactNode;
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
        By default when <code>isOptionEqual</code> is not provided the ids of
        the objects will be compared. If id does not exist the labels for the
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
        By default when <code>keyForOption</code> is not provided the id of the
        object will be used the key. If id does not exist the labels for the
        options coming from <code>labelForOption</code> will be used as the key.
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
      Whenever <code>reloadOptions</code> changes the options are fetched again.
      Should only be used when <code>options</code> is a function which fetches
      data.
    </p>
  );
}

export function FieldFormElementDependencies() {
  return (
    <Alert color="warning" className="mb-4">
      <p>
        To be able to use field variants of form elements, you have to add
        @42.nl/final-form-field-validation, final-form, react-final-form and
        react-display-name to your dependencies:
      </p>
      <code>
        npm install --save @42.nl/final-form-field-validation final-form
        react-final-form react-display-name
      </code>
    </Alert>
  );
}

export function JarbFormElementDependencies() {
  return (
    <Alert color="warning" className="mb-4">
      <p>
        To be able to use jarb variants of form elements, you have to add
        @42.nl/jarb-final-form, @42.nl/final-form-field-validation,
        @42.nl/spring-connect, @42.nl/react-error-store, final-form,
        react-final-form and react-display-name to your dependencies:
      </p>
      <code>
        npm install --save @42.nl/jarb-final-form
        @42.nl/final-form-field-validation @42.nl/spring-connect
        @42.nl/react-error-store final-form react-final-form react-display-name
      </code>
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

export type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  eyeColor: string;
  height: number;
  weight: number;
  jobTitle: string;
  favoriteMovie: Movie | undefined;
  favoriteFood: string;
  dateOfBirth: Date | undefined;
  sex: string;
};

export type Movie = {
  name: string;
};

export const persons: Person[] = [
  {
    id: Math.random(),
    firstName: 'Fitzpatrick',
    lastName: 'Lyons',
    age: 20,
    eyeColor: 'brown',
    height: 10,
    weight: 3,
    jobTitle: 'Senior CodeMonkey',
    favoriteMovie: { name: 'The Matrix' },
    favoriteFood: 'Hamburgers',
    dateOfBirth: new Date('2014-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Berry',
    lastName: 'McNab',
    age: 41,
    eyeColor: 'blue',
    height: 13,
    weight: 55,
    jobTitle: 'Business Manager',
    favoriteMovie: { name: 'Fear and loathing in Las Vegas' },
    favoriteFood: 'Spaghetti',
    dateOfBirth: new Date('2000-09-24'),
    sex: 'female'
  },
  {
    id: Math.random(),
    firstName: 'Neville',
    lastName: 'Brooks',
    age: 25,
    eyeColor: 'green',
    height: 12,
    weight: 32,
    jobTitle: 'Senior CodeMonkey',
    favoriteMovie: { name: 'Lord of the Rings' },
    favoriteFood: 'French Fries',
    dateOfBirth: new Date('2014-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Leonard',
    lastName: 'Nemoy',
    age: 50,
    eyeColor: 'brown',
    height: 10,
    weight: 3,
    jobTitle: 'Thespian',
    favoriteMovie: { name: 'Star Trek' },
    favoriteFood: 'Kosher',
    dateOfBirth: new Date('1900-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Levi',
    lastName: 'Smith',
    age: 30,
    eyeColor: 'brown',
    height: 10,
    weight: 3,
    jobTitle: 'Taxi driver',
    favoriteMovie: { name: 'Taxi' },
    favoriteFood:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, at nam alias ad culpa quae deleniti. Autem eveniet mollitia veritatis reprehenderit ea, tempora vero voluptatem. Dolore repudiandae voluptate quam quidem.,',
    dateOfBirth: new Date('2014-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Celine',
    lastName: 'Ferdinand',
    age: 80,
    eyeColor: 'green',
    height: 3,
    weight: 5,
    jobTitle: 'Retired',
    favoriteMovie: { name: 'Driving miss Daisy' },
    favoriteFood: 'Prunes',
    dateOfBirth: new Date('1940-09-24'),
    sex: 'female'
  },
  {
    id: Math.random(),
    firstName: 'Bonald',
    lastName: 'Ferdinand',
    age: 82,
    eyeColor: 'blue',
    height: 3,
    weight: 5,
    jobTitle: 'Retired',
    favoriteMovie: { name: 'Driving miss Daisy' },
    favoriteFood: 'Prunes',
    dateOfBirth: new Date('1938-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Zechs',
    lastName: 'Merquise',
    age: 42,
    eyeColor: 'blue',
    height: 3,
    weight: 5,
    jobTitle: 'Ace pilot',
    favoriteMovie: { name: 'Gundam wing' },
    favoriteFood: 'Apple pie',
    dateOfBirth: new Date('2010-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'David',
    lastName: 'Hayter',
    age: 55,
    eyeColor: 'blue',
    height: 3,
    weight: 5,
    jobTitle: 'Voice actor',
    favoriteMovie: { name: 'Guyver' },
    favoriteFood: 'Snakes',
    dateOfBirth: new Date('1960-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'James',
    lastName: 'Kirk',
    age: 50,
    eyeColor: 'brown',
    height: 3,
    weight: 5,
    jobTitle: 'Captain',
    favoriteMovie: { name: 'Star Trek' },
    favoriteFood: 'Replicated',
    dateOfBirth: new Date('2100-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Bert',
    lastName: 'Kelly',
    age: 30,
    eyeColor: 'blue',
    height: 3,
    weight: 5,
    jobTitle: 'Blacksmith',
    favoriteMovie: { name: 'Not without my daughter' },
    favoriteFood: 'Pears',
    dateOfBirth: new Date('1989-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'John',
    lastName: 'Goodall',
    age: 68,
    eyeColor: 'green',
    height: 3,
    weight: 5,
    jobTitle: 'Gardner',
    favoriteMovie: { name: 'The Gardner' },
    favoriteFood: 'Cauliflower',
    dateOfBirth: new Date('2019-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Rick',
    lastName: 'Xander',
    age: 14,
    eyeColor: 'brown',
    height: 3,
    weight: 5,
    jobTitle: 'Baker',
    favoriteMovie: { name: 'Halloween' },
    favoriteFood: 'Cake',
    dateOfBirth: new Date('1980-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Jessica',
    lastName: 'Bernard',
    age: 36,
    eyeColor: 'green',
    height: 3,
    weight: 5,
    jobTitle: 'Student',
    favoriteMovie: { name: 'Highlander' },
    favoriteFood: 'Ice cream',
    dateOfBirth: new Date('1980-09-24'),
    sex: 'female'
  },
  {
    id: Math.random(),
    firstName: 'Benjamin',
    lastName: 'Sisko',
    age: 55,
    eyeColor: 'brown',
    height: 3,
    weight: 5,
    jobTitle: 'Commander',
    favoriteMovie: { name: 'Search for Spock' },
    favoriteFood: 'Jamba',
    dateOfBirth: new Date('2200-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Kathyrn',
    lastName: 'Janeway',
    age: 55,
    eyeColor: 'brown',
    height: 3,
    weight: 5,
    jobTitle: 'Captain',
    favoriteMovie: { name: 'Wrath of Khan' },
    favoriteFood: 'Coffee',
    dateOfBirth: new Date('2240-09-24'),
    sex: 'female'
  },
  {
    id: Math.random(),
    firstName: 'Jean-Luc',
    lastName: 'Picard',
    age: 66,
    eyeColor: 'blue',
    height: 3,
    weight: 5,
    jobTitle: 'Captain',
    favoriteMovie: { name: 'Next generation' },
    favoriteFood: 'Tea Earl Grey Hot',
    dateOfBirth: new Date('2200-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Peter',
    lastName: 'Parker',
    age: 30,
    eyeColor: 'blue',
    height: 55,
    weight: 14,
    jobTitle: 'Spider-man',
    favoriteMovie: { name: 'Spider-man' },
    favoriteFood: 'Webs',
    dateOfBirth: new Date('1990-09-24'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Clark',
    lastName: 'Kent',
    age: 40,
    eyeColor: 'blue',
    height: 80,
    weight: 33,
    jobTitle: 'Journalist',
    favoriteMovie: { name: 'Superman returns' },
    favoriteFood: 'Kryptonite',
    dateOfBirth: new Date('1960-01-01'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Bruce',
    lastName: 'Wayne',
    age: 55,
    eyeColor: 'blue',
    height: 70,
    weight: 33,
    jobTitle: 'CEO',
    favoriteMovie: { name: 'Batman begins' },
    favoriteFood: 'Bats',
    dateOfBirth: new Date('1955-01-01'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Diana',
    lastName: 'Prince',
    age: 28,
    eyeColor: 'green',
    height: 90,
    weight: 19,
    jobTitle: 'Curator',
    favoriteMovie: { name: 'Wonderwoman' },
    favoriteFood: 'Greek',
    dateOfBirth: new Date('1990-01-01'),
    sex: 'female'
  },
  {
    id: Math.random(),
    firstName: 'Tony',
    lastName: 'Stark',
    age: 40,
    eyeColor: 'brown',
    height: 70,
    weight: 33,
    jobTitle: 'CEO',
    favoriteMovie: { name: 'Ironman' },
    favoriteFood: 'Shoarma',
    dateOfBirth: new Date('1980-01-01'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Steve',
    lastName: 'Rogers',
    age: 100,
    eyeColor: 'blue',
    height: 44,
    weight: 55,
    jobTitle: 'Captain',
    favoriteMovie: { name: 'Winter soldier' },
    favoriteFood: 'Apple pie',
    dateOfBirth: new Date('1920-01-01'),
    sex: 'male'
  },
  {
    id: Math.random(),
    firstName: 'Natasha',
    lastName: 'Romanov',
    age: 30,
    eyeColor: 'green',
    height: 77,
    weight: 66,
    jobTitle: 'Black widow',
    favoriteMovie: { name: 'Avengers' },
    favoriteFood: 'Stroganov',
    dateOfBirth: new Date('1995-01-01'),
    sex: 'female'
  },
  {
    id: Math.random(),
    firstName: 'Bruce',
    lastName: 'Banner',
    age: 42,
    eyeColor: 'brown',
    height: 89,
    weight: 99,
    jobTitle: 'Smasher',
    favoriteMovie: { name: 'The Incredible Hulk' },
    favoriteFood: 'Gammarays',
    dateOfBirth: new Date('1975-01-01'),
    sex: 'male'
  }
];
