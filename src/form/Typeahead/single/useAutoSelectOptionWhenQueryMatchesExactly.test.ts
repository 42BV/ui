import { renderHook } from '@testing-library/react';

import { useAutoSelectOptionWhenQueryMatchesExactly } from './useAutoSelectOptionWhenQueryMatchesExactly';

describe('useAutoSelectOptionWhenQueryMatchesExactly', () => {
  it('should auto-select the value when a lowercase exact match is found', () => {
    const onChangeSpy = jest.fn();

    const { rerender } = renderHook(
      ({ query }) => {
        return useAutoSelectOptionWhenQueryMatchesExactly({
          typeaheadOptions: [
            { label: 'Aap', value: 'AAP' },
            { label: 'Noot', value: 'NOOT' },
            { label: 'Mies', value: 'MIES' }
          ],
          query,
          onChange: onChangeSpy
        });
      },
      {
        initialProps: {
          query: ''
        }
      }
    );

    // Initially there is no match
    expect(onChangeSpy).toHaveBeenCalledTimes(0);

    // User starts typing the first letter, still no exact match
    rerender({ query: 'a' });
    expect(onChangeSpy).toHaveBeenCalledTimes(0);

    // User starts typing the second letter, still no exact match
    rerender({ query: 'aa' });
    expect(onChangeSpy).toHaveBeenCalledTimes(0);

    // User starts typing the third letter, now there is a match
    rerender({ query: 'aap' });
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith('AAP');
  });
});
