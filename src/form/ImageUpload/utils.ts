import picaFn from 'pica';
import { ImageUploadCrop } from './ImageUpload';
import { Buffer } from 'buffer';
Buffer.from('anything','base64');

let picaInstance: any;

export function getPicaInstance() {
  if (picaInstance) {
    return picaInstance;
  }

  picaInstance = picaFn();

  return picaInstance;
}

export function dataUrlToFile(dataUrl: string, fileName: string): File {
  const byteString = Buffer.from(dataUrl.split(',')[1], 'base64');

  // separate out the mime component
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  const bytes = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString[i];
  }

  return new File([ bytes ], fileName, { type: mimeString });
}

type AvatarEditorConfig = {
  borderRadius: number;
  width: number;
  height: number;
};

export function cropToAvatarEditorConfig(
  crop: ImageUploadCrop
): AvatarEditorConfig {
  if (crop.type === 'rect') {
    const { width, height } = crop;

    return { borderRadius: 0, width, height };
  } else {
    const { size } = crop;

    /* 
      When Crop is 'circle' a ridiculously high border radius is needed 
      so crop.size of different sizes show a perfect circle. Not sure
      why this occurs.
    */
    const borderRadius = 9000000;

    return { borderRadius, width: size, height: size };
  }
}

// Calculate the next 'scale' to use based on how hard the user scrolled
export function calculateScale(scale: number, delta: number): number {
  const zoomFactor = Math.max(Math.abs(delta) / 1000, 0.1);
  const nextScale = delta > 0 ? scale - zoomFactor : scale + zoomFactor;
  return Math.min(10, Math.max(1, nextScale));
}

// Replace any part after the last dot in the filename with .png
export function replaceFileExtension(fileName: string): string {
  return fileName.replace(/\.\w+$/, '.png');
}

export function readFile(file: File, callback: (result: string) => void) {
  const reader = new FileReader();
  reader.onloadend = () => {
    /* istanbul ignore else */
    if (typeof reader.result === 'string') {
      callback(reader.result);
    }
  };
  reader.readAsDataURL(file);
}
