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
          text={{
            confirm: 'YES',
            cancel: 'NO',
            modalHeader: 'PLEASE SAY YES'
          }}
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
    let onConfirmSpy: jest.Mock;

    type Props =
      | { icon: IconType; button?: never }
      | { button: string; icon?: never };

    function setup({ button, icon }: Props) {
      onConfirmSpy = jest.fn();

      const props = {
        onConfirm: onConfirmSpy,
        dialogText: 'Are you sure you want a ConfirmButton?'
      };

      if (icon && button) {
        confirmButton = shallow(
          <ConfirmButton icon={icon} {...props}>
            {button}
          </ConfirmButton>
        );
      } else if (icon) {
        confirmButton = shallow(<ConfirmButton icon={icon} {...props} />);
      } else {
        confirmButton = shallow(
          <ConfirmButton {...props}>{button}</ConfirmButton>
        );
      }
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
      expect(confirmButton.find('OpenCloseModal').props().isOpen).toBe(true);
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
      expect(confirmButton.find('OpenCloseModal').props().isOpen).toBe(true);

      expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it('should close the Modal', () => {
      setup({
        button: 'Delete',
        icon: undefined
      });

      openModal();

      // @ts-ignore
      confirmButton.find('OpenCloseModal').prop('onClose')();

      // @ts-ignore
      expect(confirmButton.find('OpenCloseModal').props().isOpen).toBe(false);
    });

    it('should close and save the Modal when the Accept button is clicked', () => {
      setup({
        button: 'Delete',
        icon: undefined
      });

      openModal();

      // @ts-ignore
      confirmButton
        .find('OpenCloseModal')
        // @ts-ignore
        .prop('onSave')();

      expect(onConfirmSpy).toHaveBeenCalledTimes(1);

      // @ts-ignore
      expect(confirmButton.find('OpenCloseModal').props().isOpen).toBe(false);
    });
  });
});
