import React, { useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { Alert, Card } from 'reactstrap';
import { random, uniq } from 'lodash';

import { EpicTable } from '../EpicTable/EpicTable';
import { EpicRow } from '../EpicTable/rows/EpicRow/EpicRow';
import { EpicHeader } from '../EpicTable/cells/EpicHeader/EpicHeader';

import { JarbInput } from '../../form/Input/Input';
import { JarbDateTimeInput } from '../../form/DateTimeInput/DateTimeInput';
import { JarbRadioGroup } from '../../form/RadioGroup/RadioGroup';
import { JarbSelect } from '../../form/Select/Select';
import { JarbModalPickerSingle } from '../../form/ModalPicker/single/ModalPickerSingle';
import { pageOf } from '../../utilities/page/page';
import { EpicForm } from '../EpicTable/cells/EpicForm/EpicForm';
import { EpicCell } from '../EpicTable/cells/EpicCell/EpicCell';
import { EpicFormCell } from '../EpicTable/cells/EpicFormCell/EpicFormCell';
import { Button } from '../../core/buttons/Button/Button';
import { Loading } from '../../core/Loading/Loading';
import { FormButton } from '../../form/FormButton/FormButton';
import { FormApi } from 'final-form';
import { ConfirmButton } from '../../core/ConfirmButton/ConfirmButton';
import { FlashMessage } from '../../core/FlashMessage/FlashMessage';
import { OpenCloseModal, Pagination } from '../../index';
import { emptyPage, Page } from '@42.nl/spring-connect/lib';
import { FormSpy } from 'react-final-form';
import { Movie, Person, persons, sleep } from '../../story-utils';

storiesOf('table/FormTable', module)
  .addParameters({ component: EpicForm })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>
          To be able to use EpicForm, you have to add lodash to your
          dependencies:
        </p>
        <code>npm install --save lodash</code>
      </Alert>
      <Alert color="warning" className="mb-4">
        <p>
          To be able to use EpicForm with Page, you have to add
          @42.nl/spring-connect to your dependencies:
        </p>
        <code>npm install --save @42.nl/spring-connect</code>
      </Alert>
      <Story />
    </>
  ))
  .add('basic example', () => {
    const [newPerson] = useState<Person>({
      id: Math.random(),
      firstName: '',
      lastName: '',
      age: 0,
      eyeColor: '',
      height: 0,
      weight: 0,
      jobTitle: '',
      favoriteMovie: undefined,
      favoriteFood: '',
      dateOfBirth: undefined,
      sex: ''
    });

    const [page, setPage] = useState(1);
    const [newPage, setNewPage] = useState<number>();
    const [personsList, setPersonsList] = useState(persons);
    const [pageOfPersons, setPageOfPersons] = useState<Page<Person>>(
      emptyPage<Person>()
    );
    const [loading, setLoading] = useState<Person>();
    const [dirtyPersons, setDirtyPersons] = useState<{ [id: number]: boolean }>(
      {}
    );
    const [flashMessage, setFlashMessage] = useState<string>();

    useEffect(() => {
      const p = pageOf<Person>(personsList, page, 10);
      p.content.push({ ...newPerson });
      setDirtyPersons({});
      setPageOfPersons(p);
    }, [personsList, newPerson, page]);

    useEffect(() => {
      const timeout = window.setTimeout(() => setFlashMessage(undefined), 5000);
      return () => {
        window.clearTimeout(timeout);
      };
    }, [flashMessage]);

    async function onSubmit(data: Person, form: FormApi<Person>) {
      setLoading(data);
      await sleep(random(200, 1000));
      const person = { ...data };
      if (data.id === newPerson.id) {
        person.id = Math.random();
        setPersonsList([...personsList, person]);
      } else {
        setPersonsList(
          personsList.map((p) => {
            return p.id === person.id ? person : p;
          })
        );
      }
      setFlashMessage('Person saved successfully!');
      window.setTimeout(
        () => form.reset(data.id === newPerson.id ? newPerson : person),
        1
      );
      setLoading(undefined);
    }

    async function deletePerson(person: Person) {
      setLoading(person);
      await sleep(random(200, 1000));
      setPersonsList(personsList.filter((p) => p.id !== person.id));
      setLoading(undefined);
      setFlashMessage('Person deleted successfully!');
    }

    function setPersonDirty(isPristine: boolean, person: Person) {
      if (!isPristine) {
        if (!dirtyPersons[person.id]) {
          setDirtyPersons({ ...dirtyPersons, [person.id]: true });
        }
      } else if (dirtyPersons[person.id]) {
        setDirtyPersons({ ...dirtyPersons, [person.id]: false });
      }
    }

    function confirmPage(pageNumber: number) {
      if (Object.values(dirtyPersons).some((d) => d)) {
        setNewPage(pageNumber);
      } else {
        setPage(pageNumber);
      }
    }

    return (
      <Card body>
        {flashMessage ? (
          <FlashMessage
            onClose={() => setFlashMessage(undefined)}
            color="success"
          >
            {flashMessage}
          </FlashMessage>
        ) : null}
        <EpicTable hasRight={false}>
          <EpicRow header>
            <EpicHeader width={300} height={44}>
              Actions
            </EpicHeader>
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
            <EpicHeader width={300} height={44}>
              Birth date
            </EpicHeader>
            <EpicHeader width={200} height={44}>
              Sex
            </EpicHeader>
          </EpicRow>
          {pageOfPersons.content.map((person) => (
            <EpicRow key={person.id}>
              <EpicCell width={300} height={52}>
                {loading && loading.id === person.id ? (
                  <Loading text={{ loading: 'Processing...' }} />
                ) : (
                  <>
                    <FormButton
                      formId={'personForm' + person.id}
                      type="submit"
                      icon="save"
                      className="me-1"
                      color={dirtyPersons[person.id] ? 'primary' : 'secondary'}
                    >
                      Save
                    </FormButton>
                    {dirtyPersons[person.id] ? (
                      <FormButton
                        formId={'personForm' + person.id}
                        type="reset"
                        icon="restore"
                        color="secondary"
                        className="me-1"
                      >
                        Reset
                      </FormButton>
                    ) : null}
                    {person.id !== newPerson.id ? (
                      <ConfirmButton
                        onConfirm={() => deletePerson(person)}
                        icon="delete"
                        color="danger"
                        dialogText={`Are you sure you want to delete ${person.firstName} ${person.lastName}?`}
                      >
                        Delete
                      </ConfirmButton>
                    ) : null}
                  </>
                )}
              </EpicCell>
              <EpicForm
                id={'personForm' + person.id}
                width={1950}
                height={52}
                initialValues={person}
                onSubmit={onSubmit}
              >
                <FormSpy
                  subscription={{ pristine: true }}
                  onChange={(formState) =>
                    setPersonDirty(formState.pristine, person)
                  }
                />
                <EpicFormCell width={300} height={52}>
                  <JarbInput
                    id={`firstName-${person.id}`}
                    name="firstName"
                    label="First name"
                    hiddenLabel={true}
                    placeholder="Enter first name"
                    jarb={{
                      validator: 'Person.firstName',
                      label: 'First name'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbInput
                    id={`lastName-${person.id}`}
                    name="lastName"
                    label="Last name"
                    hiddenLabel={true}
                    placeholder="Enter last name"
                    jarb={{
                      validator: 'Person.lastName',
                      label: 'Last name'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbInput
                    id={`age-${person.id}`}
                    name="age"
                    label="Age"
                    hiddenLabel={true}
                    type="number"
                    placeholder="Enter age"
                    jarb={{
                      validator: 'Person.age',
                      label: 'Age'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbSelect
                    id={`eyeColor-${person.id}`}
                    name="eyeColor"
                    label="Eye color"
                    hiddenLabel={true}
                    placeholder="Enter eye color"
                    options={['green', 'blue', 'brown']}
                    labelForOption={(option) => option}
                    jarb={{
                      validator: 'Person.eyeColor',
                      label: 'Eye color'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbInput
                    id={`height-${person.id}`}
                    name="height"
                    label="Height"
                    hiddenLabel={true}
                    placeholder="Enter height"
                    type="number"
                    jarb={{
                      validator: 'Person.height',
                      label: 'Height'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbInput
                    id={`weight-${person.id}`}
                    name="weight"
                    label="Weight"
                    hiddenLabel={true}
                    type="number"
                    placeholder="Enter weight"
                    jarb={{
                      validator: 'Person.weight',
                      label: 'Weight'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={200} height={52}>
                  <JarbInput
                    id={`jobTitle-${person.id}`}
                    name="jobTitle"
                    label="Job title"
                    hiddenLabel={true}
                    placeholder="Enter job title"
                    jarb={{
                      validator: 'Person.jobTitle',
                      label: 'Job title'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={300} height={52}>
                  <JarbModalPickerSingle
                    id={`favoriteMovie-${person.id}`}
                    name="favoriteMovie"
                    label="Favorite movie"
                    hiddenLabel={true}
                    placeholder="Enter favorite movie"
                    jarb={{
                      validator: 'Person.favoriteMovie',
                      label: 'Favorite movie'
                    }}
                    multiple={false}
                    options={({ query, page, size }) =>
                      Promise.resolve(
                        pageOf(
                          movies
                            .filter(
                              (movie) =>
                                query.length === 0 ||
                                movie.name.indexOf(query) > 0
                            )
                            .slice((page - 1) * size, size),
                          page,
                          size
                        )
                      )
                    }
                    labelForOption={(option) => option.name}
                    errorMode="tooltip"
                    alignButton="right"
                    className="mw-100"
                  />
                </EpicFormCell>

                <EpicFormCell width={150} height={52}>
                  <JarbInput
                    id={`favoriteFood-${person.id}`}
                    name="favoriteFood"
                    label="Favorite food"
                    hiddenLabel={true}
                    placeholder="Enter favorite food"
                    jarb={{
                      validator: 'Person.favoriteFood',
                      label: 'Favorite food'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={300} height={52}>
                  <JarbDateTimeInput
                    id={`dateOfBirth-${person.id}`}
                    name="dateOfBirth"
                    label="Birth date"
                    hiddenLabel={true}
                    placeholder="Enter birth date"
                    dateFormat="yyyy-MM-dd"
                    timeFormat={false}
                    jarb={{
                      validator: 'Person.dateOfBirth',
                      label: 'Birthdate'
                    }}
                    errorMode="tooltip"
                    mode="modal"
                    allowNull={true}
                  />
                </EpicFormCell>

                <EpicFormCell width={200} height={52}>
                  <JarbRadioGroup
                    id={`sex-${person.id}`}
                    name="sex"
                    label="Sex"
                    hiddenLabel={true}
                    className="ms-1"
                    options={['male', 'female']}
                    labelForOption={(option) => option}
                    horizontal={true}
                    jarb={{
                      validator: 'Person.sex',
                      label: 'Sex'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>
              </EpicForm>
            </EpicRow>
          ))}
        </EpicTable>

        <div className="d-flex justify-content-center">
          <Pagination
            className="my-3"
            page={pageOfPersons}
            onChange={confirmPage}
          />
          {newPage ? (
            <OpenCloseModal
              onClose={() => setNewPage(undefined)}
              onSave={() => {
                setPage(newPage);
                setNewPage(undefined);
              }}
              text={{ save: 'Confirm' }}
            >
              All your changes will be lost if you navigate to another page. Are
              you sure you want to go to page {newPage} and loose all your
              progress?
            </OpenCloseModal>
          ) : null}
        </div>
      </Card>
    );
  })
  .add('edit per row', () => {
    const [editingPerson, setEditingPerson] = useState<Person>();
    const [newPerson] = useState<Person>({
      id: Math.random(),
      firstName: '',
      lastName: '',
      age: 0,
      eyeColor: '',
      height: 0,
      weight: 0,
      jobTitle: '',
      favoriteMovie: undefined,
      favoriteFood: '',
      dateOfBirth: undefined,
      sex: ''
    });

    const [page, setPage] = useState(1);
    const [newPage, setNewPage] = useState<number>();
    const [personsList, setPersonsList] = useState(persons);
    const [pageOfPersons, setPageOfPersons] = useState<Page<Person>>(
      emptyPage<Person>()
    );
    const [loading, setLoading] = useState<Person>();
    const [dirty, setDirty] = useState(false);
    const [flashMessage, setFlashMessage] = useState<string>();

    useEffect(() => {
      const p = pageOf<Person>(personsList, page, 10);
      p.content.push({ ...newPerson });
      setPageOfPersons(p);
      setEditingPerson(undefined);
    }, [personsList, newPerson, page]);

    useEffect(() => {
      const timeout = window.setTimeout(() => setFlashMessage(undefined), 5000);
      return () => {
        window.clearTimeout(timeout);
      };
    }, [flashMessage]);

    async function onSubmit(data: Person, form: FormApi<Person>) {
      setLoading(data);
      await sleep(random(200, 1000));
      const person = { ...data };
      if (data.id === newPerson.id) {
        person.id = Math.random();
        setPersonsList([...personsList, person]);
      } else {
        setPersonsList(
          personsList.map((p) => {
            return p.id === person.id ? person : p;
          })
        );
      }
      setFlashMessage('Person saved successfully!');
      window.setTimeout(
        () => form.reset(data.id === newPerson.id ? newPerson : person),
        1
      );
      setLoading(undefined);
    }

    async function deletePerson(person: Person) {
      setLoading(person);
      await sleep(random(200, 1000));
      setPersonsList(personsList.filter((p) => p.id !== person.id));
      setLoading(undefined);
      setFlashMessage('Person deleted successfully!');
    }

    function confirmPage(pageNumber: number) {
      if (editingPerson) {
        setNewPage(pageNumber);
      } else {
        setPage(pageNumber);
      }
    }

    return (
      <Card body>
        {flashMessage ? (
          <FlashMessage
            onClose={() => setFlashMessage(undefined)}
            color="success"
          >
            {flashMessage}
          </FlashMessage>
        ) : null}
        <EpicTable hasRight={false}>
          <EpicRow header>
            <EpicHeader width={300} height={44}>
              Actions
            </EpicHeader>
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
            <EpicHeader width={300} height={44}>
              Birth date
            </EpicHeader>
            <EpicHeader width={200} height={44}>
              Sex
            </EpicHeader>
          </EpicRow>
          {pageOfPersons.content.map((person) =>
            (editingPerson && editingPerson.id === person.id) ||
            person.id === newPerson.id ? (
              <EpicRow key={person.id}>
                <EpicCell width={300} height={52}>
                  {loading && loading.id === person.id ? (
                    <Loading text={{ loading: 'Processing...' }} />
                  ) : (
                    <>
                      {dirty ? (
                        <FormButton
                          formId={'personForm' + person.id}
                          type="submit"
                          icon="save"
                          className="me-1"
                          color={dirty ? 'primary' : 'secondary'}
                        >
                          Save
                        </FormButton>
                      ) : null}
                      <Button
                        type="button"
                        icon="cancel"
                        color="secondary"
                        className="me-1"
                        onClick={() => setEditingPerson(undefined)}
                      >
                        Cancel
                      </Button>
                      {person.id !== newPerson.id ? (
                        <ConfirmButton
                          onConfirm={() => deletePerson(person)}
                          icon="delete"
                          color="danger"
                          dialogText={`Are you sure you want to delete ${person.firstName} ${person.lastName}?`}
                        >
                          Delete
                        </ConfirmButton>
                      ) : null}
                    </>
                  )}
                </EpicCell>
                <EpicForm
                  id={'personForm' + person.id}
                  width={1950}
                  height={52}
                  initialValues={person}
                  onSubmit={onSubmit}
                >
                  <FormSpy
                    subscription={{ pristine: true }}
                    onChange={(formState) => setDirty(formState.pristine)}
                  />
                  <EpicFormCell width={300} height={52}>
                    <JarbInput
                      id={`firstName-${person.id}`}
                      name="firstName"
                      label="First name"
                      hiddenLabel={true}
                      placeholder="Enter first name"
                      jarb={{
                        validator: 'Person.firstName',
                        label: 'First name'
                      }}
                      errorMode="tooltip"
                    />
                  </EpicFormCell>

                  <EpicFormCell width={100} height={52}>
                    <JarbInput
                      id={`lastName-${person.id}`}
                      name="lastName"
                      label="Last name"
                      hiddenLabel={true}
                      placeholder="Enter last name"
                      jarb={{
                        validator: 'Person.lastName',
                        label: 'Last name'
                      }}
                      errorMode="tooltip"
                    />
                  </EpicFormCell>

                  <EpicFormCell width={100} height={52}>
                    <JarbInput
                      id={`age-${person.id}`}
                      name="age"
                      label="Age"
                      hiddenLabel={true}
                      type="number"
                      placeholder="Enter age"
                      jarb={{
                        validator: 'Person.age',
                        label: 'Age'
                      }}
                      errorMode="tooltip"
                    />
                  </EpicFormCell>

                  <EpicFormCell width={100} height={52}>
                    <JarbSelect
                      id={`eyeColor-${person.id}`}
                      name="eyeColor"
                      label="Eye color"
                      hiddenLabel={true}
                      placeholder="Enter eye color"
                      options={['green', 'blue', 'brown']}
                      labelForOption={(option) => option}
                      jarb={{
                        validator: 'Person.eyeColor',
                        label: 'Eye color'
                      }}
                      errorMode="tooltip"
                    />
                  </EpicFormCell>

                  <EpicFormCell width={100} height={52}>
                    <JarbInput
                      id={`height-${person.id}`}
                      name="height"
                      label="Height"
                      hiddenLabel={true}
                      placeholder="Enter height"
                      type="number"
                      jarb={{
                        validator: 'Person.height',
                        label: 'Height'
                      }}
                      errorMode="tooltip"
                    />
                  </EpicFormCell>

                  <EpicFormCell width={100} height={52}>
                    <JarbInput
                      id={`weight-${person.id}`}
                      name="weight"
                      label="Weight"
                      hiddenLabel={true}
                      type="number"
                      placeholder="Enter weight"
                      jarb={{
                        validator: 'Person.weight',
                        label: 'Weight'
                      }}
                      errorMode="tooltip"
                    />
                  </EpicFormCell>

                  <EpicFormCell width={200} height={52}>
                    <JarbInput
                      id={`jobTitle-${person.id}`}
                      name="jobTitle"
                      label="Job title"
                      hiddenLabel={true}
                      placeholder="Enter job title"
                      jarb={{
                        validator: 'Person.jobTitle',
                        label: 'Job title'
                      }}
                      errorMode="tooltip"
                    />
                  </EpicFormCell>

                  <EpicFormCell width={300} height={52}>
                    <JarbModalPickerSingle
                      id={`favoriteMovie-${person.id}`}
                      name="favoriteMovie"
                      label="Favorite movie"
                      hiddenLabel={true}
                      placeholder="Enter favorite movie"
                      jarb={{
                        validator: 'Person.favoriteMovie',
                        label: 'Favorite movie'
                      }}
                      multiple={false}
                      labelForOption={(option) => option.name}
                      options={({ query, page, size }) =>
                        Promise.resolve(
                          pageOf(
                            movies
                              .filter(
                                (movie) =>
                                  query.length === 0 ||
                                  movie.name.indexOf(query) > 0
                              )
                              .slice((page - 1) * size, size),
                            page,
                            size
                          )
                        )
                      }
                      errorMode="tooltip"
                      alignButton="right"
                    />
                  </EpicFormCell>

                  <EpicFormCell width={150} height={52}>
                    <JarbInput
                      id={`favoriteFood-${person.id}`}
                      name="favoriteFood"
                      label="Favorite food"
                      hiddenLabel={true}
                      placeholder="Enter favorite food"
                      jarb={{
                        validator: 'Person.favoriteFood',
                        label: 'Favorite food'
                      }}
                      errorMode="tooltip"
                    />
                  </EpicFormCell>

                  <EpicFormCell width={300} height={52}>
                    <JarbDateTimeInput
                      id={`dateOfBirth-${person.id}`}
                      name="dateOfBirth"
                      label="Birth date"
                      hiddenLabel={true}
                      placeholder="Enter birth date"
                      dateFormat="yyyy-MM-dd"
                      timeFormat={false}
                      jarb={{
                        validator: 'Person.dateOfBirth',
                        label: 'Birthdate'
                      }}
                      errorMode="tooltip"
                      mode="modal"
                    />
                  </EpicFormCell>

                  <EpicFormCell width={200} height={52}>
                    <JarbRadioGroup
                      id={`sex-${person.id}`}
                      name="sex"
                      label="Sex"
                      hiddenLabel={true}
                      className="ms-1"
                      options={['male', 'female']}
                      labelForOption={(option) => option}
                      horizontal={true}
                      jarb={{
                        validator: 'Person.sex',
                        label: 'Sex'
                      }}
                      errorMode="tooltip"
                    />
                  </EpicFormCell>
                </EpicForm>
              </EpicRow>
            ) : (
              <EpicRow key={person.id}>
                <EpicCell width={300} height={52}>
                  {loading && loading.id === person.id ? (
                    <Loading text={{ loading: 'Processing...' }} />
                  ) : (
                    <>
                      {editingPerson ? (
                        <ConfirmButton
                          onConfirm={() => setEditingPerson(person)}
                          icon="edit"
                          color="primary"
                          className="me-1"
                          dialogText={`All progress on ${editingPerson.firstName} will be lost. Are you sure you want to edit ${person.firstName}?`}
                        >
                          Edit
                        </ConfirmButton>
                      ) : (
                        <Button
                          onClick={() => setEditingPerson(person)}
                          icon="edit"
                          color="primary"
                          className="me-1"
                        >
                          Edit
                        </Button>
                      )}
                      <ConfirmButton
                        onConfirm={() => deletePerson(person)}
                        icon="cancel"
                        color="danger"
                        dialogText={`Are you sure you want to delete ${person.firstName} ${person.lastName}?`}
                      >
                        Delete
                      </ConfirmButton>
                    </>
                  )}
                </EpicCell>

                <EpicCell width={300} height={52}>
                  {person.firstName}
                </EpicCell>

                <EpicCell width={100} height={52}>
                  {person.lastName}
                </EpicCell>

                <EpicCell width={100} height={52}>
                  {person.age}
                </EpicCell>

                <EpicCell width={100} height={52}>
                  {person.eyeColor}
                </EpicCell>

                <EpicCell width={100} height={52}>
                  {person.height}
                </EpicCell>

                <EpicCell width={100} height={52}>
                  {person.weight}
                </EpicCell>

                <EpicCell width={200} height={52}>
                  {person.jobTitle}
                </EpicCell>

                <EpicCell width={300} height={52}>
                  {person.favoriteMovie?.name}
                </EpicCell>

                <EpicCell width={150} height={52}>
                  {person.favoriteFood}
                </EpicCell>

                <EpicCell width={300} height={52}>
                  {person.dateOfBirth?.toLocaleDateString()}
                </EpicCell>

                <EpicCell width={200} height={52}>
                  {person.sex}
                </EpicCell>
              </EpicRow>
            )
          )}
        </EpicTable>

        <div className="d-flex justify-content-center">
          <Pagination
            className="my-3"
            page={pageOfPersons}
            onChange={confirmPage}
          />
          {newPage ? (
            <OpenCloseModal
              onClose={() => setNewPage(undefined)}
              onSave={() => {
                setPage(newPage);
                setNewPage(undefined);
              }}
              text={{ save: 'Confirm' }}
            >
              All your changes will be lost if you navigate to another page. Are
              you sure you want to go to page {newPage} and loose all your
              progress?
            </OpenCloseModal>
          ) : null}
        </div>
      </Card>
    );
  })
  .add('instant edit', () => {
    const [newPerson] = useState<Person>({
      id: Math.random(),
      firstName: '',
      lastName: '',
      age: 0,
      eyeColor: '',
      height: 0,
      weight: 0,
      jobTitle: '',
      favoriteMovie: undefined,
      favoriteFood: '',
      dateOfBirth: undefined,
      sex: ''
    });

    const [page, setPage] = useState(1);
    const [personsList, setPersonsList] = useState(persons);
    const [pageOfPersons, setPageOfPersons] = useState<Page<Person>>(
      emptyPage<Person>()
    );
    const [loading, setLoading] = useState<Person>();
    const [dirtyPersons, setDirtyPersons] = useState<{ [id: number]: boolean }>(
      {}
    );
    const [flashMessage, setFlashMessage] = useState<string>();

    useEffect(() => {
      const p = pageOf<Person>(personsList, page, 10);
      p.content.push({ ...newPerson });
      setDirtyPersons({});
      setPageOfPersons(p);
    }, [personsList, newPerson, page]);

    useEffect(() => {
      const timeout = window.setTimeout(() => setFlashMessage(undefined), 5000);
      return () => {
        window.clearTimeout(timeout);
      };
    }, [flashMessage]);

    async function onSubmit(data: Person) {
      setLoading(data);
      await sleep(random(200, 1000));
      const person = { ...data };
      if (data.id === newPerson.id) {
        person.id = Math.random();
        setPersonsList([...personsList, person]);
      } else {
        setPersonsList(
          personsList.map((p) => {
            return p.id === person.id ? person : p;
          })
        );
      }
      setFlashMessage('Person saved successfully!');
      setLoading(undefined);
    }

    async function deletePerson(person: Person) {
      setLoading(person);
      await sleep(random(200, 1000));
      setPersonsList(personsList.filter((p) => p.id !== person.id));
      setLoading(undefined);
      setFlashMessage('Person deleted successfully!');
    }

    function setPersonDirty(isPristine: boolean, person: Person) {
      if (!isPristine) {
        if (!dirtyPersons[person.id]) {
          setDirtyPersons({ ...dirtyPersons, [person.id]: true });
        }
      } else if (dirtyPersons[person.id]) {
        setDirtyPersons({ ...dirtyPersons, [person.id]: false });
      }
    }

    return (
      <Card body>
        {flashMessage ? (
          <FlashMessage
            onClose={() => setFlashMessage(undefined)}
            color="success"
          >
            {flashMessage}
          </FlashMessage>
        ) : null}
        <EpicTable hasRight={false}>
          <EpicRow header>
            <EpicHeader width={300} height={44}>
              Actions
            </EpicHeader>
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
            <EpicHeader width={300} height={44}>
              Birth date
            </EpicHeader>
            <EpicHeader width={200} height={44}>
              Sex
            </EpicHeader>
          </EpicRow>
          {pageOfPersons.content.map((person) => (
            <EpicRow key={person.id}>
              <EpicCell width={300} height={52}>
                {loading && loading.id === person.id ? (
                  <Loading text={{ loading: 'Processing...' }} />
                ) : (
                  <>
                    {person.id !== newPerson.id ? (
                      <ConfirmButton
                        onConfirm={() => deletePerson(person)}
                        icon="delete"
                        color="danger"
                        dialogText={`Are you sure you want to delete ${person.firstName} ${person.lastName}?`}
                      >
                        Delete
                      </ConfirmButton>
                    ) : null}
                  </>
                )}
              </EpicCell>
              <EpicForm
                id={'personForm' + person.id}
                width={1950}
                height={52}
                initialValues={person}
                onSubmit={onSubmit}
                submitOnChange={true}
              >
                <FormSpy
                  subscription={{ pristine: true }}
                  onChange={(formState) =>
                    setPersonDirty(formState.pristine, person)
                  }
                />
                <EpicFormCell width={300} height={52}>
                  <JarbInput
                    id={`firstName-${person.id}`}
                    name="firstName"
                    label="First name"
                    hiddenLabel={true}
                    placeholder="Enter first name"
                    jarb={{
                      validator: 'Person.firstName',
                      label: 'First name'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbInput
                    id={`lastName-${person.id}`}
                    name="lastName"
                    label="Last name"
                    hiddenLabel={true}
                    placeholder="Enter last name"
                    jarb={{
                      validator: 'Person.lastName',
                      label: 'Last name'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbInput
                    id={`age-${person.id}`}
                    name="age"
                    label="Age"
                    hiddenLabel={true}
                    type="number"
                    placeholder="Enter age"
                    jarb={{
                      validator: 'Person.age',
                      label: 'Age'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbSelect
                    id={`eyeColor-${person.id}`}
                    name="eyeColor"
                    label="Eye color"
                    hiddenLabel={true}
                    placeholder="Enter eye color"
                    options={['green', 'blue', 'brown']}
                    labelForOption={(option) => option}
                    jarb={{
                      validator: 'Person.eyeColor',
                      label: 'Eye color'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbInput
                    id={`height-${person.id}`}
                    name="height"
                    label="Height"
                    hiddenLabel={true}
                    placeholder="Enter height"
                    type="number"
                    jarb={{
                      validator: 'Person.height',
                      label: 'Height'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbInput
                    id={`weight-${person.id}`}
                    name="weight"
                    label="Weight"
                    hiddenLabel={true}
                    type="number"
                    placeholder="Enter weight"
                    jarb={{
                      validator: 'Person.weight',
                      label: 'Weight'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={200} height={52}>
                  <JarbInput
                    id={`jobTitle-${person.id}`}
                    name="jobTitle"
                    label="Job title"
                    hiddenLabel={true}
                    placeholder="Enter job title"
                    jarb={{
                      validator: 'Person.jobTitle',
                      label: 'Job title'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={300} height={52}>
                  <JarbModalPickerSingle
                    id={`favoriteMovie-${person.id}`}
                    name="favoriteMovie"
                    label="Favorite movie"
                    hiddenLabel={true}
                    placeholder="Enter favorite movie"
                    jarb={{
                      validator: 'Person.favoriteMovie',
                      label: 'Favorite movie'
                    }}
                    multiple={false}
                    options={({ query, page, size }) =>
                      Promise.resolve(
                        pageOf(
                          movies
                            .filter(
                              (movie) =>
                                query.length === 0 ||
                                movie.name.indexOf(query) > 0
                            )
                            .slice((page - 1) * size, size),
                          page,
                          size
                        )
                      )
                    }
                    labelForOption={(option) => option.name}
                    errorMode="tooltip"
                    alignButton="right"
                  />
                </EpicFormCell>

                <EpicFormCell width={150} height={52}>
                  <JarbInput
                    id={`favoriteFood-${person.id}`}
                    name="favoriteFood"
                    label="Favorite food"
                    hiddenLabel={true}
                    placeholder="Enter favorite food"
                    jarb={{
                      validator: 'Person.favoriteFood',
                      label: 'Favorite food'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={300} height={52}>
                  <JarbDateTimeInput
                    id={`dateOfBirth-${person.id}`}
                    name="dateOfBirth"
                    label="Birth date"
                    hiddenLabel={true}
                    placeholder="Enter birth date"
                    dateFormat="yyyy-MM-dd"
                    timeFormat={false}
                    jarb={{
                      validator: 'Person.dateOfBirth',
                      label: 'Birthdate'
                    }}
                    errorMode="tooltip"
                    mode="modal"
                    allowNull={true}
                  />
                </EpicFormCell>

                <EpicFormCell width={200} height={52}>
                  <JarbRadioGroup
                    id={`sex-${person.id}`}
                    name="sex"
                    label="Sex"
                    hiddenLabel={true}
                    className="ms-1"
                    options={['male', 'female']}
                    labelForOption={(option) => option}
                    horizontal={true}
                    jarb={{
                      validator: 'Person.sex',
                      label: 'Sex'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>
              </EpicForm>
            </EpicRow>
          ))}
        </EpicTable>

        <div className="d-flex justify-content-center">
          <Pagination
            className="my-3"
            page={pageOfPersons}
            onChange={setPage}
          />
        </div>
      </Card>
    );
  })
  .add('copy / paste to spreadsheet', () => {
    const [newPerson] = useState<Person>({
      id: Math.random(),
      firstName: '',
      lastName: '',
      age: 0,
      eyeColor: '',
      height: 0,
      weight: 0,
      jobTitle: '',
      favoriteMovie: undefined,
      favoriteFood: '',
      dateOfBirth: undefined,
      sex: ''
    });

    const [page, setPage] = useState(1);
    const [newPage, setNewPage] = useState<number>();
    const [personsList, setPersonsList] = useState(persons);
    const [pageOfPersons, setPageOfPersons] = useState<Page<Person>>(
      emptyPage<Person>()
    );
    const [loading, setLoading] = useState<Person>();
    const [dirtyPersons, setDirtyPersons] = useState<{ [id: number]: boolean }>(
      {}
    );
    const [flashMessage, setFlashMessage] = useState<string>();
    const [processingPaste, setProcessingPaste] = useState(false);

    useEffect(() => {
      const p = pageOf<Person>(personsList, page, 10);
      p.content.push({ ...newPerson });
      setDirtyPersons({});
      setPageOfPersons(p);
    }, [personsList, newPerson, page]);

    useEffect(() => {
      const timeout = window.setTimeout(() => setFlashMessage(undefined), 5000);
      return () => {
        window.clearTimeout(timeout);
      };
    }, [flashMessage]);

    async function onSubmit(data: Person, form: FormApi<Person>) {
      setLoading(data);
      await sleep(random(200, 1000));
      const person = { ...data };
      if (data.id === newPerson.id) {
        person.id = Math.random();
        setPersonsList([...personsList, person]);
      } else {
        setPersonsList(
          personsList.map((p) => {
            return p.id === person.id ? person : p;
          })
        );
      }
      setFlashMessage('Person saved successfully!');
      window.setTimeout(
        () => form.reset(data.id === newPerson.id ? newPerson : person),
        1
      );
      setLoading(undefined);
    }

    async function deletePerson(person: Person) {
      setLoading(person);
      await sleep(random(200, 1000));
      setPersonsList(personsList.filter((p) => p.id !== person.id));
      setLoading(undefined);
      setFlashMessage('Person deleted successfully!');
    }

    function setPersonDirty(isPristine: boolean, person: Person) {
      if (!isPristine) {
        if (!dirtyPersons[person.id]) {
          setDirtyPersons({ ...dirtyPersons, [person.id]: true });
        }
      } else if (dirtyPersons[person.id]) {
        setDirtyPersons({ ...dirtyPersons, [person.id]: false });
      }
    }

    function confirmPage(pageNumber: number) {
      if (Object.values(dirtyPersons).some((d) => d)) {
        setNewPage(pageNumber);
      } else {
        setPage(pageNumber);
      }
    }

    async function copy() {
      const csv = [personKeys.join('\t')]
        .concat(
          persons.map((person) =>
            personKeys
              .map((key) => {
                if (key === 'favoriteMovie') {
                  const movie = person[key];

                  return movie?.name ?? '';
                } else {
                  return person[key] ?? '';
                }
              })
              .join('\t')
          )
        )
        .join('\n');

      await navigator.clipboard.writeText(csv);

      setFlashMessage('Copied!');
    }

    async function paste() {
      setProcessingPaste(true);

      const text = await navigator.clipboard.readText();
      const keys = [...personKeys];
      const list: Person[] = [];

      const rows = text.split('\n');

      // Remove header line
      rows.shift();

      rows.forEach((row) => {
        const person = {};
        row.split('\t').forEach((value, index) => {
          const key = keys[index];

          switch (key) {
            case 'favoriteMovie':
              person[key] = { name: value };
              break;
            case 'dateOfBirth':
              person[key] = Date.parse(value);
              break;
            default:
              person[key] = value;
              break;
          }
        });
        list.push(person as Person);
      });

      setPersonsList(list);
      setProcessingPaste(false);
      setFlashMessage(`Imported ${list.length} rows`);
    }

    useEffect(() => {
      function preventOnInputElement(event: Event, action: () => void) {
        if (
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLInputElement
        ) {
          return;
        }

        action();
      }

      function handleCopy(event: Event) {
        preventOnInputElement(event, copy);
      }

      function handlePaste(event: Event) {
        preventOnInputElement(event, paste);
      }

      document.addEventListener('paste', handlePaste, { passive: true });
      document.addEventListener('copy', handleCopy, { passive: true });

      return () => {
        document.removeEventListener('paste', handlePaste);
        document.removeEventListener('copy', handleCopy);
      };
    }, []);

    return (
      <Card body>
        <div className="mb-2">
          <Button icon="file_copy" onClick={copy}>
            Copy
          </Button>

          <Button
            onClick={paste}
            className="ms-2"
            icon="assignment"
            inProgress={processingPaste}
          >
            Paste
          </Button>
        </div>

        <p>Try copy pasting to excel / numbers and back.</p>

        <p>
          You can also use the copy and paste keyboard shortcuts when no input
          is focussed.
        </p>

        {flashMessage ? (
          <FlashMessage
            onClose={() => setFlashMessage(undefined)}
            color="success"
          >
            {flashMessage}
          </FlashMessage>
        ) : null}
        <EpicTable hasRight={false}>
          <EpicRow header>
            <EpicHeader width={300} height={44}>
              Actions
            </EpicHeader>
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
            <EpicHeader width={300} height={44}>
              Birth date
            </EpicHeader>
            <EpicHeader width={200} height={44}>
              Sex
            </EpicHeader>
          </EpicRow>
          {pageOfPersons.content.map((person) => (
            <EpicRow key={person.id}>
              <EpicCell width={300} height={52}>
                {loading && loading.id === person.id ? (
                  <Loading text={{ loading: 'Processing...' }} />
                ) : (
                  <>
                    <FormButton
                      formId={'personForm' + person.id}
                      type="submit"
                      icon="save"
                      className="me-1"
                      color={dirtyPersons[person.id] ? 'primary' : 'secondary'}
                    >
                      Save
                    </FormButton>
                    {dirtyPersons[person.id] ? (
                      <FormButton
                        formId={'personForm' + person.id}
                        type="reset"
                        icon="restore"
                        color="secondary"
                        className="me-1"
                      >
                        Reset
                      </FormButton>
                    ) : null}
                    {person.id !== newPerson.id ? (
                      <ConfirmButton
                        onConfirm={() => deletePerson(person)}
                        icon="delete"
                        color="danger"
                        dialogText={`Are you sure you want to delete ${person.firstName} ${person.lastName}?`}
                      >
                        Delete
                      </ConfirmButton>
                    ) : null}
                  </>
                )}
              </EpicCell>
              <EpicForm
                id={'personForm' + person.id}
                width={1950}
                height={52}
                initialValues={person}
                onSubmit={onSubmit}
              >
                <FormSpy
                  subscription={{ pristine: true }}
                  onChange={(formState) =>
                    setPersonDirty(formState.pristine, person)
                  }
                />
                <EpicFormCell width={300} height={52}>
                  <JarbInput
                    id={`firstName-${person.id}`}
                    name="firstName"
                    label="First name"
                    hiddenLabel={true}
                    placeholder="Enter first name"
                    jarb={{
                      validator: 'Person.firstName',
                      label: 'First name'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbInput
                    id={`lastName-${person.id}`}
                    name="lastName"
                    label="Last name"
                    hiddenLabel={true}
                    placeholder="Enter last name"
                    jarb={{
                      validator: 'Person.lastName',
                      label: 'Last name'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbInput
                    id={`age-${person.id}`}
                    name="age"
                    label="Age"
                    hiddenLabel={true}
                    type="number"
                    placeholder="Enter age"
                    jarb={{
                      validator: 'Person.age',
                      label: 'Age'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbSelect
                    id={`eyeColor-${person.id}`}
                    name="eyeColor"
                    label="Eye color"
                    hiddenLabel={true}
                    placeholder="Enter eye color"
                    options={['green', 'blue', 'brown']}
                    labelForOption={(option) => option}
                    jarb={{
                      validator: 'Person.eyeColor',
                      label: 'Eye color'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbInput
                    id={`height-${person.id}`}
                    name="height"
                    label="Height"
                    hiddenLabel={true}
                    placeholder="Enter height"
                    type="number"
                    jarb={{
                      validator: 'Person.height',
                      label: 'Height'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={100} height={52}>
                  <JarbInput
                    id={`weight-${person.id}`}
                    name="weight"
                    label="Weight"
                    hiddenLabel={true}
                    type="number"
                    placeholder="Enter weight"
                    jarb={{
                      validator: 'Person.weight',
                      label: 'Weight'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={200} height={52}>
                  <JarbInput
                    id={`jobTitle-${person.id}`}
                    name="jobTitle"
                    label="Job title"
                    hiddenLabel={true}
                    placeholder="Enter job title"
                    jarb={{
                      validator: 'Person.jobTitle',
                      label: 'Job title'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={300} height={52}>
                  <JarbModalPickerSingle
                    id={`favoriteMovie-${person.id}`}
                    name="favoriteMovie"
                    label="Favorite movie"
                    hiddenLabel={true}
                    placeholder="Enter favorite movie"
                    jarb={{
                      validator: 'Person.favoriteMovie',
                      label: 'Favorite movie'
                    }}
                    multiple={false}
                    options={({ query, page, size }) =>
                      Promise.resolve(
                        pageOf(
                          movies
                            .filter(
                              (movie) =>
                                query.length === 0 ||
                                movie.name.indexOf(query) > 0
                            )
                            .slice((page - 1) * size, size),
                          page,
                          size
                        )
                      )
                    }
                    labelForOption={(option) => option.name}
                    errorMode="tooltip"
                    alignButton="right"
                  />
                </EpicFormCell>

                <EpicFormCell width={150} height={52}>
                  <JarbInput
                    id={`favoriteFood-${person.id}`}
                    name="favoriteFood"
                    label="Favorite food"
                    hiddenLabel={true}
                    placeholder="Enter favorite food"
                    jarb={{
                      validator: 'Person.favoriteFood',
                      label: 'Favorite food'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>

                <EpicFormCell width={300} height={52}>
                  <JarbDateTimeInput
                    id={`dateOfBirth-${person.id}`}
                    name="dateOfBirth"
                    label="Birth date"
                    hiddenLabel={true}
                    placeholder="Enter birth date"
                    dateFormat="yyyy-MM-dd"
                    timeFormat={false}
                    jarb={{
                      validator: 'Person.dateOfBirth',
                      label: 'Birthdate'
                    }}
                    errorMode="tooltip"
                    mode="modal"
                    allowNull={true}
                  />
                </EpicFormCell>

                <EpicFormCell width={200} height={52}>
                  <JarbRadioGroup
                    id={`sex-${person.id}`}
                    name="sex"
                    label="Sex"
                    hiddenLabel={true}
                    className="ms-1"
                    options={['male', 'female']}
                    labelForOption={(option) => option}
                    horizontal={true}
                    jarb={{
                      validator: 'Person.sex',
                      label: 'Sex'
                    }}
                    errorMode="tooltip"
                  />
                </EpicFormCell>
              </EpicForm>
            </EpicRow>
          ))}
        </EpicTable>

        <div className="d-flex justify-content-center">
          <Pagination
            className="my-3"
            page={pageOfPersons}
            onChange={confirmPage}
          />
          {newPage ? (
            <OpenCloseModal
              onClose={() => setNewPage(undefined)}
              onSave={() => {
                setPage(newPage);
                setNewPage(undefined);
              }}
              text={{ save: 'Confirm' }}
            >
              All your changes will be lost if you navigate to another page. Are
              you sure you want to go to page {newPage} and loose all your
              progress?
            </OpenCloseModal>
          ) : null}
        </div>
      </Card>
    );
  });

const personKeys: (keyof Person)[] = [
  'id',
  'firstName',
  'lastName',
  'age',
  'eyeColor',
  'height',
  'weight',
  'jobTitle',
  'favoriteMovie',
  'favoriteFood',
  'dateOfBirth',
  'sex'
];

const movies: Movie[] = uniq(
  persons
    .filter((person) => person.favoriteMovie)
    .map((person) => person.favoriteMovie?.name)
).map((movie) => ({ name: movie } as Movie));
