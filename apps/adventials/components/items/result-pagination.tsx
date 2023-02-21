import { stringArrayEquals } from '@castleadmin/frontend-utils';
import { Pagination } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './result-pagination.module.scss';

/* eslint-disable-next-line */
export interface ResultPaginationProps {
  count: number;
}

export let stateResultPagination;

export function ResultPagination(props: ResultPaginationProps) {
  const router = useRouter();
  let page = Number.parseInt(router.query['page']?.toString() ?? '');
  if (!Number.isFinite(page)) {
    page = 1;
  }
  let qualities = (router.query['qualities'] as string[]) ?? [];
  if (!Array.isArray(qualities)) {
    qualities = [qualities];
  }
  let powers = (router.query['powers'] as string[]) ?? [];
  if (!Array.isArray(powers)) {
    powers = [powers];
  }
  const { pathname, query } = router;

  const [state, setState] = useState({
    page,
    qualities,
    powers,
  });
  stateResultPagination = state;

  // The route have been changed
  if (state.page !== page) {
    setState({ ...state, page });
  }

  // The filter options have been changed
  if (
    !stringArrayEquals(state.qualities, qualities) ||
    !stringArrayEquals(state.powers, powers)
  ) {
    setState({ ...state, qualities, powers });
    router.push({ pathname, query: { ...query, page: 1 } });
  }

  const onPaginationChange = async (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const pageValue = value;

    await router.push({ pathname, query: { ...query, page: pageValue } });
  };

  return (
    <Pagination
      className={styles['result-pagination'] as string}
      count={props.count}
      page={state.page}
      color={'pagination'}
      onChange={onPaginationChange}
    />
  );
}

export default ResultPagination;
