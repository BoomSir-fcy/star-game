import React, { useEffect, useState, useMemo } from 'react';
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
import { DateRangePicker } from 'react-dates';
import dayjs from 'dayjs';
import moment from 'moment';

const TitleBox = styled(Flex)`
  width: 512px;
  height: 52px;
  background: url('/images/battleReport/top.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: center;
`;

const RecordBox = styled(Flex)`
  height: 90px;
  background: url('/images/battleReport/infoBg.png') no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 34px 0 45px;
  margin-left: 20px;
  .DateRangePickerInput {
    margin-top: 10px;
    background-color: transparent;
    /* display: flex;
    align-items: center; */
    .DateInput {
      background: transparent;
      .DateInput_input {
        background-color: transparent;
        text-shadow: 0px 3px 0.4em #79c6c4;
        background: linear-gradient(
          0deg,
          rgba(79, 255, 251, 1) 0%,
          rgba(255, 255, 255, 1) 60.4873046875%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: #ffffff;
        font-size: 22px;
        font-weight: 600;
        font-family: SourceHanSansCN-Bold;
        line-height: 1.5;
        /* margin-left: 20px; */
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
    .DateRangePickerInput_arrow {
      display: none;
      color: #79c6c4;
      .DateRangePickerInput_arrow_svg {
        fill: #79c6c4;
        width: 60px;
        height: 34px;
      }
    }
    /* .SingleDatePicker_picker__directionLeft {
      top: 64px !important;
    } */
  }
`;

const DownImg = styled.img`
  width: 36px;
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
  Start_time: number;
  End_time: number;
  setStart_time: (e) => void;
  setEnd_time: (e) => void;
}> = ({ cont, Start_time, End_time, setStart_time, setEnd_time }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const initialStartDate = useMemo(() => {
    return moment(Start_time * 1000);
  }, [Start_time]);

  const initialEndDate = useMemo(() => {
    return moment(End_time * 1000);
  }, [End_time]);

  const [isFocused, setIsFocused] = useState(null);

  const onDateChange = (e: any) => {
    const E_startDate = e.startDate;
    const E_endDate = e.endDate;

    const Starttime = moment(e.startDate).format('YYYY-MM-DD');
    const Endtime = moment(e.endDate).format('YYYY-MM-DD');
    const Start =
      new Date(new Date(Starttime).toLocaleDateString()).getTime() / 1000;
    const End =
      new Date(new Date(Endtime).toLocaleDateString()).getTime() / 1000;
    setStart_time(Start);
    setEnd_time(End || Start + 86400);
    setIsFocused(null);
  };
  const onFocusChange = e => {
    setIsFocused(e);
  };

  return (
    <Flex padding='0 20px' mb='16px' alignItems='center' flex={1}>
      <Box mr='40px'>
        <BackButton />
        {/* <RefreshButton
          ml='33px'
          onRefresh={() => {
            // upDate(new Date(new Date().toLocaleDateString()).getTime() / 1000);
          }}
        /> */}
      </Box>
      <TitleBox>
        <MarkText fontSize='18px' bold fontStyle='italic'>
          {t('Explore Report')}
        </MarkText>
      </TitleBox>
      <RecordBox width='316px'>
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
      <RecordBox width='320px'>
        {/* <SingleDatePicker
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
        /> */}
        <DateRangePicker
          readOnly
          startDate={initialStartDate}
          endDate={initialEndDate}
          focusedInput={isFocused}
          onFocusChange={onFocusChange}
          onDatesChange={onDateChange}
          maxDate={moment(new Date(new Date().toLocaleDateString()).getTime())}
          minimumNights={0}
          // disabled='endDate'
          numberOfMonths={1}
          isOutsideRange={() => {}}
          startDateId='_startDate'
          endDateId='_endDateId'
          noBorder
        />
        <Flex
          onClick={() => setIsFocused('startDate')}
          justifyContent='center'
          alignItems='center'
          width='80px'
          height='60px'
          position='relative'
        >
          <DownImg src='/images/commons/icon/back.png' />
        </Flex>
      </RecordBox>
    </Flex>
  );
};
