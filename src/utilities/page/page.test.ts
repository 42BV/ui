import { pageOf } from './page';

describe('Utility: pageOf', () => {
  test('first page', () => {
    expect(pageOf([ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j' ], 1, 5))
      .toMatchInlineSnapshot(`
      Object {
        "content": Array [
          "a",
          "b",
          "c",
          "d",
          "e",
        ],
        "first": true,
        "last": false,
        "number": 1,
        "numberOfElements": 5,
        "size": 5,
        "totalElements": 10,
        "totalPages": 2,
      }
    `);
  });

  test('center page', () => {
    expect(pageOf([ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j' ], 2, 2))
      .toMatchInlineSnapshot(`
      Object {
        "content": Array [
          "c",
          "d",
        ],
        "first": false,
        "last": false,
        "number": 2,
        "numberOfElements": 2,
        "size": 2,
        "totalElements": 10,
        "totalPages": 5,
      }
    `);
  });

  test('last page', () => {
    expect(pageOf([ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j' ], 2, 5))
      .toMatchInlineSnapshot(`
      Object {
        "content": Array [
          "f",
          "g",
          "h",
          "i",
          "j",
        ],
        "first": false,
        "last": true,
        "number": 2,
        "numberOfElements": 5,
        "size": 5,
        "totalElements": 10,
        "totalPages": 2,
      }
    `);
  });

  test('that size default to 10', () => {
    expect(pageOf([ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j' ], 1))
      .toMatchInlineSnapshot(`
      Object {
        "content": Array [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
        ],
        "first": true,
        "last": true,
        "number": 1,
        "numberOfElements": 10,
        "size": 10,
        "totalElements": 10,
        "totalPages": 1,
      }
    `);
  });
});
