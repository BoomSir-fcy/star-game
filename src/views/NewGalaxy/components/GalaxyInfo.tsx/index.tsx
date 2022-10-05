import React, { useCallback, useEffect, useState } from 'react';
import { useStore } from 'state';
import { useGalaxyList, useGalaxyNftArr } from 'state/galaxy/hooks';
import { Text, Flex, Box, MarkText, Spinner } from 'uikit';
import { useDispatch } from 'react-redux';
import {
  fetchGalaxyListAsync,
  fetchGalaxyStarListAsync,
  setCurrentGalaxy,
} from 'state/galaxy/reducer';
import {
  GalaxyImg,
  GalaxyInfoBox,
  GalaxyItemInfo,
  GalaxyItemInfoTitle,
  ItemGalaxyBox,
  LoadingBox,
  TextInfoBox,
} from 'views/NewGalaxy/style';
import { getFullDisplayBalance } from 'utils/formatBalance';
import BigNumber from 'bignumber.js';
import { GalaxyInfo } from 'state/types';
import { useTranslation } from 'contexts/Localization';
import { useNavigate } from 'react-router-dom';
import useParsedQueryString from 'hooks/useParsedQueryString';
import InfoModule from './InfoModule';
import OccupiedModul from './OccupiedModul';

const GalaxyInfoIndex: React.FC = () => {
  useGalaxyList();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const paramsQs = useParsedQueryString();
  const InitId = Number(paramsQs?.id);

  const { galaxyList, galaxyNftList, loadingGalaxy } = useStore(p => p.galaxy);
  const [OpenInfo, setOpenInfo] = useState(false);
  const [ShowListModule, setShowListModule] = useState(false);
  const [ActiveGalaxy, setActiveGalaxy] = useState(0);

  useGalaxyNftArr(galaxyList);

  const ChangeActiveGalaxy = useCallback(
    (item: GalaxyInfo) => {
      if (item.id === ActiveGalaxy) {
        return;
      }
      setActiveGalaxy(item.id);
      dispatch(setCurrentGalaxy(item));
      dispatch(fetchGalaxyStarListAsync(item.id as number));
    },
    [ActiveGalaxy, dispatch],
  );

  const GetCurrentPrice = useCallback(currentPrice => {
    const price = getFullDisplayBalance(new BigNumber(currentPrice), 18, 6);
    return Number(price) ? price : 0;
  }, []);

  useEffect(() => {
    if (InitId && galaxyList.length) {
      const info = galaxyList.filter(i => InitId === i.id);
      ChangeActiveGalaxy(info[0]);
      setOpenInfo(true);
      setShowListModule(true);
      navigate('/galaxy', { replace: true });
    }
  }, [InitId, galaxyList, ChangeActiveGalaxy, navigate]);

  useEffect(() => {
    if (galaxyList.length) {
      const oWrap = document.getElementById('box');
      const InfoBox = document.getElementById('InfoBox');
      const oImg = document.getElementsByClassName('imgBox');
      if (!InfoBox || !oImg) {
        return;
      }
      const oImgLength = oImg.length;
      const Deg = 360 / oImgLength;
      let nowX;
      let nowY;
      let lastX;
      let lastY;
      let disx = 0;
      let disy = 0;
      let roY = 0;
      let roX = 0;
      let timer;

      for (let i = 0; i < oImgLength; i++) {
        oImg[i].setAttribute(
          'style',
          `transition:transform 1s ${
            (oImgLength - 1 - i) * 0.1
          }s;transform:rotateY(${i * Deg}deg) translateZ(550px)`,
        );
      }
      // 拖拽：三个事件-按下 移动 抬起
      // 按下
      InfoBox.onmousedown = (ev: MouseEvent) => {
        // ev = ev || window.MouseEvent;

        // 鼠标按下的时候，给前一点坐标赋值，为了避免第一次相减的时候出错
        lastX = ev.clientX;
        lastY = ev.clientY;

        // 移动
        InfoBox.onmousemove = move_ev => {
          // ev = ev || window.event;
          clearInterval(timer);

          nowX = move_ev.clientX; // clientX 鼠标距离页面左边的距离
          nowY = move_ev.clientY; // clientY ………………………………顶部………………

          // 当前坐标和前一点坐标差值
          disx = nowX - lastX;
          disy = nowY - lastY;

          // 更新wrap的旋转角度，拖拽越快-> minus变化大 -> roY变化大 -> 旋转快
          roY += disx * 0.05; // roY = roY + disx*0.1;
          roX -= disy * 0.05;

          oWrap.style.transform = `rotateY(${roY}deg)`;

          // 前一点的坐标
          lastX = nowX;
          lastY = nowY;
        };
        // 抬起
        InfoBox.onmouseup = () => {
          InfoBox.onmousemove = null;
          if (timer) {
            clearInterval(timer);
          }
          timer = setInterval(() => {
            disx *= 0.98;
            disy *= 0.98;
            roY += disx * 0.05; // roY = roY + disx*0.05;
            roX -= disy * 0.05;
            oWrap.style.transform = `rotateY(${roY}deg)`;
          }, 20);
        };
        return false;
      };
      InfoBox.ontouchstart = ev => {
        // ev = ev || window.MouseEvent;

        // 鼠标按下的时候，给前一点坐标赋值，为了避免第一次相减的时候出错
        lastX = ev.targetTouches[0].pageX;
        lastY = ev.targetTouches[0].pageY;

        // 移动
        InfoBox.ontouchmove = move_ev => {
          // ev = ev || window.event;

          clearInterval(timer);

          nowX = move_ev.targetTouches[0].pageX; // clientX 鼠标距离页面左边的距离
          nowY = move_ev.targetTouches[0].pageY; // clientY ………………………………顶部………………

          // 当前坐标和前一点坐标差值
          disx = nowX - lastX;
          disy = nowY - lastY;

          // 更新wrap的旋转角度，拖拽越快-> minus变化大 -> roY变化大 -> 旋转快
          roY += disx * 0.05; // roY = roY + disx*0.1;
          roX -= disy * 0.05;

          oWrap.style.transform = `rotateY(${roY}deg)`;

          // 前一点的坐标
          lastX = nowX;
          lastY = nowY;
        };
        // 抬起
        InfoBox.ontouchend = () => {
          InfoBox.ontouchmove = null;
          if (timer) {
            clearInterval(timer);
          }
          timer = setInterval(() => {
            disx *= 0.98;
            disy *= 0.98;
            roY += disx * 0.05; // roY = roY + disx*0.05;
            roX -= disy * 0.05;
            oWrap.style.transform = `rotateY(${roY}deg)`;
          }, 20);
        };
        return false;
      };
    }
  }, [galaxyList]);

  return (
    <Box position='relative' height='calc(100% - 156px)'>
      {!loadingGalaxy ? (
        <GalaxyInfoBox id='InfoBox'>
          <Box
            id='box'
            width={300}
            height={300}
            margin='100px auto'
            style={{ position: 'relative', transformStyle: 'preserve-3d' }}
          >
            {(galaxyList ?? []).map((item, index) => (
              <ItemGalaxyBox
                className='imgBox'
                key={item.id}
                width={300}
                height={300}
                onTouchStart={() => {
                  ChangeActiveGalaxy(item);
                  setOpenInfo(true);
                  setShowListModule(true);
                }}
                onClick={() => {
                  ChangeActiveGalaxy(item);
                  setOpenInfo(true);
                  setShowListModule(true);
                }}
              >
                <GalaxyItemInfo
                // background={`url(/images/galaxy/${index + 1}.png)`}
                // backgroundRepeat='no-repeat'
                // backgroundSize='100% 100%'
                >
                  <TextInfoBox>
                    <GalaxyItemInfoTitle stripe isRadius>
                      <Flex justifyContent='center'>
                        <Text small>{item.name}</Text>
                      </Flex>
                    </GalaxyItemInfoTitle>
                    <Flex mb='6px' justifyContent='space-between'>
                      <Text small>{t('Galaxy Lord')}</Text>
                      <MarkText fontSize='14px'>{item.nickname}</MarkText>
                    </Flex>
                    <Flex
                      mb='6px'
                      justifyContent='space-between'
                      flexWrap='wrap'
                    >
                      <Text small>{t('Current Price')} BNB</Text>
                      <MarkText fontSize='14px'>
                        {GetCurrentPrice(
                          galaxyNftList[item.id]?.currentPrice,
                        ) || '---'}
                      </MarkText>
                    </Flex>
                    <Flex mb='6px' justifyContent='space-between'>
                      <Text small>{t('Total Galaxy CE')}</Text>
                      <MarkText maxWidth='50%' ellipsis fontSize='14px'>
                        {item.power}
                      </MarkText>
                    </Flex>
                  </TextInfoBox>
                  <GalaxyImg src={`/images/galaxy/${index + 1}.png`} />
                </GalaxyItemInfo>
              </ItemGalaxyBox>
            ))}
          </Box>
        </GalaxyInfoBox>
      ) : (
        <LoadingBox>
          <Spinner />
        </LoadingBox>
      )}
      {OpenInfo && <InfoModule OpenInfo={OpenInfo} setOpenInfo={setOpenInfo} />}
      {ShowListModule && (
        <OccupiedModul
          ShowListModule={ShowListModule}
          setShowListModule={setShowListModule}
        />
      )}
    </Box>
  );
};

export default GalaxyInfoIndex;
