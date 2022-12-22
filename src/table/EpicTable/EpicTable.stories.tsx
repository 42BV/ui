import React, { Fragment, useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Alert, Card, Col, Input, Row } from 'reactstrap';
import { every, groupBy, lowerCase, startsWith } from 'lodash';

import { EpicTable } from './EpicTable';
import { EpicRow } from './rows/EpicRow/EpicRow';
import { EpicHeader } from './cells/EpicHeader/EpicHeader';
import { EpicCell } from './cells/EpicCell/EpicCell';
import { EpicExpanderRow } from './rows/EpicExpanderRow/EpicExpanderRow';
import { EpicCellLayout } from './cells/EpicCellLayout/EpicCellLayout';

import { EpicExpander } from './widgets/EpicExpander/EpicExpander';
import { EpicDetailRow } from './rows/EpicDetailRow/EpicDetailRow';
import { EpicDetail } from './widgets/EpicDetail/EpicDetail';
import { EpicSelection } from './widgets/EpicSelection/EpicSelection';
import { EpicSort } from './widgets/EpicSort/EpicSort';

import { EpicTableSortDirection } from './types';
import moment from 'moment';
import { MoreOrLess } from '../../core/MoreOrLess/MoreOrLess';
import { pageOf } from '../../utilities/page/page';
import { Tag } from '../../core/Tag/Tag';
import {
  ContentState,
  ContentStateMode
} from '../../core/ContentState/ContentState';
import { DateTimeInput } from '../../form/DateTimeInput/DateTimeInput';
import { Button } from '../../core/Button/Button';
import { Pagination } from '../../core/Pagination/Pagination';
import { Person, persons } from '../../story-utils';

export default {
  title: 'table/EpicTable',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p className="mb-0">
            To be able to use EpicTable, you have to add lodash,
            overlayscrollbars and overlayscrollbars-react to your dependencies:
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
        <Story />
      </>
    )
  ],

  parameters: {
    component: EpicTable
  }
};

