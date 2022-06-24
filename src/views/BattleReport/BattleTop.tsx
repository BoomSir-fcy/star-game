import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Card,
  Flex,
  Box,
  Text,
  Image,
  BackButton,
  RefreshButton,
  MarkText,
} from 'uikit';
import { useTranslation } from 'contexts/Localization';
import { useDispatch } from 'react-redux';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
import dayjs from 'dayjs';

const TitleBox = styled(Flex)`
  width: 512px;
  height: 52px;
  background: url('/images/battleReport/top.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: center;
`;

const RecordBox = styled(Flex)`
  width: 316px;
  height: 90px;
  background: url('/images/battleReport/infoBg.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 34px 0 45px;
  margin-left: 20px;
  .SingleDatePickerInput__withBorder {
    border: none;
  }
  .SingleDatePickerInput {
    background-color: transparent;
    .DateInput {
      background: transparent;
      #date_input {
        background-color: transparent;
        text-shadow: 0px 3px 0.4em #79c6c4;
        background: linear-gradient(
          0deg,
          rgba(79, 255, 251, 1) 0%,
          rgba(255, 255, 255, 1) 60.4873046875%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: #ffffff;
        font-size: 22px;
        font-weight: 600;
        font-family: SourceHanSansCN-Bold;
        line-height: 1.5;
        /* margin-left: 20px; */
        margin-top: 10px;
        font-size: 22px;
        font-style: italic;
        padding: 0;
        border: none;
        cursor: pointer;
      }
    }
    .CalendarDay {
      line-height: 38px;
    }
    .SingleDatePicker_picker__directionLeft {
      top: 64px !important;
    }
  }
`;

const DownImg = styled.img`
  width: 42px;
  transform: rotate(90deg);
  cursor: pointer;
`;

interface contInfo {
  Cont: number;
  WinCont: number;
  FailedCont: number;
}

export const BattleTop: React.FC<{
  cont: contInfo;
  upDate: (e) => void;
}> = ({ cont, upDate }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [date, setDate] = useState();
  const [isFocused, setIsFocused] = useState(false);

  const onDateChange = (e: any) => {
    setDate(e);
    const time = dayjs(e).unix();
    upDate(time);
  };
  const onFocusChange = ({ focused }) => {
    setIsFocused(focused);
  };

  return (
    <Flex padding='0 20px' mb='16px' alignItems='center' flex={1}>
      <Box mr='40px'>
        <BackButton />
        <RefreshButton
          ml='33px'
          onRefresh={() => {
            console.log(
              new Date(new Date().toLocaleDateString()).getTime() / 1000,
            );

            upDate(new Date(new Date().toLocaleDateString()).getTime() / 1000);
          }}
        />
      </Box>
      <TitleBox>
        <MarkText fontSize='18px' bold fontStyle='italic'>
          {t('Battle details')}
        </MarkText>
      </TitleBox>
      <RecordBox>
        <MarkText ml='20px' mt='10px' fontSize='22px' bold fontStyle='italic'>
          {t('Total number of battles')}
        </MarkText>
        <Flex
          justifyContent='center'
          alignItems='center'
          width='60px'
          height='60px'
          position='relative'
        >
          <MarkText fontSize='28px' bold fontStyle='italic'>
            {cont.Cont}
          </MarkText>
        </Flex>
      </RecordBox>
      <RecordBox>
        {/* <MarkText ml='20px' mt='10px' fontSize='22px' bold fontStyle='italic'>
          {t('Victories')}
        </MarkText>
        <MarkText fontSize='28px' bold fontStyle='italic'>
          {cont.WinCont}
        </MarkText> */}
        <SingleDatePicker
          id='date_input'
          date={date}
          focused={isFocused}
          onDateChange={onDateChange}
          onFocusChange={onFocusChange}
          numberOfMonths={1}
          isOutsideRange={() => {}}
          placeholder={dayjs().format('MM/DD/YYYY')}
          readOnly
          maxDate={new Date(new Date().toLocaleDateString()).getTime() / 1000}
        />
        <Flex
          onClick={() => setIsFocused(true)}
          justifyContent='center'
          alignItems='center'
          width='60px'
          height='60px'
          position='relative'
        >
          <DownImg src='/images/commons/icon/back.png' />
        </Flex>
      </RecordBox>
      {/* <RecordBox>
        <MarkText ml='20px' mt='10px' fontSize='22px' bold fontStyle='italic'>
          {t('Number of failed games')}
        </MarkText>
        <MarkText fontSize='28px' bold fontStyle='italic'>
          {cont.FailedCont}
        </MarkText>
      </RecordBox> */}
    </Flex>
  );
};
