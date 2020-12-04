export type AddButtonCallback<T> = () => Promise<T>;

export type AddButtonOptions<T> = {
  label: string;
  onClick: AddButtonCallback<T>;
};

export type ButtonAlignment = 'left' | 'right' | 'default';
