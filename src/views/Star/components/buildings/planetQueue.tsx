import React from 'react';
import styled from 'styled-components';
import { useStore } from 'state';
import { Box, Flex, MarkText, Image } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { QueueBuilding } from './queueBuilding';

const Layout = styled(Box)`
  position: fixed;
  left: 30px;
  top: 30%;
`;

const QueueGroup = styled(Flex)`
  margin-bottom: 12px;
  cursor: pointer;
`;

const QueueBox = styled(Flex)`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 95px;
  height: 95px;
  overflow: hidden;
  background: linear-gradient(0deg, #1f5758 0%, #102426 100%);
  border-radius: 10px;
  border: 1px solid #4ffffb;
  margin-right: 10px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 93px;
    height: 93px;
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
    z-index: 0;
  }
`;

export const PlanetQueue = () => {
  const { t } = useTranslation();
  const vipBenefite = useStore(p => p.userInfo.userInfo.vipBenefits);
  const queueArr = Array.from(
    { length: vipBenefite?.building_queue_capacity },
    (v, i) => i,
  );

  return (
    <Layout>
      <MarkText mb='24px' fontSize='20px' bold>
        {t('BuildUpgradeQueue')}
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
            src='../images/commons/icon/icon-queue-add.png'
            width={37}
            height={37}
          />
        </QueueBox>
      </QueueGroup>
      <QueueGroup>
        <QueueBox>
          <Image
            src='../images/commons/icon/icon-queue-lock.png'
            width={37}
            height={37}
          />
        </QueueBox>
      </QueueGroup>
    </Layout>
  );
};