const FullExampleStory = () => {
  const [widths, setWidths] = useState(() => ({
    firstName: 300,
    lastName: 200,
    age: 200,
    eyeColor: 200,
    height: 150,
    weight: 150,
    jobTitle: 200,
    favoriteMovie: 300,
    favoriteFood: 200,
    dateOfBirth: 200,
    sex: 200,
    actions: 300
  }));

  function changeSize(name: keyof Person, width: number) {
    setWidths((widths) => ({ ...widths, [name]: width }));
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
    dateOfBirth: '',
    sex: ''
  }));

  function filterChanged(name: keyof Person, value: string) {
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

  function changeSort(column: keyof Person, direction: EpicTableSortDirection) {
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

  const allPersonsSelected =
    selected.length > 0 &&
    pageOfPersons.content.every((p) => selected.some((ps) => ps.id === p.id));

  function selectAllClicked(checked: boolean) {
    if (checked) {
      pageOfPersons.content.forEach((p) => {
        if (selected.every((ps) => p.id !== ps.id)) {
          selected.push(p);
        }

        setSelected([...selected]);
      });
    } else {
      setSelected([]);
    }
  }

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
      {selected.length > 0 ? (
        <>
          <span className="d-block fs-2">Selected</span>
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
      ) : null}

      <EpicTable
        overlay={
          loading ? (
            <ContentState className="my-5" mode="loading" title="Loading" />
          ) : pageOfPersons.totalElements === 0 ? (
            <ContentState
              className="my-5"
              mode="no-results"
              title="Try again with a different query"
            />
          ) : null
        }
      >
        <EpicRow header>
          <EpicHeader
            width={widths.firstName}
            height={88}
            onResize={(width) => changeSize('firstName', width)}
          >
            <EpicCellLayout mode="vertical">
              <EpicCellLayout mode="horizontal">
                <EpicSelection
                  checked={allPersonsSelected}
                  onChange={(checked) => selectAllClicked(checked)}
                >
                  First name
                </EpicSelection>

                <EpicSort
                  direction={
                    sort.column === 'firstName' ? sort.direction : 'NONE'
                  }
                  onChange={(direction) => changeSort('firstName', direction)}
                />
              </EpicCellLayout>
              <Input
                onChange={(event) => {
                  event.preventDefault();
                  filterChanged('firstName', event.target.value);
                }}
              />
            </EpicCellLayout>
          </EpicHeader>
          <EpicHeader
            width={widths.lastName}
            height={88}
            onResize={(width) => changeSize('lastName', width)}
          >
            <EpicCellLayout mode="vertical">
              <EpicCellLayout mode="horizontal">
                Last name
                <EpicSort
                  direction={
                    sort.column === 'lastName' ? sort.direction : 'NONE'
                  }
                  onChange={(direction) => changeSort('lastName', direction)}
                />
              </EpicCellLayout>
              <Input
                onChange={(event) =>
                  filterChanged('lastName', event.target.value)
                }
              />
            </EpicCellLayout>
          </EpicHeader>
          <EpicHeader
            width={widths.age}
            height={88}
            onResize={(width) => changeSize('age', width)}
          >
            <EpicCellLayout mode="vertical">
              <EpicCellLayout mode="horizontal">
                Age
                <EpicSort
                  direction={sort.column === 'age' ? sort.direction : 'NONE'}
                  onChange={(direction) => changeSort('age', direction)}
                />
              </EpicCellLayout>
              <Input
                onChange={(event) => filterChanged('age', event.target.value)}
              />
            </EpicCellLayout>
          </EpicHeader>
          <EpicHeader
            width={widths.eyeColor}
            height={88}
            onResize={(width) => changeSize('eyeColor', width)}
          >
            <EpicCellLayout mode="vertical">
              <EpicCellLayout mode="horizontal">
                Eye color
                <EpicSort
                  direction={
                    sort.column === 'eyeColor' ? sort.direction : 'NONE'
                  }
                  onChange={(direction) => changeSort('eyeColor', direction)}
                />
              </EpicCellLayout>
              <Input
                type="select"
                onChange={(event) =>
                  filterChanged('eyeColor', event.target.value)
                }
              >
                <option>all</option>
                <option>brown</option>
                <option>green</option>
                <option>blue</option>
              </Input>
            </EpicCellLayout>
          </EpicHeader>
          <EpicHeader
            width={widths.height}
            height={88}
            onResize={(width) => changeSize('height', width)}
          >
            <EpicCellLayout mode="vertical">
              <EpicCellLayout mode="horizontal">
                Height
                <EpicSort
                  direction={sort.column === 'height' ? sort.direction : 'NONE'}
                  onChange={(direction) => changeSort('height', direction)}
                />
              </EpicCellLayout>
              <Input
                onChange={(event) =>
                  filterChanged('height', event.target.value)
                }
              />
            </EpicCellLayout>
          </EpicHeader>
          <EpicHeader
            width={widths.weight}
            height={88}
            onResize={(width) => changeSize('weight', width)}
          >
            <EpicCellLayout mode="vertical">
              <EpicCellLayout mode="horizontal">
                Weight
                <EpicSort
                  direction={sort.column === 'weight' ? sort.direction : 'NONE'}
                  onChange={(direction) => changeSort('weight', direction)}
                />
              </EpicCellLayout>
              <Input
                onChange={(event) =>
                  filterChanged('weight', event.target.value)
                }
              />
            </EpicCellLayout>
          </EpicHeader>
          <EpicHeader
            width={widths.jobTitle}
            height={88}
            onResize={(width) => changeSize('jobTitle', width)}
          >
            <EpicCellLayout mode="vertical">
              <EpicCellLayout mode="horizontal">
                Job title
                <EpicSort
                  direction={
                    sort.column === 'jobTitle' ? sort.direction : 'NONE'
                  }
                  onChange={(direction) => changeSort('jobTitle', direction)}
                />
              </EpicCellLayout>
              <Input
                onChange={(event) =>
                  filterChanged('jobTitle', event.target.value)
                }
              />
            </EpicCellLayout>
          </EpicHeader>
          <EpicHeader
            width={widths.favoriteMovie}
            height={88}
            onResize={(width) => changeSize('favoriteMovie', width)}
          >
            <EpicCellLayout mode="vertical">
              <EpicCellLayout mode="horizontal">
                Favorite movie
                <EpicSort
                  direction={
                    sort.column === 'favoriteMovie' ? sort.direction : 'NONE'
                  }
                  onChange={(direction) =>
                    changeSort('favoriteMovie', direction)
                  }
                />
              </EpicCellLayout>
              <Input />
            </EpicCellLayout>
          </EpicHeader>
          <EpicHeader
            width={widths.favoriteFood}
            height={88}
            onResize={(width) => changeSize('favoriteFood', width)}
          >
            <EpicCellLayout mode="vertical">
              <EpicCellLayout mode="horizontal">
                Favorite food
                <EpicSort
                  direction={
                    sort.column === 'favoriteFood' ? sort.direction : 'NONE'
                  }
                  onChange={(direction) =>
                    changeSort('favoriteFood', direction)
                  }
                />
              </EpicCellLayout>
              <Input
                onChange={(event) =>
                  filterChanged('favoriteFood', event.target.value)
                }
              />
            </EpicCellLayout>
          </EpicHeader>
          <EpicHeader
            width={widths.dateOfBirth}
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
                  onChange={(direction) => changeSort('dateOfBirth', direction)}
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
          <EpicHeader
            width={widths.sex}
            height={88}
            onResize={(width) => changeSize('sex', width)}
          >
            <EpicCellLayout mode="vertical">
              <div className="d-flex w-100 justify-content-between">
                Sex
                <EpicSort
                  direction={sort.column === 'sex' ? sort.direction : 'NONE'}
                  onChange={(direction) => changeSort('sex', direction)}
                />
              </div>
              <Input
                type="select"
                onChange={(event) => filterChanged('sex', event.target.value)}
              >
                <option>all</option>
                <option>male</option>
                <option>female</option>
              </Input>
            </EpicCellLayout>
          </EpicHeader>
          <EpicHeader width={widths.actions} height={88}>
            <div className="px-1 py-1 align-self-start">Actions</div>
          </EpicHeader>
        </EpicRow>

        {pageOfPersons.content.map((person, index) => (
          <Fragment key={person.id}>
            <EpicRow onClick={() => setDetail(index)} tabIndex={0}>
              <EpicCell width={widths.firstName} height={44}>
                <EpicSelection
                  checked={selected.some((p) => p.id === person.id)}
                  onChange={(checked) => onSelect(person, checked)}
                >
                  {person.firstName}
                </EpicSelection>
              </EpicCell>
              <EpicCell width={widths.lastName} height={44}>
                {person.lastName}
              </EpicCell>
              <EpicCell width={widths.age} height={44}>
                {person.age}
              </EpicCell>
              <EpicCell width={widths.eyeColor} height={44}>
                {person.eyeColor}
              </EpicCell>
              <EpicCell width={widths.height} height={44}>
                {person.height}
              </EpicCell>
              <EpicCell width={widths.weight} height={44}>
                {person.weight}
              </EpicCell>
              <EpicCell width={widths.jobTitle} height={44}>
                {person.jobTitle}
              </EpicCell>
              <EpicCell width={widths.favoriteMovie} height={44}>
                {person.favoriteMovie?.name}
              </EpicCell>
              <EpicCell width={widths.favoriteFood} height={44}>
                {person.favoriteFood}
              </EpicCell>
              <EpicCell width={widths.dateOfBirth} height={44}>
                {person.dateOfBirth?.toLocaleDateString()}
              </EpicCell>
              <EpicCell width={widths.sex} height={44}>
                {person.sex}
              </EpicCell>
              <EpicCell width={widths.actions} height={44}>
                <Button
                  icon="delete"
                  color="danger"
                  onClick={action('delete')}
                />
                <Button icon="edit" onClick={action('edit')} />
              </EpicCell>
            </EpicRow>
            <EpicDetailRow active={index === detail} left={300}>
              {() => (
                <EpicDetail onClose={() => setDetail(-1)}>
                  <Row tag="dl">
                    <Col tag="dt" sm={3}>
                      First name
                    </Col>
                    <Col tag="dd" sm={9}>
                      {person.firstName}
                    </Col>

                    <Col tag="dt" sm={3}>
                      Last name
                    </Col>
                    <Col tag="dd" sm={9}>
                      {person.lastName}
                    </Col>

                    <Col tag="dt" sm={3}>
                      Date of birth
                    </Col>
                    <Col tag="dd" sm={9}>
                      {person.dateOfBirth?.toLocaleDateString()}
                    </Col>

                    <Col tag="dt" sm={3}>
                      Sex
                    </Col>
                    <Col tag="dd" sm={9}>
                      {person.sex}
                    </Col>

                    <Col tag="dt" sm={3}>
                      Job title
                    </Col>
                    <Col tag="dd" sm={9}>
                      {person.jobTitle}
                    </Col>

                    <Col tag="dt" sm={3}>
                      Eye color
                    </Col>
                    <Col tag="dd" sm={9}>
                      {person.eyeColor}
                    </Col>

                    <Col tag="dt" sm={3}>
                      Weight
                    </Col>
                    <Col tag="dd" sm={9}>
                      {person.weight}
                    </Col>

                    <Col tag="dt" sm={3}>
                      Height
                    </Col>
                    <Col tag="dd" sm={9}>
                      {person.height}
                    </Col>

                    <Col tag="dt" sm={3}>
                      Favorite food
                    </Col>
                    <Col tag="dd" sm={9}>
                      {person.favoriteFood}
                    </Col>

                    <Col tag="dt" sm={3}>
                      Favorite movie
                    </Col>
                    <Col tag="dd" sm={9}>
                      {person.favoriteMovie?.name}
                    </Col>

                    <Col>
                      <Input defaultValue="This input should have a normal height" />
                    </Col>
                  </Row>
                </EpicDetail>
              )}
            </EpicDetailRow>
          </Fragment>
        ))}
      </EpicTable>

      <div className="d-flex justify-content-center">
        <Pagination className="my-3" page={pageOfPersons} onChange={setPage} />
      </div>
    </Card>
  );
};

