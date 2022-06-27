import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import * as imgUploadUtils from './utils';

import { ImageState, ImageUpload, ImageUploadCrop, limitImageSize, Mode, requireImage, Text } from './ImageUpload';

import * as testUtils from '../../test/utils';
import AvatarEditor from 'react-avatar-editor';
import { Tooltip } from '../../core/Tooltip/Tooltip';

describe('Component: ImageUpload', () => {
  function setup({
    value,
    cropType = 'rect',
    text,
    hasLabel = true,
    label,
    emptyLabel = false,
    keepOriginalFileExtension,
    mode,
    image = { src: '', fileName: 'maarten.png', rotate: 0, scale: 1 },
    imageSize = { width: 1000, height: 1000 },
    file = new File([ '' ], 'maarten.png')
  }: {
    value?: File | string;
    cropType?: 'rect' | 'circle';
    text?: Text;
    hasLabel?: boolean;
    label?: React.ReactNode;
    emptyLabel?: boolean;
    keepOriginalFileExtension?: boolean;
    mode?: Mode;
    image?: ImageState | null;
    imageSize?: { width: number; height: number };
    file?: File;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    jest.spyOn(AvatarEditor.prototype, 'getImage')
      // @ts-expect-error Test mock
      .mockReturnValue(imageSize);

    const { promise, resolve } = testUtils.resolvablePromise();

    const resizeSpy = jest.fn(() => {
      return promise;
    });

    jest.spyOn(imgUploadUtils, 'getPicaInstance').mockImplementation(() => {
      return {
        resize: resizeSpy
      };
    });

    jest
      .spyOn(imgUploadUtils, 'dataUrlToFile')
      .mockImplementation(() => file);

    const setModeSpy = jest.fn();
    const setImageSpy = jest.fn();

    if (mode) {
      jest.spyOn(React, 'useState')
        .mockReturnValueOnce([ mode, setModeSpy ])
        .mockReturnValueOnce([ image, setImageSpy ]);
    }

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
      keepOriginalFileExtension,
      id: hasLabel ? 'image-uploader' : undefined,
      label: emptyLabel ? '' : label ?? 'Profile photo',
      hiddenLabel: !hasLabel
    };

    const { container, asFragment } = render(
      <ImageUpload color="success" {...props} />
    );

    return { container, asFragment, onChangeSpy, onBlurSpy, resizeSpy, resolve, promise, setModeSpy, setImageSpy };
  }

  it('should not show the image when the value is undefined', () => {
    setup({});
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should not show the image when the value is empty string', () => {
    setup({ value: '' });
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should show the image when the value is a non empty string', () => {
    setup({ value: 'maarten.png' });
    expect(screen.queryByRole('img')).toBeInTheDocument();
  });

  it('should set image and set mode to file-selected when the value is a File', async () => {
    expect.assertions(5);

    const { setModeSpy, setImageSpy } = setup({
      mode: 'no-file',
      value: new File([ 'base64code' ], 'gido.png'),
      image: null
    });

    await waitFor(() => {
      expect(setImageSpy).toHaveBeenCalledTimes(1);
    });

    expect(setImageSpy).toHaveBeenCalledWith(expect.objectContaining({
      fileName: 'gido.png',
      rotate: 0,
      scale: 1
    }));
    expect(setModeSpy).toHaveBeenCalledTimes(1);
    expect(setModeSpy).toHaveBeenCalledWith('file-selected');
  });

  describe('ui', () => {
    test('file-selected as rect', () => {
      const { container } = setup({ mode: 'file-selected', hasLabel: false });
      expect(container).toMatchSnapshot();
    });

    test('file-selected as circle', () => {
      const { container } = setup({ cropType: 'circle', mode: 'file-selected' });
      expect(container).toMatchSnapshot();
    });

    test('edit as rect', () => {
      const { container } = setup({ mode: 'edit' });
      expect(container).toMatchSnapshot();
    });

    test('edit as circle', () => {
      const { container } = setup({ cropType: 'circle', mode: 'edit' });
      expect(container).toMatchSnapshot();
    });

    test('no-file', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('visible label', () => {
      setup({});
      expect(screen.queryByText('Profile photo')).toBeInTheDocument();
      expect(screen.queryByLabelText('Profile photo')).toBeInTheDocument();
    });

    test('invisible label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('Profile photo')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Profile photo')).toBeInTheDocument();
    });

    test('with empty label', () => {
      setup({ emptyLabel: true });
      expect(screen.queryByText('Profile photo')).not.toBeInTheDocument();
    });

    test('with custom label', () => {
      const label = <Tooltip content="Is this a test?">Profile photo</Tooltip>;
      setup({ label, hasLabel: true, mode: 'file-selected' });
      expect(screen.queryByText('Profile photo')).toBeInTheDocument();
      expect(screen.queryByAltText('Profile photo')).not.toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('should set mode to edit when file is selected', () => {
      const readFileSpy = jest.spyOn(imgUploadUtils, 'readFile').mockImplementation((file, callback) => callback(''));

      const { setModeSpy, setImageSpy } = setup({
        mode: 'no-file'
      });

      fireEvent.change(screen.getByLabelText('Profile photo'), { target: { files: [ new File([ '' ], 'maarten.png') ] } });

      expect(readFileSpy).toHaveBeenCalledTimes(1);

      expect(setModeSpy).toHaveBeenCalledTimes(1);
      expect(setModeSpy).toHaveBeenCalledWith('edit');

      expect(setImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledWith({
        src: '',
        fileName: 'maarten.png',
        rotate: 0,
        scale: 1
      });
    });

    it('should rotate left when rotate left rotation button is clicked', () => {
      const { setImageSpy } = setup({
        mode: 'edit'
      });

      fireEvent.click(screen.getByText('rotate_left'));

      expect(setImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledWith(
        expect.objectContaining({ rotate: -90 })
      );
    });

    it('should rotate right when rotate right rotation button is clicked', () => {
      const { setImageSpy } = setup({
        mode: 'edit'
      });

      fireEvent.click(screen.getByText('rotate_right'));

      expect(setImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledWith(
        expect.objectContaining({ rotate: 90 })
      );
    });

    it('should scale the image when mouse is scrolled on avatar editor', () => {
      const { setImageSpy } = setup({
        mode: 'edit'
      });

      const calculateScaleSpy = jest.spyOn(imgUploadUtils, 'calculateScale');

      fireEvent.wheel(screen.getByTestId('scroll-scale'), { deltaY: -100 });

      expect(calculateScaleSpy).toHaveBeenCalledTimes(1);
      expect(calculateScaleSpy).toHaveBeenCalledWith(1, -100);

      expect(setImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledWith(
        expect.objectContaining({ scale: 1.1 })
      );
    });

    it('should reset the file input, clear the image and set mode to no-file when cancel button is clicked', () => {
      const { setImageSpy, setModeSpy, onChangeSpy, onBlurSpy } = setup({
        mode: 'edit'
      });

      fireEvent.click(screen.getByText('cancel'));

      expect(setImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledWith(undefined);

      expect(setModeSpy).toHaveBeenCalledTimes(1);
      expect(setModeSpy).toHaveBeenCalledWith('no-file');

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(null);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should set the final image and set mode to file-selected when done button is clicked', async () => {
      expect.assertions(13);

      const file = new File([ '' ], 'maarten.png');

      const { setModeSpy, setImageSpy, resizeSpy, resolve, promise, onChangeSpy, onBlurSpy } = setup({
        mode: 'edit',
        file
      });

      fireEvent.click(screen.getByText('done'));

      await act(async () => {
        resolve({
          toDataURL: jest.fn(() => 'Some base 64 string')
        });
        await expect(promise).resolves.toBeDefined();
      });

      expect(resizeSpy).toHaveBeenCalledTimes(1);
      // @ts-expect-error Test mock
      expect(resizeSpy.mock.calls[0][0]).toEqual({ width: 1000, height: 1000 });
      // @ts-expect-error Test mock
      expect(resizeSpy.mock.calls[0][2]).toEqual({ alpha: true });

      // @ts-expect-error Test mock
      const offScreenCanvas = resizeSpy.mock.calls[0][1];
      // @ts-expect-error Test mock
      expect(offScreenCanvas.width).toBe(500);
      // @ts-expect-error Test mock
      expect(offScreenCanvas.height).toBe(500);

      expect(setModeSpy).toHaveBeenCalledTimes(1);
      expect(setModeSpy).toHaveBeenCalledWith('file-selected');

      expect(setImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledWith({
        src: 'Some base 64 string',
        fileName: 'maarten.png',
        rotate: 0,
        scale: 1
      });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(file);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should replace the file extension when keepOriginalFileExtension is undefined', async () => {
      expect.assertions(4);

      const file = new File([ '' ], 'maarten.jpg');

      const replaceFileExtensionSpy = jest.spyOn(imgUploadUtils, 'replaceFileExtension');

      const { resolve, promise, setImageSpy } = setup({
        mode: 'edit',
        file
      });

      fireEvent.click(screen.getByText('done'));

      await act(async () => {
        resolve({
          toDataURL: jest.fn(() => 'Some base 64 string')
        });
        await expect(promise).resolves.toBeDefined();
      });

      expect(replaceFileExtensionSpy).toBeCalledTimes(1);

      expect(setImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledWith({
        src: 'Some base 64 string',
        fileName: 'maarten.png',
        rotate: 0,
        scale: 1
      });
    });

    it('should not replace the file extension when keepOriginalFileExtension is true', async () => {
      expect.assertions(4);

      const file = new File([ '' ], 'maarten.jpg');

      const replaceFileExtensionSpy = jest.spyOn(imgUploadUtils, 'replaceFileExtension');

      const { resolve, promise, setImageSpy } = setup({
        mode: 'edit',
        keepOriginalFileExtension: true,
        file,
        image: { src: '', fileName: 'maarten.jpg', rotate: 0, scale: 1 }
      });

      fireEvent.click(screen.getByText('done'));

      await act(async () => {
        resolve({
          toDataURL: jest.fn(() => 'Some base 64 string')
        });
        await expect(promise).resolves.toBeDefined();
      });

      expect(replaceFileExtensionSpy).toBeCalledTimes(0);

      expect(setImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledWith({
        src: 'Some base 64 string',
        fileName: 'maarten.jpg',
        rotate: 0,
        scale: 1
      });
    });

    it('should clear the image and set mode to no-file when clicking the remove button', () => {
      const { setImageSpy, setModeSpy, onChangeSpy, onBlurSpy } = setup({
        mode: 'file-selected'
      });

      fireEvent.click(screen.getByText('delete'));

      expect(setImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledWith(undefined);

      expect(setModeSpy).toHaveBeenCalledTimes(1);
      expect(setModeSpy).toHaveBeenCalledWith('no-file');

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(null);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should clear the image, set mode to no-file and trigger the file input so user can select a new image when change button is clicked', () => {
      jest.useFakeTimers();

      const clickSpy = jest.fn();
      jest.spyOn(React, 'useRef').mockReturnValueOnce({
        current: {
          click: clickSpy
        }
      });

      const { setImageSpy, setModeSpy } = setup({
        mode: 'file-selected'
      });

      fireEvent.click(screen.getByText('camera_roll'));

      expect(setImageSpy).toHaveBeenCalledTimes(1);
      expect(setImageSpy).toHaveBeenCalledWith(undefined);

      expect(setModeSpy).toHaveBeenCalledTimes(1);
      expect(setModeSpy).toHaveBeenCalledWith('no-file');

      expect(clickSpy).toHaveBeenCalledTimes(0);

      jest.runAllTimers();

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onChange with initial image when selected image starts edit mode', async () => {
      expect.assertions(2);

      jest.useFakeTimers();
      const { onChangeSpy, resolve, promise } = setup({
        mode: 'edit'
      });

      await act(() => {
        jest.runAllTimers();
      });

      await act(async () => {
        resolve({
          toDataURL: jest.fn(() => 'Some base 64 string')
        });
        await expect(promise).resolves.toBeDefined();
      });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call onChange with initial image when selected image is not readable', async () => {
      expect.assertions(1);

      jest.useFakeTimers();
      const { onChangeSpy } = setup({
        mode: 'edit',
        image: null
      });

      await act(() => {
        jest.runAllTimers();
      });

      expect(onChangeSpy).toHaveBeenCalledTimes(0);
    });

    it('should set mode to file-selected when selected image is too small for cropping', async () => {
      expect.assertions(3);

      jest.useFakeTimers();

      const { setModeSpy, resolve, promise } = setup({
        mode: 'edit',
        imageSize: { width: 200, height: 200 }
      });

      await act(() => {
        jest.runAllTimers();
      });

      await act(async () => {
        resolve({
          toDataURL: jest.fn(() => 'Some base 64 string')
        });
        await expect(promise).resolves.toBeDefined();
      });

      expect(setModeSpy).toHaveBeenCalledTimes(1);
      expect(setModeSpy).toHaveBeenCalledWith('file-selected');
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

  expect(validator(new File([ '' ], 'henkie.png'), {})).toBe(undefined);
});

test('limitImageSize', () => {
  const validator = limitImageSize(1, 'profile picture');

  // @ts-expect-error Even though it accepts Value it will be given undefined and null
  expect(validator(undefined, {})).toBe(undefined);
  // @ts-expect-error Even though it accepts Value it will be given undefined and null
  expect(validator(null, {})).toBe(undefined);

  const smallFile = new File([ '' ], 'small.png');
  expect(validator(smallFile, {})).toBe(undefined);

  const largeFile = new File(
    [ 'very large image string'.repeat(100000) ],
    'large.png'
  );
  expect(validator(largeFile, {})).toEqual({
    data: { fileSize: '2.2', label: 'profile picture', size: '1.0' },
    fallback:
      'profile picture image is to large. Max size is 1.0 MB image size is 2.2 MB',
    key: 'ImageUpload.SIZE_TOO_LARGE'
  });
});
