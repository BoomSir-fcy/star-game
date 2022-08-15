import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import TooltipTrigger from 'components/Tooltip';

export interface ButtonGroupProps {
  onRefresh?: () => void;
  onBack?: ButtonOnBack;
  className?: string;
}

interface SecondaryButtonProps extends ButtonProps {
  tag: 'attack' | 'flag' | 'm-box' | 'star' | 'bag';
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
              width={36}
              height={36}
              src={`/images/commons/btn/${tag}.png`}
            />
          }
        >
          <Text bold shadow='secondary'>
            {children}
          </Text>
        </Button>
      </Link>
    </Box>
  );
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  onBack,
  onRefresh,
  className,
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <Flex>
      <SecondaryButton href='/star/planet' tag='bag'>
        {t('Planet').toLocaleUpperCase()}
      </SecondaryButton>
      <SecondaryButton
        href='/plant-league'
        tag='star'
        className='header_explore'
      >
        {t('Alliance').toLocaleUpperCase()}
      </SecondaryButton>
      {pathname === '/plant-league' ? (
        <TooltipTrigger
          overlay={<Text color='textPrimary'>{t('Earn BOX')}</Text>}
          defaultVisible
          trigger={[]}
          placement='topRight'
        >
          <SecondaryButton href='/galaxy' tag='flag'>
            {t('Galaxy').toLocaleUpperCase()}
          </SecondaryButton>
        </TooltipTrigger>
      ) : (
        <SecondaryButton href='/galaxy' tag='flag'>
          {t('Galaxy').toLocaleUpperCase()}
        </SecondaryButton>
      )}

      {/* <BackButton onBack={onBack} /> */}
      {/* <RefreshButton mr='23px' onRefresh={onRefresh} /> */}
    </Flex>
  );
};

export default ButtonGroup;
