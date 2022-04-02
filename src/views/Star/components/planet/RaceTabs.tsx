import React from 'react';
import styled, { css } from 'styled-components';
import { Flex, Button } from 'uikit';

const Container = styled(Flex)`
  width: 495px;
  height: 55px;
  padding: 0 7px;
  align-items: center;
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
  background-size: 10px 10px;
  border-radius: ${({ theme }) => theme.radii.card};
`;

const TabsButton = styled(Button)<{ active?: boolean }>`
  width: 160px;
  height: 45px;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  ${({ active }) =>
    active &&
    css`
      border-radius: 10px;
      background: url(/images/commons/btn/blue-round.png) no-repeat;
      background-size: auto auto;
    `}
`;

export const PlanetRaceTabs: React.FC<{
  current?: number;
}> = ({ current }) => {
  const raceArr = [
    {
      id: 1,
      label: '神族',
    },
    {
      id: 2,
      label: '人族',
    },
    {
      id: 3,
      label: '虫族',
    },
  ];

  return (
    <Container>
      {raceArr.map(({ id, label }) => (
        <TabsButton key={id} scale='sm' variant='text' active={current === id}>
          {label}
        </TabsButton>
      ))}
    </Container>
  );
};