export const FullExample = {
  render: FullExampleStory,
  name: 'full example'
};

const BasicExampleStory = () => {
  return (
    <Card body>
      <EpicTable>
        <EpicRow header>
          <EpicHeader width={300} height={44}>
            First name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Last name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Age
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Eye color
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Height
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Weight
          </EpicHeader>
          <EpicHeader width={200} height={44}>
            Job title
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Favorite movie
          </EpicHeader>
          <EpicHeader width={150} height={44}>
            Favorite food
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Birth date
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Sex
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Actions
          </EpicHeader>
        </EpicRow>

        {persons.map((person) => (
          <EpicRow key={person.id}>
            <EpicCell width={300} height={44}>
              {person.firstName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.lastName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.age}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.eyeColor}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.height}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.weight}
            </EpicCell>
            <EpicCell width={200} height={44}>
              {person.jobTitle}
            </EpicCell>
            <EpicCell width={300} height={44}>
              {person.favoriteMovie?.name}
            </EpicCell>
            <EpicCell width={150} height={44}>
              {person.favoriteFood}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.dateOfBirth?.toLocaleDateString()}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.sex}
            </EpicCell>
            <EpicCell width={300} height={44}>
              <Button icon="delete" onClick={action('delete')} />
              <Button icon="edit" onClick={action('edit')} />
            </EpicCell>
          </EpicRow>
        ))}
      </EpicTable>
    </Card>
  );
};

