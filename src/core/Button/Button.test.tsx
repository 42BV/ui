/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Button from './Button';
import useShowSpinner from './useShowSpinner';

describe('Component: Button', () => {
  describe('ui', () => {
    describe('button', () => {
      describe('normal', () => {
        test('inProgress is true', () => {
          const button = shallow(
            <Button onClick={jest.fn()} inProgress={true}>
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

    describe('icon', () => {
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
    });
  });

  describe('events', () => {
    let button: ShallowWrapper;
    let onClickSpy: jest.Mock<any, any>;

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

          // @ts-ignore
          button
            .find('Button')
            .props()
            // @ts-ignore
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

          // @ts-ignore
          button
            .find('Button')
            .props()
            // @ts-ignore
            .onClick(event);

          expect(onClickSpy).toHaveBeenCalledTimes(0);
        });

        it('should not call the onClick callback when onClick is undefined', () => {
          setup({
            inProgress: false,
            hasOnClick: false
          });

          const event = new Event('click');

          button
            .find('Button')
            .props()
            // @ts-ignore
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

          // @ts-ignore
          button
            .find('Icon')
            .props()
            // @ts-ignore
            .onClick(event);

          expect(onClickSpy).toHaveBeenCalledTimes(1);
          expect(onClickSpy).toHaveBeenCalledWith(event);
        });
      });
    });
  });
});
