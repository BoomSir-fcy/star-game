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
import { SubString_1 } from 'utils/DecimalPlaces';

const Content = styled(Box)`
  /* width: 1270px;
  padding-left: 570px; */
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

const TopCarousel: React.FC<{
  width?: string;
  pl?: string;
}> = ({ width = '1270px', pl = '570px' }) => {
  useFetchAllLogsView();
  const { t } = useTranslation();
  const { AllLogs, galaxy_total_box, planet_total_box } = useStore(
    p => p.galaxy,
  );
  const [index, setIndex] = useState(1);

  return (
    <Content width={width} pl={pl}>
      <Flex mb='20px' justifyContent='space-around' alignItems='flex-end'>
        <Box>
          <Text>{t('Star Lord get')} BOX</Text>
          <MarkText bold fontStyle='normal'>
            {SubString_1(planet_total_box, 4)}
          </MarkText>
        </Box>
        <Box>
          <Text>{t('Galaxy Lord get')} BOX</Text>
          <MarkText bold fontStyle='normal'>
            {SubString_1(galaxy_total_box, 4)}
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
                  <Text maxWidth='180px' color='#4FFFFB' ellipsis mr='4px'>
                    {item.nickname}
                  </Text>
                  <Text mr='4px'>{t('became the lord of')}</Text>
                  <Text color='#4FFFFB' mr='4px'>
                    {t('Galaxy %galaxy%', { galaxy: item.name })}
                  </Text>
                  <Text mr='4px'>{t('bidding amount:')}</Text>
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
