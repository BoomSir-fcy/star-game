import { useTranslation } from 'contexts/Localization';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Text, Flex, Box, MarkText } from 'uikit';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper';

import 'swiper/swiper.min.css';

const Content = styled(Box)`
  width: 600px;
  padding-left: 200px;
  margin: 0 auto;
  padding-top: 30px;
`;

const SwiperBox = styled(Box)`
  width: 100%;
  height: 100px;
  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 30px;
  }
`;

const TopCarousel: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Content>
      <Flex mb='20px' justifyContent='space-between' alignItems='flex-end'>
        <Box>
          <Text>{t('恒星主获得BOX')}</Text>
          <MarkText bold fontStyle='normal'>
            123123
          </MarkText>
        </Box>
        <Box>
          <Text>{t('星系主获得BOX')}</Text>
          <MarkText bold fontStyle='normal'>
            123123
          </MarkText>
        </Box>
      </Flex>
      <SwiperBox>
        <Swiper
          effect='coverflow'
          className='mySwiper'
          direction='vertical'
          loop
          grabCursor
          centeredSlides
          coverflowEffect={{
            rotate: 20,
            stretch: 60,
            depth: 150,
            modifier: 1,
            slideShadows: false,
          }}
          slidesPerView='auto'
          pagination
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, EffectCoverflow, Pagination]}
        >
          <SwiperSlide>
            <Flex>
              <Text>{t('%name% 成为了', { name: '草草草草' })}</Text>
              <Text color='#4FFFFB'>
                {t(' %galaxy% 星系 ', { galaxy: 'A' })}
              </Text>
              <Text>{t('的领主,竞拍金额: ')}</Text>
              <Text color='#4FFFFB'>{t('2.669 BNB')}</Text>
            </Flex>
          </SwiperSlide>
          <SwiperSlide>
            <Flex>
              <Text>{t('%name% 成为了', { name: '草草草草' })}</Text>
              <Text color='#4FFFFB'>
                {t(' %galaxy% 星系 ', { galaxy: 'A' })}
              </Text>
              <Text>{t('的领主,竞拍金额: ')}</Text>
              <Text color='#4FFFFB'>{t('2.669 BNB')}</Text>
            </Flex>
          </SwiperSlide>
          <SwiperSlide>
            <Flex>
              <Text>{t('%name% 成为了', { name: '草草草草' })}</Text>
              <Text color='#4FFFFB'>
                {t(' %galaxy% 星系 ', { galaxy: 'A' })}
              </Text>
              <Text>{t('的领主,竞拍金额: ')}</Text>
              <Text color='#4FFFFB'>{t('2.669 BNB')}</Text>
            </Flex>
          </SwiperSlide>
          <SwiperSlide>
            <Flex>
              <Text>{t('%name% 成为了', { name: '草草草草' })}</Text>
              <Text color='#4FFFFB'>
                {t(' %galaxy% 星系 ', { galaxy: 'A' })}
              </Text>
              <Text>{t('的领主,竞拍金额: ')}</Text>
              <Text color='#4FFFFB'>{t('2.669 BNB')}</Text>
            </Flex>
          </SwiperSlide>
        </Swiper>
      </SwiperBox>
    </Content>
  );
};
export default TopCarousel;
