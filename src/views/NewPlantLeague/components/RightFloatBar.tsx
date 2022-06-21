import React from 'react';
import styled from 'styled-components';
import { Text, Flex, Box, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';

const FloatBox = styled(Box)`
  position: fixed;
  right: 0;
  top: 30%;
`;

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

const RightFloatBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FloatBox>
      <RecordBox>
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
      </RecordBox>
    </FloatBox>
  );
};

export default RightFloatBar;
