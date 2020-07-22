import React from 'react';
import { isRequired } from '@42.nl/jarb-final-form';
import { getConfig } from '../../../../config/config';
import { t } from '../../../../utilities/translation/translation';

type Props = {
  label?: React.ReactNode;
  validator: string;
};

export function MarkedAsRequiredLabel({ label, validator }: Props) {
  if (!label) {
    return null;
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

  return <>{label}</>;
}
