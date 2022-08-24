import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Text, Flex, Box, MarkText } from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';
import { useFetchAllianceView } from 'state/alliance/hooks';

const RecordBox = styled(Flex)`
  width: 200px;
  height: 58px;
  background: url('/images/battleReport/infoBg.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  cursor: pointer;
  /* position: relative; */
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
const TipBox = styled(Box)`
  width: 150px;
  position: absolute;
  background: #4b4b4b;
  opacity: 0;
  border-radius: 10px;
  padding: 0;
  bottom: -60px;
  left: 0;
  cursor: auto;
  transition: all 0.5s;
  overflow: hidden;
`;

const TipTriangle = styled(Box)`
  width: 0px;
  height: 0px;
  border: 10px solid transparent;
  border-bottom-color: #4b4b4b;
  position: absolute;
  left: 2px;
  top: -16px;
`;
const BattleReport = () => {
  useFetchAllianceView();

  const { t } = useTranslation();
  const { unread_plunder_count, message_count, later_extract_time } = useStore(
    p => p.alliance.allianceView,
  );
  const [CloseTips, setCloseTips] = useState(false);

  const ShowTip = useMemo(() => {
    if (CloseTips) return false;
    if (unread_plunder_count > 0) {
      return true;
    }
    return false;
  }, [CloseTips, unread_plunder_count]);

  return (
    <Box
      mt='20px'
      ml='20px'
      height='max-content'
      width='max-content'
      position='relative'
    >
      <Link to='/BattleReport'>
        <RecordBox
          className='Alliance_Messages'
          onMouseEnter={() => {
            // setCloseTips(true)
          }}
        >
          <MarkText
            ml='18px'
            padding={0}
            maxWidth='122px'
            fontSize='16px'
            bold
            fontStyle='normal'
          >
            {t('Brief Report')}
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
              {unread_plunder_count}
            </MarkText>
            {unread_plunder_count > 0 && <MessageBox />}
          </Flex>
        </RecordBox>
      </Link>
      <TipBox
        height={ShowTip ? 'max-content' : '0px'}
        style={
          ShowTip
            ? { opacity: 0.6, overflow: 'inherit', padding: '6px 16px' }
            : {}
        }
      >
        <Text fontSize='14px'>{t('New exploration completed')}</Text>
        <TipTriangle />
      </TipBox>
    </Box>
  );
};

export default BattleReport;
