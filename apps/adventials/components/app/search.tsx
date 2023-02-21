import { Language } from '@castleadmin/checkout-domain';
import { SortOption } from '@castleadmin/product-domain';
import { Autocomplete, Button, debounce, Icon, InputBase } from '@mui/material';
import { captureException } from '@sentry/nextjs';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './search.module.scss';

/* eslint-disable-next-line */
export interface SearchProps {}

export let stateSearch;

export function Search(_props: SearchProps) {
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale as Language;
  const query = router.query['query']?.toString() ?? '';
  const category = router.query['category']?.toString() ?? '';
  const sort = router.query['sort']?.toString() ?? '';
  const { pathname, query: routerQuery, asPath } = router;

  const [state, setState] = useState({
    query,
    searchFieldText: query,
    autocompleteSearchText: query,
    autocompleteOptions: [] as string[],
  });
  stateSearch = state;

  // The route have been changed by another component
  if (state.query !== query) {
    setState({
      ...state,
      query,
      autocompleteSearchText: query,
      searchFieldText: query,
    });
  }

  const onSearch = async (searchText: string): Promise<void> => {
    // If the user performs a search and isn't on the items page
    if (pathname !== '/items') {
      if (searchText) {
        // Navigate to the items page
        await router.push({
          pathname: '/items',
          query: {
            query: searchText,
            sort: SortOption.bestResults,
            page: '1',
          },
        });

        return;
      } else {
        // On another page the search query parameter isn't set.
        // Therefore, the search text is empty.
        // This case should never happen. Do nothing!
        return;
      }
    }

    // If on the items page
    if (searchText) {
      await router.push({
        pathname: '/items',
        query: {
          ...routerQuery, // Preserve the existing query
          query: searchText, // Update the search query parameter
          sort: SortOption.bestResults, // Use the best results search option, in order to display the search results closest to the new search text at the top
          page: '1', // Navigate to the first page, since the result set has changed
        },
      });
    } else if (category) {
      const categoryQuery = { ...routerQuery };
      delete categoryQuery['query'];

      await router.push({
        pathname: '/items',
        query: {
          ...categoryQuery, // Preserve the existing query and remove the query parameter.
          // Switch the best results search option to popularity or do nothing.
          // The best results search option only makes sense in conjunction with a search text.
          sort: sort === SortOption.bestResults ? SortOption.popularity : sort,
          page: '1', // Navigate to the first page, since the result set has changed
        },
      });
    } else {
      // Go to the home page
      await router.push({
        pathname: '/',
        query: {},
      });
    }

    return;
  };

  const createAutocompleteOptions = (
    options: string[],
    searchText?: string
  ): string[] => {
    const optionsSet = new Set<string>();

    if (searchText) {
      optionsSet.add(searchText);
    }

    options.forEach((option) => optionsSet.add(option));

    const uniqueOptions = Array.from(optionsSet.keys()).slice(
      0,
      Math.min(optionsSet.size, 9)
    );

    return uniqueOptions;
  };

  const onChangeSearchFieldText = (
    _event: React.SyntheticEvent,
    value: string
  ): void => {
    const searchFieldText = value;

    if (searchFieldText !== state.searchFieldText) {
      setState({ ...state, searchFieldText });
    }
  };

  const onEmptyInputEnterKeyDown = (async (event) => {
    // special case that isn't handled by the autocomplete component
    if (event.key === 'Enter' && state.searchFieldText === '') {
      await onChangeAutocompleteSearchText(undefined, state.searchFieldText);
    }
  }) as KeyboardEventHandler<HTMLInputElement>;

  const onClickSearch = (async (): Promise<void> => {
    await onChangeAutocompleteSearchText(undefined, state.searchFieldText);
  }) as MouseEventHandler<HTMLDivElement>;

  const onChangeAutocompleteSearchText = async (
    _event?: React.SyntheticEvent,
    value?: string
  ): Promise<void> => {
    const autocompleteSearchText = value || '';

    if (autocompleteSearchText !== state.autocompleteSearchText) {
      setState({
        ...state,
        autocompleteSearchText,
        autocompleteOptions: createAutocompleteOptions(
          state.autocompleteOptions,
          autocompleteSearchText
        ),
      });
      await onSearch(autocompleteSearchText);
    }
  };

  const debouncedFetch = useMemo(
    () =>
      debounce(
        (
          options: {
            searchText: string;
            locale: Language;
            pathname: string;
            queryParameters: ParsedUrlQuery;
          },
          callback: (itemNames: string[]) => void,
          errorCallback: (error: unknown) => void
        ) => {
          const { searchText, locale, pathname, queryParameters } = options;
          const searchParameters = new URLSearchParams();

          if (pathname === '/items') {
            Object.keys(queryParameters).forEach((key) => {
              if (
                key === 'category' ||
                key === 'qualities' ||
                key === 'powers'
              ) {
                if (Array.isArray(queryParameters[key])) {
                  (queryParameters[key] as string[]).forEach((arrayValue) =>
                    searchParameters.append(key, arrayValue)
                  );
                } else {
                  searchParameters.append(key, queryParameters[key] as string);
                }
              }
            });
          }

          searchParameters.set('query', searchText);
          searchParameters.set('locale', locale);

          fetch(`/api/get-autocomplete-items?${searchParameters.toString()}`, {
            method: 'GET',
            mode: 'same-origin',
          })
            .then(async (response) => {
              if (!response.ok) {
                const responseText = await response.text();
                throw `error - /api/get-autocomplete-items - ${responseText}`;
              }

              const itemNames = await response.json();

              callback(itemNames);
            })
            .catch((error) => {
              console.error(error);
              captureException(error);
              errorCallback(error);
            });
        },
        400
      ),
    []
  );

  // Update autocomplete options inside an effect
  useEffect(() => {
    let componentExists = true;

    if (state.searchFieldText === '') {
      setState({
        ...state,
        autocompleteOptions: state.autocompleteSearchText
          ? [state.autocompleteSearchText]
          : [],
      });
    } else {
      debouncedFetch(
        {
          searchText: state.searchFieldText,
          locale,
          pathname,
          queryParameters: routerQuery,
        },
        (itemNames: string[]): void => {
          if (componentExists) {
            let updatedOptions: string[] = [];

            if (itemNames && itemNames.length > 0) {
              updatedOptions = createAutocompleteOptions(
                itemNames,
                state.autocompleteSearchText
              );
            } else if (state.autocompleteSearchText) {
              updatedOptions = [state.autocompleteSearchText];
            }

            setState({ ...state, autocompleteOptions: updatedOptions });
          }
        },
        () => {
          setState({
            ...state,
            autocompleteOptions: state.autocompleteSearchText
              ? [state.autocompleteSearchText]
              : [],
          });
        }
      );
    }

    return () => {
      componentExists = false;
    };
  }, [
    state.searchFieldText,
    state.autocompleteSearchText,
    debouncedFetch,
    asPath,
    locale,
  ]);

  return (
    <div className={styles['search-container']}>
      <div
        id="search-button"
        className={styles['search-button']}
        onClick={onClickSearch}
      >
        <Button>
          <Icon className="adventials-material-symbols-outlined">
            search_outlined
          </Icon>
        </Button>
      </div>
      <Autocomplete
        id="search-autocomplete"
        disableClearable
        freeSolo
        autoComplete
        includeInputInList
        filterSelectedOptions
        filterOptions={(x) => x}
        options={state.autocompleteOptions}
        value={state.autocompleteSearchText}
        onChange={onChangeAutocompleteSearchText}
        onInputChange={onChangeSearchFieldText}
        onKeyDown={onEmptyInputEnterKeyDown}
        renderInput={(params) => {
          const { InputLabelProps, InputProps, size, ...additionalParams } =
            params;

          return (
            <InputBase
              {...InputProps}
              {...additionalParams}
              size={size ?? 'medium'}
              className={styles['search-input'] as string}
              placeholder={t('searchHint') as string}
            />
          );
        }}
      />
    </div>
  );
}

export default Search;
