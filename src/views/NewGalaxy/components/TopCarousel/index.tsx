import { useTranslation } from 'contexts/Localization';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Text, Flex, Box, MarkText } from 'uikit';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper';

import 'swiper/swiper.min.css';
import { useFetchAllLogsView } from 'state/galaxy/hooks';
import { useStore } from 'state';
import { AllLogsInfo } from 'state/types';

const Content = styled(Box)`
  width: 700px;
  padding-left: 70px;
  margin: 0 auto;
  padding-top: 10px;
`;

const SwiperBox = styled(Box)`
  width: 100%;
  height: 76px;
  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 30px;
    opacity: 0.5;
  }
  .active {
    opacity: 1;
  }
`;

const TopCarousel: React.FC = () => {
  useFetchAllLogsView();
  const { t } = useTranslation();
  const AllLogs = useStore(p => p.galaxy.AllLogs);
  const [index, setIndex] = useState(1);

  return (
    <Content>
      <Flex mb='20px' justifyContent='space-around' alignItems='flex-end'>
        <Box>
          <Text>{t('Stellar Master Gets')}BOX</Text>
          <MarkText bold fontStyle='normal'>
            123123
          </MarkText>
        </Box>
        <Box>
          <Text>{t('Galaxy Lord Gets')}BOX</Text>
          <MarkText bold fontStyle='normal'>
            123123
          </MarkText>
        </Box>
      </Flex>
      <SwiperBox>
        {AllLogs.length && (
          <Swiper
            initialSlide={0}
            effect='coverflow'
            className='mySwiper'
            direction='vertical'
            loop
            grabCursor
            centeredSlides
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 1,
              slideShadows: false,
            }}
            slidesPerView='auto'
            pagination
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            onActiveIndexChange={(event: any) => setIndex(event.realIndex)}
            modules={[Autoplay, EffectCoverflow, Pagination]}
          >
            {(AllLogs ?? []).map((item, i) => (
              <SwiperSlide
                className={index === i ? 'active' : ''}
                key={item.id}
              >
                <Flex justifyContent='center' alignItems='flex-end'>
                  <Text maxWidth='114px' ellipsis>
                    {item.nickname}
                  </Text>
                  <Text> {t('became the lord of')} </Text>
                  <Text color='#4FFFFB'>
                    {t('Galaxy %galaxy%', { galaxy: item.name })}
                  </Text>
                  <Text> {t('bidding amount:')} </Text>
                  <Text color='#4FFFFB'>{item.price} BNB</Text>
                </Flex>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </SwiperBox>
    </Content>
  );
};
export default TopCarousel;
