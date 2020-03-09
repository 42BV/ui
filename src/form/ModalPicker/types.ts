export type AddButtonCallback<T> = () => Promise<T>;

export interface AddButtonOptions<T> {
  label: string;
  onClick: AddButtonCallback<T>;
}

export type ButtonAlignment = 'left' | 'right' | 'default';
