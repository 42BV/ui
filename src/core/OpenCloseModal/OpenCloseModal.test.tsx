import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
    const onCloseSpy = jest.fn();
    const onSaveSpy = jest.fn();

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
        onChange={jest.fn()}
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

    test('with label', () => {
      setup({ isOpen: true });
      expect(screen.queryByText('Choose something')).toBeInTheDocument();
    });

    test('without label', () => {
      setup({ isOpen: true, hasLabel: false });
      expect(screen.queryByText('Choose something')).not.toBeInTheDocument();
    });

    test('with buttons', () => {
      setup({ isOpen: true, hasButtons: true });
      expect(screen.queryAllByRole('button').length).toBe(3);
      expect(screen.queryByText('save')).toBeInTheDocument();
      expect(screen.queryByText('cancel')).toBeInTheDocument();
    });

    test('without buttons', () => {
      setup({ isOpen: true, hasButtons: false });
      expect(screen.queryAllByRole('button').length).toBe(1);
      expect(screen.queryByText('save')).not.toBeInTheDocument();
      expect(screen.queryByText('cancel')).not.toBeInTheDocument();
    });

    test('custom button texts', () => {
      setup({ isOpen: true, hasCustomText: true });
      expect(screen.queryAllByRole('button').length).toBe(3);
      expect(screen.queryAllByRole('button')[1]).toHaveTextContent(
        'cancelStop please'
      );
      expect(screen.queryAllByRole('button')[2]).toHaveTextContent(
        'saveSelect me'
      );
    });

    test('in progress', () => {
      setup({ isOpen: true, inProgress: true });
      expect(document.body.lastChild).toMatchSnapshot();
    });

    test('sticky footer', () => {
      setup({ isOpen: true, stickyFooter: true });
      expect(
        document.body.lastChild?.firstChild?.firstChild?.firstChild
      ).toHaveClass('modal-dialog-scrollable');
    });

    test('sans sticky footer', () => {
      setup({ isOpen: true, stickyFooter: false });
      expect(
        document.body.lastChild?.firstChild?.firstChild?.firstChild
      ).not.toHaveClass('modal-dialog-scrollable');
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