export const BasicExample = {
  render: BasicExampleStory,
  name: 'basic example'
};

const WithRowClickStory = () => {
  function onRowClick(person: Person) {
    alert(`You clicked ${person.firstName} ${person.lastName}`);
  }

  return (
    <Card body>
      <EpicTable>
        <EpicRow header>
          <EpicHeader width={300} height={44}>
            First name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Last name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Age
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Eye color
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Height
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Weight
          </EpicHeader>
          <EpicHeader width={200} height={44}>
            Job title
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Favorite movie
          </EpicHeader>
          <EpicHeader width={150} height={44}>
            Favorite food
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Birth date
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Sex
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Actions
          </EpicHeader>
        </EpicRow>

        {persons.map((person) => (
          <EpicRow key={person.id} onClick={() => onRowClick(person)}>
            <EpicCell width={300} height={44}>
              {person.firstName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.lastName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.age}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.eyeColor}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.height}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.weight}
            </EpicCell>
            <EpicCell width={200} height={44}>
              {person.jobTitle}
            </EpicCell>
            <EpicCell width={300} height={44}>
              {person.favoriteMovie?.name}
            </EpicCell>
            <EpicCell width={150} height={44}>
              {person.favoriteFood}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.dateOfBirth?.toLocaleDateString()}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.sex}
            </EpicCell>
            <EpicCell width={300} height={44}>
              <Button icon="delete" onClick={action('delete')} />
              <Button icon="edit" onClick={action('edit')} />
            </EpicCell>
          </EpicRow>
        ))}
      </EpicTable>
    </Card>
  );
};

export const WithRowClick = {
  render: WithRowClickStory,
  name: 'with row click'
};

const NoStripesStory = () => {
  return (
    <Card body>
      <EpicTable striped={false}>
        <EpicRow header>
          <EpicHeader width={300} height={44}>
            First name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Last name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Age
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Eye color
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Height
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Weight
          </EpicHeader>
          <EpicHeader width={200} height={44}>
            Job title
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Favorite movie
          </EpicHeader>
          <EpicHeader width={150} height={44}>
            Favorite food
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Birth date
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Sex
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Actions
          </EpicHeader>
        </EpicRow>

        {persons.map((person) => (
          <EpicRow key={person.id}>
            <EpicCell width={300} height={44}>
              {person.firstName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.lastName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.age}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.eyeColor}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.height}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.weight}
            </EpicCell>
            <EpicCell width={200} height={44}>
              {person.jobTitle}
            </EpicCell>
            <EpicCell width={300} height={44}>
              {person.favoriteMovie?.name}
            </EpicCell>
            <EpicCell width={150} height={44}>
              {person.favoriteFood}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.dateOfBirth?.toLocaleDateString()}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.sex}
            </EpicCell>
            <EpicCell width={300} height={44}>
              <Button icon="delete" onClick={action('delete')} />
              <Button icon="edit" onClick={action('edit')} />
            </EpicCell>
          </EpicRow>
        ))}
      </EpicTable>
    </Card>
  );
};

export const NoStripes = {
  render: NoStripesStory,
  name: 'no stripes'
};

const SmallExampleStory = () => {
  return (
    <Card body>
      <EpicTable>
        <EpicRow header>
          <EpicHeader width={300} height={44}>
            First name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Last name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Age
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Actions
          </EpicHeader>
        </EpicRow>

        {persons.map((person) => (
          <EpicRow key={person.id}>
            <EpicCell width={300} height={44}>
              {person.firstName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.lastName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.age}
            </EpicCell>
            <EpicCell width={300} height={44}>
              <Button icon="delete" onClick={action('delete')} />
              <Button icon="edit" onClick={action('edit')} />
            </EpicCell>
          </EpicRow>
        ))}
      </EpicTable>
    </Card>
  );
};

export const SmallExample = {
  render: SmallExampleStory,
  name: 'small example'
};

const NoHeaderStory = () => {
  return (
    <Card body>
      <EpicTable>
        {persons.map((person) => (
          <EpicRow key={person.id}>
            <EpicCell width={300} height={44}>
              {person.firstName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.lastName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.age}
            </EpicCell>
            <EpicCell width={300} height={44}>
              <Button icon="delete" onClick={action('delete')} />
              <Button icon="edit" onClick={action('edit')} />
            </EpicCell>
          </EpicRow>
        ))}
      </EpicTable>
    </Card>
  );
};

export const NoHeader = {
  render: NoHeaderStory,
  name: 'no header'
};

const NoRightStory = () => {
  return (
    <Card body>
      <EpicTable hasRight={false}>
        <EpicRow header>
          <EpicHeader width={300} height={44}>
            First name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Last name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Age
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Eye color
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Height
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Weight
          </EpicHeader>
          <EpicHeader width={200} height={44}>
            Job title
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Favorite movie
          </EpicHeader>
          <EpicHeader width={150} height={44}>
            Favorite food
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Birth date
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Sex
          </EpicHeader>
        </EpicRow>

        {persons.map((person) => (
          <EpicRow key={person.id}>
            <EpicCell width={300} height={44}>
              {person.firstName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.lastName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.age}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.eyeColor}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.height}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.weight}
            </EpicCell>
            <EpicCell width={200} height={44}>
              {person.jobTitle}
            </EpicCell>
            <EpicCell width={300} height={44}>
              {person.favoriteMovie?.name}
            </EpicCell>
            <EpicCell width={150} height={44}>
              {person.favoriteFood}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.dateOfBirth?.toLocaleDateString()}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.sex}
            </EpicCell>
          </EpicRow>
        ))}
      </EpicTable>
    </Card>
  );
};

