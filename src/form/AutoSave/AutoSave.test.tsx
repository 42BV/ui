import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { AutoSave } from './AutoSave';
import * as Active from './useActive';
import * as PendingPromise from './usePromise';
import { resolvablePromise } from '../../test/utils';

describe('Component: AutoSave', () => {
  function setup({
    activeField,
    initialValues
  }: {
    activeField?: string;
    initialValues?: { [id: string]: string };
  }) {
    const resolvable = resolvablePromise();
    const onSaveSpy = jest.fn(() => resolvable.promise);
    const setActiveSpy = jest.fn();
    jest
      .spyOn(Active, 'useActive')
      .mockImplementation(() => [activeField, setActiveSpy]);

    // @ts-ignore
    const autoSave = shallow(
      <AutoSave onSave={onSaveSpy} initialValues={initialValues} />
    );

    return { autoSave, onSaveSpy, setActiveSpy };
  }

  test('ui', () => {
    const autoSave = shallow(<AutoSave onSave={jest.fn()} />);
    expect(toJson(autoSave)).toMatchSnapshot();
  });

  describe('events', () => {
    it('should not save on first time field active', () => {
      const { autoSave, onSaveSpy, setActiveSpy } = setup({});

      // @ts-ignore
      autoSave
        .find('FormSpy')
        .props()
        // @ts-ignore
        .onChange({ active: 'test' });

      expect(setActiveSpy).toBeCalledTimes(1);
      expect(setActiveSpy).toBeCalledWith('test');

      expect(onSaveSpy).toBeCalledTimes(0);
    });

    it('should not save when same field changes', () => {
      const { autoSave, onSaveSpy, setActiveSpy } = setup({
        activeField: 'test'
      });

      // @ts-ignore
      autoSave
        .find('FormSpy')
        .props()
        // @ts-ignore
        .onChange({ active: 'test' });

      expect(setActiveSpy).toBeCalledTimes(0);
      expect(onSaveSpy).toBeCalledTimes(0);
    });

    it('should not save when values do not change', () => {
      const { autoSave, onSaveSpy, setActiveSpy } = setup({
        activeField: 'test',
        initialValues: { test: 'test' }
      });

      // @ts-ignore
      autoSave
        .find('FormSpy')
        .props()
        // @ts-ignore
        .onChange({ active: 'friends', values: { test: 'test' } });

      expect(setActiveSpy).toBeCalledTimes(1);
      expect(setActiveSpy).toBeCalledWith('friends');

      expect(onSaveSpy).toBeCalledTimes(0);
    });

    it('should wait until saving again until the previous save has finished', async done => {
      const { promise, resolve } = resolvablePromise();
      // @ts-ignore
      jest
        .spyOn(PendingPromise, 'usePromise')
        .mockReturnValue({ current: promise });

      const { autoSave, onSaveSpy, setActiveSpy } = setup({
        activeField: 'test',
        initialValues: { test: 'test' }
      });

      // @ts-ignore
      autoSave
        .find('FormSpy')
        .props()
        // @ts-ignore
        .onChange({ active: 'friends', values: { test: 'testing' } });

      expect(setActiveSpy).toBeCalledTimes(1);
      expect(setActiveSpy).toBeCalledWith('friends');

      expect(onSaveSpy).toBeCalledTimes(0);

      try {
        await resolve();

        expect(onSaveSpy).toBeCalledTimes(1);
        expect(onSaveSpy).toBeCalledWith({ test: 'testing' });

        done();
      } catch (e) {
        console.error(e);
        done.fail();
      }
    });

    it('should save when another field changes', () => {
      const { autoSave, onSaveSpy, setActiveSpy } = setup({
        activeField: 'test'
      });

      // @ts-ignore
      autoSave
        .find('FormSpy')
        .props()
        // @ts-ignore
        .onChange({ active: 'friends', values: { test: 'test' } });

      expect(setActiveSpy).toBeCalledTimes(1);
      expect(setActiveSpy).toBeCalledWith('friends');

      expect(onSaveSpy).toBeCalledTimes(1);
      expect(onSaveSpy).toBeCalledWith({ test: 'test' });
    });
  });
});
