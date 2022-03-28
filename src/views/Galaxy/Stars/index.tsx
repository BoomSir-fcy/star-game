import React, { useState } from 'react';
import { Flex } from 'uikit';
import { Layout, Dashboard, Nav, StarAddBtn } from 'components';
import { starList } from '../config';
import { StarBox } from './style';
import { StarInfo, StarsLevel } from '../type';
import { PlunderCard } from './PlunderCard';

const Stars = () => {
  const [activeLevel, setActiveLevel] = useState<StarsLevel>(starList[0] || {});
  const [activeStar, setActiveStar] = useState<StarInfo>({ lv: 0 });
  const [visible, setVisible] = useState(false);

  console.log(activeStar);

  return (
    <Layout>
      <Dashboard />
      <Flex alignItems='center' mt='16px'>
        <Nav
          nav={starList}
          mr='24px'
          onChangeNav={info => {
            console.log(info);
            setActiveLevel(info);
          }}
        />
        <StarBox>
          {activeLevel &&
            activeLevel?.levels?.map((item, index) => (
              <StarAddBtn
                key={item}
                className={`star-${index + 1}`}
                active={activeStar.lv === item}
                owner={`Lv ${item}`}
                url='/images/login/a-man.png'
                onClick={() => {
                  setActiveStar({ lv: item });
                  setVisible(true);
                }}
              />
            ))}

          {visible && (
            <PlunderCard info={activeStar} onClose={() => setVisible(false)} />
          )}
        </StarBox>
      </Flex>
    </Layout>
  );
};

export default Stars;
