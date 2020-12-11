import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Button, { getIconSize, getSpinnerSize } from './Button';
import useShowSpinner from './useShowSpinner';

describe('Component: Button', () => {
  describe('ui', () => {
    describe('button', () => {
      describe('normal', () => {
        test('inProgress is true', () => {
          const button = shallow(
            <Button onClick={jest.fn()} inProgress={true} iconPosition="right">
              Save
            </Button>
          );

          expect(toJson(button)).toMatchSnapshot();
        });

        test('inProgress is false', () => {
          const button = shallow(
            <Button onClick={jest.fn()} inProgress={false}>
              Save
            </Button>
          );

          expect(toJson(button)).toMatchSnapshot();
        });
      });

      describe('outline', () => {
        test('inProgress is true', () => {
          const button = shallow(
            <Button onClick={jest.fn()} inProgress={true} outline={true}>
              Save
            </Button>
          );

          expect(toJson(button)).toMatchSnapshot();
        });

        test('inProgress is false', () => {
          const button = shallow(
            <Button onClick={jest.fn()} inProgress={false} outline={true}>
              Save
            </Button>
          );

          expect(toJson(button)).toMatchSnapshot();
        });
      });

      describe('disabled', () => {
        test('is disabled', () => {
          const button = shallow(
            <Button onClick={jest.fn()} disabled={true}>
              Save
            </Button>
          );

          expect(toJson(button)).toMatchSnapshot();
        });

        test('is enabled', () => {
          const button = shallow(
            <Button onClick={jest.fn()} disabled={false}>
              Save
            </Button>
          );

          expect(toJson(button)).toMatchSnapshot();
        });
      });

      describe('size', () => {
        test('use md by default', () => {
          const button = shallow(<Button onClick={jest.fn()}>Save</Button>);

          expect(toJson(button)).toMatchSnapshot();
        });

        test('can override size', () => {
          const button = shallow(
            <Button onClick={jest.fn()} size="sm">
              Save
            </Button>
          );

          expect(toJson(button)).toMatchSnapshot();
        });
      });

      test('full-width', () => {
        const button = shallow(
          <Button onClick={jest.fn()} fullWidth={true}>
            Save
          </Button>
        );

        expect(toJson(button)).toMatchSnapshot();
      });
    });

    describe('button with icon', () => {
      describe('normal', () => {
        test('inProgress is true', () => {
          const button = shallow(
            <Button onClick={jest.fn()} inProgress={true} icon="save">
              Save
            </Button>
          );

          expect(toJson(button)).toMatchSnapshot();
        });

        test('inProgress is false', () => {
          const button = shallow(
            <Button onClick={jest.fn()} inProgress={false} icon="save">
              Save
            </Button>
          );

          expect(toJson(button)).toMatchSnapshot();
        });

        test('with icon on the right', () => {
          const button = shallow(
            <Button onClick={jest.fn()} icon="save" iconPosition="right">
              Save
            </Button>
          );

          expect(toJson(button)).toMatchSnapshot();
        });
      });

      describe('outline', () => {
        test('inProgress is true', () => {
          const button = shallow(
            <Button
              onClick={jest.fn()}
              inProgress={true}
              outline={true}
              icon="save"
            >
              Save
            </Button>
          );

          expect(toJson(button)).toMatchSnapshot();
        });

        test('inProgress is false', () => {
          const button = shallow(
            <Button
              onClick={jest.fn()}
              inProgress={false}
              outline={true}
              icon="save"
            >
              Save
            </Button>
          );

          expect(toJson(button)).toMatchSnapshot();
        });
      });
    });

    describe('icon only', () => {
      test('that when no icon is provided it will fallback to block', () => {
        const button = shallow(<Button />);

        // @ts-expect-error Test mock
        expect(button.find('Icon').props().icon).toBe('block');
      });

      describe('inProgress', () => {
        test('inProgress is true', () => {
          const button = shallow(
            <Button onClick={jest.fn()} inProgress={true} icon="save" />
          );

          expect(toJson(button)).toMatchSnapshot();
        });

        test('inProgress is false', () => {
          const button = shallow(
            <Button onClick={jest.fn()} inProgress={false} icon="save" />
          );

          expect(toJson(button)).toMatchSnapshot();
        });
      });

      describe('disabled', () => {
        test('is disabled', () => {
          const button = shallow(
            <Button onClick={jest.fn()} icon="save" disabled={true} />
          );

          expect(toJson(button)).toMatchSnapshot();
        });

        test('is enabled', () => {
          const button = shallow(
            <Button onClick={jest.fn()} icon="save" disabled={false} />
          );

          expect(toJson(button)).toMatchSnapshot();
        });
      });

      describe('full-width', () => {
        test('full width and icon left', () => {
          const button = shallow(
            <Button
              onClick={jest.fn()}
              icon="save"
              fullWidth={true}
              iconPosition="left"
            />
          );

          expect(toJson(button)).toMatchSnapshot();
        });

        test('full width and icon right', () => {
          const button = shallow(
            <Button
              onClick={jest.fn()}
              icon="save"
              fullWidth={true}
              iconPosition="right"
            />
          );

          expect(toJson(button)).toMatchSnapshot();
        });
      });
    });
  });

  describe('events', () => {
    let button: ShallowWrapper;
    let onClickSpy: jest.Mock;

    describe('onClick', () => {
      function setup({
        inProgress,
        hasOnClick
      }: {
        inProgress: boolean;
        hasOnClick: boolean;
      }) {
        onClickSpy = jest.fn();

        jest
          .spyOn({ useShowSpinner }, 'useShowSpinner')
          .mockReturnValue(inProgress);

        const props = {
          onClick: hasOnClick ? onClickSpy : undefined,
          inProgress
        };

        button = shallow(<Button {...props}>Save</Button>);
      }

      describe('button', () => {
        it('should call the onClick callback when inProgress is false', () => {
          setup({
            inProgress: false,
            hasOnClick: true
          });

          const event = new Event('click');

          // @ts-expect-error Test mock
          button
            .find('Button')
            .props()
            // @ts-expect-error Test mock
            .onClick(event);

          expect(onClickSpy).toHaveBeenCalledTimes(1);
          expect(onClickSpy).toHaveBeenCalledWith(event);
        });

        it('should not call the onClick callback when inProgress is true and ignore the click', () => {
          setup({
            inProgress: true,
            hasOnClick: true
          });

          const event = new Event('click');

          // @ts-expect-error Test mock
          button
            .find('Button')
            .props()
            // @ts-expect-error Test mock
            .onClick(event);

          expect(onClickSpy).toHaveBeenCalledTimes(0);
        });

        it('should not call the onClick callback when onClick is undefined', () => {
          setup({
            inProgress: false,
            hasOnClick: false
          });

          const event = new Event('click');

          // @ts-expect-error Test mock
          button
            .find('Button')
            .props()
            // @ts-expect-error Test mock
            .onClick(event);

          expect(onClickSpy).toHaveBeenCalledTimes(0);
        });
      });

      describe('icon', () => {
        function setup({ inProgress }: { inProgress: boolean }) {
          onClickSpy = jest.fn();

          jest
            .spyOn({ useShowSpinner }, 'useShowSpinner')
            .mockReturnValue(inProgress);

          button = shallow(
            <Button onClick={onClickSpy} inProgress={inProgress} icon="save" />
          );
        }

        it('should call the onClick callback when inProgress is false', () => {
          setup({
            inProgress: false
          });

          const event = new Event('click');

          // @ts-expect-error Test mock
          button
            .find('Icon')
            .props()
            // @ts-expect-error Test mock
            .onClick(event);

          expect(onClickSpy).toHaveBeenCalledTimes(1);
          expect(onClickSpy).toHaveBeenCalledWith(event);
        });
      });
    });
  });
});

test('Util: getIconSize', () => {
  expect(getIconSize('lg')).toBe(39);
  expect(getIconSize('md')).toBe(35);
  expect(getIconSize('sm')).toBe(31);
});

test('Util: getSpinnerSize', () => {
  expect(getSpinnerSize('lg')).toBe(19);
  expect(getSpinnerSize('md')).toBe(16);
  expect(getSpinnerSize('sm')).toBe(12);
});
