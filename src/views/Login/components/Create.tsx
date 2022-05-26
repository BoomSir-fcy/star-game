import React, {
  useCallback,
  useState,
  useImperativeHandle,
  useEffect,
} from 'react';
import Chance from 'chance';
import { Box, TweenText, Flex, Input, Label, Button, Text } from 'uikit';
import { ManAvatar, WoManAvatar } from 'components/Avatar';
import { Gender } from 'state/types';
import styled from 'styled-components';
import { useToast } from 'contexts/ToastsContext';
import KingAvatar from 'views/Galaxy/components/KingAvatar';
import { useTranslation } from 'contexts/Localization';

const chance = new Chance();

const BoxStyled = styled(Box)`
  background: url('/images/login/b1.png') no-repeat center;
  height: 788px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopBox = styled(Box)`
  background: url('/images/login/t1.png') center;
  width: 580px;
  height: 76px;
  text-align: center;
  padding-top: 26px;
`;

export interface ForwardRefRenderProps {
  getState: () => { name: string; gender: Gender; superior: string };
}

const Create: React.ForwardRefRenderFunction<ForwardRefRenderProps, any> = (
  p,
  ref,
) => {
  const { t } = useTranslation();
  const [gender, setGender] = useState(Gender.MAN);
  const [name, setName] = useState('');
  const [superior, setSuperior] = useState('');

  const { toastSuccess, toastError } = useToast();

  useEffect(() => {
    const InviteAddress = localStorage.getItem('InviteAddress');
    if (InviteAddress) {
      setSuperior(InviteAddress);
    }
  }, [setSuperior]);

  const randomName = useCallback(() => {
    setName(chance.name());
  }, [setName]);

  useImperativeHandle(ref, () => ({
    getState() {
      return { gender, name, superior };
    },
  }));

  return (
    <BoxStyled>
      <TopBox>
        <TweenText
          to={t('Commander! Please create an identity for yourself')}
          from=''
        />
      </TopBox>
      <Flex width='540px' mt='28px' justifyContent='space-between'>
        <KingAvatar
          onClick={() => {
            return setGender(Gender.MAN);
          }}
          width={gender === Gender.MAN ? '241px' : '200px'}
          height={gender === Gender.MAN ? '236px' : '200px'}
          sex='man'
        />
        <KingAvatar
          onClick={() => {
            return setGender(Gender.WOMAN);
          }}
          width={gender === Gender.WOMAN ? '241px' : '200px'}
          height={gender === Gender.WOMAN ? '236px' : '200px'}
          sex='woman'
        />
        {/* <ManAvatar
          onClick={() => {
            return setGender(Gender.MAN);
          }}
          active={gender === Gender.MAN}
        />

        <WoManAvatar
          onClick={() => {
            return setGender(Gender.WOMAN);
          }}
          active={gender === Gender.WOMAN}
        /> */}
      </Flex>
      <Label mt={22} width={603} pr='18px'>
        <Input
          value={name}
          className='login-step0'
          onChange={event => {
            setName(event.target.value);
          }}
          placeholder={t('Enter a name you want')}
        />
        <Button variant='text'>
          <Box onClick={randomName} width='37px'>
            <img alt='' src='/images/login/round.png' />
          </Box>
        </Button>
      </Label>
      <Label mt={22} width={603} pr='18px'>
        <Input
          value={superior}
          onChange={event => {
            setSuperior(event.target.value);
          }}
          placeholder={t("Enter the inviter's address (optional)")}
        />
      </Label>
      <Text mt={32} small>
        {t(
          'Create an identity will consume 100 DSG, the system will automatically exchange BNB for this amount of DSG using a real-time exchange rate.',
        )}
      </Text>
    </BoxStyled>
  );
};

export default React.forwardRef(Create);
