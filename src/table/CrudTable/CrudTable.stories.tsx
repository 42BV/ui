import React, { useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Alert, Card } from 'reactstrap';
import { capitalize, every, lowerCase, startsWith } from 'lodash';
import { Field, Form } from 'react-final-form';
import moment from 'moment';
import { pageOf } from '@42.nl/spring-connect';
import { Button } from '../../core/Button/Button';
import { Tag } from '../../core/Tag/Tag';
import { Select } from '../../form/Select/Select';
import { Input } from '../../form/Input/Input';
import { ContentState } from '../../core/ContentState/ContentState';
import { ConfirmButton } from '../../core/ConfirmButton/ConfirmButton';
import { DateTimeInput } from '../../form/DateTimeInput/DateTimeInput';
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
import { Person, persons } from '../../story-utils';

storiesOf('table/CrudTable', module)
  .addParameters({ component: CrudTable })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>
          To be able to use CrudTable, you have to add lodash, overlayscrollbars
          and overlayscrollbars-react to your dependencies:
        </p>
        <code>
          npm install --save lodash overlayscrollbars overlayscrollbars-react
        </code>
        <p className="mb-0 mt-2">
          You also have to add the stylesheet to your project
        </p>
        <code>
          @import &apos;overlayscrollbars/overlayscrollbars.css&apos;;
        </code>
      </Alert>
      <Alert color="warning" className="mb-4">
        <p>
          To be able to use CrudTable with Page, you have to add
          @42.nl/spring-connect to your dependencies:
        </p>
        <code>npm install --save @42.nl/spring-connect</code>
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

    const [page, setPage] = useState(1);

    const pageOfPersons = pageOf(persons, page, 20);

    const [detail, setDetail] = useState(-1);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, []);

    return (
      <Card body>
        <CrudTable page={pageOfPersons} pageChanged={setPage}>
          <EpicRow header>
            <CrudHeader width={columns.firstName}>First name</CrudHeader>
            <CrudHeader width={columns.firstName}>Last name</CrudHeader>
            <CrudHeader width={columns.firstName}>Age</CrudHeader>
          </EpicRow>

          {loading ? (
            <ContentState mode="loading" title="Loading..." />
          ) : (
            pageOfPersons.content.map((person) => (
              <EpicRow key={person.id} onClick={() => setDetail(person.id)}>
                <EpicCell width={columns.firstName}>
                  <span
                    className="text-primary clickable w-100"
                    onClick={() => setDetail(person.id)}
                  >
                    {person.firstName}
                  </span>
                </EpicCell>
                <EpicCell width={columns.lastName}>{person.lastName}</EpicCell>
                <EpicCell width={columns.age}>{person.age}</EpicCell>
              </EpicRow>
            ))
          )}
          <EpicDetailRow left={columns.firstName} active={detail > 0}>
            {() => {
              const person = pageOfPersons.content.find((p) => p.id === detail);

              if (!person) {
                return (
                  <EpicDetail onClose={() => setDetail(-1)}>
                    Person not found
                  </EpicDetail>
                );
              }

              return (
                <EpicDetail onClose={() => setDetail(-1)}>
                  <AttributeList>
                    {Object.keys(person).map((column) => (
                      <AttributeView
                        key={column}
                        label={capitalize(column.replace(/([A-Z])/, ' $1'))}
                      >
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
    const [columns, setColumns] = useState(() => ({
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

    const [filters, setFilters] = useState(() => ({
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

    const [sort, setSort] = useState<{
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

    filteredPersons.sort(sortFn);

    const [page, setPage] = useState(1);

    const pageOfPersons = pageOf(filteredPersons, page, 20);

    const [selected, setSelected] = useState<Person[]>([]);

    function onSelect(person: Person, checked: boolean) {
      if (checked) {
        selected.push(person);
        setSelected([...selected]);
      } else {
        const nextSelected = selected.filter((p) => p.id !== person.id);

        setSelected(nextSelected);
      }
    }

    const [detail, setDetail] = useState(-1);

    const [editing, setEditing] = useState(-1);

    const [creating, setCreating] = useState(false);

    const [loading, setLoading] = useState(false);

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
          renderSelection={
            selected.length > 0
              ? () => (
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
                )
              : undefined
          }
          page={pageOfPersons}
          pageChanged={setPage}
          onSearch={(value) => filterChanged('firstName', value)}
        >
          <EpicRow header>
            {Object.keys(columns)
              .filter((column) => column !== 'dateOfBirth')
              .map((column: keyof Person) => (
                <CrudHeader
                  key={column}
                  width={columns[column]}
                  onResize={(width) => changeSize(column, width)}
                  direction={sort.column === column ? sort.direction : 'NONE'}
                  onSort={(direction) => changeSort(column, direction)}
                  onSearch={(value) => filterChanged(column, value)}
                  searchValue={filters[column]}
                  searchLabel={`Search by ${column.replace(/([A-Z])/, ' $1')}`}
                >
                  {capitalize(column.replace(/([A-Z])/, ' $1'))}
                </CrudHeader>
              ))}
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
                  label="Date of birth"
                  hiddenLabel={true}
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
          ) : (
            pageOfPersons.content.map((person) => (
              <EpicRow key={person.id} onClick={() => setDetail(person.id)}>
                <EpicCell width={columns.firstName}>
                  <EpicSelection
                    checked={selected.some((p) => p.id === person.id)}
                    onChange={(checked) => onSelect(person, checked)}
                  >
                    {person.firstName}
                  </EpicSelection>
                </EpicCell>
                {Object.keys(columns)
                  .filter((column) => column !== 'firstName')
                  .map((column) => (
                    <EpicCell key={column} width={columns[column]}>
                      {person[column]}
                    </EpicCell>
                  ))}
                <EpicCell width={300}>
                  <ConfirmButton
                    icon="delete"
                    dialogText="Are you sure you want to delete this person?"
                    onConfirm={action('delete')}
                  />
                  <Button icon="edit" onClick={() => setEditing(person.id)} />
                </EpicCell>
              </EpicRow>
            ))
          )}

          <EpicDetailRow left={columns.firstName} active={editing > 0}>
            {() => (
              <EpicDetail onClose={() => setEditing(-1)}>
                <PersonForm
                  person={pageOfPersons.content.find(
                    (person) => person.id === editing
                  )}
                />
              </EpicDetail>
            )}
          </EpicDetailRow>
          <EpicDetailRow left={columns.firstName} active={detail > 0}>
            {() => {
              const person = pageOfPersons.content.find((p) => p.id === detail);

              if (!person) {
                return (
                  <EpicDetail onClose={() => setDetail(-1)}>
                    Person not found
                  </EpicDetail>
                );
              }

              return (
                <EpicDetail onClose={() => setDetail(-1)}>
                  <AttributeList>
                    {Object.keys(columns).map((column) => (
                      <AttributeView
                        key={column}
                        label={capitalize(column.replace(/([A-Z])/, ' $1'))}
                      >
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
            {({ input }) => <Input {...input} type="text" label="First name" />}
          </Field>
          <Field name="lastName">
            {({ input }) => <Input {...input} type="text" label="Last name" />}
          </Field>
          <Field name="age">
            {({ input }) => <Input {...input} type="text" label="Age" />}
          </Field>
          <Field name="eyeColor">
            {({ input }) => (
              <Select
                {...input}
                label="Eye color"
                options={['all', 'brown', 'green', 'blue']}
                labelForOption={(option) => option}
              />
            )}
          </Field>
          <Field name="sex">
            {({ input }) => (
              <Select
                {...input}
                label="Sex"
                options={['male', 'female']}
                labelForOption={(option) => option}
              />
            )}
          </Field>
        </>
      )}
    </Form>
  );
}
