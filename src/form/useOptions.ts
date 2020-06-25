import { Page } from '@42.nl/spring-connect';
import { useEffect, useState } from 'react';

import {
  isOptionSelected,
  OptionEqual,
  OptionForValue,
  OptionsFetcher
} from './option';
import { isEqual } from 'lodash';

interface UseOptionConfig<T> {
  optionsOrFetcher: OptionsFetcher<T> | T[];
  value?: T;
  optionForValue: OptionForValue<T>;
  isOptionEqual?: OptionEqual<T>;
  watch?: any;
}

interface UseOptionResult<T> {
  options: T[];
  loading: boolean;
}

export function useOptions<T>(config: UseOptionConfig<T>): UseOptionResult<T> {
  const {
    optionsOrFetcher,
    value,
    optionForValue,
    isOptionEqual,
    watch
  } = config;

  const [loading, setLoading] = useState(
    () => !Array.isArray(optionsOrFetcher)
  );

  const [options, setOptions] = useState<T[]>(() =>
    Array.isArray(optionsOrFetcher) ? optionsOrFetcher : []
  );

  const [optionsLoaded, setOptionsLoaded] = useState(false);

  const [watchedValue, setWatchedValue] = useState(watch);

  // Load the options when the options is a OptionsFetcher once.
  useEffect(() => {
    async function loadOption(fetcher: OptionsFetcher<T>) {
      // When already loaded do nothing
      if (optionsLoaded) {
        return;
      }

      setLoading(true);

      const page: Page<T> = await fetcher();

      setOptions(page.content);
      setLoading(false);

      setOptionsLoaded(true);
    }

    if (!Array.isArray(optionsOrFetcher)) {
      loadOption(optionsOrFetcher);
    } else {
      setOptions(optionsOrFetcher);
    }
  }, [optionsLoaded, optionsOrFetcher]);

  // Reload the options when the options is an OptionsFetcher and
  // watch value changed
  useEffect(() => {
    async function loadOption(fetcher: OptionsFetcher<T>) {
      setLoading(true);

      const page: Page<T> = await fetcher();

      setOptions(page.content);
      setLoading(false);

      setOptionsLoaded(true);
    }

    if (!Array.isArray(optionsOrFetcher)) {
      if (!isEqual(watchedValue, watch)) {
        loadOption(optionsOrFetcher);
        setWatchedValue(watch);
      }
    }
  }, [watch, optionsOrFetcher, watchedValue]);

  // When the options are loaded make sure that the options always
  // contain the value that the user has selected.
  useEffect(() => {
    if (value) {
      if (
        !options.some(option =>
          isOptionSelected({ option, optionForValue, isOptionEqual, value })
        )
      ) {
        setOptions([value, ...options]);
      }
    }
  }, [value, options, isOptionEqual, optionForValue, setOptions]);

  return { loading, options };
}
