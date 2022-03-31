import React from 'react';
import { Box, Flex, Text, Image, Progress, Button } from 'uikit';
import styled from 'styled-components';
import { useStore } from 'state';

const ProgressBox = styled(Box)`
  position: relative;
  border: 2px solid #2396ad;
`;

const ProgressImage = styled(Image)`
  position: absolute;
  left: -15px;
  top: -8px;
`;

const ProgressTextBox = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
`;

const BtnFlex = styled(Flex)``;

const ProductionProgress = () => {
  const { alliance } = useStore(p => p.alliance.allianceView);

  return (
    <Flex flex='1' flexDirection='column' padding='30px'>
      <Flex mb='20px' justifyContent='center'>
        <Text fontSize='20px'>资源生产(3h:30:30)</Text>
      </Flex>
      <ProgressBox mb='56px' ml='15px'>
        <Progress
          color='progressBar'
          variant='flat'
          scale='lg'
          primaryStep={36}
        />
        <ProgressImage
          src='/images/planetary_alliance/progress.png'
          width={235}
          height={75}
        />
        <ProgressTextBox>
          <Flex height='100%' justifyContent='center' alignItems='center'>
            <Text fontSize='22px' shadow='primary'>
              36%
            </Text>
          </Flex>
        </ProgressTextBox>
      </ProgressBox>
      <BtnFlex justifyContent='space-between'>
        <Button variant='black'>掠夺资源</Button>
        <Button variant='black'>占领恒星</Button>
      </BtnFlex>
    </Flex>
  );
};

export default ProductionProgress;
