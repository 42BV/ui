import React from 'react';
import { Progress } from 'reactstrap';

import { t } from '../../../utilities/translation/translation';
import Icon from '../../../core/Icon/Icon';
import { useMeterWidth } from './useMeterWidth/useMeterWidth';
import { useRules } from './useRules/useRules';
import { NewPasswordInputRule } from '../types';

type Props = {
  /**
   * The password to match the rule to.
   */
  password: string;

  /**
   * The list of rules to be matched.
   */
  rules: NewPasswordInputRule[];

  /**
   * Optionally the minimum length of the password.
   */
  minimumLength?: number;

  /**
   * Whether or not to display a meter or only a list of rules.
   * Defaults to true.
   *
   * @default true
   */
  showMeter?: boolean;
};

export default function PasswordStrength(props: Props) {
  const { password, rules, minimumLength = 10, showMeter = true } = props;

  const compliant = useRules(rules, password, minimumLength);
  const meterWidth = useMeterWidth(compliant);

  return (
    <>
      {showMeter ? (
        <Progress
          color={
            meterWidth >= 100
              ? 'success'
              : meterWidth >= 75
              ? 'warning'
              : 'danger'
          }
          value={meterWidth}
          className="mb-2"
          title = "Progress bar"
        />
      ) : null}
      <div className="mb-2">
        {rules.map((rule) => {
          const isCompliant = compliant[rule];
          return (
            <div key={rule} className="d-flex">
              <Icon
                icon={isCompliant ? 'check_circle' : 'cancel'}
                color={isCompliant ? 'success' : 'danger'}
                size={16}
                className="align-bottom mt-1 mb-1 me-3"
              />
              <div>{t(labelForRule(rule, minimumLength))}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function labelForRule(
  rule: NewPasswordInputRule,
  minimumLength: number
) {
  switch (rule) {
    case 'lowercase':
      return {
        key: 'PasswordStrength.LOWERCASE',
        fallback: 'Must contain at least one lowercase letter'
      };
    case 'uppercase':
      return {
        key: 'PasswordStrength.UPPERCASE',
        fallback: 'Must contain at least one uppercase letter'
      };
    case 'number':
      return {
        key: 'PasswordStrength.NUMBER',
        fallback: 'Must contain at least one number'
      };
    case 'specialChar':
      return {
        key: 'PasswordStrength.SPECIAL_CHAR',
        data: { specialCharacters: '@#$%^&+=.,?!' },
        fallback: 'Must contain at least one special character (@#$%^&+=.,?!)'
      };
    case 'minimumLength':
      return {
        key: 'PasswordStrength.MINIMUM_LENGTH',
        data: { minimumLength },
        fallback: `Must contain at least ${minimumLength} characters`
      };
    case 'noSpace':
      return {
        key: 'PasswordStrength.NO_SPACE',
        fallback: 'Must not contain any space'
      };
  }
}
