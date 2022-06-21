import React, { useState } from 'react';
import styled from 'styled-components';
import { Text, Flex, Box, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import HowToPlay from './HowToPlay';

const RecordBox = styled(Flex)`
  width: 200px;
  height: 58px;
  background: url('/images/battleReport/infoBg.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin-bottom: 20px;
  cursor: pointer;
  position: relative;
`;

const ImgFlex = styled(Flex)`
  width: 38px;
  img {
    width: 100%;
  }
`;

const MessageBox = styled(Box)`
  position: absolute;
  right: -2px;
  top: -2px;
  background-color: ${({ theme }) => theme.colors.redText};
  width: 11px;
  height: 11px;
  border-radius: 50%;
`;

const BarFlex = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
`;

const TipBox = styled(Box)`
  width: 150px;
  position: absolute;
  background: #4b4b4b;
  opacity: 0.5;
  border-radius: 10px;
  padding: 6px 16px;
  left: -160px;
  cursor: auto;
`;

const TipTriangle = styled(Box)`
  width: 0px;
  height: 0px;
  border: 10px solid transparent;
  border-top-color: #4b4b4b;
  position: absolute;
  right: -8px;
  top: 0;
`;

const RightFloatBar: React.FC = () => {
  const { t } = useTranslation();
  const [ShowPlay, setShowPlay] = useState(false);
  return (
    <BarFlex>
      <RecordBox
        onMouseEnter={() => setShowPlay(true)}
        onMouseLeave={() => setShowPlay(false)}
      >
        <MarkText ml='24px' fontSize='16px' bold fontStyle='normal'>
          {t('玩法介绍')}
        </MarkText>
        <ImgFlex mr='11px' justifyContent='center' alignItems='center'>
          <img src='/images/commons/icon/help.png' alt='' />
        </ImgFlex>
      </RecordBox>
      <RecordBox>
        <MarkText ml='24px' fontSize='16px' bold fontStyle='normal'>
          {t('修复耐久')}
        </MarkText>
        <ImgFlex mr='11px' justifyContent='center' alignItems='center'>
          <img src='/images/commons/icon/icon-vip.png' alt='' />
        </ImgFlex>
      </RecordBox>
      <RecordBox>
        <MarkText ml='24px' fontSize='16px' bold fontStyle='normal'>
          {t('充值资源')}
        </MarkText>
        <ImgFlex mr='11px' justifyContent='center' alignItems='center'>
          <img src='/images/commons/icon/icon-vip.png' alt='' />
        </ImgFlex>
      </RecordBox>
      <RecordBox>
        <MarkText ml='24px' fontSize='16px' bold fontStyle='normal'>
          {t('站内消息')}
        </MarkText>
        <Flex
          justifyContent='center'
          alignItems='center'
          width='42px'
          height='42px'
          mr='8px'
          position='relative'
        >
          <MarkText fontSize='18px' bold fontStyle='italic'>
            3
          </MarkText>
          <MessageBox />
        </Flex>
      </RecordBox>
      <RecordBox>
        <MarkText ml='24px' fontSize='16px' bold fontStyle='normal'>
          {t('联盟消息')}
        </MarkText>
        <Flex
          justifyContent='center'
          alignItems='center'
          width='42px'
          height='42px'
          mr='8px'
          position='relative'
        >
          <MarkText fontSize='18px' bold fontStyle='italic'>
            3
          </MarkText>
          <MessageBox />
        </Flex>
        <TipBox>
          <Text fontSize='14px'>{t('新的探索已完成')}</Text>
          <TipTriangle />
        </TipBox>
      </RecordBox>
      <HowToPlay ShowPlay={ShowPlay} setShowPlay={e => setShowPlay(e)} />
    </BarFlex>
  );
};

export default RightFloatBar;