export const NoRight = {
  render: NoRightStory,
  name: 'no right'
};

const WithOverlayStory = () => {
  const [mode, setMode] = useState<ContentStateMode>('loading');
  const [detail, setDetail] = useState(false);

  return (
    <Card body>
      <div className="d-flex mb-2">
        <Button className="me-1" onClick={() => setMode('loading')}>
          Loading
        </Button>
        <Button className="me-1" onClick={() => setMode('empty')}>
          Empty
        </Button>
        <Button className="me-1" onClick={() => setMode('error')}>
          Error
        </Button>
        <Button className="me-1" onClick={() => setMode('no-results')}>
          No results
        </Button>

        <Button
          className="d-inline-block float-end"
          icon="details"
          onClick={() => setDetail(true)}
        >
          Show detail
        </Button>
      </div>

      <EpicTable
        overlay={
          <ContentState
            className="my-5"
            mode={mode}
            title={`In mode ${mode}`}
          />
        }
      >
        <EpicRow header>
          <EpicHeader width={300} height={44}>
            First name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Last name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Age
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Eye color
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Height
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Weight
          </EpicHeader>
          <EpicHeader width={200} height={44}>
            Job title
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Favorite movie
          </EpicHeader>
          <EpicHeader width={150} height={44}>
            Favorite food
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Birth date
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Sex
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Actions
          </EpicHeader>
        </EpicRow>
        <EpicDetailRow active={detail} left={300}>
          {() => (
            <EpicDetail onClose={() => setDetail(false)}>
              <h2>Details</h2>

              <p>
                Details should be shown over the overlay. This allows the user
                to create items when the table is still empty.
              </p>
            </EpicDetail>
          )}
        </EpicDetailRow>
      </EpicTable>
    </Card>
  );
};

export const WithOverlay = {
  render: WithOverlayStory,
  name: 'with overlay'
};

const WithSortStory = () => {
  const [direction, setDirection] = useState<EpicTableSortDirection>('NONE');

  const sortFn =
    direction === 'ASC'
      ? (a, b) => a.firstName.localeCompare(b.firstName)
      : (a, b) => b.firstName.localeCompare(a.firstName);

  persons.sort(sortFn);

  return (
    <Card body>
      <EpicTable>
        <EpicRow header>
          <EpicHeader width={300} height={44}>
            <div className="d-flex w-100 justify-content-between">
              First name
              <EpicSort direction={direction} onChange={setDirection} />
            </div>
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Last name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Age
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Eye color
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Height
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Weight
          </EpicHeader>
          <EpicHeader width={200} height={44}>
            Job title
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Favorite movie
          </EpicHeader>
          <EpicHeader width={150} height={44}>
            Favorite food
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Birth date
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Sex
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Actions
          </EpicHeader>
        </EpicRow>

        {persons.map((person) => (
          <EpicRow key={person.id}>
            <EpicCell width={300} height={44}>
              {person.firstName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.lastName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.age}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.eyeColor}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.height}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.weight}
            </EpicCell>
            <EpicCell width={200} height={44}>
              {person.jobTitle}
            </EpicCell>
            <EpicCell width={300} height={44}>
              {person.favoriteMovie?.name}
            </EpicCell>
            <EpicCell width={150} height={44}>
              {person.favoriteFood}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.dateOfBirth?.toLocaleDateString()}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.sex}
            </EpicCell>
            <EpicCell width={300} height={44}>
              <Button icon="delete" onClick={action('delete')} />
              <Button icon="edit" onClick={action('edit')} />
            </EpicCell>
          </EpicRow>
        ))}
      </EpicTable>
    </Card>
  );
};

export const WithSort = {
  render: WithSortStory,
  name: 'with sort'
};

const WithResizableColumnsStory = () => {
  const [widths, setWidths] = useState(() => ({
    firstName: 300,
    lastName: 100,
    age: 100,
    eyeColor: 100
  }));

  function changeSize(name: keyof Person, width: number) {
    setWidths((widths) => ({ ...widths, [name]: width }));
  }

  return (
    <Card body>
      <EpicTable>
        <EpicRow header>
          <EpicHeader
            width={widths.firstName}
            height={44}
            onResize={(width) => changeSize('firstName', width)}
          >
            First name
          </EpicHeader>
          <EpicHeader
            width={widths.lastName}
            height={44}
            onResize={(width) => changeSize('lastName', width)}
          >
            Last name
          </EpicHeader>
          <EpicHeader
            width={widths.age}
            height={44}
            onResize={(width) => changeSize('age', width)}
          >
            Age
          </EpicHeader>
          <EpicHeader
            width={widths.eyeColor}
            height={44}
            onResize={(width) => changeSize('eyeColor', width)}
          >
            Eye color
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Actions
          </EpicHeader>
        </EpicRow>

        {persons.map((person) => (
          <EpicRow key={person.id}>
            <EpicCell width={widths.firstName} height={44}>
              {person.firstName}
            </EpicCell>
            <EpicCell width={widths.lastName} height={44}>
              {person.lastName}
            </EpicCell>
            <EpicCell width={widths.age} height={44}>
              {person.age}
            </EpicCell>
            <EpicCell width={widths.eyeColor} height={44}>
              {person.eyeColor}
            </EpicCell>
            <EpicCell width={300} height={44}>
              <Button icon="delete" onClick={action('delete')} />
              <Button icon="edit" onClick={action('edit')} />
            </EpicCell>
          </EpicRow>
        ))}
      </EpicTable>
    </Card>
  );
};

