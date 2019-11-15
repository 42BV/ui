import { Page } from '@42.nl/spring-connect';

export function pageOf<T>(content: T[], page: number, size = 10): Page<T> {
  const actualPage = page - 1;

  const slice = content.slice(size * actualPage, size * actualPage + size);

  const totalPages = Math.max(1, Math.ceil(content.length / size));

  return {
    content: slice,
    last: page === totalPages,
    totalElements: content.length,
    totalPages,
    size: slice.length,
    number: page,
    first: page === 1,
    numberOfElements: slice.length
  };
}
