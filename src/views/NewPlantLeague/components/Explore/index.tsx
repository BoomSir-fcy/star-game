import React, { useState } from 'react';
import { Button, Flex } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const Explore: React.FC<{
  ShowModule: boolean;
  setShowModule: (e) => void;
}> = ({ ShowModule, setShowModule }) => {
  const { t } = useTranslation();

  return (
    <Flex zIndex={1} position='relative' justifyContent='center'>
      <Button
        variant='vs'
        onClick={() => {
          setShowModule(true);
        }}
      >
        {t('开始探索')}
        {`(${0}/${2})`}
      </Button>
    </Flex>
  );
};

export default Explore;