export const WithResizableColumns = {
  render: WithResizableColumnsStory,
  name: 'with resizable columns'
};

const MultipleHeadersStory = () => {
  const contactsByLetter = groupBy(persons, (p) => p.lastName[0]);

  const letters = Object.keys(contactsByLetter).sort();

  return (
    <Card body>
      <EpicTable>
        {letters.map((letter) => (
          <Fragment key={letter}>
            <EpicRow header>
              <EpicHeader width={300} height={44}>
                {letter}
              </EpicHeader>
              <EpicHeader width={100} height={44}>
                First name
              </EpicHeader>
              <EpicHeader width={100} height={44}>
                Age
              </EpicHeader>
              <EpicHeader width={100} height={44}>
                Eye color
              </EpicHeader>
              <EpicHeader width={100} height={44}>
                Height
              </EpicHeader>
              <EpicHeader width={100} height={44}>
                Weight
              </EpicHeader>
              <EpicHeader width={200} height={44}>
                Job title
              </EpicHeader>
              <EpicHeader width={300} height={44}>
                Favorite movie
              </EpicHeader>
              <EpicHeader width={150} height={44}>
                Favorite food
              </EpicHeader>
              <EpicHeader width={100} height={44}>
                Birth date
              </EpicHeader>
              <EpicHeader width={100} height={44}>
                Sex
              </EpicHeader>
              <EpicHeader width={300} height={44}>
                Actions
              </EpicHeader>
            </EpicRow>
            {contactsByLetter[letter].map((person) => (
              <EpicRow key={person.id}>
                <EpicCell width={300} height={44}>
                  {person.lastName}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.firstName}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.age}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.eyeColor}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.height}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.weight}
                </EpicCell>
                <EpicCell width={200} height={44}>
                  {person.jobTitle}
                </EpicCell>
                <EpicCell width={300} height={44}>
                  {person.favoriteMovie?.name}
                </EpicCell>
                <EpicCell width={150} height={44}>
                  {person.favoriteFood}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.dateOfBirth?.toLocaleDateString()}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.sex}
                </EpicCell>
                <EpicCell width={300} height={44}>
                  <Button icon="delete" onClick={action('delete')} />
                  <Button icon="edit" onClick={action('edit')} />
                </EpicCell>
              </EpicRow>
            ))}
          </Fragment>
        ))}
      </EpicTable>
    </Card>
  );
};

export const MultipleHeaders = {
  render: MultipleHeadersStory,
  name: 'multiple headers'
};

const SingleColumnStory = () => {
  const contactsByLetter = groupBy(persons, (p) => p.lastName[0]);

  const letters = Object.keys(contactsByLetter).sort();

  return (
    <Card body>
      <EpicTable striped={false}>
        {letters.map((letter) => (
          <Fragment key={letter}>
            <EpicRow header>
              <EpicHeader width={300} height={44}>
                {letter}
              </EpicHeader>
            </EpicRow>
            {contactsByLetter[letter].map((person) => (
              <EpicRow key={person.id}>
                <EpicCell width={300} height={44}>
                  <EpicCellLayout mode="horizontal">
                    {person.lastName}
                    <div>
                      <Button icon="delete" onClick={action('delete')} />
                      <Button icon="edit" onClick={action('edit')} />
                    </div>
                  </EpicCellLayout>
                </EpicCell>
              </EpicRow>
            ))}
          </Fragment>
        ))}
      </EpicTable>
    </Card>
  );
};

export const SingleColumn = {
  render: SingleColumnStory,
  name: 'single column'
};

const WithPaginationStory = () => {
  const [page, setPage] = useState(1);

  const pageOfPersons = pageOf(persons, page, 20);

  return (
    <Card body>
      <EpicTable>
        <EpicRow header>
          <EpicHeader width={300} height={44}>
            First name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Last name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Age
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Eye color
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Height
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Weight
          </EpicHeader>
          <EpicHeader width={200} height={44}>
            Job title
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Favorite movie
          </EpicHeader>
          <EpicHeader width={150} height={44}>
            Favorite food
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Birth date
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Sex
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Actions
          </EpicHeader>
        </EpicRow>

        {pageOfPersons.content.map((person) => (
          <EpicRow key={person.id}>
            <EpicCell width={300} height={44}>
              {person.firstName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.lastName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.age}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.eyeColor}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.height}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.weight}
            </EpicCell>
            <EpicCell width={200} height={44}>
              {person.jobTitle}
            </EpicCell>
            <EpicCell width={300} height={44}>
              {person.favoriteMovie?.name}
            </EpicCell>
            <EpicCell width={150} height={44}>
              {person.favoriteFood}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.dateOfBirth?.toLocaleDateString()}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.sex}
            </EpicCell>
            <EpicCell width={300} height={44}>
              <Button icon="delete" onClick={action('delete')} />
              <Button icon="edit" onClick={action('edit')} />
            </EpicCell>
          </EpicRow>
        ))}
      </EpicTable>

      <div className="d-flex justify-content-center">
        <Pagination className="my-3" page={pageOfPersons} onChange={setPage} />
      </div>
    </Card>
  );
};

