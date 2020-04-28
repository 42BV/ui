import { useEffect, useState } from 'react';
import { Rule } from '../rules';

export function useMeterWidth(compliant: { [key in Rule]?: boolean }) {
  const [meterWidth, setMeterWidth] = useState(0);

  useEffect(() => {
    const values = Object.values(compliant);
    const noCompliantRules = values.filter(value => value).length;
    const noRules = values.length;

    setMeterWidth((noCompliantRules / noRules) * 100);
  }, [compliant, setMeterWidth]);

  return meterWidth;
}
