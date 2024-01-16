import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { RadioGroup } from '../../form/RadioGroup/RadioGroup';

import { Modal } from './Modal';

describe('Component: Modal', () => {
  function setup({
    hasHeader = true,
    hasFooter = true,
    stickyFooter
  }: {
    hasHeader?: boolean;
    hasFooter?: boolean;
    stickyFooter?: boolean;
  }) {
    const onCloseSpy = jest.fn();

    const props = {
      stickyFooter,
      onClose: onCloseSpy,
      header: hasHeader ? 'Header text' : undefined,
      footer: hasFooter ? 'Footer text' : undefined
    };

    const children = (
      <RadioGroup<string>
        onChange={jest.fn()}
        options={['local', 'development', 'test', 'acceptation', 'production']}
        labelForOption={(v) => v}
        label="Environment"
      />
    );

    const { container } = render(<Modal {...props}>{children}</Modal>);

    return { container, onCloseSpy };
  }

  describe('ui', () => {
    test('with header and footer', () => {
      setup({});

      expect(document.body.lastChild).toMatchSnapshot();
    });

    test('without header', () => {
      setup({ hasHeader: false });

      expect(screen.queryByText('Header text')).not.toBeInTheDocument();
      expect(document.body.lastChild).toMatchSnapshot();
    });

    test('without footer', () => {
      setup({ hasFooter: false });

      expect(screen.queryByText('Footer text')).not.toBeInTheDocument();
      expect(document.body.lastChild).toMatchSnapshot();
    });

    test('sticky footer', () => {
      setup({ stickyFooter: true });

      expect(
        document.body.lastChild?.firstChild?.firstChild?.firstChild
      ).toHaveClass('modal-dialog-scrollable');
    });

    test('scrollable', () => {
      setup({ stickyFooter: false });

      expect(
        document.body.lastChild?.firstChild?.firstChild?.firstChild
      ).not.toHaveClass('modal-dialog-scrollable');
    });
  });

  describe('events', () => {
    it('should call onClose when close button clicked', () => {
      const { onCloseSpy } = setup({});

      fireEvent.click(screen.getByLabelText('Close'));

      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });
  });
});