export const WithPagination = {
  render: WithPaginationStory,
  name: 'with pagination'
};

const WithExpanderStory = () => {
  const [expanded, setExpanded] = useState(-1);

  return (
    <Card body>
      <EpicTable>
        <EpicRow header>
          <EpicHeader width={300} height={44}>
            First name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Last name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Age
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Eye color
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Height
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Weight
          </EpicHeader>
          <EpicHeader width={200} height={44}>
            Job title
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Favorite movie
          </EpicHeader>
          <EpicHeader width={150} height={44}>
            Favorite food
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Birth date
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Sex
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Actions
          </EpicHeader>
        </EpicRow>

        {persons.map((person, index) => (
          <Fragment key={person.id}>
            <EpicRow>
              <EpicCell width={300} height={44}>
                <EpicCellLayout mode="horizontal">
                  {person.firstName}

                  <EpicExpander
                    open={expanded === index}
                    onChange={(open) => setExpanded(open ? index : -1)}
                  />
                </EpicCellLayout>
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.lastName}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.age}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.eyeColor}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.height}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.weight}
              </EpicCell>
              <EpicCell width={200} height={44}>
                {person.jobTitle}
              </EpicCell>
              <EpicCell width={300} height={44}>
                {person.favoriteMovie?.name}
              </EpicCell>
              <EpicCell width={150} height={44}>
                {person.favoriteFood}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.dateOfBirth?.toLocaleDateString()}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.sex}
              </EpicCell>
              <EpicCell width={300} height={44}>
                <Button icon="delete" onClick={action('delete')} />
                <Button icon="edit" onClick={action('edit')} />
              </EpicCell>
            </EpicRow>
            <EpicExpanderRow active={index === expanded} height={58}>
              {() => (
                <div className="p-1">
                  <Alert className="mb-0" color="danger">
                    You can place any content inside of an `EpicExpanderRow`.
                    This is the row for {person.firstName} {person.lastName}.
                  </Alert>
                </div>
              )}
            </EpicExpanderRow>
          </Fragment>
        ))}
      </EpicTable>
    </Card>
  );
};

export const WithExpander = {
  render: WithExpanderStory,
  name: 'with expander'
};

const WithDetailStory = () => {
  const [detail, setDetail] = useState(-1);

  return (
    <Card body>
      <EpicTable>
        <EpicRow header>
          <EpicHeader width={300} height={44}>
            First name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Last name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Age
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Eye color
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Height
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Weight
          </EpicHeader>
          <EpicHeader width={200} height={44}>
            Job title
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Favorite movie
          </EpicHeader>
          <EpicHeader width={150} height={44}>
            Favorite food
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Birth date
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Sex
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Actions
          </EpicHeader>
        </EpicRow>

        {persons
          .filter((p) => p.firstName === 'Zechs')
          .map((person, index) => (
            <Fragment key={person.id}>
              <EpicRow>
                <EpicCell width={300} height={44}>
                  <span
                    onClick={() => setDetail(index)}
                    className="text-primary clickable"
                  >
                    {person.firstName}
                  </span>
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.lastName}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.age}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.eyeColor}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.height}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.weight}
                </EpicCell>
                <EpicCell width={200} height={44}>
                  {person.jobTitle}
                </EpicCell>
                <EpicCell width={300} height={44}>
                  {person.favoriteMovie?.name}
                </EpicCell>
                <EpicCell width={150} height={44}>
                  {person.favoriteFood}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.dateOfBirth?.toLocaleDateString()}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.sex}
                </EpicCell>
                <EpicCell width={300} height={44}>
                  <Button icon="delete" onClick={action('delete')} />
                  <Button icon="edit" onClick={action('edit')} />
                </EpicCell>
              </EpicRow>
              <EpicDetailRow active={index === detail} left={300}>
                {() => (
                  <EpicDetail onClose={() => setDetail(-1)}>
                    <Row tag="dl">
                      <Col tag="dt" sm={3}>
                        First name
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.firstName}
                      </Col>

                      <Col tag="dt" sm={3}>
                        Last name
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.lastName}
                      </Col>

                      <Col tag="dt" sm={3}>
                        Date of birth
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.dateOfBirth?.toLocaleDateString()}
                      </Col>

                      <Col tag="dt" sm={3}>
                        Sex
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.sex}
                      </Col>

                      <Col tag="dt" sm={3}>
                        Job title
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.jobTitle}
                      </Col>

                      <Col tag="dt" sm={3}>
                        Eye color
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.eyeColor}
                      </Col>

                      <Col tag="dt" sm={3}>
                        Weight
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.weight}
                      </Col>

                      <Col tag="dt" sm={3}>
                        Height
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.height}
                      </Col>

                      <Col tag="dt" sm={3}>
                        Favorite food
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.favoriteFood}
                      </Col>

                      <Col tag="dt" sm={3}>
                        Favorite movie
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.favoriteMovie?.name}
                      </Col>

                      <p className="p-5">
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Dignissimos assumenda doloribus earum quidem
                        consequuntur. Eligendi necessitatibus vero tenetur quo
                        dolorem, nesciunt reprehenderit, rerum ea modi, suscipit
                        porro maiores nostrum atque.
                      </p>

                      <p className="p-5">
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Dignissimos assumenda doloribus earum quidem
                        consequuntur. Eligendi necessitatibus vero tenetur quo
                        dolorem, nesciunt reprehenderit, rerum ea modi, suscipit
                        porro maiores nostrum atque.
                      </p>
                    </Row>
                  </EpicDetail>
                )}
              </EpicDetailRow>
            </Fragment>
          ))}
      </EpicTable>
    </Card>
  );
};

