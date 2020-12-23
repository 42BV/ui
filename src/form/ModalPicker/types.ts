import { ReactNode } from 'react';

export type AddButtonCallback<T> = () => Promise<T>;

export type AddButtonOptions<T> = {
  label: string;
  onClick: AddButtonCallback<T>;
};

export type ButtonAlignment = 'left' | 'right' | 'default';

export type RenderOptionsOption<T> = {
  option: T;
  isSelected: boolean;
  enabled: boolean;
  toggle: () => void;
};

/**
 * Callback which renders the options.
 */
export type RenderOptions<T> = (options: RenderOptionsOption<T>[]) => ReactNode;
