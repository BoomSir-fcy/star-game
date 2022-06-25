import React, { useCallback, useMemo } from 'react';
import { Select } from 'components/Select';
import { Flex } from 'uikit';
import { useImmer } from 'use-immer';
import { useTranslation } from 'contexts/Localization';
import { useDispatch } from 'react-redux';
import { LevelOptions, RaceOptions, RarityOptions } from './config';

const SearchSelect: React.FC<{ onSelectCallback: (values: any) => void }> = ({
  onSelectCallback,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [state, setState] = useImmer({
    race: 0,
    rarity: 0,
    level: 0,
  });

  const RaceOption = useMemo(() => {
    return RaceOptions(t);
  }, [t]);

  const RarityOption = useMemo(() => {
    return RarityOptions(t);
  }, [t]);

  const LevelOption = useMemo(() => {
    return LevelOptions(20);
  }, []);

  const handleSelect = useCallback(
    (key, value) => {
      setState(p => {
        p[key] = value;
      });
      onSelectCallback({ ...state, [key]: value });
    },
    [state, setState, onSelectCallback],
  );
  return (
    <Flex>
      <Select
        width='180px'
        direction='up'
        options={RaceOption}
        defaultId={state.race}
        onChange={option => handleSelect('race', option.value)}
      />
      <Select
        ml='14px'
        width='180px'
        direction='up'
        options={RarityOption}
        defaultId={state.rarity}
        onChange={option => handleSelect('rarity', option.value)}
      />
      <Select
        ml='14px'
        width='180px'
        direction='up'
        options={LevelOption}
        defaultId={state.level}
        onChange={option => handleSelect('level', option.value)}
      />
    </Flex>
  );
};

export default SearchSelect;
