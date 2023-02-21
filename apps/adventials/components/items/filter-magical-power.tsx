import { stringArrayEquals } from '@castleadmin/frontend-utils';
import { EffectPower } from '@castleadmin/product-domain';
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
import styles from './filter-magical-power.module.scss';

/* eslint-disable-next-line */
export interface FilterMagicalPowerProps {}

export let stateFilterMagicalPower;

export function FilterMagicalPower(_props: FilterMagicalPowerProps) {
  const { t } = useTranslation();

  const router = useRouter();
  let powers = (router.query['powers'] as string[]) ?? [];
  if (!Array.isArray(powers)) {
    powers = [powers];
  }
  const { pathname, query } = router;

  const [state, setState] = useState({
    powers,
  });
  stateFilterMagicalPower = state;

  // The route have been changed
  if (!stringArrayEquals(state.powers, powers)) {
    setState({ ...state, powers });
  }

  const onPowerChange = async (event: SelectChangeEvent<string[]>) => {
    const selectFieldPowers = event.target.value as string[];

    await router.push({
      pathname,
      query: { ...query, powers: selectFieldPowers, page: '1' },
    });
  };

  return (
    <FormControl className={styles['filter-magical-power'] as string}>
      <InputLabel id="filter-magical-power-label" color="label">
        <Trans>magicalPower</Trans>
      </InputLabel>
      <Select
        id="filter-magical-power-input"
        labelId="filter-magical-power-label"
        multiple
        color="secondary"
        value={state.powers}
        onChange={onPowerChange}
        input={<OutlinedInput label={t('magicalPower')} />}
        renderValue={(selected: string[]) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value: string) => (
              <Chip
                key={value}
                label={t(
                  `magicalPower${value
                    .charAt(0)
                    .toUpperCase()}${value.substring(1)}`
                )}
              />
            ))}
          </Box>
        )}
      >
        <MenuItem value={EffectPower.none}>
          <Trans>magicalPowerNone</Trans>
        </MenuItem>
        <MenuItem value={EffectPower.weak}>
          <Trans>magicalPowerWeak</Trans>
        </MenuItem>
        <MenuItem value={EffectPower.average}>
          <Trans>magicalPowerAverage</Trans>
        </MenuItem>
        <MenuItem value={EffectPower.strong}>
          <Trans>magicalPowerStrong</Trans>
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default FilterMagicalPower;
