import { calculateScale, cropToAvatarEditorConfig, dataUrlToFile, getPicaInstance, replaceFileExtension } from './utils';

test('getPicaInstance', () => {
  const first = getPicaInstance();
  expect(first).not.toBe(undefined);
  expect(first).not.toBe(null);

  const second = getPicaInstance();
  expect(second).not.toBe(undefined);
  expect(second).not.toBe(null);

  // check caching
  expect(second).toBe(first);
});

test('dataUrlToFile', () => {
  const dataUrl =
    'data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7';
  const file = dataUrlToFile(dataUrl, 'maarten.png');

  expect(file).toBeInstanceOf(File);
  expect(file.type).toBe('image/gif');
  expect(file.name).toBe('maarten.png');
});

test('cropToAvatarEditorConfig', () => {
  expect(
    cropToAvatarEditorConfig({ type: 'rect', width: 500, height: 400 })
  ).toEqual({
    borderRadius: 0,
    width: 500,
    height: 400
  });

  expect(cropToAvatarEditorConfig({ type: 'circle', size: 250 })).toEqual({
    borderRadius: 9000000,
    width: 250,
    height: 250
  });
});

test('calculateScale', () => {
  // soft scroll
  expect(calculateScale(5, 1)).toBe(4.9);
  expect(calculateScale(5, -1)).toBe(5.1);

  // hard scroll
  expect(calculateScale(5, 800)).toBe(4.2);
  expect(calculateScale(5, -800)).toBe(5.8);

  // clamp
  expect(calculateScale(1, 800)).toBe(1);
  expect(calculateScale(10, -800)).toBe(10);
});

test('replaceFileExtension', () => {
  expect(replaceFileExtension('')).toBe('');
  expect(replaceFileExtension('test')).toBe('test');
  expect(replaceFileExtension('test.png')).toBe('test.png');
  expect(replaceFileExtension('test.jpg')).toBe('test.png');
  expect(replaceFileExtension('test.jpeg')).toBe('test.png');
  expect(replaceFileExtension('test.svg')).toBe('test.png');
  expect(replaceFileExtension('test.gif')).toBe('test.png');
  expect(replaceFileExtension('test.bmp')).toBe('test.png');
  expect(replaceFileExtension('test.tif')).toBe('test.png');
  expect(replaceFileExtension('test.tiff')).toBe('test.png');
  expect(replaceFileExtension('test.webp')).toBe('test.png');
  expect(replaceFileExtension('test.bladiebla')).toBe('test.png');
  expect(replaceFileExtension('test.bladiebla.jpg')).toBe('test.bladiebla.png');
  expect(replaceFileExtension('test.jpg2')).toBe('test.png');
  expect(replaceFileExtension('test.jpg_2')).toBe('test.png');
  expect(replaceFileExtension('test...jpg')).toBe('test...png');
});
