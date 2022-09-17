import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Box, BoxProps, Text, Flex, Button } from 'uikit';
import Modal from 'components/Modal';
import { useTranslation } from 'contexts/Localization';

const BoxStyled = styled(Box)`
  width: 281px;
  height: 204px;
  background: url('/images/plunder/round.png');
  background-size: 100% 100%;
  position: relative;
`;
const FlexStyled = styled(Flex)`
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: 0;
  top: auto;
  left: 0;
  bottom: 0;
  margin: auto;
`;
const ButtonStyled = styled(Button).attrs({ variant: 'vs' })`
  width: 160px;
  height: 51px;
`;

interface RoundPanelProps extends BoxProps {
  roundName?: string;
  isEnemy?: boolean;
  onEnd?: () => void;
}

const RoundPanel: React.FC<RoundPanelProps> = ({
  roundName,
  isEnemy,
  onEnd,
  ...props
}) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const handleEnd = useCallback(() => {
    setVisible(true);
    if (onEnd) {
      onEnd();
    }
  }, [setVisible, onEnd]);

  return (
    <BoxStyled {...props}>
      <FlexStyled>
        <Text shadow='primary' fontSize='24px' bold>
          {roundName || '--'}
        </Text>
        <Text shadow='primary' fontSize='22px' bold>
          {isEnemy ? 'Enemy Actions' : 'Our Actions'}
        </Text>
        <ButtonStyled
          onClick={() => {
            setVisible(true);
          }}
          mt='26px'
        >
          <Text shadow='primary' small bold>
            Skip
          </Text>
        </ButtonStyled>
      </FlexStyled>
      <Modal title={t('Kind tips')} visible={visible} setVisible={setVisible}>
        <Flex
          height='350px'
          flexDirection='column'
          justifyContent='space-around'
        >
          <Box>
            <Text fontSize='20px' textAlign='center'>
              {t('Skip this round of combat?')}
            </Text>
            <Text fontSize='20px' textAlign='center'>
              {t('(Skip will not affect the result of this battle)')}
            </Text>
          </Box>
          <Flex justifyContent='space-around'>
            <Button
              width='180px'
              variant='purple'
              onClick={() => setVisible(false)}
            >
              {t('Cancel')}
            </Button>
            <Button width='180px' variant='purple' onClick={handleEnd}>
              {t('Confirm')}
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </BoxStyled>
  );
};

export default RoundPanel;
