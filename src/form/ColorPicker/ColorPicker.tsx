import React, { useState } from 'react';
import { Button, FormGroup, Label } from 'reactstrap';
import { SketchPicker } from 'react-color';
import classNames from 'classnames';

import { withJarb } from '../withJarb/withJarb';
import { Icon, IconType } from '../../core/Icon';
import { doBlur } from '../utils';
import { t } from '../../utilities/translation/translation';
import { TextButton } from '../../core/TextButton/TextButton';
import Tooltip from 'rc-tooltip';
import { Card } from '../../core/Card/Card';
import { uniqueId } from 'lodash';
import { FieldCompatible } from '../types';

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

type Props = FieldCompatible<string | undefined, string | undefined> & {
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
   * Whether to show a "clear" button.
   *
   * Defaults to `true`
   */
  canClear?: boolean;
};

/**
 * ColorPicker is a form element which allows the user to select a
 * color from a color picker. The color's format is in hex.
 */
export function ColorPicker(props: Props) {
  const {
    id = uniqueId(),
    label,
    hiddenLabel,
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

  const [ colorValue, setColorValue ] = useState(value ? value : '#ffffff');

  const [ isOpen, setIsOpen ] = useState(false);

  function onColorSelected(newColor?: string) {
    onChange(newColor);
    doBlur(onBlur);
    setIsOpen(false);
  }

  const classes = classNames('color-picker', className);

  return (
    <FormGroup className={classes} color={color}>
      {!hiddenLabel || typeof label !== 'string' ? <Label>{label}</Label> : null}

      <div className="d-flex">
        {value ? (
          <div className="d-flex justify-content-between">
            <div className="border p-1 me-3">
              <div
                id="color-picker-value"
                className="h-100"
                style={{ backgroundColor: value, width: 42 }}
              />
            </div>
            {canClear ? (
              <TextButton
                onClick={() => onColorSelected()}
                className="me-3"
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
        <Tooltip
          id={id}
          placement="bottom"
          align={{ offset: [ 0, 7 ] }}
          destroyTooltipOnHide={true}
          trigger={['click']}
          visible={isOpen}
          overlay={(
            <Card cardBodyClassName="p-0">
              <SketchPicker
                color={colorValue}
                onChange={(result) => setColorValue(result.hex)}
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
          )}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsOpen(!isOpen)}
            aria-describedby={id}
          >
            {icon ? <Icon icon={icon} className="me-2 align-bottom" /> : null}
            {placeholder}
          </button>
        </Tooltip>
      </div>
      {error}
    </FormGroup>
  );
}

/**
 * Variant of the ColorPicker which can be used in a Jarb context.
 */
export const JarbColorPicker = withJarb<string, string, Props>(ColorPicker);
