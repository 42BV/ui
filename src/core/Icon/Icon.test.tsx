import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { Icon } from './Icon';
import * as components from './index';

describe('index', () => {
  it('should contain exports', () => {
    expect(components).toMatchSnapshot();
  });
});

describe('Icon', () => {
  describe('ui', () => {
    test('default', () => {
      const { container } = render(<Icon icon="alarm" />);
      expect(container).toMatchSnapshot();
    });

    test('with id', () => {
      const { container } = render(<Icon icon="alarm" id="1337" />);
      expect(container).toMatchSnapshot();
    });

    test('with color', () => {
      const { container } = render(
        <Icon icon="alarm" id="1337" color="danger" />
      );
      expect(container.firstChild).toHaveClass('text-danger');
    });

    test('with className', () => {
      const { container } = render(
        <Icon icon="alarm" className="text-danger" />
      );
      expect(container.firstChild).toHaveClass('text-danger');
    });

    test('is clickable', () => {
      const { container } = render(
        <Icon icon="alarm" onClick={() => undefined} />
      );
      expect(container.firstChild).toHaveClass('clickable');
    });

    test('is not clickable', () => {
      const { container } = render(<Icon icon="alarm" onClick={undefined} />);
      expect(container.firstChild).not.toHaveClass('clickable');
    });

    test('is disabled', () => {
      const { container } = render(
        <Icon icon="alarm" onClick={() => undefined} disabled={true} />
      );
      expect(container.firstChild).toHaveClass('icon--disabled');
    });

    test('is enabled', () => {
      const { container } = render(<Icon icon="alarm" disabled={false} />);
      expect(container.firstChild).not.toHaveClass('icon--disabled');
    });

    test('with size', () => {
      const { container } = render(<Icon icon="alarm" size={144} />);
      expect(container.firstChild).toHaveStyle({ fontSize: 144 });
    });

    test('with variant', () => {
      const { container } = render(<Icon icon="alarm" variant="outlined" />);
      expect(container.firstChild).toHaveClass('material-icons__outlined');
    });
  });

  describe('hoverColor', () => {
    it('should use hoverColor when onClick and hoverColor are defined', async () => {
      expect.assertions(1);
      const { container } = render(
        <Icon
          icon="alarm"
          color="secondary"
          hoverColor="primary"
          onClick={jest.fn()}
        />
      );
      await userEvent.hover(screen.getByText('alarm'));
      expect(container.firstChild).toHaveClass('text-primary');
    });

    it('should not use hoverColor when onClick is not defined', async () => {
      expect.assertions(1);
      const { container } = render(
        <Icon icon="alarm" color="secondary" hoverColor="primary" />
      );
      await userEvent.hover(screen.getByText('alarm'));
      expect(container.firstChild).toHaveClass('text-secondary');
    });

    it('should not use hoverColor when onClick and hoverColor are defined but icon is disabled', async () => {
      expect.assertions(1);
      const { container } = render(
        <Icon
          icon="alarm"
          color="secondary"
          hoverColor="primary"
          onClick={jest.fn()}
          disabled={true}
        />
      );
      await userEvent.hover(screen.getByText('alarm'));
      expect(container.firstChild).toHaveClass('text-secondary');
    });
  });

  describe('events', () => {
    it('should call the "onClick" event when the icon is clicked', () => {
      const onClickSpy = jest.fn();

      render(<Icon icon="alarm" onClick={onClickSpy} />);

      fireEvent.click(screen.getByText('alarm'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
    it('should call the "onClick" event when the icon has focus and the enter key is pressed', () => {
      const onClickSpy = jest.fn();

      render(<Icon icon="alarm" onClick={onClickSpy} />);

      fireEvent.keyUp(screen.getByText('alarm'), { key: 'Enter' });

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should call the "onClick" event when the icon is clicked and is explicitly enabled', () => {
      const onClickSpy = jest.fn();

      render(<Icon icon="alarm" onClick={onClickSpy} disabled={false} />);

      fireEvent.click(screen.getByText('alarm'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call the "onClick" event when the icon is clicked but is disabled', () => {
      const onClickSpy = jest.fn();

      render(<Icon icon="alarm" onClick={onClickSpy} disabled={true} />);

      fireEvent.click(screen.getByText('alarm'));

      expect(onClickSpy).toHaveBeenCalledTimes(0);
    });
  });
});
