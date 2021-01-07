import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as imgUploadUtils from './utils';

import ImageUpload, {
  ImageUploadCrop,
  limitImageSize,
  requireImage,
  Text
} from './ImageUpload';

import * as testUtils from '../../test/utils';

describe('Component: ImageUpload', () => {
  let imgUpload: ShallowWrapper;

  let onChangeSpy: jest.Mock;
  let onBlurSpy: jest.Mock;

  function setup({
    value,
    cropType,
    text,
    hasLabel = true,
    emptyLabel = false,
    keepOriginalFileExtension
  }: {
    value?: File | string;
    cropType: 'rect' | 'circle';
    text?: Text;
    hasLabel?: boolean;
    emptyLabel?: boolean;
    keepOriginalFileExtension?: boolean;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    const crop: ImageUploadCrop =
      cropType === 'rect'
        ? { width: 500, height: 500, type: 'rect' }
        : { size: 250, type: 'circle' };

    const props = {
      crop,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      text,
      keepOriginalFileExtension
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
      // @ts-expect-error Test mock
      const imgUpload = new ImageUpload();

      // @ts-expect-error Test mock
      imgUpload.props = { value: null, id: 1 };
      jest.spyOn(imgUpload, 'setState');

      imgUpload.componentDidMount();

      expect(imgUpload.setState).toHaveBeenCalledTimes(0);
    });

    it('should not show the image when the value is empty string', () => {
      // @ts-expect-error Test mock
      const imgUpload = new ImageUpload();

      // @ts-expect-error Test mock
      imgUpload.props = { value: '' };
      jest.spyOn(imgUpload, 'setState');

      imgUpload.componentDidMount();

      expect(imgUpload.setState).toHaveBeenCalledTimes(0);
    });

    test('it should show the image when the value is a non empty string', () => {
      // @ts-expect-error Test mock
      const imgUpload = new ImageUpload();

      // @ts-expect-error Test mock
      imgUpload.props = { value: 'maarten.png' };
      jest.spyOn(imgUpload, 'setState').mockImplementation(() => undefined);

      imgUpload.componentDidMount();

      expect(imgUpload.setState).toHaveBeenCalledTimes(1);
      expect(imgUpload.setState).toHaveBeenCalledWith({
        mode: 'file-selected',
        imageSrc: 'maarten.png'
      });
    });

    test('it should show the image when the value is a File', () => {
      // @ts-expect-error Test mock
      const imgUpload = new ImageUpload();

      // @ts-expect-error Test mock
      imgUpload.props = { value: new File([''], 'maarten.png') };
      jest.spyOn(imgUpload, 'setState').mockImplementation(() => undefined);
      jest
        .spyOn(imgUpload, 'readFile')
        .mockImplementation((file: File, callback: (result: string) => void) =>
          callback('test')
        );

      imgUpload.componentDidMount();

      expect(imgUpload.setState).toHaveBeenCalledTimes(1);
      expect(imgUpload.setState).toHaveBeenCalledWith({
        mode: 'file-selected',
        fileName: 'maarten.png',
        imageSrc: 'test'
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
    it('should when file is selected transition to edit mode', (done) => {
      setup({ value: undefined, cropType: 'circle' });

      const instance = imgUpload.instance();
      jest.spyOn(instance, 'setState');

      const file = new File([''], 'maarten.png');

      // @ts-expect-error Test mock
      imgUpload
        .find('input')
        .props()
        // @ts-expect-error Test mock
        .onChange({ target: { files: [file] } });

      // Wait for reader to have finished reading the file
      testUtils.waitForUI(() => {
        expect(instance.setState).toHaveBeenCalledTimes(1);
        expect(instance.setState).toHaveBeenCalledWith({
          imageSrc: 'data:application/octet-stream;base64,',
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

      imgUpload.find('Button').at(0).simulate('click');

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

      imgUpload.find('Button').at(1).simulate('click');

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

      // @ts-expect-error Test mock
      imgUpload
        .find('div')
        .at(2)
        .props()
        // @ts-expect-error Test mock
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
      // @ts-expect-error Test mock
      instance.inputRef = { current: null };

      imgUpload.find('Button').at(2).simulate('click');

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

    it('should set the final image when done button is clicked and move to state file-selected', async (done) => {
      expect.assertions(10);

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

      imgUpload.setState({
        imageSrc: 'maarten.png',
        mode: 'edit',
        fileName: 'maarten.png'
      });

      const instance = imgUpload.instance();
      // @ts-expect-error Test mock
      instance.editorRef = {
        current: { getImage: jest.fn(() => 'fakeCanvas') }
      };
      jest.spyOn(instance, 'setState');

      try {
        await imgUpload.find('Button').at(3).simulate('click');

        resolve({
          toDataURL: jest.fn(() => 'Some base 64 string')
        });

        await promise;

        expect(resizeSpy).toHaveBeenCalledTimes(1);
        // @ts-expect-error Test mock
        expect(resizeSpy.mock.calls[0][0]).toBe('fakeCanvas');
        // @ts-expect-error Test mock
        expect(resizeSpy.mock.calls[0][2]).toEqual({ alpha: true });

        // @ts-expect-error Test mock
        const offScreenCanvas = resizeSpy.mock.calls[0][1];
        // @ts-expect-error Test mock
        expect(offScreenCanvas.width).toBe(250);
        // @ts-expect-error Test mock
        expect(offScreenCanvas.height).toBe(250);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(file);

        expect(onBlurSpy).toHaveBeenCalledTimes(1);

        expect(instance.setState).toHaveBeenCalledTimes(1);
        expect(instance.setState).toHaveBeenCalledWith({
          mode: 'file-selected',
          imageSrc: 'Some base 64 string',
          fileName: 'maarten.png'
        });

        done();
      } catch (error) {
        console.error(error);
        done.fail();
      }
    });

    it('should replace the file extension when keepOriginalFileExtension is undefined', async (done) => {
      expect.assertions(2);

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

      const file = new File([''], 'maarten.jpg');

      jest
        .spyOn(imgUploadUtils, 'dataUrlToFile')
        .mockImplementation(() => file);

      imgUpload.setState({
        imageSrc: 'maarten.jpg',
        mode: 'edit',
        fileName: 'maarten.jpg'
      });

      const instance = imgUpload.instance();
      // @ts-expect-error Test mock
      instance.editorRef = {
        current: { getImage: jest.fn(() => 'fakeCanvas') }
      };
      jest.spyOn(instance, 'setState');

      try {
        await imgUpload.find('Button').at(3).simulate('click');

        resolve({
          toDataURL: jest.fn(() => 'Some base 64 string')
        });

        await promise;

        expect(instance.setState).toHaveBeenCalledTimes(1);
        expect(instance.setState).toHaveBeenCalledWith({
          mode: 'file-selected',
          imageSrc: 'Some base 64 string',
          fileName: 'maarten.png'
        });

        done();
      } catch (error) {
        console.error(error);
        done.fail();
      }
    });

    it('should not replace the file extension when keepOriginalFileExtension is true', async (done) => {
      expect.assertions(2);

      setup({
        value: undefined,
        cropType: 'circle',
        keepOriginalFileExtension: true
      });

      const { promise, resolve } = testUtils.resolvablePromise();

      const resizeSpy = jest.fn(() => {
        return promise;
      });

      jest.spyOn(imgUploadUtils, 'getPicaInstance').mockImplementation(() => {
        return {
          resize: resizeSpy
        };
      });

      const file = new File([''], 'maarten.jpg');

      jest
        .spyOn(imgUploadUtils, 'dataUrlToFile')
        .mockImplementation(() => file);

      imgUpload.setState({
        imageSrc: 'maarten.jpg',
        mode: 'edit',
        fileName: 'maarten.jpg'
      });

      const instance = imgUpload.instance();
      // @ts-expect-error Test mock
      instance.editorRef = {
        current: { getImage: jest.fn(() => 'fakeCanvas') }
      };
      jest.spyOn(instance, 'setState');

      try {
        await imgUpload.find('Button').at(3).simulate('click');

        resolve({
          toDataURL: jest.fn(() => 'Some base 64 string')
        });

        await promise;

        expect(instance.setState).toHaveBeenCalledTimes(1);
        expect(instance.setState).toHaveBeenCalledWith({
          mode: 'file-selected',
          imageSrc: 'Some base 64 string',
          fileName: 'maarten.jpg'
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

      // @ts-expect-error Test mock
      imgUpload.instance().inputRef = { current: { value: 'maarten.png' } };

      // @ts-expect-error Test mock
      imgUpload.find('Button').at(1).prop('onClick')();

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

      // @ts-expect-error Test mock
      expect(imgUpload.instance().inputRef.current.value).toBe('');
    });

    it('should reset to no file and trigger the file input so user can select a new image', () => {
      jest.useFakeTimers();

      setup({ value: new File([''], 'maarten.png'), cropType: 'rect' });
      imgUpload.setState({ imageSrc: 'maarten.png', mode: 'file-selected' });

      const instance = imgUpload.instance();
      // @ts-expect-error Test mock
      instance.inputRef = { current: { click: jest.fn() } };

      jest
        // @ts-expect-error Test mock
        .spyOn(instance, 'resetFileInput')
        .mockImplementation(() => undefined);

      // @ts-expect-error Test mock
      imgUpload.find('Button').at(0).prop('onClick')();

      // @ts-expect-error Test mock
      expect(instance.resetFileInput).toHaveBeenCalledTimes(1);

      // @ts-expect-error Test mock
      expect(instance.inputRef.current.click).toHaveBeenCalledTimes(0);

      jest.runAllTimers();

      // @ts-expect-error Test mock
      expect(instance.inputRef.current.click).toHaveBeenCalledTimes(1);
    });
  });
});

test('requireImage', () => {
  const validator = requireImage('profile picture');

  // @ts-expect-error Even though it accepts Value it will be given undefined and null
  expect(validator(undefined, {})).toEqual({
    data: { label: 'profile picture' },
    key: 'ImageUpload.REQUIRED',
    fallback: 'profile picture is required'
  });
  // @ts-expect-error Even though it accepts Value it will be given undefined and null
  expect(validator(null, {})).toEqual({
    data: { label: 'profile picture' },
    key: 'ImageUpload.REQUIRED',
    fallback: 'profile picture is required'
  });

  expect(validator(new File([''], 'henkie.png'), {})).toBe(undefined);
});

test('limitImageSize', () => {
  const validator = limitImageSize(1, 'profile picture');

  // @ts-expect-error Even though it accepts Value it will be given undefined and null
  expect(validator(undefined, {})).toBe(undefined);
  // @ts-expect-error Even though it accepts Value it will be given undefined and null
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
