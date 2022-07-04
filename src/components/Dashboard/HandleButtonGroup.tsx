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
              width={42}
              height={42}
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

const HandleButtonGroup: React.FC<HandleButtonGroupProps> = ({
  onBack,
  onRefresh,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Flex>
      <BackButton mr='22px' onBack={onBack} />
      {/* <RefreshButton mr='22px' onRefresh={onRefresh} /> */}
      <SecondaryButton href='/mystery-box' tag='m-box1'>
        {t('Explore').toLocaleUpperCase()}
      </SecondaryButton>
      <SecondaryButton href='/vip' tag='vip'>
        VIP
      </SecondaryButton>
    </Flex>
  );
};

export default HandleButtonGroup;
