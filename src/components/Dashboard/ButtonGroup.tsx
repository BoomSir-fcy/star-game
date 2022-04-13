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
} from 'uikit';
import { useTranslation } from 'contexts/Localization';

export interface ButtonGroupProps {
  onRefresh?: ButtonOnRefresh;
  onBack?: ButtonOnBack;
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
          {children}
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
        {t('Plunder resources').toLocaleUpperCase()}
      </SecondaryButton>
      <SecondaryButton href='/galaxy' tag='flag'>
        {t('Occupy the stars').toLocaleUpperCase()}
      </SecondaryButton>
      <SecondaryButton href='/plant-league' tag='star'>
        {t('STAR GPOUP').toLocaleUpperCase()}
      </SecondaryButton>
      <SecondaryButton href='/mystery-box' tag='m-box'>
        {t('STAR BOX').toLocaleUpperCase()}
      </SecondaryButton>
      {/* <BackButton onBack={onBack} /> */}
      <RefreshButton mr='23px' onRefresh={onRefresh} />
    </Flex>
  );
};

export default ButtonGroup;
