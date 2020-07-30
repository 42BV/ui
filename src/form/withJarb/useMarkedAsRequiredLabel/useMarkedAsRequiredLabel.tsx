import React from 'react';

import { isRequired } from '@42.nl/jarb-final-form';

import { getConfig } from '../../../config/config';
import { t } from '../../../utilities/translation/translation';

export function useMarkedAsRequiredLabel({
  label,
  validator
}: {
  label?: React.ReactNode;
  validator: string;
}) {
  if (!label) {
    return label;
  }

  const { showRequiredMarkInLabel } = getConfig();

  if (
    typeof label === 'string' &&
    showRequiredMarkInLabel &&
    isRequired(validator)
  ) {
    return (
      <>
        {label}
        {t({
          key: 'withJarb.REQUIRED_MARK',
          fallback: ' *'
        })}
      </>
    );
  }

  return label;
}
