import React, { Fragment, MutableRefObject, useCallback, useEffect, useRef, useState, WheelEventHandler } from 'react';
import { FieldValidator } from 'final-form';
import { FormGroup, Label } from 'reactstrap';
import AvatarEditor from 'react-avatar-editor';

import { Icon } from '../../core/Icon';
import { Button } from '../../core/Button/Button';
import { withJarb } from '../withJarb/withJarb';
import { doBlur } from '../utils';
import { t } from '../../utilities/translation/translation';
import { Translation } from '../../utilities/translation/translator';
import { calculateScale, cropToAvatarEditorConfig, dataUrlToFile, getPicaInstance, readFile, replaceFileExtension } from './utils';
import { FieldCompatible } from '../types';
import { uniqueId } from 'lodash';

export type Text = {
  cancel?: string;
  change?: string;
  remove?: string;
  done?: string;
};

export type ImageUploadCropRect = {
  /**
   * Crop is a rectangle
   */
  type: 'rect';

  /**
   * The width of the crop
   */
  width: number;

  /**
   * The height of the crop
   */
  height: number;
};

export type ImageUploadCropCircle = {
  /**
   * Crop is a circle
   */
  type: 'circle';

  /**
   * The size of the radius of the circle.
   */
  size: number;
};

/**
 * Crop is either a rectangle or a circle.
 */
export type ImageUploadCrop = ImageUploadCropRect | ImageUploadCropCircle;

type Value = File | string;
type ChangeValue = File | null;

export type Props = Omit<FieldCompatible<Value, ChangeValue>,
  'placeholder' | 'valid'> & {
  /**
   * Whether to crop as a circle or as a rectangle.
   */
  crop: ImageUploadCrop;

  /**
   * Optionally customized text you want to use in this component.
   */
  text?: Text;

  /**
   * Optionally whether to keep the original file extension or to
   * replace it with .png (because the output is always a PNG file).
   * Defaults to false.
   */
  keepOriginalFileExtension?: boolean;
};

/*
  There are three modes in which this component can be.

  First it will start in 'no-file' this will show a dotted
  box inviting the user to drop an image or clicking on the box to
  select one.

  Next the mode will go to the 'edit' mode, in which the user
  can edit the provided image. Once the user presses the "done" button
  the image will be set on the form and the mode will go to 'file-selected'.

  When in the 'file-selected' mode, the cropped image is shown.
  The user can go back to the 'no-file' mode by clicking on either the
  'change' or 'remove' buttons.

  If the imageSrc is not empty at the start, which is true when
  using this component in an update form, the mode will become
  'file-selected'.
*/
export type Mode = 'no-file' | 'edit' | 'file-selected';

export type ImageState = {
  src: string;
  fileName: string;
  rotate: number;
  scale: number;
};

