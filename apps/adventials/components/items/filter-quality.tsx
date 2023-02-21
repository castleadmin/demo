import { stringArrayEquals } from '@castleadmin/frontend-utils';
import { Quality } from '@castleadmin/product-domain';
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Trans, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './filter-quality.module.scss';

/* eslint-disable-next-line */
export interface FilterQualityProps {}

export let stateFilterQuality;

export function FilterQuality(_props: FilterQualityProps) {
  const { t } = useTranslation();

  const router = useRouter();
  let qualities = (router.query['qualities'] as string[]) ?? [];
  if (!Array.isArray(qualities)) {
    qualities = [qualities];
  }
  const { pathname, query } = router;

  const [state, setState] = useState({
    qualities,
  });
  stateFilterQuality = state;

  // The route have been changed
  if (!stringArrayEquals(state.qualities, qualities)) {
    setState({ ...state, qualities });
  }

  const onQualityChange = async (event: SelectChangeEvent<string[]>) => {
    const selectFieldQualities = event.target.value as string[];

    await router.push({
      pathname,
      query: { ...query, qualities: selectFieldQualities, page: '1' },
    });
  };

  return (
    <FormControl className={styles['filter-quality'] as string}>
      <InputLabel id="filter-quality-label" color="label">
        <Trans>quality</Trans>
      </InputLabel>
      <Select
        id="filter-quality-input"
        labelId="filter-quality-label"
        multiple
        color="secondary"
        value={state.qualities}
        onChange={onQualityChange}
        input={<OutlinedInput label={t('quality')} />}
        renderValue={(selected: string[]) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value: string) => (
              <Chip
                key={value}
                label={t(
                  `quality${value.charAt(0).toUpperCase()}${value.substring(1)}`
                )}
              />
            ))}
          </Box>
        )}
      >
        <MenuItem value={Quality.normal}>
          <Trans>qualityNormal</Trans>
        </MenuItem>
        <MenuItem value={Quality.improved}>
          <Trans>qualityImproved</Trans>
        </MenuItem>
        <MenuItem value={Quality.excellent}>
          <Trans>qualityExcellent</Trans>
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default FilterQuality;
