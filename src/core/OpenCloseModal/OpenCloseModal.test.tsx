import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { RadioGroup } from '../../form/RadioGroup/RadioGroup';

import { OpenCloseModal } from './OpenCloseModal';

describe('Component: OpenCloseModal', () => {
  function setup({
    isOpen = false,
    hasLabel = true,
    hasCustomText = false,
    hasButtons = true,
    inProgress = undefined,
    stickyFooter = undefined
  }: {
    isOpen?: boolean;
    hasLabel?: boolean;
    hasCustomText?: boolean;
    hasButtons?: boolean;
    inProgress?: boolean;
    stickyFooter?: boolean;
  }) {
    const onCloseSpy = vi.fn();
    const onSaveSpy = vi.fn();

    const props = {
      isOpen,
      inProgress,
      stickyFooter,
      onClose: onCloseSpy,
      text: hasCustomText
        ? { cancel: 'Stop please', save: 'Select me' }
        : undefined,
      label: hasLabel ? 'Choose something' : undefined,
      onSave: hasButtons ? onSaveSpy : undefined
    };

    const children = (
      <RadioGroup<string>
        onChange={vi.fn()}
        options={['local', 'development', 'test', 'acceptation', 'production']}
        labelForOption={(v) => v}
        label="Environment"
      />
    );

    const { container } = render(
      <OpenCloseModal {...props}>{children}</OpenCloseModal>
    );

    return { container, onCloseSpy, onSaveSpy };
  }

  describe('ui', () => {
    test('open', () => {
      setup({ isOpen: true });
      expect(document.body.lastChild).toMatchSnapshot();
    });

    test('not open', () => {
      const { container } = setup({ isOpen: false });
      expect(container.firstChild).toBeNull();
    });

    test('with label', async () => {
      expect.assertions(0);
      setup({ isOpen: true });
      await screen.findByText('Choose something');
    });

    test('without label', () => {
      setup({ isOpen: true, hasLabel: false });
      expect(screen.queryByText('Choose something')).toBeNull();
    });

    test('without buttons', () => {
      setup({ isOpen: true, hasButtons: false });
      expect(screen.queryAllByRole('button').length).toBe(1);
      expect(screen.queryByText('save')).toBeNull();
      expect(screen.queryByText('cancel')).toBeNull();
    });

    test('custom button texts', () => {
      setup({ isOpen: true, hasCustomText: true });
      expect(screen.queryAllByRole('button').length).toBe(3);
      expect(screen.queryAllByRole('button')[1].textContent).toBe(
        'cancelStop please'
      );
      expect(screen.queryAllByRole('button')[2].textContent).toBe(
        'saveSelect me'
      );
    });

    test('in progress', () => {
      setup({ isOpen: true, inProgress: true });
      expect(document.body.lastChild).toMatchSnapshot();
    });

    test('sans sticky footer', () => {
      setup({ isOpen: true, stickyFooter: false });
      expect(
        // @ts-expect-error HTMLElement has property classList
        document.body.lastChild?.firstChild?.classList.contains('sticky-modal')
      ).toBe(false);
    });
  });

  describe('events', () => {
    it('should call onClose when cancel button clicked', () => {
      const { onCloseSpy } = setup({ isOpen: true });

      fireEvent.click(screen.getByText('Cancel'));

      expect(onCloseSpy).toBeCalledTimes(1);
    });

    it('should call onSave when save button clicked', () => {
      const { onSaveSpy } = setup({ isOpen: true });

      fireEvent.click(screen.getByText('Save'));

      expect(onSaveSpy).toBeCalledTimes(1);
    });
  });
});
