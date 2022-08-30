import React from 'react';
import { Progress } from 'reactstrap';

import { t } from '../../../utilities/translation/translation';
import { Icon } from '../../../core/Icon';
import { useMeterWidth } from './useMeterWidth/useMeterWidth';
import { useRules } from './useRules/useRules';
import { NewPasswordInputRule } from '../types';
import { uniqueId } from 'lodash';

type Text = {
  /**
   * Text for the override title of the progress bar.
   */
  title?: string;

  /**
   * Text to indicate the current progress of the progress bar.
   */
  currentProgress?: string;
};

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
   * Whether to display a meter or only a list of rules.
   * Defaults to true.
   *
   * @default true
   */
  showMeter?: boolean;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;
};

export function PasswordStrength(props: Props) {
  const {
    password,
    rules,
    minimumLength = 10,
    showMeter = true,
    text = {}
  } = props;

  const compliant = useRules(rules, password, minimumLength);
  const meterWidth = useMeterWidth(compliant);

  const id = uniqueId();

  return (
    <>
      {showMeter ? (
        <>
          <span className="visually-hidden" id={id}>
            {t({
              key: 'PasswordStrength.PROGRESS',
              fallback: 'Percentage of rules the password matches',
              overrideText: text.currentProgress
            })}
          </span>
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
            barAriaLabelledBy={id}
          />
        </>
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
