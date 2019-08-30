import { Page } from '@42.nl/spring-connect';

export type FetchOptionsCallback<T> = (
  query: string,
  page: number
) => Promise<Page<T>>;

export type AddButtonCallback<T> = () => Promise<T>;

export interface AddButtonOptions<T> {
  label: string;
  onClick: AddButtonCallback<T>;
}
