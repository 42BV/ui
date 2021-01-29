import React, { useState } from 'react';
import { Button, FormGroup, Label, Card } from 'reactstrap';
import { SketchPicker } from 'react-color';
import classNames from 'classnames';

import withJarb from '../withJarb/withJarb';
import { Color, Icon } from '../..';
import { doBlur } from '../utils';
import { t } from '../../utilities/translation/translation';
import Popover from '../../core/Popover/Popover';
import TextButton from '../../core/TextButton/TextButton';
import { IconType } from '../../core/Icon';

type Text = {
  /**
   * The text of the clear button
   */
  clear?: string;

  /**
   * The text of the cancel button
   */
  cancel?: string;

  /**
   * The text of the select button
   */
  select?: string;
};

type Props = {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The color that the form element currently has in hex.
   */
  value?: string;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value?: string) => void;

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
   * Whether or not the form element is currently valid.
   */
  valid?: boolean;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * The label of the form element.
   */
  label: React.ReactNode;

  /**
   * The placeholder of the form element.
   */
  placeholder: string;

  /**
   * Optionally the icon to display on the button that opens the color picker.
   */
  icon?: IconType;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  /**
   * Whether or not to show a "clear" button.
   *
   * Defaults to `true`
   */
  canClear?: boolean;
};

/**
 * ColorPicker is a form element which allows the user to select a
 * color from a color picker. The color's format is in hex.
 */
export default function ColorPicker(props: Props) {
  const {
    id,
    label,
    value,
    color,
    placeholder,
    icon,
    className,
    error,
    onChange,
    onBlur,
    canClear = true,
    text = {}
  } = props;

  const [colorValue, setColorValue] = useState(value ? value : '#ffffff');

  const [isOpen, setIsOpen] = useState(false);

  function onColorSelected(color?: string) {
    onChange(color);
    doBlur(onBlur);
    setIsOpen(false);
  }

  const classes = classNames('color-picker', className);

  return (
    <FormGroup className={classes} color={color}>
      <Label for={id}>{label}</Label>

      <div className="d-flex">
        {value ? (
          <div className="d-flex justify-content-between">
            <div className="border p-1 mr-3">
              <div
                id="color-picker-value"
                className="h-100"
                style={{ backgroundColor: value, width: 42 }}
              />
            </div>
            {canClear ? (
              <TextButton
                onClick={() => onColorSelected(undefined)}
                className="mr-3"
              >
                {t({
                  key: 'ColorPicker.CLEAR',
                  fallback: 'Clear',
                  overrideText: text.clear
                })}
              </TextButton>
            ) : null}
          </div>
        ) : null}
        <Popover
          placement="bottom"
          isOpen={isOpen}
          target={
            <Button
              type="button"
              color="primary"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              {icon ? <Icon icon={icon} className="mr-2 align-bottom" /> : null}
              {placeholder}
            </Button>
          }
        >
          <Card body className="p-0">
            <SketchPicker
              color={colorValue}
              onChange={(color) => setColorValue(color.hex)}
            />

            <div className="d-flex justify-content-between my-1 p-1">
              <Button
                color="secondary"
                onClick={() => {
                  const resetColorValue = value ? value : '#ffffff';
                  setColorValue(resetColorValue);
                  setIsOpen(false);
                }}
              >
                {t({
                  key: 'ColorPicker.CANCEL',
                  fallback: 'Cancel',
                  overrideText: text.cancel
                })}
              </Button>
              <Button
                color="primary"
                onClick={() => onColorSelected(colorValue)}
              >
                {t({
                  key: 'ColorPicker.SELECT',
                  fallback: 'Select',
                  overrideText: text.select
                })}
              </Button>
            </div>
          </Card>
        </Popover>
      </div>
      {error}
    </FormGroup>
  );
}

/**
 * Variant of the ColorPicker which can be used in a Jarb context.
 */
export const JarbColorPicker = withJarb<string, string, Props>(ColorPicker);