export const WithDetail = {
  render: WithDetailStory,
  name: 'with detail'
};

const WithDetailButSmallStory = () => {
  const [detail, setDetail] = useState(-1);

  return (
    <Card body>
      <EpicTable>
        <EpicRow header>
          <EpicHeader width={300} height={44}>
            First name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Last name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Age
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Eye color
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Height
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Weight
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Actions
          </EpicHeader>
        </EpicRow>

        {persons
          .filter((p) => p.firstName === 'Zechs')
          .map((person, index) => (
            <Fragment key={person.id}>
              <EpicRow>
                <EpicCell width={300} height={44}>
                  <span
                    onClick={() => setDetail(index)}
                    className="text-primary clickable"
                  >
                    {person.firstName}
                  </span>
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.lastName}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.age}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.eyeColor}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.height}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.weight}
                </EpicCell>
                <EpicCell width={300} height={44}>
                  <Button icon="delete" onClick={action('delete')} />
                  <Button icon="edit" onClick={action('edit')} />
                </EpicCell>
              </EpicRow>
              <EpicDetailRow active={index === detail} left={300}>
                {() => (
                  <EpicDetail onClose={() => setDetail(-1)}>
                    <MoreOrLess
                      content={persons.map((p) => (
                        <p key={p.id}>{p.firstName}</p>
                      ))}
                      limit={3}
                    />
                  </EpicDetail>
                )}
              </EpicDetailRow>
            </Fragment>
          ))}
      </EpicTable>
    </Card>
  );
};

export const WithDetailButSmall = {
  render: WithDetailButSmallStory,
  name: 'with detail but small'
};

const WithSelectionStory = () => {
  const [page, setPage] = useState(1);

  const pageOfPersons = pageOf(persons, page, 20);

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

  const allPersonsSelected =
    selected.length > 0 &&
    pageOfPersons.content.every((p) => selected.some((ps) => ps.id === p.id));

  function selectAllClicked(checked: boolean) {
    if (checked) {
      pageOfPersons.content.forEach((p) => {
        if (selected.every((ps) => p.id !== ps.id)) {
          selected.push(p);
        }

        setSelected([...selected]);
      });
    } else {
      setSelected([]);
    }
  }

  return (
    <Card body>
      {selected.length > 0 ? (
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
      ) : null}

      <EpicTable>
        <EpicRow header>
          <EpicHeader width={300} height={44}>
            <EpicSelection
              checked={allPersonsSelected}
              onChange={(checked) => selectAllClicked(checked)}
            >
              First name
            </EpicSelection>
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Last name
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Age
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Eye color
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Height
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Weight
          </EpicHeader>
          <EpicHeader width={200} height={44}>
            Job title
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Favorite movie
          </EpicHeader>
          <EpicHeader width={150} height={44}>
            Favorite food
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Birth date
          </EpicHeader>
          <EpicHeader width={100} height={44}>
            Sex
          </EpicHeader>
          <EpicHeader width={300} height={44}>
            Actions
          </EpicHeader>
        </EpicRow>

        {pageOfPersons.content.map((person) => (
          <EpicRow key={person.id}>
            <EpicCell width={300} height={44}>
              <EpicSelection
                checked={selected.some((p) => p.id === person.id)}
                onChange={(checked) => onSelect(person, checked)}
              >
                {person.firstName}
              </EpicSelection>
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.lastName}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.age}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.eyeColor}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.height}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.weight}
            </EpicCell>
            <EpicCell width={200} height={44}>
              {person.jobTitle}
            </EpicCell>
            <EpicCell width={300} height={44}>
              {person.favoriteMovie?.name}
            </EpicCell>
            <EpicCell width={150} height={44}>
              {person.favoriteFood}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.dateOfBirth?.toLocaleDateString()}
            </EpicCell>
            <EpicCell width={100} height={44}>
              {person.sex}
            </EpicCell>
            <EpicCell width={300} height={44}>
              <Button icon="delete" onClick={action('delete')} />
              <Button icon="edit" onClick={action('edit')} />
            </EpicCell>
          </EpicRow>
        ))}
      </EpicTable>

      <div className="d-flex justify-content-center">
        <Pagination className="my-3" page={pageOfPersons} onChange={setPage} />
      </div>
    </Card>
  );
};

export const WithSelection = {
  render: WithSelectionStory,
  name: 'with selection'
};
