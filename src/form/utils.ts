export type State = {
  color: string;
  valid?: boolean;
};

export function getState(info: {
  hasErrors: boolean;
  touched?: boolean;
}): State {
  if (info.hasErrors && info.touched) {
    return { color: 'danger', valid: false };
  } else {
    return { color: '', valid: undefined };
  }
}

export function doBlur(onBlur?: () => void): void {
  /* istanbul ignore else */
  if (onBlur) {
    onBlur();
  }
}

export function alwaysTrue(): true {
  return true;
}

export function illegalPropsDetected(component: string, displayName: string, illegalProps: string[], managedProps: string[]) {
  const illegalPropsAsString = prettyPropsSummation(illegalProps, 'and');
  const managedPropsAsString = prettyPropsSummation(managedProps, 'or');

  throw new Error(`
        ${component}: illegal props detected on "${displayName}".
        
        The following illegal props were detected: ${illegalPropsAsString}.
        
        This happens when providing one or multiple of the following 
        managed props: ${managedPropsAsString} manually. 
        
        You should never provide these props manually instead you should
        trust that "${component}" will manage these props for you.

        Remove the following illegal props: ${illegalPropsAsString}.
      `);
}

export function prettyPropsSummation(
  props: string[],
  coordinatingConjunction: 'and' | 'or'
): string {
  const lastIndex = props.length - 1;

  return props
    .map((prop, index) => {
      const isFirst = index === 0;
      const isLast = index === lastIndex;

      const comma = isFirst || isLast ? '' : ', ';

      const conjunction = isLast ? ` ${coordinatingConjunction} ` : '';

      return `${comma}${conjunction}'${prop}'`;
    })
    .join('');
}
