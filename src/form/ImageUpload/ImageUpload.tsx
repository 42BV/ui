import React, { Component, Fragment } from 'react';
import { FieldValidator } from 'final-form';
import { FormGroup, Label } from 'reactstrap';
import AvatarEditor from 'react-avatar-editor';

import Icon from '../../core/Icon/Icon';
import Button from '../../core/Button/Button';
import { Color } from '../../core/types';
import withJarb from '../withJarb/withJarb';
import { doBlur } from '../utils';
import { t } from '../../utilities/translation/translation';
import { Translation } from '../../utilities/translation/translator';
import {
  calculateScale,
  cropToAvatarEditorConfig,
  dataUrlToFile,
  getPicaInstance
} from './utils';

export interface Text {
  cancel?: string;
  change?: string;
  remove?: string;
  done?: string;
}

interface CropRect {
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
}

interface CropCircle {
  /**
   * Crop is a circle
   */
  type: 'circle';

  /**
   * The size of the radius of the circle.
   */
  size: number;
}

/**
 * Crop is either a rectangle or a circle.
 */
export type Crop = CropRect | CropCircle;

type Value = File | string;
type ChangeValue = File | null;

interface BaseProps {
  /**
   * Whether to crop as a circle or as a rectangle.
   */
  crop: Crop;

  /**
   * The value that the form element currently has.
   */
  value?: Value;

  /**
   * Callback for when the form element changes.
   */
  onChange: (file: ChangeValue) => void;

  /**
   * Optional callback for when the form element is blurred.
   */
  onBlur?: () => void;

  /**
   * Optionally the error message to render.
   */
  error?: React.ReactNode;

  /**
   * Optionally the color of the FormGroup.
   */
  color?: Color;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally customized text you want to use in this component.
   */
  text?: Text;
}

interface WithoutLabel extends BaseProps {
  id?: string;
  label?: never;
}

interface WithLabel extends BaseProps {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The label of the form element.
   */
  label: React.ReactNode;
}

export type Props = WithoutLabel | WithLabel;

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
enum Mode {
  NO_FILE = 'no-file',
  EDIT = 'edit',
  FILE_SELECTED = 'file-selected'
}

interface State {
  mode: Mode;
  imageSrc: string;
  fileName: string;
  rotate: number;
  scale: number;
}

const reader = new FileReader();

export default class ImageUpload extends Component<Props, State> {
  state = {
    mode: Mode.NO_FILE,
    imageSrc: '',
    fileName: '',
    rotate: 0,
    scale: 1
  };

  inputRef = React.createRef<HTMLInputElement>();
  editorRef = React.createRef<AvatarEditor>();

  componentDidMount() {
    const imageSrc = this.props.value;

    if (typeof imageSrc === 'string' && imageSrc !== '') {
      this.setState({
        mode: Mode.FILE_SELECTED,
        imageSrc
      });
    }
  }

  imgSelected({ target: { files } }: React.ChangeEvent<HTMLInputElement>) {
    /* istanbul ignore else */
    if (files) {
      const file = files[0];

      reader.onloadend = () => {
        /* istanbul ignore else */
        if (typeof reader.result === 'string') {
          this.setState({
            imageSrc: reader.result,
            mode: Mode.EDIT,
            fileName: file.name,
            rotate: 0,
            scale: 1
          });
        }
      };

      reader.readAsDataURL(file);
    }
  }

  async onCrop() {
    /* istanbul ignore else */
    if (this.editorRef.current) {
      const { crop } = this.props;

      const canvas = this.editorRef.current.getImage();
      const config = cropToAvatarEditorConfig(crop);

      const offScreenCanvas = document.createElement('canvas');
      offScreenCanvas.width = config.width;
      offScreenCanvas.height = config.height;

      // Let pica generate the cropped image as pica uses a far
      // better compression algorithm than the browsers do by default!
      const picaCanvas = await getPicaInstance().resize(
        canvas,
        offScreenCanvas,
        {
          alpha: true
        }
      );

      const dataUrl = picaCanvas.toDataURL('image/png', 1.0);
      const file = dataUrlToFile(dataUrl, this.state.fileName);

      this.props.onChange(file);
      doBlur(this.props.onBlur);

      this.setState({ mode: Mode.FILE_SELECTED, imageSrc: dataUrl });
    }
  }

