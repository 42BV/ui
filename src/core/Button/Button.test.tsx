import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Button, getIconSize, getSpinnerSize } from './Button';
import { useShowSpinner } from './useShowSpinner';

describe('Component: Button', () => {
  describe('ui', () => {
    describe('button', () => {
      describe('normal', () => {
        test('inProgress is true', () => {
          const { container } = render(
            <Button onClick={jest.fn()} inProgress={true} iconPosition="right">
              Save
            </Button>
          );

          expect(container).toMatchSnapshot();
        });

        test('inProgress is false', () => {
          const { container } = render(
            <Button onClick={jest.fn()} inProgress={false}>
              Save
            </Button>
          );

          expect(container).toMatchSnapshot();
        });
      });

      describe('outline', () => {
        test('inProgress is true', () => {
          const { container } = render(
            <Button onClick={jest.fn()} inProgress={true} outline={true}>
              Save
            </Button>
          );

          expect(container).toMatchSnapshot();
        });

        test('inProgress is false', () => {
          const { container } = render(
            <Button onClick={jest.fn()} inProgress={false} outline={true}>
              Save
            </Button>
          );

          expect(container).toMatchSnapshot();
        });
      });

      describe('disabled', () => {
        test('is disabled', () => {
          const { container } = render(
            <Button onClick={jest.fn()} disabled={true}>
              Save
            </Button>
          );

          expect(container).toMatchSnapshot();
        });

        test('is enabled', () => {
          const { container } = render(
            <Button onClick={jest.fn()} disabled={false}>
              Save
            </Button>
          );

          expect(container).toMatchSnapshot();
        });
      });

      describe('size', () => {
        test('use md by default', () => {
          const { container } = render(
            <Button onClick={jest.fn()}>Save</Button>
          );

          expect(container).toMatchSnapshot();
        });

        test('can override size', () => {
          const { container } = render(
            <Button onClick={jest.fn()} size="sm">
              Save
            </Button>
          );

          expect(container).toMatchSnapshot();
        });
      });

      test('full-width', () => {
        const { container } = render(
          <Button onClick={jest.fn()} fullWidth={true}>
            Save
          </Button>
        );

        expect(container).toMatchSnapshot();
      });
    });

    describe('button with icon', () => {
      describe('normal', () => {
        test('inProgress is true', () => {
          const { container } = render(
            <Button onClick={jest.fn()} inProgress={true} icon="save">
              Save
            </Button>
          );

          expect(container).toMatchSnapshot();
        });

        test('inProgress is false', () => {
          const { container } = render(
            <Button onClick={jest.fn()} inProgress={false} icon="save">
              Save
            </Button>
          );

          expect(container).toMatchSnapshot();
        });

        test('with icon on the right', () => {
          const { container } = render(
            <Button onClick={jest.fn()} icon="save" iconPosition="right">
              Save
            </Button>
          );

          expect(container).toMatchSnapshot();
        });
      });

      describe('outline', () => {
        test('inProgress is true', () => {
          const { container } = render(
            <Button
              onClick={jest.fn()}
              inProgress={true}
              outline={true}
              icon="save"
            >
              Save
            </Button>
          );

          expect(container).toMatchSnapshot();
        });

        test('inProgress is false', () => {
          const { container } = render(
            <Button
              onClick={jest.fn()}
              inProgress={false}
              outline={true}
              icon="save"
            >
              Save
            </Button>
          );

          expect(container).toMatchSnapshot();
        });
      });
    });

    describe('icon only', () => {
      test('that when no icon is provided it will fallback to block', () => {
        const { container } = render(
          <Button />
        );

        expect(container).toMatchSnapshot();
      });

      describe('inProgress', () => {
        test('inProgress is true', () => {
          const { container } = render(
            <Button onClick={jest.fn()} inProgress={true} icon="save" />
          );

          expect(container).toMatchSnapshot();
        });

        test('inProgress is false', () => {
          const { container } = render(
            <Button onClick={jest.fn()} inProgress={false} icon="save" />
          );

          expect(container).toMatchSnapshot();
        });
      });

      describe('disabled', () => {
        test('is disabled', () => {
          const { container } = render(
            <Button onClick={jest.fn()} icon="save" disabled={true} />
          );

          expect(container).toMatchSnapshot();
        });

        test('is enabled', () => {
          const { container } = render(
            <Button onClick={jest.fn()} icon="save" disabled={false} />
          );

          expect(container).toMatchSnapshot();
        });
      });

      describe('full-width', () => {
        test('full width and icon left', () => {
          const { container } = render(
            <Button
              onClick={jest.fn()}
              icon="save"
              fullWidth={true}
              iconPosition="left"
            />
          );

          expect(container).toMatchSnapshot();
        });

        test('full width and icon right', () => {
          const { container } = render(
            <Button
              onClick={jest.fn()}
              icon="save"
              fullWidth={true}
              iconPosition="right"
            />
          );

          expect(container).toMatchSnapshot();
        });
      });
    });
  });

  describe('events', () => {
    describe('onClick', () => {
      function setup({
        inProgress,
        hasOnClick
      }: {
        inProgress: boolean;
        hasOnClick: boolean;
      }) {
        const onClickSpy = jest.fn();

        jest
          .spyOn({ useShowSpinner }, 'useShowSpinner')
          .mockReturnValue(inProgress);

        const props = {
          onClick: hasOnClick ? onClickSpy : undefined,
          inProgress
        };

        const { container } = render(
          <Button {...props}>Save</Button>
        );

        return { container, onClickSpy };
      }

      describe('button', () => {
        it('should call the onClick callback when inProgress is false', () => {
          const { onClickSpy } = setup({
            inProgress: false,
            hasOnClick: true
          });

          fireEvent.click(screen.getByText('Save'));

          expect(onClickSpy).toHaveBeenCalledTimes(1);
        });

        it('should not call the onClick callback when inProgress is true and ignore the click', () => {
          const { onClickSpy } = setup({
            inProgress: true,
            hasOnClick: true
          });

          fireEvent.click(screen.getByText('Save'));

          expect(onClickSpy).toHaveBeenCalledTimes(0);
        });

        it('should not call the onClick callback when onClick is undefined', () => {
          const { onClickSpy } = setup({
            inProgress: false,
            hasOnClick: false
          });

          fireEvent.click(screen.getByText('Save'));

          expect(onClickSpy).toHaveBeenCalledTimes(0);
        });
      });

      describe('icon', () => {
        function setup({ inProgress }: { inProgress: boolean }) {
          const onClickSpy = jest.fn();

          jest
            .spyOn({ useShowSpinner }, 'useShowSpinner')
            .mockReturnValue(inProgress);

          const { container } = render(
            <Button onClick={onClickSpy} inProgress={inProgress} icon="save" />
          );

          return { container, onClickSpy };
        }

        it('should call the onClick callback when inProgress is false', () => {
          const { onClickSpy } = setup({
            inProgress: false
          });

          fireEvent.click(screen.getByText('save'));

          expect(onClickSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

test('Util: getIconSize', () => {
  expect(getIconSize('lg')).toBe(32);
  expect(getIconSize('md')).toBe(24);
  expect(getIconSize('sm')).toBe(16);
});

test('Util: getSpinnerSize', () => {
  expect(getSpinnerSize('lg')).toBe(19);
  expect(getSpinnerSize('md')).toBe(16);
  expect(getSpinnerSize('sm')).toBe(12);
});
