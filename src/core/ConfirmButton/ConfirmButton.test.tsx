/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import ConfirmButton from './ConfirmButton';
import IconType from '../Icon/types';

describe('Component: ConfirmButton', () => {
  describe('ui', () => {
    test('only button', () => {
      const confirmButton = shallow(
        <ConfirmButton
          onConfirm={() => undefined}
          dialogText={
            <p>
              Are you sure you want to <strong>delete</strong> the user?
            </p>
          }
        >
          Delete user
        </ConfirmButton>
      );

      expect(toJson(confirmButton)).toMatchSnapshot(
        'Component: ConfirmButton => ui => only button'
      );
    });

    test('only icon', () => {
      const confirmButton = shallow(
        <ConfirmButton
          onConfirm={() => undefined}
          icon="delete"
          dialogText={
            <p>
              Are you sure you want to <strong>delete</strong> the user?
            </p>
          }
        />
      );

      expect(toJson(confirmButton)).toMatchSnapshot(
        'Component: ConfirmButton => ui => only icon'
      );
    });

    test('only icon in progress', () => {
      const confirmButton = shallow(
        <ConfirmButton
          onConfirm={() => undefined}
          inProgress={true}
          icon="delete"
          dialogText={
            <p>
              Are you sure you want to <strong>delete</strong> the user?
            </p>
          }
        />
      );

      expect(toJson(confirmButton)).toMatchSnapshot(
        'Component: ConfirmButton => ui => only icon in progress'
      );
    });

    test('button and icon', () => {
      const confirmButton = shallow(
        <ConfirmButton
          onConfirm={() => undefined}
          icon="delete"
          dialogText={
            <p>
              Are you sure you want to <strong>delete</strong> the user?
            </p>
          }
        >
          Delete user
        </ConfirmButton>
      );

      expect(toJson(confirmButton)).toMatchSnapshot(
        'Component: ConfirmButton => ui => button and icon'
      );
    });

    test('custom class, color and texts', () => {
      const confirmButton = shallow(
        <ConfirmButton
          className="bigger-better-and-uncut"
          color="info"
          onConfirm={() => undefined}
          icon="delete"
          dialogText={
            <p>
              Are you sure you want to <strong>delete</strong> the user?
            </p>
          }
          confirmText="YES"
          cancelText="NO"
          modalHeaderText="PLEASE SAY YES"
        >
          Delete user
        </ConfirmButton>
      );

      expect(toJson(confirmButton)).toMatchSnapshot(
        'Component: ConfirmButton => ui => custom color and texts'
      );
    });
  });

  describe('events', () => {
    let confirmButton: ShallowWrapper;
    let onConfirmSpy: jest.Mock<any, any>;

    function setup({ button, icon }: { icon?: IconType; button?: string }) {
      onConfirmSpy = jest.fn();

      confirmButton = shallow(
        <ConfirmButton
          onConfirm={onConfirmSpy}
          dialogText="Are you sure you want a ConfirmButton?"
          icon={icon}
        >
          {button}
        </ConfirmButton>
      );
    }

    function openModal() {
      const event = { stopPropagation: jest.fn() };

      // @ts-ignore
      confirmButton
        .find('Button')
        .at(0)
        .props()
        // @ts-ignore
        .onClick(event);

      // @ts-ignore
      expect(confirmButton.find('Modal').props().isOpen).toBe(true);
    }

    it('should open the Modal when the ConfirmButton button is clicked', () => {
      setup({
        button: 'Delete',
        icon: undefined
      });

      const event = { stopPropagation: jest.fn() };

      // @ts-ignore
      confirmButton
        .find('Button')
        .at(0)
        .props()
        // @ts-ignore
        .onClick(event);

      // @ts-ignore
      expect(confirmButton.find('Modal').props().isOpen).toBe(true);

      expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it('should close the Modal when the Cancel button is clicked', () => {
      setup({
        button: 'Delete',
        icon: undefined
      });

      openModal();

      // @ts-ignore
      confirmButton
        .find('Button')
        .at(1)
        .prop('onClick')();

      // @ts-ignore
      expect(confirmButton.find('Modal').props().isOpen).toBe(false);
    });

    it('should close the Modal when the Header is clicked', () => {
      setup({
        button: 'Delete',
        icon: undefined
      });

      openModal();

      // @ts-ignore
      confirmButton
        .find('ModalHeader')
        .props()
        // @ts-ignore
        .toggle();

      // @ts-ignore
      expect(confirmButton.find('Modal').props().isOpen).toBe(false);
    });

    it('should close the Modal the user clicks outside the Modal', () => {
      setup({
        button: 'Delete',
        icon: undefined
      });

      openModal();

      confirmButton
        .find('Modal')
        .props()
        // @ts-ignore
        .toggle();

      // @ts-ignore
      expect(confirmButton.find('Modal').props().isOpen).toBe(false);
    });

    it('should close and save the Modal when the Accept button is clicked', () => {
      setup({
        button: 'Delete',
        icon: undefined
      });

      openModal();
      const event = new Event('click');

      // @ts-ignore
      confirmButton
        .find('Button')
        .at(2)
        // @ts-ignore
        .prop('onClick')(event);

      expect(onConfirmSpy).toHaveBeenCalledTimes(1);
      expect(onConfirmSpy).toHaveBeenCalledWith(event);

      // @ts-ignore
      expect(confirmButton.find('Modal').props().isOpen).toBe(false);
    });
  });
});
