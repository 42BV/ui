import React from 'react';

import { CardOpenClose } from '../CardOpenClose/CardOpenClose';
import { UIBasePropsWithCSSPropertiesAndChildren, WithValue } from '../types';

type Props<TVal> = {
  /**
   * Optionally whether the debug should start open or closed.
   *
   * Defaults to `true`.
   */
  defaultOpen?: boolean;
} & Partial<UIBasePropsWithCSSPropertiesAndChildren<() => React.ReactNode>> &
  WithValue<TVal>;

/**
 * A component which helps you debug things by rendering them as
 * JSON on the screen.
 *
 * Useful for when debugging forms:
 *
 * @example
 *
 * ```tsx
 * <Form
 *   onSubmit={save}
 *   initialValues={initialValues}
 *   render={({ handleSubmit, submitting, values }) => (
 *     <form onSubmit={handleSubmit}>
 *       <Debug value={values} />
 *     </form>
 *   )}
 * />
 * ```
 */
export function Debug<TVal>({
  value,
  defaultOpen = true,
  ...props
}: Props<TVal>) {
  return (
    <CardOpenClose
      header="DEBUG"
      isOpen={defaultOpen}
      {...props}
      toggle={() => {
        return;
      }}
    >
      {() => <pre>{JSON.stringify(value, null, 2)}</pre>}
    </CardOpenClose>
  );
}
