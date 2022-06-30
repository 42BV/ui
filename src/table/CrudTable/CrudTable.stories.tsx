import React, { useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Alert, Card } from 'reactstrap';
import { capitalize, every, lowerCase, startsWith } from 'lodash';
import { Field, Form } from 'react-final-form';
import moment from 'moment';
import Button from '../../core/Button/Button';
import Tag from '../../core/Tag/Tag';
import Select from '../../form/Select/Select';
import Input from '../../form/Input/Input';
import ContentState from '../../core/ContentState/ContentState';
import ConfirmButton from '../../core/ConfirmButton/ConfirmButton';
import { pageOf } from '../../utilities/page/page';
import DateTimeInput from '../../form/DateTimeInput/DateTimeInput';
import { EpicRow } from '../EpicTable/rows/EpicRow/EpicRow';
import { EpicHeader } from '../EpicTable/cells/EpicHeader/EpicHeader';
import { EpicCell } from '../EpicTable/cells/EpicCell/EpicCell';
import { EpicCellLayout } from '../EpicTable/cells/EpicCellLayout/EpicCellLayout';
import { EpicSelection } from '../EpicTable/widgets/EpicSelection/EpicSelection';
import { EpicSort } from '../EpicTable/widgets/EpicSort/EpicSort';

import { EpicTableSortDirection } from '../EpicTable/types';
import { CrudTable } from './CrudTable';
import { CrudHeader } from './components/CrudHeader/CrudHeader';
import { EpicDetailRow } from '../EpicTable/rows/EpicDetailRow/EpicDetailRow';
import { EpicDetail } from '../EpicTable/widgets/EpicDetail/EpicDetail';
import { AttributeList } from '../../core/lists/AttributeList/AttributeList';
import { AttributeView } from '../../core/lists/AttributeView/AttributeView';

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  eyeColor: string;
  height: number;
  weight: number;
  jobTitle: string;
  favoriteMovie: string;
  favoriteFood: string;
  sex: string;
  dateOfBirth: string;
};

const persons: Person[] = [
  {
    id: Math.random(),
    firstName: 'Fitzpatrick',
    lastName: 'Lyons',
    age: 20,
    eyeColor: 'brown',
    height: 10,
    weight: 3,
    jobTitle: 'Senior CodeMonkey',
    favoriteMovie: 'The Matrix',
    favoriteFood: 'Hamburgers',
    sex: 'male',
    dateOfBirth: '2014-09-24'
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
    favoriteMovie: 'Fear and loathing in Las Vegas',
    favoriteFood: 'Spaghetti',
    sex: 'female',
    dateOfBirth: '2000-09-24'
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
    favoriteMovie: 'Lord of the Rings',
    favoriteFood: 'French Fries',
    sex: 'male',
    dateOfBirth: '2014-09-24'
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
    favoriteMovie: 'Star Trek',
    favoriteFood: 'Kosher',
    sex: 'male',
    dateOfBirth: '1900-09-24'
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
    favoriteMovie: 'Taxi',
    favoriteFood:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, at nam alias ad culpa quae deleniti. Autem eveniet mollitia veritatis reprehenderit ea, tempora vero voluptatem. Dolore repudiandae voluptate quam quidem.,',
    sex: 'male',
    dateOfBirth: '2014-09-24'
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
    favoriteMovie: 'Driving miss Daisy',
    favoriteFood: 'Prunes',
    sex: 'female',
    dateOfBirth: '1940-09-24'
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
    favoriteMovie: 'Driving miss Daisy',
    favoriteFood: 'Prunes',
    sex: 'male',
    dateOfBirth: '1938-09-24'
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
    favoriteMovie: 'Gundam wing',
    favoriteFood: 'Apple pie',
    sex: 'male',
    dateOfBirth: '2010-09-24'
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
    favoriteMovie: 'Guyver',
    favoriteFood: 'Snakes',
    sex: 'male',
    dateOfBirth: '1960-09-24'
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
    favoriteMovie: 'Star Trek',
    favoriteFood: 'Replicated',
    sex: 'male',
    dateOfBirth: '2100-09-24'
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
    favoriteMovie: 'Not without my daughter',
    favoriteFood: 'Pears',
    sex: 'male',
    dateOfBirth: '1989-09-24'
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
    favoriteMovie: 'The Gardner',
    favoriteFood: 'Cauliflower',
    sex: 'male',
    dateOfBirth: '2019-09-24'
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
    favoriteMovie: 'Halloween',
    favoriteFood: 'Cake',
    sex: 'male',
    dateOfBirth: '1980-09-24'
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
    favoriteMovie: 'Highlander',
    favoriteFood: 'Ice cream',
    sex: 'female',
    dateOfBirth: '1980-09-24'
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
    favoriteMovie: 'Search for Spock',
    favoriteFood: 'Jamba',
    sex: 'male',
    dateOfBirth: '2200-09-24'
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
    favoriteMovie: 'Wrath of Khan',
    favoriteFood: 'Coffee',
    sex: 'female',
    dateOfBirth: '2240-09-24'
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
    favoriteMovie: 'Next generation',
    favoriteFood: 'Tea Earl Grey Hot',
    sex: 'male',
    dateOfBirth: '2200-09-24'
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
    favoriteMovie: 'Spider-man',
    favoriteFood: 'Webs',
    sex: 'male',
    dateOfBirth: '1990-09-24'
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
    favoriteMovie: 'Superman returns',
    favoriteFood: 'Kryptonite',
    sex: 'male',
    dateOfBirth: '1960-01-01'
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
    favoriteMovie: 'Batman begins',
    favoriteFood: 'Bats',
    sex: 'male',
    dateOfBirth: '1955-01-01'
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
    favoriteMovie: 'Wonderwoman',
    favoriteFood: 'Greek',
    sex: 'female',
    dateOfBirth: '1990-01-01'
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
    favoriteMovie: 'Ironman',
    favoriteFood: 'Shoarma',
    sex: 'male',
    dateOfBirth: '1980-01-01'
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
    favoriteMovie: 'Winter soldier',
    favoriteFood: 'Apple pie',
    sex: 'male',
    dateOfBirth: '1920-01-01'
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
    favoriteMovie: 'Avengers',
    favoriteFood: 'Stroganov',
    sex: 'female',
    dateOfBirth: '1995-01-01'
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
    favoriteMovie: 'The Incredible Hulk',
    favoriteFood: 'Gammarays',
    sex: 'male',
    dateOfBirth: '1975-01-01'
  }
];

