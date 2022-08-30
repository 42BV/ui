import { emptyPage, Page } from '@42.nl/spring-connect';
import { useEffect, useRef, useState } from 'react';
import { pageOf } from '../utilities/page/page';
import { FetchOptionsCallback, FieldCompatibleWithPredeterminedOptions, isOptionSelected } from './option';

type UseOptionConfig<T> = FieldCompatibleWithPredeterminedOptions<T> & {
  value?: T | T[];
  query: string;
  pageNumber: number;
  size: number;
  optionsShouldAlwaysContainValue: boolean;
};

type UseOptionResult<T> = {
  page: Page<T>;
  loading: boolean;
};

export function useOptions<T>(config: UseOptionConfig<T>): UseOptionResult<T> {
  const {
    options: optionsOrFetcher,
    value,
    keyForOption,
    labelForOption,
    isOptionEqual,
    reloadOptions,
    query,
    pageNumber,
    size,
    optionsShouldAlwaysContainValue
  } = config;

  const [ loading, setLoading ] = useState(
    () => !Array.isArray(optionsOrFetcher)
  );

  const [ page, setPage ] = useState(() => {
    if (Array.isArray(optionsOrFetcher)) {
      const page = pageFromOptionsArray(optionsOrFetcher);
      appendValueToPage(page);
      return page;
    } else {
      return emptyPage<T>();
    }
  });

  function pageFromOptionsArray(options: T[]): Page<T> {
    // Filter based on the label for the option
    const content = options.filter((option) =>
      labelForOption(option)
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase())
    );

    // We expect that the caller will change the pageNumber to 1
    // when the query changes. This is not `useOptions`'s
    // responsibility.
    return pageOf(content, pageNumber, size);
  }

  // When the options are loaded make sure that the options always
  // contain the value that the user has selected when
  // `optionsShouldAlwaysContainValue` is `true`.
  function appendValueToPage(page: Page<T>): void {
    /* 
        When a form component shows the selected value in one place, 
        but allows the user to select values from the another place 
        `optionsShouldAlwaysContainValue` should be `false`.
  
        Take for example the `ModalPickerMultiple`. The selected values 
        are rendered in the modal above the options in `Tag`'s. So there 
        is no need to append the selected values, because they are already
        visible.
      */
    if (!optionsShouldAlwaysContainValue) {
      return;
    }

    // If there is no value there is no need to add it
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      // When the value is an array add each value
      const prepend = value.filter((v) => {
        const isValueIncludedInPage = page.content.some((option) =>
          isOptionSelected({
            option,
            keyForOption,
            labelForOption,
            isOptionEqual,
            value: v
          })
        );

        return !isValueIncludedInPage;
      });

      page.content = [ ...prepend, ...page.content ];
    } else {
      const isValueIncludedInPage = page.content.some((option) =>
        isOptionSelected({
          option,
          keyForOption,
          labelForOption,
          isOptionEqual,
          value
        })
      );

      // If the value is in the page there is no need to add it
      if (isValueIncludedInPage) {
        return;
      }

      page.content.unshift(value);
    }
  }

  const watch = `${reloadOptions}-${query}-${pageNumber}-${size}`;

  const lastWatch = useRef(watch);

  useEffect(() => {
    async function loadOptions(fetcher: FetchOptionsCallback<T>) {
      setLoading(true);

      const resultPage: Page<T> = await fetcher({
        query,
        page: pageNumber,
        size
      });

      appendValueToPage(resultPage);
      setPage(resultPage);

      setLoading(false);
    }

    if (!Array.isArray(optionsOrFetcher)) {
      loadOptions(optionsOrFetcher);
    } else if (lastWatch.current !== watch) {
      lastWatch.current = watch;

      const newPage = pageFromOptionsArray(optionsOrFetcher);
      appendValueToPage(newPage);
      setPage(newPage);
    }
    // We only want to reload when the following props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ watch ]);

  return { loading, page };
}
