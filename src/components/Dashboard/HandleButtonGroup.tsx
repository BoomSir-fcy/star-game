import React, { useMemo } from 'react';
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

export interface HandleButtonGroupProps {
  onRefresh?: () => void;
  onBack?: ButtonOnBack;
  className?: string;
}

interface SecondaryButtonProps extends ButtonProps {
  tag: 'm-box1' | 'vip';
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
          variant='s2-long'
          startIcon={
            <Image
              width={tag === 'm-box1' ? 35 : 40}
              height={tag === 'm-box1' ? 35 : 40}
              src={`/images/commons/btn/${tag}.png`}
            />
          }
        >
          <Text
            ml={tag === 'm-box1' ? '-0.5rem' : ''}
            fontSize='20px'
            bold
            shadow='primary'
          >
            {children}
          </Text>
        </Button>
      </Link>
    </Box>
  );
};

const HandleButtonGroup: React.FC<HandleButtonGroupProps> = ({
  onBack,
  onRefresh,
  className,
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const ShowBack = useMemo(() => {
    const pathList = ['/star/planet', '/plant-league', '/galaxy'];
    if (pathList.indexOf(pathname) !== -1) {
      return false;
    }
    return true;
  }, [pathname]);

  return (
    <Flex>
      {/* <RefreshButton mr='22px' onRefresh={onRefresh} /> */}

      {process.env.REACT_APP_API_HOST?.includes('tsapi2') ||
        (process.env.REACT_APP_API_HOST?.includes('192') && (
          <SecondaryButton href='/change-rate' tag='m-box1'>
            更改时间倍率
          </SecondaryButton>
        ))}
      <SecondaryButton className='tofind' href='/mystery-box' tag='m-box1'>
        {t('Discovers').toLocaleUpperCase()}
      </SecondaryButton>
      <SecondaryButton href='/vip' tag='vip'>
        VIP
      </SecondaryButton>
      {ShowBack && <BackButton mr='22px' onBack={onBack} />}
    </Flex>
  );
};

export default HandleButtonGroup;
