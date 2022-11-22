import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ConfirmButton } from './ConfirmButton';
import { IconType } from '../types';

describe('Component: ConfirmButton', () => {
  describe('ui', () => {
    test('only button', () => {
      const { container } = render(
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

      expect(container).toMatchSnapshot();
    });

    test('only icon', () => {
      const { container } = render(
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

      expect(container).toMatchSnapshot();
    });

    test('only icon in progress', () => {
      const { container } = render(
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

      expect(container).toMatchSnapshot();
    });

    test('button and icon', () => {
      const { container } = render(
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

      expect(container).toMatchSnapshot();
    });

    test('custom class, color and texts', () => {
      const { container } = render(
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
            header: 'PLEASE SAY YES'
          }}
        >
          Delete user
        </ConfirmButton>
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe('events', () => {
    type Props =
      | { icon: IconType; button?: never }
      | { button: string; icon?: never };

    function setup({ button, icon }: Props) {
      const onConfirmSpy = jest.fn();

      const props = {
        onConfirm: onConfirmSpy,
        dialogText: 'Are you sure you want a ConfirmButton?'
      };

      if (icon && button) {
        const { container } = render(
          <ConfirmButton icon={icon} {...props}>
            {button}
          </ConfirmButton>
        );
        return { container, onConfirmSpy };
      } else if (icon) {
        const { container } = render(<ConfirmButton icon={icon} {...props} />);
        return { container, onConfirmSpy };
      } else {
        const { container } = render(
          <ConfirmButton {...props}>{button}</ConfirmButton>
        );
        return { container, onConfirmSpy };
      }
    }

    it('should open the Modal when the ConfirmButton button is clicked', () => {
      setup({ button: 'Delete' });

      expect(
        screen.queryByText('Are you sure you want a ConfirmButton?')
      ).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Delete'));

      expect(
        screen.queryByText('Are you sure you want a ConfirmButton?')
      ).toBeInTheDocument();
    });

    it('should close the Modal when the Cancel button is clicked', () => {
      const { onConfirmSpy } = setup({ button: 'Delete' });

      fireEvent.click(screen.getByText('Delete'));

      expect(
        screen.queryByText('Are you sure you want a ConfirmButton?')
      ).toBeInTheDocument();

      fireEvent.click(screen.getByText('Cancel'));

      expect(
        screen.queryByText('Are you sure you want a ConfirmButton?')
      ).not.toBeInTheDocument();
      expect(onConfirmSpy).toHaveBeenCalledTimes(0);
    });

    it('should close and save the Modal when the Confirm button is clicked', () => {
      const { onConfirmSpy } = setup({ button: 'Delete' });

      fireEvent.click(screen.getByText('Delete'));

      expect(
        screen.queryByText('Are you sure you want a ConfirmButton?')
      ).toBeInTheDocument();

      fireEvent.click(screen.getByText('Confirm'));

      expect(
        screen.queryByText('Are you sure you want a ConfirmButton?')
      ).not.toBeInTheDocument();
      expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    });
  });
});
