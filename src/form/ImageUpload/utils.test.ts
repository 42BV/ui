import {
  getPicaInstance,
  dataUrlToFile,
  cropToAvatarEditorConfig,
  calculateScale
} from './utils';

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
