import { useEffect, useState } from 'react';
import {
  hasLowercase,
  hasMinimumLength,
  hasNoSpaces,
  hasNumber,
  hasSpecialChar,
  hasUppercase,
  Rule
} from '../rules';

export function useRules(
  rules: Rule[],
  password: string,
  minimumLength: number
) {
  const [compliant, setCompliant] = useState<{ [key in Rule]?: boolean }>(
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
  }, [password, rules, setCompliant, minimumLength]);

  return compliant;
}

export function checkRule(
  obj: Record<string, boolean>,
  rule: Rule,
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
