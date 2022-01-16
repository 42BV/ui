import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Icon from './Icon';
import * as components from './index';
import * as UseHover from '../../hooks/useHover/useHover';

describe('index', () => {
  it('should contain exports', () => {
    expect(components).toMatchSnapshot();
  });
});

describe('Icon', () => {
  describe('ui', () => {
    test('default', () => {
      const icon = shallow(<Icon icon="alarm" />);
      expect(toJson(icon)).toMatchSnapshot('Icon => ui => default');
    });

    test('with id', () => {
      const icon = shallow(<Icon icon="alarm" id="1337" />);
      expect(toJson(icon)).toMatchSnapshot('Icon => ui => with id');
    });

    test('with color', () => {
      const icon = shallow(<Icon icon="alarm" id="1337" color="danger" />);
      expect(toJson(icon)).toMatchSnapshot('Icon => ui => with color');
    });

    test('with className', () => {
      const icon = shallow(<Icon icon="alarm" className="text-danger" />);
      expect(toJson(icon)).toMatchSnapshot('Icon => ui => with className');
    });

    test('is clickable', () => {
      const icon = shallow(<Icon icon="alarm" onClick={() => undefined} />);
      expect(toJson(icon)).toMatchSnapshot('Icon => ui => is clickable');
    });

    test('is not clickable', () => {
      const icon = shallow(<Icon icon="alarm" onClick={undefined} />);
      expect(toJson(icon)).toMatchSnapshot('Icon => ui => is not clickable');
    });

    test('is disabled', () => {
      const icon = shallow(
        <Icon icon="alarm" onClick={() => undefined} disabled={true} />
      );
      expect(toJson(icon)).toMatchSnapshot('Icon => ui => is disabled');
    });

    test('is enabled', () => {
      const icon = shallow(<Icon icon="alarm" disabled={false} />);
      expect(toJson(icon)).toMatchSnapshot('Icon => ui => is enabled');
    });

    test('with size', () => {
      const icon = shallow(<Icon icon="alarm" size={144} />);
      expect(toJson(icon)).toMatchSnapshot('Icon => ui => with size');
    });

    test('with hoverColor', () => {
      const icon = shallow(<Icon icon="alarm" size={144} color="secondary" hoverColor="primary" />);
      expect(toJson(icon)).toMatchSnapshot('Icon => ui => with hoverColor');
    });

    test('with onClick', () => {
      const icon = shallow(<Icon icon="alarm" size={144} color="secondary" hoverColor="primary" onClick={jest.fn()} />);
      expect(toJson(icon)).toMatchSnapshot('Icon => ui => with onClick');
    });
  });

  describe('events', () => {
    it('should call the "onClick" event when the icon is clicked', () => {
      const onClickSpy = jest.fn();

      const icon = shallow(<Icon icon="alarm" onClick={onClickSpy} />);
      icon.find('i').simulate('click');

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should call the "onClick" event when the icon is clicked and is explicitly enabled', () => {
      const onClickSpy = jest.fn();

      const icon = shallow(
        <Icon icon="alarm" onClick={onClickSpy} disabled={false} />
      );
      icon.find('i').simulate('click');

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call the "onClick" event when the icon is clicked but is disabled', () => {
      const onClickSpy = jest.fn();

      const icon = shallow(
        <Icon icon="alarm" onClick={onClickSpy} disabled={true} />
      );
      icon.find('i').simulate('click');

      expect(onClickSpy).toHaveBeenCalledTimes(0);
    });

    describe('hover', () => {
      it('should change color when hoverColor is defined', () => {
        jest
          .spyOn(UseHover, 'useHover')
          .mockReturnValue([
            true,
            { onMouseEnter: jest.fn(), onMouseLeave: jest.fn() }
          ]);

        const icon = shallow(
          <Icon icon="alarm" color="secondary" onClick={jest.fn()} hoverColor="primary" />
        );

        expect(toJson(icon)).toMatchSnapshot('Icon => events => hover => should change color when hoverColor is defined');
      });

      it('should not change color when onClick is not defined', () => {
        jest
          .spyOn(UseHover, 'useHover')
          .mockReturnValue([
            true,
            { onMouseEnter: jest.fn(), onMouseLeave: jest.fn() }
          ]);

        const icon = shallow(
          <Icon icon="alarm" color="secondary" hoverColor="primary" />
        );

        expect(toJson(icon)).toMatchSnapshot('Icon => events => hover => should not change color when onClick is not defined');
      });

      it('should not change color when disabled', () => {
        jest
          .spyOn(UseHover, 'useHover')
          .mockReturnValue([
            true,
            { onMouseEnter: jest.fn(), onMouseLeave: jest.fn() }
          ]);

        const icon = shallow(
          <Icon icon="alarm" color="secondary" onClick={jest.fn()} disabled={true} hoverColor="primary" />
        );

        expect(toJson(icon)).toMatchSnapshot('Icon => events => hover => should not change color when disabled');
      });
    });
  });
});