  rotateLeft() {
    this.setState({ rotate: this.state.rotate - 90 });
  }

  rotateRight() {
    this.setState({ rotate: this.state.rotate + 90 });
  }

  changeScale(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();

    const scale = calculateScale(this.state.scale, event.deltaY);

    this.setState({ scale });
  }

  resetFileInput() {
    this.setState({ imageSrc: '', mode: Mode.NO_FILE, rotate: 0, scale: 1 });

    this.props.onChange(null);
    doBlur(this.props.onBlur);

    if (this.inputRef.current) {
      this.inputRef.current.value = '';
    }
  }

  triggerFileInput() {
    this.resetFileInput();

    // Wait for the input to re-appear and click it
    setTimeout(() => {
      /* istanbul ignore else */
      if (this.inputRef.current) {
        this.inputRef.current.click();
      }
    }, 200);
  }

  render() {
    const { className, error, color, ...props } = this.props;

    let label: React.ReactNode = null;
    if ('label' in props && props.label) {
      label = <Label for={props.id}>{props.label}</Label>;
    }

    return (
      <div className={className}>
        <FormGroup color={color} className="img-upload">
          {label}
          {this.renderMode()}
          {this.renderButtons()}
          {error}
        </FormGroup>
      </div>
    );
  }

  renderMode() {
    switch (this.state.mode) {
      case Mode.FILE_SELECTED:
        return this.renderFileSelected();

      case Mode.EDIT:
        return this.renderEdit();

      default:
        return this.renderNoFile();
    }
  }

  renderNoFile() {
    const id = 'id' in this.props ? this.props.id : undefined;

    return (
      <Fragment>
        <input
          id={id}
          onChange={event => this.imgSelected(event)}
          type="file"
          accept="image/*"
          ref={this.inputRef}
        />

        <div className="img-upload-wrapper bg-faded text-muted">
          <Icon icon="add_a_photo" />
        </div>
      </Fragment>
    );
  }

  renderEdit() {
    const { crop } = this.props;
    const { imageSrc, rotate, scale } = this.state;

    const config = cropToAvatarEditorConfig(crop);

    return (
      <div className="d-flex justify-content-center">
        <div onWheel={event => this.changeScale(event)}>
          <AvatarEditor
            ref={this.editorRef}
            image={imageSrc}
            width={config.width}
            height={config.height}
            borderRadius={config.borderRadius}
            rotate={rotate}
            scale={scale}
          />
        </div>
      </div>
    );
  }

  renderFileSelected() {
    const { imageSrc } = this.state;
    const { crop, ...props } = this.props;

    let alt = '';
    if ('label' in props && props.label && typeof props.label === 'string') {
      alt = props.label;
    }

    return (
      <div className="d-flex justify-content-center">
        <img
          style={{ borderRadius: crop.type === 'rect' ? 0 : '50%' }}
          className="img-fluid elevated-3"
          alt={alt}
          src={imageSrc}
        />
      </div>
    );
  }

  renderButtons() {
    switch (this.state.mode) {
      case Mode.FILE_SELECTED:
        return this.renderFileSelectedButtons();

      case Mode.EDIT:
        return this.renderEditButtons();

      default:
        return null;
    }
  }

  renderFileSelectedButtons() {
    const { text = {} } = this.props;

    return (
      <FormGroup className="text-center mt-1">
        <Button
          onClick={() => this.triggerFileInput()}
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
          className="ml-1"
          onClick={() => this.resetFileInput()}
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

  renderEditButtons() {
    const { text = {} } = this.props;

    return (
      <FormGroup className="d-flex justify-content-center mt-1">
        <Button
          className="mt-2"
          onClick={() => this.rotateLeft()}
          color="secondary"
          icon="rotate_left"
        />

        <Button
          className="ml-1 mt-2"
          onClick={() => this.rotateRight()}
          color="secondary"
          icon="rotate_right"
        />

        <Button
          className="ml-3"
          onClick={() => this.resetFileInput()}
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
          className="ml-1"
          onClick={() => this.onCrop()}
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
}

export const JarbImageUpload = withJarb<Value, ChangeValue, Props>(ImageUpload);

/**
 * An ImageValidator is a FieldValidator which checks if the image
 * is valid.
 */
export type ImageValidator = FieldValidator<Value | null | undefined>;

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
