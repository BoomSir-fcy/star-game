import React from 'react';
import styled from 'styled-components';
import { useStore } from 'state';
import { Box, Flex, MarkText, Image } from 'uikit';
import { QueueBuilding } from './queueBuilding';

const Layout = styled(Box)`
  position: fixed;
  left: 30px;
  top: 15%;
`;

const QueueGroup = styled(Flex)`
  margin-bottom: 12px;
  cursor: pointer;
`;

const QueueBox = styled(Box)`
  position: relative;
  width: 95px;
  height: 95px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.backgroundCard};
  background-image: linear-gradient(
    45deg,
    rgba(31, 34, 40, 0.5) 25%,
    transparent 25%,
    transparent 50%,
    rgba(31, 34, 40, 0.5) 50%,
    rgba(31, 34, 40, 0.5) 75%,
    transparent 75%,
    transparent
  );
  background-size: 7px 7px;
  border-radius: 10px;
  border: 1px solid #4ffffb;
  margin-right: 10px;
`;

export const PlanetQueue = () => {
  const vipBenefite = useStore(p => p.userInfo.userInfo.vipBenefits);
  const queueArr = Array.from(
    { length: vipBenefite?.building_queue_capacity },
    (v, i) => i,
  );

  return (
    <Layout>
      <MarkText mb='24px' fontSize='20px' bold>
        建造/升级队列
      </MarkText>
      {(queueArr ?? []).map(item => (
        <QueueGroup key={item}>
          <QueueBox>
            <Image
              src='http://192.168.101.106:9091/nfts/planet/33.png'
              width={95}
              height={95}
            />
          </QueueBox>
          <QueueBuilding type={1} status={1} level={1} />
        </QueueGroup>
      ))}
      <QueueGroup>
        <QueueBox>
          <Image
            src='http://192.168.101.106:9091/nfts/planet/33.png'
            width={95}
            height={95}
          />
        </QueueBox>
      </QueueGroup>
    </Layout>
  );
};
