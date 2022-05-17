import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flex,
  Button,
  Image,
  RefreshButton,
  BackButton,
  ButtonOnBack,
  ButtonOnRefresh,
  ButtonProps,
  Box,
  Text,
} from 'uikit';
import { useTranslation } from 'contexts/Localization';

export interface ButtonGroupProps {
  onRefresh?: () => void;
  onBack?: ButtonOnBack;
  className?: string;
}

interface SecondaryButtonProps extends ButtonProps {
  tag: 'attack' | 'flag' | 'm-box' | 'star';
  href: string;
}
const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  tag,
  children,
  href,
  ...props
}) => {
  return (
    <Box mr='22px'>
      <Link to={href}>
        <Button
          {...props}
          variant='secondary'
          startIcon={
            <Image
              width={50}
              height={50}
              src={`/images/commons/btn/${tag}.png`}
            />
          }
        >
          <Text fontSize='20px' bold shadow='secondary'>
            {children}
          </Text>
        </Button>
      </Link>
    </Box>
  );
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({ onBack, onRefresh }) => {
  const { t } = useTranslation();

  return (
    <Flex>
      <SecondaryButton href='/plunder' tag='attack'>
        {t('Loot Resources').toLocaleUpperCase()}
      </SecondaryButton>
      <SecondaryButton href='/galaxy' tag='flag'>
        {t('Occupy Star').toLocaleUpperCase()}
      </SecondaryButton>
      <SecondaryButton href='/plant-league' tag='star'>
        {t('Planet Alliance').toLocaleUpperCase()}
      </SecondaryButton>
      <SecondaryButton href='/mystery-box' tag='m-box'>
        {t('Planet Box').toLocaleUpperCase()}
      </SecondaryButton>
      {/* <BackButton onBack={onBack} /> */}
      <RefreshButton mr='23px' onRefresh={onRefresh} />
    </Flex>
  );
};

export default ButtonGroup;
