import React from 'react';
import { omit, pick } from 'lodash';
import { FieldValidator } from 'final-form';

import { Translation } from '../../utilities/translation/translator';
import Input, { Props as InputProps } from '../Input/Input';
import withJarb from '../withJarb/withJarb';
import PasswordStrength from './PasswordStrength/PasswordStrength';
import {
  hasLowercase,
  hasMinimumLength,
  hasNoSpaces,
  hasNumber,
  hasSpecialChar,
  hasUppercase
} from './PasswordStrength/rules';
import { NewPasswordInputRule } from './types';

type PasswordProps = {
  /**
   * Whether or not the password should contain at least one lowercase letter.
   * Defaults to true.
   *
   * @default true
   */
  lowercase?: boolean;

  /**
   * Whether or not the password should contain at least one uppercase letter.
   * Defaults to true.
   *
   * @default true
   */
  uppercase?: boolean;

  /**
   * Whether or not the password should contain at least one number.
   * Defaults to true.
   *
   * @default true
   */
  number?: boolean;

  /**
   * Whether or not the password should contain at least one special character.
   * Defaults to true.
   *
   * @default true
   */
  specialCharacter?: boolean;

  /**
   * Optionally the minimum length of the password.
   * Defaults to 10.
   *
   * @default 10
   */
  minimumLength?: number;

  /**
   * Whether or not the password should not contain any space.
   * Defaults to true.
   *
   * @default true
   */
  noSpace?: boolean;

  /**
   * Whether or not to display a meter or only a list of rules.
   * Defaults to true.
   *
   * @default true
   */
  showMeter?: boolean;
};

export type Props = Omit<InputProps, 'type'> & PasswordProps;

export default function NewPasswordInput(props: Props) {
  const rules = getRulesFromProps(props);
  const inputProps = omit(props, [
    'lowercase',
    'uppercase',
    'number',
    'specialCharacter',
    'minimumLength',
    'noSpace',
    'showMeter'
  ]) as InputProps;
  inputProps.type = 'password';
  const passwordStrengthProps = pick(props, ['minimumLength', 'showMeter']);

  return (
    <div className="new-password-input">
      <Input {...inputProps} />
      <PasswordStrength
        password={inputProps.value ?? ''}
        rules={rules}
        {...passwordStrengthProps}
      />
    </div>
  );
}

/**
 * Variant of the FileInput which can be used in a Jarb context.
 */
export const JarbNewPasswordInput = withJarb<string, string, Props>(
  NewPasswordInput
);

function getRulesFromProps(props: PasswordProps): NewPasswordInputRule[] {
  const {
    lowercase = true,
    uppercase = true,
    number = true,
    specialCharacter = true,
    minimumLength = 10,
    noSpace = true
  } = props;

  const rules: NewPasswordInputRule[] = [];
  if (lowercase) {
    rules.push('lowercase');
  }
  if (uppercase) {
    rules.push('uppercase');
  }
  if (number) {
    rules.push('number');
  }
  if (specialCharacter) {
    rules.push('specialChar');
  }
  if (minimumLength > 0) {
    rules.push('minimumLength');
  }
  if (noSpace) {
    rules.push('noSpace');
  }

  return rules;
}

/**
 * A PasswordValidator is a FieldValidator which checks if the password
 * is valid.
 */
type PasswordValidator = FieldValidator<string>;

/**
 * Takes `rules` and a minimum length and returns a validator which can check if the
 * the password complies to the rules.
 *
 * @export
 * @param {Rule[]} rules The rules the password should comply to.
 * @param {number} minimumLength The minimum length of the password.
 * @returns {(FieldValidator<string>)}
 */
export function isStrongPassword(
  rules: NewPasswordInputRule[],
  minimumLength: number
): PasswordValidator {
  return (value?: string): Translation | undefined => {
    const compliant = rules.map((rule) => {
      switch (rule) {
        case 'lowercase':
          return hasLowercase(value);
        case 'uppercase':
          return hasUppercase(value);
        case 'number':
          return hasNumber(value);
        case 'specialChar':
          return hasSpecialChar(value);
        case 'minimumLength':
          return hasMinimumLength(minimumLength, value);
        case 'noSpace':
          return hasNoSpaces(value);
      }
    });

    if (compliant.every((value) => value)) {
      return undefined;
    }

    return {
      key: 'NewPasswordInput.NOT_STRONG_ENOUGH',
      fallback: 'Password does not follow rules'
    };
  };
}
