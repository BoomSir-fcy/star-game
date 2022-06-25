import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex, Text, Input, Button } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import SearchInput from './SearchInput';
import SearchSelect from './SearchSelect';

const Search = () => {
  const { t } = useTranslation();
  const [showSelectSearch, setShowSelectSearch] = useState(false);

  return (
    <Flex
      width='100%'
      mb='10px'
      alignItems='center'
      justifyContent='space-between'
    >
      {showSelectSearch ? (
        <SearchSelect />
      ) : (
        <SearchInput
          onEndCallback={value => {
            console.log('value', value);
          }}
        />
      )}

      <Button
        width='107px'
        height='50px'
        variant='purple'
        onClick={() => setShowSelectSearch(p => !p)}
      >
        <Text color='textPrimary' bold>
          切换
        </Text>
      </Button>
    </Flex>
  );
};

export default Search;