storiesOf('table/CrudTable', module)
  .addParameters({ component: CrudTable })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>To be able to use CrudTable with Page, you have to add @42.nl/spring-connect, lodash, overlayscrollbars and overlayscrollbars-react to your dependencies:</p>
        <code>npm install --save @42.nl/spring-connect lodash overlayscrollbars overlayscrollbars-react</code>
        <p className="mb-0 mt-2">You also have to add the stylesheet to your project</p>
        <code>@import &apos;~overlayscrollbars/css/OverlayScrollbars.css&apos;;</code>
      </Alert>
      <Story />
    </>
  ))
  .add('simple example', () => {
    const columns = {
      firstName: 300,
      lastName: 200,
      age: 200
    };

    const [ page, setPage ] = useState(1);

    const pageOfPersons = pageOf(persons, page, 20);

    const [ detail, setDetail ] = useState(-1);

    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, []);

    return (
      <Card body>
        <CrudTable
          page={pageOfPersons}
          pageChanged={setPage}
        >
          <EpicRow header>
            <CrudHeader width={columns.firstName}>
              First name
            </CrudHeader>
            <CrudHeader width={columns.firstName}>
              Last name
            </CrudHeader>
            <CrudHeader width={columns.firstName}>
              Age
            </CrudHeader>
          </EpicRow>

          {loading ? (
            <ContentState mode="loading" title="Loading..." />
          ) : pageOfPersons.content.map((person) => (
            <EpicRow key={person.id} onClick={() => setDetail(person.id)}>
              <EpicCell width={columns.firstName}>
                <span
                  className="text-primary clickable w-100"
                  onClick={() => setDetail(person.id)}
                >
                  {person.firstName}
                </span>
              </EpicCell>
              <EpicCell width={columns.lastName}>
                {person.lastName}
              </EpicCell>
              <EpicCell width={columns.age}>
                {person.age}
              </EpicCell>
            </EpicRow>
          ))}
          <EpicDetailRow left={columns.firstName} active={detail > 0}>
            {() => {
              const person = pageOfPersons.content.find(p => p.id === detail);

              if (!person) {
                return <EpicDetail onClose={() => setDetail(-1)}>Person not found</EpicDetail>;
              }

              return (
                <EpicDetail onClose={() => setDetail(-1)}>
                  <AttributeList>
                  {Object.keys(person).map((column) => (
                    <AttributeView key={column} label={capitalize(column.replace(/([A-Z])/, ' $1'))}>
                      {person[column]}
                    </AttributeView>
                    ))}
                  </AttributeList>
                </EpicDetail>
              );
            }}
          </EpicDetailRow>
        </CrudTable>
      </Card>
    );
  })
  .add('full example', () => {
    const [ columns, setColumns ] = useState(() => ({
      firstName: 300,
      lastName: 200,
      age: 200,
      eyeColor: 200,
      height: 150,
      weight: 150,
      jobTitle: 200,
      favoriteMovie: 300,
      favoriteFood: 200,
      sex: 200,
      dateOfBirth: 200
    }));

    function changeSize(name: keyof Person, width: number) {
      setColumns((widths) => ({ ...widths, [name]: width }));
    }

    const [ filters, setFilters ] = useState(() => ({
      firstName: '',
      lastName: '',
      age: '',
      eyeColor: '',
      height: '',
      weight: '',
      jobTitle: '',
      favoriteMovie: '',
      favoriteFood: '',
      sex: '',
      dateOfBirth: ''
    }));

    function filterChanged(name: keyof Person, value: string) {
      setPage(1);
      setFilters({ ...filters, [name]: value });
    }

    const filteredPersons = persons.filter((person) => {
      return every(filters, (value, key) => {
        const text = person[key];

        if (!value || value === 'all') {
          return true;
        }

        return startsWith(lowerCase(text), lowerCase(value));
      });
    });

    const [ sort, setSort ] = useState<{
      direction: EpicTableSortDirection;
      column: string;
    }>({ direction: 'NONE', column: 'firstName' });

    function changeSort(
      column: keyof Person,
      direction: EpicTableSortDirection
    ) {
      setPage(1);
      setSort({ direction, column });
    }

    const sortFn =
      sort.direction === 'ASC'
        ? (a, b) => `${a[sort.column]}`.localeCompare(`${b[sort.column]}`)
        : (a, b) => `${b[sort.column]}`.localeCompare(`${a[sort.column]}`);

    const sortedPersons = filteredPersons.sort(sortFn);

    const [ page, setPage ] = useState(1);

    const pageOfPersons = pageOf(sortedPersons, page, 20);

    const [ selected, setSelected ] = useState<Person[]>([]);

    function onSelect(person: Person, checked: boolean) {
      if (checked) {
        selected.push(person);
        setSelected([ ...selected ]);
      } else {
        const nextSelected = selected.filter((p) => p.id !== person.id);

        setSelected(nextSelected);
      }
    }

    const [ detail, setDetail ] = useState(-1);

    const [ editing, setEditing ] = useState(-1);

    const [ creating, setCreating ] = useState(false);

    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, []);

    return (
      <Card body>
        <CrudTable
          buttons={() => (
            <Button icon="add" onClick={() => setCreating(true)}>
              Add person
            </Button>
          )}
          renderSelection={selected.length > 0 ? () => (
            <>
              <h2>Selected</h2>
              <div className="mb-3">
                {selected.map((person) => (
                  <Tag
                    key={person.id}
                    text={`${person.firstName} ${person.lastName}`}
                    onRemove={() => onSelect(person, false)}
                  />
                ))}
              </div>
            </>
          ) : undefined}
          page={pageOfPersons}
          pageChanged={setPage}
          onSearch={(value) => filterChanged('firstName', value)}
        >
          <EpicRow header>
            {Object.keys(columns).filter(column => column !== 'dateOfBirth').map(((column: keyof Person) => (
              <CrudHeader
                key={column}
                width={columns[column]}
                onResize={(width) => changeSize(column, width)}
                direction={sort.column === column ? sort.direction : 'NONE'}
                onSort={(direction) => changeSort(column, direction)}
                onSearch={(value) => filterChanged(column, value)}
                searchValue={filters[column]}
              >
                {capitalize(column.replace(/([A-Z])/, ' $1'))}
              </CrudHeader>
            )))}
            <EpicHeader
              width={columns.dateOfBirth}
              height={88}
              onResize={(width) => changeSize('dateOfBirth', width)}
            >
              <EpicCellLayout mode="vertical">
                <EpicCellLayout mode="horizontal">
                  Birth date
                  <EpicSort
                    direction={
                      sort.column === 'dateOfBirth' ? sort.direction : 'NONE'
                    }
                    onChange={(direction) =>
                      changeSort('dateOfBirth', direction)
                    }
                  />
                </EpicCellLayout>

                <DateTimeInput
                  id="dateOfBirth"
                  dateFormat="YYYY-MM-DD"
                  placeholder="YYYY-MM-DD"
                  timeFormat={false}
                  onChange={(date) =>
                    filterChanged(
                      'dateOfBirth',
                      date ? moment(date).format('YYYY-MM-DD') : ''
                    )
                  }
                />
              </EpicCellLayout>
            </EpicHeader>
            <EpicHeader width={300} height={88}>
              <div className="px-1 py-1 align-self-start">Actions</div>
            </EpicHeader>
          </EpicRow>

          {loading ? (
            <ContentState mode="loading" title="Loading..." />
          ) : pageOfPersons.content.map((person) => (
            <EpicRow key={person.id} onClick={() => setDetail(person.id)}>
              <EpicCell width={columns.firstName}>
                <EpicSelection
                  checked={selected.some((p) => p.id === person.id)}
                  onChange={(checked) => onSelect(person, checked)}
                />

                <span
                  className="text-primary clickable w-100"
                  onClick={() => setDetail(person.id)}
                >
                  {person.firstName}
                </span>
              </EpicCell>
              {Object.keys(columns).filter(column => column !== 'firstName').map((column) => (
                <EpicCell key={column} width={columns[column]}>
                  {person[column]}
                </EpicCell>
              ))}
              <EpicCell width={300}>
                <ConfirmButton icon="delete" dialogText="Are you sure you want to delete this person?" onConfirm={action('delete')} />
                <Button icon="edit" onClick={() => setEditing(person.id)} />
              </EpicCell>
            </EpicRow>
          ))}

          <EpicDetailRow left={columns.firstName} active={editing > 0}>
            {() => (
              <EpicDetail onClose={() => setEditing(-1)}>
                <PersonForm person={pageOfPersons.content.find(person => person.id === editing)} />
              </EpicDetail>
            )}
          </EpicDetailRow>
          <EpicDetailRow left={columns.firstName} active={detail > 0}>
            {() => {
              const person = pageOfPersons.content.find(p => p.id === detail);

              if (!person) {
                return <EpicDetail onClose={() => setDetail(-1)}>Person not found</EpicDetail>;
              }

              return (
                <EpicDetail onClose={() => setDetail(-1)}>
                  <AttributeList>
                  {Object.keys(columns).map((column) => (
                    <AttributeView key={column} label={capitalize(column.replace(/([A-Z])/, ' $1'))}>
                      {person[column]}
                    </AttributeView>
                    ))}
                  </AttributeList>
                </EpicDetail>
              );
            }}
          </EpicDetailRow>
          <EpicDetailRow left={columns.firstName} active={creating}>
            {() => (
              <EpicDetail onClose={() => setCreating(false)}>
                <PersonForm />
              </EpicDetail>
            )}
          </EpicDetailRow>
        </CrudTable>
      </Card>
    );
  });

function PersonForm({ person }: { person?: Person }) {
  return (
    <Form initialValues={person} onSubmit={() => action('person edited')}>
      {() => (
        <>
          <Field name="firstName">
            {({ input }) => (
              <Input {...input} type="text" label="First name" />
            )}
          </Field>
          <Field name="lastName">
            {({ input }) => (
              <Input {...input} type="text" label="Last name" />
            )}
          </Field>
          <Field name="age">
            {({ input }) => (
              <Input {...input} type="text" label="Age" />
            )}
          </Field>
          <Field name="eyeColor">
            {({ input }) => (
              <Select
                {...input}
                label="Eye color"
                options={[ 'all', 'brown', 'green', 'blue' ]}
                labelForOption={(option) => option}
              />
            )}
          </Field>
          <Field name="sex">
            {({ input }) => (
              <Select
                {...input}
                label="Sex"
                options={[ 'male', 'female' ]}
                labelForOption={(option) => option}
              />
            )}
          </Field>
        </>
      )}
    </Form>
  );
}
