import { Page } from '@42.nl/spring-connect';

/**
 * Takes an array of content and turns that array into a
 * Page object from spring.
 *
 * @param content The content you want to become Page'd
 * @param page The current page you want to see
 * @param size The size of the page defaults to `10`
 */
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
