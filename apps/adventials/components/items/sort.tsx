import { SortOption } from '@castleadmin/product-domain';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Trans, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './sort.module.scss';

/* eslint-disable-next-line */
export interface SortProps {}

export let stateSort;

export function Sort(_props: SortProps) {
  const { t } = useTranslation();

  const router = useRouter();
  const query = router.query['query']?.toString() ?? '';
  const sort = router.query['sort']?.toString() ?? '';
  const { pathname, query: routerQuery } = router;

  const [state, setState] = useState({
    sort,
  });
  stateSort = state;

  // The sort query parameter has changed
  if (state.sort !== sort) {
    setState({ ...state, sort });
  }

  const onSortChange = async (event: SelectChangeEvent<string>) => {
    const selectFieldSort = event.target.value;

    await router.push({
      pathname,
      query: { ...routerQuery, sort: selectFieldSort, page: '1' },
    });
  };

  return (
    <FormControl className={styles['sort'] as string}>
      <InputLabel id="sort-label" color="label">
        <Trans>sort</Trans>
      </InputLabel>
      <Select
        id="sort-input"
        label={t('sort')}
        labelId="sort-label"
        color="secondary"
        value={state.sort}
        onChange={onSortChange}
      >
        {Object.values(SortOption)
          .filter(
            (sortOption) =>
              Boolean(query) || sortOption !== SortOption.bestResults
          )
          .map((sortOption) => (
            <MenuItem key={sortOption} value={sortOption}>
              <Trans>{`sortBy${sortOption
                .substring(0, 1)
                .toUpperCase()}${sortOption.substring(1)}`}</Trans>
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

export default Sort;
