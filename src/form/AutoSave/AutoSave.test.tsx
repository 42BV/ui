import React from 'react';
import { render } from '@testing-library/react';

import { AutoSave } from './AutoSave';
import * as Active from './useActive';
import * as PendingPromise from './usePromise';
import { resolvablePromise } from '../../test/utils';
import * as FinalForm from 'react-final-form';
import { FormState } from 'final-form';

type TestFormValues = {
  test: string;
  friends?: string;
};

describe('Component: AutoSave', () => {
  function setup({
    activeField,
    initialValues
  }: {
    activeField?: string;
    initialValues?: TestFormValues;
  }) {
    const resolvable = resolvablePromise();
    let onChangeTrigger: (formState: FormState<TestFormValues>) => void;

    jest.spyOn(FinalForm, 'FormSpy').mockImplementation((props) => {
      // @ts-expect-error onChange must be defined in AutoSave for the component to work
      onChangeTrigger = props.onChange;
      return <></>;
    });

    const onSaveSpy = jest.fn((_values) => resolvable.promise);
    const onSubmitSpy = jest.fn((_values) => resolvable.promise);

    const setActiveSpy = jest.fn();
    jest
      .spyOn(Active, 'useActive')
      .mockImplementation(() => [ activeField, setActiveSpy ]);

    const { container } = render(
      <FinalForm.Form onSubmit={onSubmitSpy}>
        {() => (
          <AutoSave onSave={onSaveSpy} initialValues={initialValues} />
        )}
      </FinalForm.Form>
    );

    // @ts-expect-error onChangeTrigger is assigned a value
    return { container, onChangeTrigger, onSaveSpy, setActiveSpy };
  }

  test('ui', () => {
    const { container } = render(
      <FinalForm.Form onSubmit={jest.fn()}>
        {() => (
          <AutoSave onSave={jest.fn()} />
        )}
      </FinalForm.Form>
    );
    expect(container.firstChild).toBeNull();
  });

  describe('events', () => {
    it('should not save on first time field active', () => {
      const { onChangeTrigger, onSaveSpy, setActiveSpy } = setup({});

      // @ts-expect-error We only need the active property for this test
      onChangeTrigger({ active: 'test' });

      expect(setActiveSpy).toBeCalledTimes(1);
      expect(setActiveSpy).toBeCalledWith('test');

      expect(onSaveSpy).toBeCalledTimes(0);
    });

    it('should not save when same field changes', () => {
      const { onChangeTrigger, onSaveSpy, setActiveSpy } = setup({
        activeField: 'test'
      });

      // @ts-expect-error We only need the active property for this test
      onChangeTrigger({ active: 'test' });

      expect(setActiveSpy).toBeCalledTimes(0);
      expect(onSaveSpy).toBeCalledTimes(0);
    });

    it('should not save when values do not change', () => {
      const { onChangeTrigger, onSaveSpy, setActiveSpy } = setup({
        activeField: 'test',
        initialValues: { test: 'test' }
      });

      // @ts-expect-error We only need the active and values properties for this test
      onChangeTrigger({ active: 'friends', values: { test: 'test' } });

      expect(setActiveSpy).toBeCalledTimes(1);
      expect(setActiveSpy).toBeCalledWith('friends');

      expect(onSaveSpy).toBeCalledTimes(0);
    });

    it('should wait with saving again until the previous save has finished', async () => {
      expect.assertions(5);

      const { promise, resolve } = resolvablePromise();

      jest
        .spyOn(PendingPromise, 'usePromise')
        .mockReturnValue({ current: promise });

      const { onChangeTrigger, onSaveSpy, setActiveSpy } = setup({
        activeField: 'test',
        initialValues: { test: 'test' }
      });

      // @ts-expect-error We only need the active and values properties for this test
      onChangeTrigger({ active: 'friends', values: { test: 'testing' } });

      expect(setActiveSpy).toBeCalledTimes(1);
      expect(setActiveSpy).toBeCalledWith('friends');

      expect(onSaveSpy).toBeCalledTimes(0);

      await resolve();

      expect(onSaveSpy).toBeCalledTimes(1);
      expect(onSaveSpy).toBeCalledWith({ test: 'testing' });
    });

    it('should save when another field changes', () => {
      const { onChangeTrigger, onSaveSpy, setActiveSpy } = setup({
        activeField: 'test'
      });

      // @ts-expect-error We only need the active and values properties for this test
      onChangeTrigger({ active: 'friends', values: { test: 'test' } });

      expect(setActiveSpy).toBeCalledTimes(1);
      expect(setActiveSpy).toBeCalledWith('friends');

      expect(onSaveSpy).toBeCalledTimes(1);
      expect(onSaveSpy).toBeCalledWith({ test: 'test' });
    });
  });
});
