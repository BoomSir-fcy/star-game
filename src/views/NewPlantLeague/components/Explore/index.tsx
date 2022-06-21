import React, { useState } from 'react';
import { Button, Flex } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import ExploreModule from './ExploreModule';

const Explore: React.FC = () => {
  const { t } = useTranslation();
  const [ShowModule, setShowModule] = useState(false);
  const [Difficulty, setDifficulty] = useState(0);
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
      {ShowModule && (
        <ExploreModule
          Difficulty={Difficulty}
          setDifficulty={e => setDifficulty(e)}
        />
      )}
    </Flex>
  );
};

export default Explore;
