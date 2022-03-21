import React from 'react';
import styled from 'styled-components';
import { Box, Flex } from 'uikit';
import useAuth from 'hooks/useAuth';
import connectors from 'config/wallet/config';
import WalletItem from './WalletItem';

const WalletModalStyled = styled.div<{
  show?: boolean;
  onClick?: (e: Event) => void;
}>`
  position: fixed;
  top: 10vh;
  right: 0;
  left: 0;
  margin: auto;
  padding: 22px 26px;
  z-index: 1000;
  border-radius: ${({ theme }) => theme.radii.card};
  transform: ${({ show }) =>
    show ? 'rotate3d(1, 0, 0, 0deg)' : 'rotate3d(1, 0, 0, 90deg)'};
  background: rgba(28, 28, 28, 0.9);
  transition: 300ms transform;
  width: 500px;
  max-width: 100%;
`;

export const Cover = styled(Box)<{ show?: boolean }>`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 13;
`;

const WalletModal: React.FC<{ show?: boolean; onClick?: (e: any) => void }> = ({
  show,
  onClick,
}) => {
  const { login } = useAuth();

  return (
    <WalletModalStyled onClick={onClick} show={show}>
      <Flex mt='28px' flexWrap='wrap'>
        {connectors.map((item, index) => (
          <Box maxWidth='42%' margin='12px' mt='0' key={item.title}>
            <WalletItem walletConfig={item} login={login} />
          </Box>
        ))}
      </Flex>
    </WalletModalStyled>
  );
};

export default WalletModal;
