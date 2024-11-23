import { Key, ReactNode } from 'react';

export type ModalPickerAddButtonCallback<T> = () => Promise<T>;

export type ModalPickerAddButtonOptions<T> = {
  label: string;
  onClick: ModalPickerAddButtonCallback<T>;
};

export type ModalPickerButtonAlignment = 'left' | 'right' | 'default';

export type ModalPickerRenderOptionsOption<T> = {
  option: T;
  key: Key;
  label: ReactNode;
  isSelected: boolean;
  enabled: boolean;
  toggle: () => void;
};

/**
 * Callback which renders the options.
 */
export type ModalPickerRenderOptions<T> = (
  options: ModalPickerRenderOptionsOption<T>[]
) => ReactNode;
