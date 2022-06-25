import React from 'react';
import { Select } from 'components/Select';
import { RaceOptions } from './config';

const SearchSelect = () => {
  return (
    <Select
      width='180px'
      // height='50px'
      direction='up'
      options={RaceOptions}
      defaultId={1}
      onChange={option => {
        console.log(option.value);
      }}
    />
  );
};

export default SearchSelect;
