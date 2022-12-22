import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { ConfirmButton } from './ConfirmButton';
import { IconType } from '../Icon';

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
            modalHeader: 'PLEASE SAY YES'
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
      const onConfirmSpy = vi.fn();

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

    it('should open the Modal when the ConfirmButton button is clicked', async () => {
      expect.assertions(1);

      setup({ button: 'Delete' });

      expect(
        screen.queryByText('Are you sure you want a ConfirmButton?')
      ).toBeNull();

      fireEvent.click(screen.getByText('Delete'));

      await screen.findByText('Are you sure you want a ConfirmButton?');
    });

    it('should close the Modal when the Cancel button is clicked', async () => {
      expect.assertions(2);

      const { onConfirmSpy } = setup({ button: 'Delete' });

      fireEvent.click(screen.getByText('Delete'));

      await screen.findByText('Are you sure you want a ConfirmButton?');

      fireEvent.click(screen.getByText('Cancel'));

      expect(
        screen.queryByText('Are you sure you want a ConfirmButton?')
      ).toBeNull();
      expect(onConfirmSpy).toHaveBeenCalledTimes(0);
    });

    it('should close and save the Modal when the Confirm button is clicked', async () => {
      expect.assertions(2);

      const { onConfirmSpy } = setup({ button: 'Delete' });

      fireEvent.click(screen.getByText('Delete'));

      await screen.findByText('Are you sure you want a ConfirmButton?');

      fireEvent.click(screen.getByText('Confirm'));

      expect(
        screen.queryByText('Are you sure you want a ConfirmButton?')
      ).toBeNull();
      expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    });
  });
});
