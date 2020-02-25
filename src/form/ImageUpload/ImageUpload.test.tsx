import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as imgUploadUtils from './utils';

import ImageUpload, {
  Crop,
  limitImageSize,
  requireImage,
  Text
} from './ImageUpload';

import * as testUtils from '../../test/utils';

describe('Component: ImageUpload', () => {
  let imgUpload: ShallowWrapper;

  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;

  function setup({
    value,
    cropType,
    text,
    hasLabel = true,
    emptyLabel = false
  }: {
    value?: File | string;
    cropType: 'rect' | 'circle';
    text?: Text;
    hasLabel?: boolean;
    emptyLabel?: boolean;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    const crop: Crop =
      cropType === 'rect'
        ? { width: 500, height: 500, type: 'rect' }
        : { size: 250, type: 'circle' };

    const props = {
      crop,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      text
    };

    if (hasLabel) {
      imgUpload = shallow(
        <ImageUpload
          id="image-uploader"
          label={emptyLabel ? '' : 'Profile photo'}
          color="success"
          {...props}
        />
      );
    } else {
      imgUpload = shallow(<ImageUpload color="success" {...props} />);
    }
  }

  describe('componentDidMount', () => {
    it('should not show the image when the value is null', () => {
      // @ts-ignore
      const imgUpload = new ImageUpload();

      imgUpload.props = { value: null };
      jest.spyOn(imgUpload, 'setState');

      imgUpload.componentDidMount();

      expect(imgUpload.setState).toHaveBeenCalledTimes(0);
    });

    it('should not show the image when the value is empty string', () => {
      // @ts-ignore
      const imgUpload = new ImageUpload();

      imgUpload.props = { value: '' };
      jest.spyOn(imgUpload, 'setState');

      imgUpload.componentDidMount();

      expect(imgUpload.setState).toHaveBeenCalledTimes(0);
    });

    test('it should show the image when the value is a non empty string', () => {
      // @ts-ignore
      const imgUpload = new ImageUpload();

      imgUpload.props = { value: 'maarten.png' };
      jest.spyOn(imgUpload, 'setState').mockImplementation(() => undefined);

      imgUpload.componentDidMount();

      expect(imgUpload.setState).toHaveBeenCalledTimes(1);
      expect(imgUpload.setState).toHaveBeenCalledWith({
        mode: 'file-selected',
        imageSrc: 'maarten.png'
      });
    });
  });

  describe('ui', () => {
    test('file-selected as rect', () => {
      setup({
        value: new File([''], 'maarten.png'),
        cropType: 'rect'
      });

      imgUpload.setState({ imageSrc: 'maarten.png', mode: 'file-selected' });

      expect(toJson(imgUpload)).toMatchSnapshot(
        'Component: ImageUpload => ui => file-selected as rect'
      );
    });

    test('file-selected as circle', () => {
      setup({
        value: new File([''], 'maarten.png'),
        cropType: 'circle',
        text: {
          cancel: 'CANCEL',
          change: 'CHANGE',
          remove: 'REMOVE',
          done: 'DONE'
        }
      });

      imgUpload.setState({ imageSrc: 'maarten.png', mode: 'file-selected' });

      expect(toJson(imgUpload)).toMatchSnapshot(
        'Component: ImageUpload => ui => file-selected as circle'
      );
    });

    test('edit as rect', () => {
      setup({
        value: undefined,
        cropType: 'rect',
        text: {
          cancel: 'CANCEL',
          change: 'CHANGE',
          remove: 'REMOVE',
          done: 'DONE'
        }
      });

      imgUpload.setState({
        imageSrc: 'maarten.png',
        mode: 'edit'
      });

      expect(toJson(imgUpload)).toMatchSnapshot(
        'Component: ImageUpload => ui => edit as rect'
      );
    });

    test('edit as circle', () => {
      setup({ value: undefined, cropType: 'circle' });

      imgUpload.setState({ imageSrc: 'maarten.png', mode: 'edit' });

      expect(toJson(imgUpload)).toMatchSnapshot(
        'Component: ImageUpload => ui => edit as circle'
      );
    });

    test('no-file', () => {
      setup({ value: 'maarten.png', cropType: 'rect' });
      imgUpload.setState({ mode: 'no-file' });

      expect(toJson(imgUpload)).toMatchSnapshot(
        'Component: ImageUpload => ui => no-file'
      );
    });

    test('without label', () => {
      setup({ cropType: 'rect', hasLabel: false });

      expect(toJson(imgUpload)).toMatchSnapshot(
        'Component: ImageUpload => ui => without label'
      );
    });

    test('with empty label', () => {
      setup({ cropType: 'rect', emptyLabel: true });

      expect(toJson(imgUpload)).toMatchSnapshot(
        'Component: ImageUpload => ui => with empty label'
      );
    });

    test('file-selected as rect without label', () => {
      setup({
        value: new File([''], 'maarten.png'),
        cropType: 'rect',
        hasLabel: false
      });

      imgUpload.setState({ imageSrc: 'maarten.png', mode: 'file-selected' });

      expect(toJson(imgUpload)).toMatchSnapshot(
        'Component: ImageUpload => ui => file-selected as rect without label'
      );
    });
  });

  describe('mode: no-file events', () => {
    it('should when file is selected transition to edit mode', done => {
      setup({ value: undefined, cropType: 'circle' });

      const instance = imgUpload.instance();
      jest.spyOn(instance, 'setState');

      const file = new File([''], 'maarten.png');

      // @ts-ignore
      imgUpload
        .find('input')
        .props()
        // @ts-ignore
        .onChange({ target: { files: [file] } });

      // Wait for reader to have finished reading the file
      testUtils.waitForUI(() => {
        expect(instance.setState).toHaveBeenCalledTimes(1);
        expect(instance.setState).toHaveBeenCalledWith({
          imageSrc: 'data:;base64,',
          mode: 'edit',
          fileName: 'maarten.png',
          rotate: 0,
          scale: 1
        });
        done();
      }, 1000);
    });
  });

  describe('mode: edit events', () => {
    it('should rotate left when rotate left rotation button is clicked', () => {
      setup({ value: undefined, cropType: 'circle' });
      imgUpload.setState({ imageSrc: 'maarten.png', mode: 'edit' });

      const instance = imgUpload.instance();
      jest.spyOn(instance, 'setState');

      imgUpload
        .find('Button')
        .at(0)
        .simulate('click');

      expect(instance.setState).toHaveBeenCalledTimes(1);
      expect(instance.setState).toHaveBeenCalledWith({
        rotate: -90
      });
    });

    it('should rotate right when rotate right rotation button is clicked', () => {
      setup({ value: undefined, cropType: 'circle' });
      imgUpload.setState({ imageSrc: 'maarten.png', mode: 'edit' });

      const instance = imgUpload.instance();
      jest.spyOn(instance, 'setState');

      imgUpload
        .find('Button')
        .at(1)
        .simulate('click');

      expect(instance.setState).toHaveBeenCalledTimes(1);
      expect(instance.setState).toHaveBeenCalledWith({
        rotate: 90
      });
    });

    it('should scale the image when mouse is scrolled on avatar editor', () => {
      setup({ value: undefined, cropType: 'circle' });
      imgUpload.setState({ imageSrc: 'maarten.png', mode: 'edit', scale: 20 });

      jest.spyOn(imgUploadUtils, 'calculateScale').mockReturnValue(42);

      const instance = imgUpload.instance();
      jest.spyOn(instance, 'setState');

      const preventDefault = jest.fn();

      // @ts-ignore
      imgUpload
        .find('div')
        .at(2)
        .props()
        // @ts-ignore
        .onWheel({ deltaY: 10, preventDefault });

      expect(preventDefault).toHaveBeenCalledTimes(1);

      expect(imgUploadUtils.calculateScale).toHaveBeenCalledTimes(1);
      expect(imgUploadUtils.calculateScale).toHaveBeenCalledWith(20, 10);

      expect(instance.setState).toHaveBeenCalledTimes(1);
      expect(instance.setState).toHaveBeenCalledWith({
        scale: 42
      });
    });

    it('should reset the file input when cancel button is clicked and move to state no-file', () => {
      setup({ value: undefined, cropType: 'circle' });
      imgUpload.setState({ imageSrc: 'maarten.png', mode: 'edit' });

      const instance = imgUpload.instance();
      // @ts-ignore
      instance.inputRef = { current: null };

      imgUpload
        .find('Button')
        .at(2)
        .simulate('click');

      expect(imgUpload.state()).toEqual({
        fileName: '',
        imageSrc: '',
        mode: 'no-file',
        rotate: 0,
        scale: 1
      });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(null);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should set the final image when done button is clicked and move to state file-selected', async done => {
      setup({ value: undefined, cropType: 'circle' });

      const { promise, resolve } = testUtils.resolvablePromise();

      const resizeSpy = jest.fn(() => {
        return promise;
      });

      jest.spyOn(imgUploadUtils, 'getPicaInstance').mockImplementation(() => {
        return {
          resize: resizeSpy
        };
      });

      const file = new File([''], 'maarten.png');

      jest
        .spyOn(imgUploadUtils, 'dataUrlToFile')
        .mockImplementation(() => file);

      imgUpload.setState({ imageSrc: 'maarten.png', mode: 'edit' });

      const instance = imgUpload.instance();
      // @ts-ignore
      instance.editorRef = {
        current: { getImage: jest.fn(() => 'fakeCanvas') }
      };
      jest.spyOn(instance, 'setState');

      try {
        await imgUpload
          .find('Button')
          .at(3)
          .simulate('click');

        resolve({
          toDataURL: jest.fn(() => 'Some base 64 string')
        });

        await promise;

        expect(resizeSpy).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(resizeSpy.mock.calls[0][0]).toBe('fakeCanvas');
        // @ts-ignore
        expect(resizeSpy.mock.calls[0][2]).toEqual({ alpha: true });

        // @ts-ignore
        const offScreenCanvas = resizeSpy.mock.calls[0][1];
        // @ts-ignore
        expect(offScreenCanvas.width).toBe(250);
        // @ts-ignore
        expect(offScreenCanvas.height).toBe(250);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(file);

        expect(onBlurSpy).toHaveBeenCalledTimes(1);

        expect(instance.setState).toHaveBeenCalledTimes(1);
        expect(instance.setState).toHaveBeenCalledWith({
          mode: 'file-selected',
          imageSrc: 'Some base 64 string'
        });

        done();
      } catch (error) {
        console.error(error);
        done.fail();
      }
    });
  });

  describe('mode: file-selected events', () => {
    it('should reset to no-file when clicking the remove button ', () => {
      setup({ value: new File([''], 'maarten.png'), cropType: 'rect' });
      imgUpload.setState({ imageSrc: 'maarten.png', mode: 'file-selected' });

      // @ts-ignore
      imgUpload.instance().inputRef = { current: { value: 'maarten.png' } };

      // @ts-ignore
      imgUpload
        .find('Button')
        .at(1)
        .prop('onClick')();

      expect(imgUpload.state()).toEqual({
        fileName: '',
        imageSrc: '',
        mode: 'no-file',
        rotate: 0,
        scale: 1
      });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(null);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);

      // @ts-ignore
      expect(imgUpload.instance().inputRef.current.value).toBe('');
    });

    it('should reset to no file and trigger the file input so user can select a new image', () => {
      jest.useFakeTimers();

      setup({ value: new File([''], 'maarten.png'), cropType: 'rect' });
      imgUpload.setState({ imageSrc: 'maarten.png', mode: 'file-selected' });

      const instance = imgUpload.instance();
      // @ts-ignore
      instance.inputRef = { current: { click: jest.fn() } };

      jest
        // @ts-ignore
        .spyOn(instance, 'resetFileInput')
        .mockImplementation(() => undefined);

      // @ts-ignore
      imgUpload
        .find('Button')
        .at(0)
        .prop('onClick')();

      // @ts-ignore
      expect(instance.resetFileInput).toHaveBeenCalledTimes(1);

      // @ts-ignore
      expect(instance.inputRef.current.click).toHaveBeenCalledTimes(0);

      jest.runAllTimers();

      // @ts-ignore
      expect(instance.inputRef.current.click).toHaveBeenCalledTimes(1);
    });
  });
});

test('requireImage', () => {
  const validator = requireImage('profile picture');

  expect(validator(undefined, {})).toEqual({
    data: { label: 'profile picture' },
    key: 'ImageUpload.REQUIRED',
    fallback: 'profile picture is required'
  });
  expect(validator(null, {})).toEqual({
    data: { label: 'profile picture' },
    key: 'ImageUpload.REQUIRED',
    fallback: 'profile picture is required'
  });

  expect(validator(new File([''], 'henkie.png'), {})).toBe(undefined);
});

test('limitImageSize', () => {
  const validator = limitImageSize(1, 'profile picture');

  expect(validator(undefined, {})).toBe(undefined);
  expect(validator(null, {})).toBe(undefined);

  const smallFile = new File([''], 'small.png');
  expect(validator(smallFile, {})).toBe(undefined);

  const largeFile = new File(
    ['very large image string'.repeat(100000)],
    'large.png'
  );
  expect(validator(largeFile, {})).toEqual({
    data: { fileSize: '2.2', label: 'profile picture', size: '1.0' },
    fallback:
      'profile picture image is to large. Max size is 1.0 MB image size is 2.2 MB',
    key: 'ImageUpload.SIZE_TOO_LARGE'
  });
});
