import { useEffect, useState } from 'react';
import { NewPasswordInputRule } from '../../types';
import { hasLowercase, hasMinimumLength, hasNoSpaces, hasNumber, hasSpecialChar, hasUppercase } from '../rules';

export function useRules(
  rules: NewPasswordInputRule[],
  password: string,
  minimumLength: number
) {
  const [ compliant, setCompliant ] = useState<{ [key in NewPasswordInputRule]?: boolean }>(
    rules.reduce(
      (obj, rule) => checkRule(obj, rule, password, minimumLength),
      {}
    )
  );

  useEffect(() => {
    setCompliant(
      rules.reduce(
        (obj, rule) => checkRule(obj, rule, password, minimumLength),
        {}
      )
    );
  }, [ password, rules, setCompliant, minimumLength ]);

  return compliant;
}

export function checkRule(
  obj: Record<string, boolean>,
  rule: NewPasswordInputRule,
  value: string,
  minimumLength: number
) {
  switch (rule) {
    case 'lowercase':
      return { ...obj, [rule]: hasLowercase(value) };
    case 'uppercase':
      return { ...obj, [rule]: hasUppercase(value) };
    case 'number':
      return { ...obj, [rule]: hasNumber(value) };
    case 'specialChar':
      return { ...obj, [rule]: hasSpecialChar(value) };
    case 'minimumLength':
      return { ...obj, [rule]: hasMinimumLength(minimumLength, value) };
    case 'noSpace':
      return { ...obj, [rule]: hasNoSpaces(value) };
  }
}
