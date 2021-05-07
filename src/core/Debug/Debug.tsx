import React, { useState } from 'react';

import { CardOpenClose } from '../CardOpenClose/CardOpenClose';

type Props = {
  /**
   * Any value you want to debug. Could be an object as well as any other type.
   */
  value: any;

  /**
   * Optionally whether the debug should start open or closed.
   *
   * Defaults to `true`.
   */
  defaultOpen?: boolean;
};

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
export function Debug({ value, defaultOpen = true }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <CardOpenClose
      header="DEBUG"
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      content={() => <pre>{JSON.stringify(value, null, 2)}</pre>}
    />
  );
}
