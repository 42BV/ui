import React, { Fragment, useState, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import { Card, Alert, Row, Col, Input } from 'reactstrap';
import { groupBy, every, startsWith, lowerCase } from 'lodash';

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

import { Direction } from './types';
import {
  Tag,
  Pagination,
  DateTimeInput,
  Button,
  ContentState,
  ContentStateMode,
  pageOf
} from '../..';
import moment from 'moment';

storiesOf('table|EpicTable', module)
  .addParameters({ component: EpicTable })
  .add('full example', () => {
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
      birthDate: 200,
      sex: 200,
      actions: 300
    }));

    function changeSize(name: keyof Person, width: number) {
      setWidths(widths => ({ ...widths, [name]: width }));
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
      birthDate: '',
      sex: ''
    }));

    function filterChanged(name: keyof Person, value: string) {
      setFilters({ ...filters, [name]: value });
    }

    const filteredPersons = persons.filter(person => {
      return every(filters, (value, key) => {
        const text = person[key];

        if (!value || value === 'all') {
          return true;
        }

        return startsWith(lowerCase(text), lowerCase(value));
      });
    });

    const [sort, setSort] = useState<{
      direction: Direction;
      column: string;
    }>({ direction: 'NONE', column: 'firstName' });

    function changeSort(column: keyof Person, direction: Direction) {
      setPage(1);
      setSort({ direction, column });
    }

    const sortFn =
      sort.direction === 'ASC'
        ? (a, b) => `${a[sort.column]}`.localeCompare(`${b[sort.column]}`)
        : (a, b) => `${b[sort.column]}`.localeCompare(`${a[sort.column]}`);

    const sortedPersons = filteredPersons.sort(sortFn);

    const [page, setPage] = useState(1);

    const pageOfPersons = pageOf(sortedPersons, page, 20);

    const [selected, setSelected] = useState<Person[]>([]);

    function onSelect(person: Person, checked: boolean) {
      if (checked) {
        selected.push(person);
        setSelected([...selected]);
      } else {
        const nextSelected = selected.filter(p => p.id !== person.id);

        setSelected(nextSelected);
      }
    }

    const allPersonsSelected =
      selected.length > 0 &&
      pageOfPersons.content.every(p => selected.some(ps => ps.id === p.id));

    function selectAllClicked(checked: boolean) {
      if (checked) {
        pageOfPersons.content.forEach(p => {
          if (selected.every(ps => p.id !== ps.id)) {
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
            <h2>Selected</h2>
            <div className="mb-3">
              {selected.map(person => (
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
              onResize={width => changeSize('firstName', width)}
            >
              <EpicCellLayout mode="vertical">
                <EpicCellLayout mode="horizontal">
                  <EpicSelection
                    checked={allPersonsSelected}
                    onChange={checked => selectAllClicked(checked)}
                  >
                    First name
                  </EpicSelection>

                  <EpicSort
                    direction={
                      sort.column === 'firstName' ? sort.direction : 'NONE'
                    }
                    onChange={direction => changeSort('firstName', direction)}
                  />
                </EpicCellLayout>
                <Input
                  onChange={event => {
                    event.preventDefault();
                    filterChanged('firstName', event.target.value);
                  }}
                />
              </EpicCellLayout>
            </EpicHeader>
            <EpicHeader
              width={widths.lastName}
              height={88}
              onResize={width => changeSize('lastName', width)}
            >
              <EpicCellLayout mode="vertical">
                <EpicCellLayout mode="horizontal">
                  Last name
                  <EpicSort
                    direction={
                      sort.column === 'lastName' ? sort.direction : 'NONE'
                    }
                    onChange={direction => changeSort('lastName', direction)}
                  />
                </EpicCellLayout>
                <Input
                  onChange={event =>
                    filterChanged('lastName', event.target.value)
                  }
                />
              </EpicCellLayout>
            </EpicHeader>
            <EpicHeader
              width={widths.age}
              height={88}
              onResize={width => changeSize('age', width)}
            >
              <EpicCellLayout mode="vertical">
                <EpicCellLayout mode="horizontal">
                  Age
                  <EpicSort
                    direction={sort.column === 'age' ? sort.direction : 'NONE'}
                    onChange={direction => changeSort('age', direction)}
                  />
                </EpicCellLayout>
                <Input
                  onChange={event => filterChanged('age', event.target.value)}
                />
              </EpicCellLayout>
            </EpicHeader>
            <EpicHeader
              width={widths.eyeColor}
              height={88}
              onResize={width => changeSize('eyeColor', width)}
            >
              <EpicCellLayout mode="vertical">
                <EpicCellLayout mode="horizontal">
                  Eye color
                  <EpicSort
                    direction={
                      sort.column === 'eyeColor' ? sort.direction : 'NONE'
                    }
                    onChange={direction => changeSort('eyeColor', direction)}
                  />
                </EpicCellLayout>
                <Input
                  type="select"
                  onChange={event =>
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
              onResize={width => changeSize('height', width)}
            >
              <EpicCellLayout mode="vertical">
                <EpicCellLayout mode="horizontal">
                  Height
                  <EpicSort
                    direction={
                      sort.column === 'height' ? sort.direction : 'NONE'
                    }
                    onChange={direction => changeSort('height', direction)}
                  />
                </EpicCellLayout>
                <Input
                  onChange={event =>
                    filterChanged('height', event.target.value)
                  }
                />
              </EpicCellLayout>
            </EpicHeader>
            <EpicHeader
              width={widths.weight}
              height={88}
              onResize={width => changeSize('weight', width)}
            >
              <EpicCellLayout mode="vertical">
                <EpicCellLayout mode="horizontal">
                  Weight
                  <EpicSort
                    direction={
                      sort.column === 'weight' ? sort.direction : 'NONE'
                    }
                    onChange={direction => changeSort('weight', direction)}
                  />
                </EpicCellLayout>
                <Input
                  onChange={event =>
                    filterChanged('weight', event.target.value)
                  }
                />
              </EpicCellLayout>
            </EpicHeader>
            <EpicHeader
              width={widths.jobTitle}
              height={88}
              onResize={width => changeSize('jobTitle', width)}
            >
              <EpicCellLayout mode="vertical">
                <EpicCellLayout mode="horizontal">
                  Job title
                  <EpicSort
                    direction={
                      sort.column === 'jobTitle' ? sort.direction : 'NONE'
                    }
                    onChange={direction => changeSort('jobTitle', direction)}
                  />
                </EpicCellLayout>
                <Input
                  onChange={event =>
                    filterChanged('jobTitle', event.target.value)
                  }
                />
              </EpicCellLayout>
            </EpicHeader>
            <EpicHeader
              width={widths.favoriteMovie}
              height={88}
              onResize={width => changeSize('favoriteMovie', width)}
            >
              <EpicCellLayout mode="vertical">
                <EpicCellLayout mode="horizontal">
                  Favorite movie
                  <EpicSort
                    direction={
                      sort.column === 'favoriteMovie' ? sort.direction : 'NONE'
                    }
                    onChange={direction =>
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
              onResize={width => changeSize('favoriteFood', width)}
            >
              <EpicCellLayout mode="vertical">
                <EpicCellLayout mode="horizontal">
                  Favorite food
                  <EpicSort
                    direction={
                      sort.column === 'favoriteFood' ? sort.direction : 'NONE'
                    }
                    onChange={direction =>
                      changeSort('favoriteFood', direction)
                    }
                  />
                </EpicCellLayout>
                <Input
                  onChange={event =>
                    filterChanged('favoriteFood', event.target.value)
                  }
                />
              </EpicCellLayout>
            </EpicHeader>
            <EpicHeader
              width={widths.birthDate}
              height={88}
              onResize={width => changeSize('birthDate', width)}
            >
              <EpicCellLayout mode="vertical">
                <EpicCellLayout mode="horizontal">
                  Birth date
                  <EpicSort
                    direction={
                      sort.column === 'birthDate' ? sort.direction : 'NONE'
                    }
                    onChange={direction => changeSort('birthDate', direction)}
                  />
                </EpicCellLayout>

                <DateTimeInput
                  id="birthdate"
                  dateFormat="YYYY-MM-DD"
                  placeholder="YYYY-MM-DD"
                  timeFormat={false}
                  onChange={date =>
                    filterChanged(
                      'birthDate',
                      date ? moment(date).format('YYYY-MM-DD') : ''
                    )
                  }
                />
              </EpicCellLayout>
            </EpicHeader>
            <EpicHeader
              width={widths.sex}
              height={88}
              onResize={width => changeSize('sex', width)}
            >
              <EpicCellLayout mode="vertical">
                <div className="d-flex w-100 justify-content-between">
                  Sex
                  <EpicSort
                    direction={sort.column === 'sex' ? sort.direction : 'NONE'}
                    onChange={direction => changeSort('sex', direction)}
                  />
                </div>
                <Input
                  type="select"
                  onChange={event => filterChanged('sex', event.target.value)}
                >
                  <option>all</option>
                  <option>male</option>
                  <option>female</option>
                </Input>
              </EpicCellLayout>
            </EpicHeader>
            <EpicHeader width={300} height={88}>
              <div className="px-1 py-1 align-self-start">Actions</div>
            </EpicHeader>
          </EpicRow>

          {pageOfPersons.content.map((person, index) => (
            <Fragment key={person.id}>
              <EpicRow>
                <EpicCell width={widths.firstName} height={44}>
                  <EpicSelection
                    checked={selected.some(p => p.id === person.id)}
                    onChange={checked => onSelect(person, checked)}
                  />

                  <span
                    className="text-primary clickable w-100"
                    onClick={() => setDetail(index)}
                  >
                    {person.firstName}
                  </span>
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
                  {person.favoriteMovie}
                </EpicCell>
                <EpicCell width={widths.favoriteFood} height={44}>
                  {person.favoriteFood}
                </EpicCell>
                <EpicCell width={widths.birthDate} height={44}>
                  {person.birthDate}
                </EpicCell>
                <EpicCell width={widths.sex} height={44}>
                  {person.sex}
                </EpicCell>
                <EpicCell width={widths.actions} height={44}>
                  <Button icon="delete" /> <Button icon="edit" />
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
                        Birthdate
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.birthDate}
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
                        Favorite move
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.favoriteMovie}
                      </Col>

                      <Col>
                        <Input value="This input should have a normal height" />
                      </Col>
                    </Row>
                  </EpicDetail>
                )}
              </EpicDetailRow>
            </Fragment>
          ))}
        </EpicTable>

        <div className="d-flex justify-content-center">
          <Pagination
            className="my-3"
            page={pageOfPersons}
            onChange={setPage}
          ></Pagination>
        </div>
      </Card>
    );
  })
  .add('basic example', () => {
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

          {persons.map(person => (
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
                {person.favoriteMovie}
              </EpicCell>
              <EpicCell width={150} height={44}>
                {person.favoriteFood}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.birthDate}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.sex}
              </EpicCell>
              <EpicCell width={300} height={44}>
                <Button icon="delete" /> <Button icon="edit" />
              </EpicCell>
            </EpicRow>
          ))}
        </EpicTable>
      </Card>
    );
  })
  .add('no stipes', () => {
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

          {persons.map(person => (
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
                {person.favoriteMovie}
              </EpicCell>
              <EpicCell width={150} height={44}>
                {person.favoriteFood}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.birthDate}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.sex}
              </EpicCell>
              <EpicCell width={300} height={44}>
                <Button icon="delete" /> <Button icon="edit" />
              </EpicCell>
            </EpicRow>
          ))}
        </EpicTable>
      </Card>
    );
  })
  .add('small example', () => {
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

          {persons.map(person => (
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
                <Button icon="delete" /> <Button icon="edit" />
              </EpicCell>
            </EpicRow>
          ))}
        </EpicTable>
      </Card>
    );
  })
  .add('no header', () => {
    return (
      <Card body>
        <EpicTable>
          {persons.map(person => (
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
                <Button icon="delete" /> <Button icon="edit" />
              </EpicCell>
            </EpicRow>
          ))}
        </EpicTable>
      </Card>
    );
  })
  .add('no right', () => {
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

          {persons.map(person => (
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
                {person.favoriteMovie}
              </EpicCell>
              <EpicCell width={150} height={44}>
                {person.favoriteFood}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.birthDate}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.sex}
              </EpicCell>
            </EpicRow>
          ))}
        </EpicTable>
      </Card>
    );
  })
  .add('with overlay', () => {
    const [mode, setMode] = useState<ContentStateMode>('loading');
    const [detail, setDetail] = useState(false);

    return (
      <Card body>
        <div className="d-flex mb-2">
          <Button className="mr-1" onClick={() => setMode('loading')}>
            Loading
          </Button>
          <Button className="mr-1" onClick={() => setMode('empty')}>
            Empty
          </Button>
          <Button className="mr-1" onClick={() => setMode('error')}>
            Error
          </Button>
          <Button className="mr-1" onClick={() => setMode('no-results')}>
            No results
          </Button>

          <Button
            className="d-inline-block float-right"
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
  })
  .add('with sort', () => {
    const [direction, setDirection] = useState<Direction>('NONE');

    const sortFn =
      direction === 'ASC'
        ? (a, b) => a.firstName.localeCompare(b.firstName)
        : (a, b) => b.firstName.localeCompare(a.firstName);

    const sortedPersons = persons.sort(sortFn);

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

          {sortedPersons.map(person => (
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
                {person.favoriteMovie}
              </EpicCell>
              <EpicCell width={150} height={44}>
                {person.favoriteFood}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.birthDate}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.sex}
              </EpicCell>
              <EpicCell width={300} height={44}>
                <Button icon="delete" /> <Button icon="edit" />
              </EpicCell>
            </EpicRow>
          ))}
        </EpicTable>
      </Card>
    );
  })
  .add('with resizable columns', () => {
    const [widths, setWidths] = useState(() => ({
      firstName: 300,
      lastName: 100,
      age: 100,
      eyeColor: 100
    }));

    function changeSize(name: keyof Person, width: number) {
      setWidths(widths => ({ ...widths, [name]: width }));
    }

    return (
      <Card body>
        <EpicTable>
          <EpicRow header>
            <EpicHeader
              width={widths.firstName}
              height={44}
              onResize={width => changeSize('firstName', width)}
            >
              First name
            </EpicHeader>
            <EpicHeader
              width={widths.lastName}
              height={44}
              onResize={width => changeSize('lastName', width)}
            >
              Last name
            </EpicHeader>
            <EpicHeader
              width={widths.age}
              height={44}
              onResize={width => changeSize('age', width)}
            >
              Age
            </EpicHeader>
            <EpicHeader
              width={widths.eyeColor}
              height={44}
              onResize={width => changeSize('eyeColor', width)}
            >
              Eye color
            </EpicHeader>
            <EpicHeader width={300} height={44}>
              Actions
            </EpicHeader>
          </EpicRow>

          {persons.map(person => (
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
                <Button icon="delete" /> <Button icon="edit" />
              </EpicCell>
            </EpicRow>
          ))}
        </EpicTable>
      </Card>
    );
  })
  .add('multiple headers', () => {
    const contactsByLetter = groupBy(persons, p => p.lastName[0]);

    const letters = Object.keys(contactsByLetter).sort();

    return (
      <Card body>
        <EpicTable>
          {letters.map(letter => (
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
              {contactsByLetter[letter].map(person => (
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
                    {person.favoriteMovie}
                  </EpicCell>
                  <EpicCell width={150} height={44}>
                    {person.favoriteFood}
                  </EpicCell>
                  <EpicCell width={100} height={44}>
                    {person.birthDate}
                  </EpicCell>
                  <EpicCell width={100} height={44}>
                    {person.sex}
                  </EpicCell>
                  <EpicCell width={300} height={44}>
                    <Button icon="delete" /> <Button icon="edit" />
                  </EpicCell>
                </EpicRow>
              ))}
            </Fragment>
          ))}
        </EpicTable>
      </Card>
    );
  })
  .add('single column', () => {
    const contactsByLetter = groupBy(persons, p => p.lastName[0]);

    const letters = Object.keys(contactsByLetter).sort();

    return (
      <Card body>
        <EpicTable striped={false}>
          {letters.map(letter => (
            <Fragment key={letter}>
              <EpicRow header>
                <EpicHeader width={300} height={44}>
                  {letter}
                </EpicHeader>
              </EpicRow>
              {contactsByLetter[letter].map(person => (
                <EpicRow key={person.id}>
                  <EpicCell width={300} height={44}>
                    <EpicCellLayout mode="horizontal">
                      {person.lastName}
                      <div>
                        <Button icon="delete" /> <Button icon="edit" />
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
  })
  .add('with pagination', () => {
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

          {pageOfPersons.content.map(person => (
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
                {person.favoriteMovie}
              </EpicCell>
              <EpicCell width={150} height={44}>
                {person.favoriteFood}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.birthDate}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.sex}
              </EpicCell>
              <EpicCell width={300} height={44}>
                <Button icon="delete" /> <Button icon="edit" />
              </EpicCell>
            </EpicRow>
          ))}
        </EpicTable>

        <div className="d-flex justify-content-center">
          <Pagination
            className="my-3"
            page={pageOfPersons}
            onChange={setPage}
          ></Pagination>
        </div>
      </Card>
    );
  })
  .add('with expander', () => {
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
                      onChange={open => setExpanded(open ? index : -1)}
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
                  {person.favoriteMovie}
                </EpicCell>
                <EpicCell width={150} height={44}>
                  {person.favoriteFood}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.birthDate}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.sex}
                </EpicCell>
                <EpicCell width={300} height={44}>
                  <Button icon="delete" /> <Button icon="edit" />
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
  })
  .add('with detail', () => {
    const [detail, setDetail] = useState(-1);

    return (
      <Card body>
        <EpicTable minHeight={800}>
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
                  {person.favoriteMovie}
                </EpicCell>
                <EpicCell width={150} height={44}>
                  {person.favoriteFood}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.birthDate}
                </EpicCell>
                <EpicCell width={100} height={44}>
                  {person.sex}
                </EpicCell>
                <EpicCell width={300} height={44}>
                  <Button icon="delete" /> <Button icon="edit" />
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
                        Birthdate
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.birthDate}
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
                        Favorite move
                      </Col>
                      <Col tag="dd" sm={9}>
                        {person.favoriteMovie}
                      </Col>
                    </Row>
                  </EpicDetail>
                )}
              </EpicDetailRow>
            </Fragment>
          ))}
        </EpicTable>
      </Card>
    );
  })
  .add('with selection', () => {
    const [page, setPage] = useState(1);

    const pageOfPersons = pageOf(persons, page, 20);

    const [selected, setSelected] = useState<Person[]>([]);

    function onSelect(person: Person, checked: boolean) {
      if (checked) {
        selected.push(person);
        setSelected([...selected]);
      } else {
        const nextSelected = selected.filter(p => p.id !== person.id);

        setSelected(nextSelected);
      }
    }

    const allPersonsSelected =
      selected.length > 0 &&
      pageOfPersons.content.every(p => selected.some(ps => ps.id === p.id));

    function selectAllClicked(checked: boolean) {
      if (checked) {
        pageOfPersons.content.forEach(p => {
          if (selected.every(ps => p.id !== ps.id)) {
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
              {selected.map(person => (
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
                onChange={checked => selectAllClicked(checked)}
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

          {pageOfPersons.content.map(person => (
            <EpicRow key={person.id}>
              <EpicCell width={300} height={44}>
                <EpicSelection
                  checked={selected.some(p => p.id === person.id)}
                  onChange={checked => onSelect(person, checked)}
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
                {person.favoriteMovie}
              </EpicCell>
              <EpicCell width={150} height={44}>
                {person.favoriteFood}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.birthDate}
              </EpicCell>
              <EpicCell width={100} height={44}>
                {person.sex}
              </EpicCell>
              <EpicCell width={300} height={44}>
                <Button icon="delete" /> <Button icon="edit" />
              </EpicCell>
            </EpicRow>
          ))}
        </EpicTable>

        <div className="d-flex justify-content-center">
          <Pagination
            className="my-3"
            page={pageOfPersons}
            onChange={setPage}
          ></Pagination>
        </div>
      </Card>
    );
  });

interface Person {
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
  birthDate: string;
  sex: string;
}

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
    birthDate: '2014-09-24',
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
    favoriteMovie: 'Fear and loathing in Las Vegas',
    favoriteFood: 'Spaghetti',
    birthDate: '2000-09-24',
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
    favoriteMovie: 'Lord of the Rings',
    favoriteFood: 'French Fries',
    birthDate: '2014-09-24',
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
    favoriteMovie: 'Star Trek',
    favoriteFood: 'Kosher',
    birthDate: '1900-09-24',
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
    favoriteMovie: 'Taxi',
    favoriteFood:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, at nam alias ad culpa quae deleniti. Autem eveniet mollitia veritatis reprehenderit ea, tempora vero voluptatem. Dolore repudiandae voluptate quam quidem.,',
    birthDate: '2014-09-24',
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
    favoriteMovie: 'Driving miss Daisy',
    favoriteFood: 'Prunes',
    birthDate: '1940-09-24',
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
    favoriteMovie: 'Driving miss Daisy',
    favoriteFood: 'Prunes',
    birthDate: '1938-09-24',
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
    favoriteMovie: 'Gundam wing',
    favoriteFood: 'Applepie',
    birthDate: '2010-09-24',
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
    favoriteMovie: 'Guyver',
    favoriteFood: 'Snakes',
    birthDate: '1960-09-24',
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
    jobTitle: 'Captian',
    favoriteMovie: 'Star Trek',
    favoriteFood: 'Replicated',
    birthDate: '2100-09-24',
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
    favoriteMovie: 'Not without my daughter',
    favoriteFood: 'Pears',
    birthDate: '1989-09-24',
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
    favoriteMovie: 'The Gardner',
    favoriteFood: 'Cauliflower',
    birthDate: '2019-09-24',
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
    favoriteMovie: 'Halloween',
    favoriteFood: 'Cake',
    birthDate: '1980-09-24',
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
    favoriteMovie: 'Highlander',
    favoriteFood: 'Icecream',
    birthDate: '1980-09-24',
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
    favoriteMovie: 'Search for Spock',
    favoriteFood: 'Jamba',
    birthDate: '2200-09-24',
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
    favoriteMovie: 'Wrath of Khan',
    favoriteFood: 'Coffee',
    birthDate: '2240-09-24',
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
    favoriteMovie: 'Next generation',
    favoriteFood: 'Tea Earl Grey Hot',
    birthDate: '2200-09-24',
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
    favoriteMovie: 'Spider-man',
    favoriteFood: 'Webs',
    birthDate: '1990-09-24',
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
    favoriteMovie: 'Superman returns',
    favoriteFood: 'Kryptonite',
    birthDate: '1960-01-01',
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
    favoriteMovie: 'Batman begins',
    favoriteFood: 'Bats',
    birthDate: '1955-01-01',
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
    favoriteMovie: 'Wonderwoman',
    favoriteFood: 'Greek',
    birthDate: '1990-01-01',
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
    favoriteMovie: 'Ironman',
    favoriteFood: 'Shoarma',
    birthDate: '1980-01-01',
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
    favoriteMovie: 'Winter soldier',
    favoriteFood: 'Applepie',
    birthDate: '1920-01-01',
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
    favoriteMovie: 'Avengers',
    favoriteFood: 'Stroganov',
    birthDate: '1995-01-01',
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
    favoriteMovie: 'The Incredible Hulk',
    favoriteFood: 'Gammarays',
    birthDate: '1975-01-01',
    sex: 'male'
  }
];
