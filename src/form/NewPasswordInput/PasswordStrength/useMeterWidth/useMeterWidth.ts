import { useEffect, useState } from 'react';
import { NewPasswordInputRule } from '../../types';

export function useMeterWidth(
  compliant: { [key in NewPasswordInputRule]?: boolean }
): number {
  const [meterWidth, setMeterWidth] = useState(0);

  useEffect(() => {
    const values = Object.values(compliant);
    const noCompliantRules = values.filter((value) => value).length;
    const noRules = values.length;

    setMeterWidth((noCompliantRules / noRules) * 100);
  }, [compliant, setMeterWidth]);

  return meterWidth;
}