export function ImageUpload(props: Props) {
  const {
    crop,
    text,
    keepOriginalFileExtension = false,
    id = uniqueId(),
    value,
    onChange,
    onBlur,
    className,
    error,
    color,
    label
  } = props;

  const [ mode, setMode ] = useState<Mode>('no-file');
  const [ image, setImage ] = useState<ImageState>();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<AvatarEditor | null>(null);

  useEffect(() => {
    if (value && !image) {
      if (typeof value === 'string') {
        setImage({
          src: value,
          fileName: value.replace(/^.*[\\\/]/, ''),
          rotate: 0,
          scale: 1
        });
        setMode('file-selected');
      } else {
        readFile(value, (result: string) => {
          setImage({
            src: result,
            fileName: value.name,
            rotate: 0,
            scale: 1
          });
          setMode('file-selected');
        });
      }
    }
  }, [ value, image ]);

  function imgSelected({ target: { files } }: React.ChangeEvent<HTMLInputElement>) {
    if (files) {
      const file = files[0];

      readFile(file, (result: string) => {
        setImage({
          src: result,
          fileName: file.name,
          rotate: 0,
          scale: 1
        });
        setMode('edit');
      });
    }
  }

  const cropStep = useCallback(async () => {
    /* istanbul ignore if */
    if (!editorRef.current) {
      return;
    }

    const canvas = editorRef.current.getImage();
    const config = cropToAvatarEditorConfig(crop);

    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = config.width < canvas.width ? config.width : canvas.width;
    offScreenCanvas.height = config.height < canvas.height ? config.height : canvas.height;

    // Let pica generate the cropped image as pica uses a far
    // better compression algorithm than the browsers do by default!
    return getPicaInstance().resize(canvas, offScreenCanvas, {
      alpha: true
    });
  }, [ crop ]);

  async function onCrop() {
    const data = await cropImage();
    if (data) {
      afterCrop(data);
    }
  }

  const cropImage = useCallback(async () => {
    if (!image) {
      return undefined;
    }

    const picaCanvas = await cropStep();
    const dataUrl = picaCanvas.toDataURL('image/png', 1.0);
    const newFileName = keepOriginalFileExtension ? image.fileName : replaceFileExtension(image.fileName);
    const file = dataUrlToFile(dataUrl, newFileName);

    onChange(file);
    doBlur(onBlur);

    return { src: dataUrl, fileName: newFileName };
  }, [ image, onChange, onBlur, cropStep, keepOriginalFileExtension ]);

  function afterCrop({ src, fileName }: { src: string; fileName: string }) {
    setMode('file-selected');
    setImage({
      src,
      fileName,
      rotate: 0,
      scale: 1
    });
  }

  useEffect(() => {
    async function imgSelectCrop() {
      const data = await cropImage();

      if (!data || !editorRef.current) {
        return;
      }

      const canvas = editorRef.current.getImage();
      const config = cropToAvatarEditorConfig(crop);

      if (config.width >= canvas.width && config.height >= canvas.height) {
        afterCrop(data);
      }
    }

    if (mode === 'edit') {
      const timeout = setTimeout(() => {
        imgSelectCrop().catch(console.error);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [ mode, crop, cropImage ]);

  function rotateLeft() {
    if (image) {
      setImage({ ...image, rotate: image.rotate - 90 });
    }
  }

  function rotateRight() {
    if (image) {
      setImage({ ...image, rotate: image.rotate + 90 });
    }
  }

  function changeScale(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    if (image) {
      setImage({ ...image, scale: calculateScale(image.scale, event.deltaY) });
    }
  }

  function resetFileInput() {
    setImage(undefined);
    setMode('no-file');

    onChange(null);
    doBlur(onBlur);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  function triggerFileInput() {
    resetFileInput();

    // Wait for the input to re-appear and click it
    setTimeout(() => {
      /* istanbul ignore else */
      if (inputRef.current) {
        inputRef.current.click();
      }
    }, 200);
  }

  return (
    <div className={className}>
      <FormGroup color={color} className="img-upload">
        {label ? <Label for={id}>{label}</Label> : null}
        {mode === 'file-selected' && image ? (
          <>
            <div className="d-flex justify-content-center">
              <img
                style={{ borderRadius: crop.type === 'rect' ? 0 : '50%' }}
                className="img-fluid elevated-3"
                alt={label && typeof label === 'string' ? label : ''}
                src={image.src}
              />
            </div>
            <FileSelectedButtons text={text} triggerFileInput={triggerFileInput} resetFileInput={resetFileInput} />
          </>
        ) : mode === 'edit' && image ? (
          <>
            <Editor crop={crop} editorRef={editorRef} image={image} changeScale={changeScale} />
            <EditButtons rotateLeft={rotateLeft} rotateRight={rotateRight} resetFileInput={resetFileInput} onCrop={onCrop} />
          </>
        ) : (
          <Fragment>
            <input
              id={id}
              onChange={imgSelected}
              type="file"
              accept="image/*"
              ref={inputRef}
            />

            <div className="img-upload-wrapper bg-faded text-muted">
              <Icon icon="add_a_photo" />
            </div>
          </Fragment>
        )}
        {error}
      </FormGroup>
    </div>
  );
}

function Editor({
  crop,
  editorRef,
  image,
  changeScale
}: {
  crop: ImageUploadCrop;
  editorRef: MutableRefObject<AvatarEditor | null>;
  image: ImageState;
  changeScale: WheelEventHandler<HTMLDivElement>;
}) {
  const config = cropToAvatarEditorConfig(crop);

  return (
    <div className="d-flex justify-content-center">
      <div data-testid="scroll-scale" onWheel={changeScale}>
        <AvatarEditor
          ref={editorRef}
          image={image.src}
          width={config.width}
          height={config.height}
          borderRadius={config.borderRadius}
          rotate={image.rotate}
          scale={image.scale}
        />
      </div>
    </div>
  );
}

function FileSelectedButtons({
  text = {},
  triggerFileInput,
  resetFileInput
}: {
  text?: Text;
  triggerFileInput: () => void;
  resetFileInput: () => void;
}) {
  return (
    <FormGroup className="text-center mt-1">
      <Button
        onClick={triggerFileInput}
        color="primary"
        icon="camera_roll"
      >
        {t({
          key: 'ImageUpload.CHANGE',
          fallback: 'Change',
          overrideText: text.change
        })}
      </Button>
      <Button
        className="ms-1"
        onClick={resetFileInput}
        color="danger"
        icon="delete"
      >
        {t({
          key: 'ImageUpload.REMOVE',
          fallback: 'Remove',
          overrideText: text.remove
        })}
      </Button>
    </FormGroup>
  );
}

function EditButtons({
  text = {},
  rotateLeft,
  rotateRight,
  resetFileInput,
  onCrop
}: {
  text?: Text;
  rotateLeft: () => void;
  rotateRight: () => void;
  resetFileInput: () => void;
  onCrop: () => void;
}) {
  return (
    <FormGroup className="d-flex justify-content-center mt-1">
      <Button
        className="mt-2"
        onClick={rotateLeft}
        color="secondary"
        icon="rotate_left"
      />

      <Button
        className="ms-1 mt-2"
        onClick={rotateRight}
        color="secondary"
        icon="rotate_right"
      />

      <Button
        className="ms-3"
        onClick={resetFileInput}
        color="secondary"
        icon="cancel"
      >
        {t({
          key: 'ImageUpload.CANCEL',
          fallback: 'Cancel',
          overrideText: text.cancel
        })}
      </Button>

      <Button
        className="ms-1"
        onClick={onCrop}
        color="primary"
        icon="done"
      >
        {t({
          key: 'ImageUpload.DONE',
          fallback: 'Done',
          overrideText: text.done
        })}
      </Button>
    </FormGroup>
  );
}

export const JarbImageUpload = withJarb<Value, ChangeValue, Props>(ImageUpload);

/**
 * An ImageValidator is a FieldValidator which checks if the image
 * is valid.
 */
export type ImageValidator = FieldValidator<Value>;

/**
 * Takes a `label` and returns a validator which can check if the
 * there is an image.
 *
 * @export
 * @param {string} label The label to display in the error message
 * @returns {ImageValidator}
 */
export function requireImage(label: string): ImageValidator {
  return (value?: Value | null | undefined): Translation | undefined => {
    if (value) {
      return undefined;
    }

    return {
      key: 'ImageUpload.REQUIRED',
      data: { label },
      fallback: `${label} is required`
    };
  };
}

/**
 * Takes a `size` and `label` and returns a validator which can check if the
 * image is past the size limit.
 *
 * @export
 * @param {string} size The maximum size of the file in MB.
 * @param {string} label The label to display in the error message
 * @returns {ImageValidator}
 */
export function limitImageSize(size: number, label: string): ImageValidator {
  return (value: Value | null | undefined): Translation | undefined => {
    if (!(value instanceof File)) {
      return undefined;
    }

    // Older browsers will not support this so we skip the check.
    /* istanbul ignore if */
    if (value.size === undefined) {
      return undefined;
    }

    const maxSizeInBytes = size * 1048576;

    if (value.size < maxSizeInBytes) {
      return undefined;
    }

    const fileSize = (value.size / 1048576).toFixed(1);
    const maxSizeDisplay = size.toFixed(1);

    return {
      key: 'ImageUpload.SIZE_TOO_LARGE',
      data: { label, size: maxSizeDisplay, fileSize },
      fallback: `${label} image is to large. Max size is ${maxSizeDisplay} MB image size is ${fileSize} MB`
    };
  };
}
