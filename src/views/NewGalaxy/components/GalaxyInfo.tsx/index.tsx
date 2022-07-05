import React, { useCallback, useEffect, useState } from 'react';
import { useStore } from 'state';
import { useGalaxyList } from 'state/galaxy/hooks';
import { Text, Flex, Box } from 'uikit';
import { useDispatch } from 'react-redux';
import {
  fetchGalaxyListAsync,
  fetchGalaxyStarListAsync,
  setCurrentGalaxy,
} from 'state/galaxy/reducer';
import { GalaxyImg, GalaxyInfoBox, ItemGalaxyBox } from 'views/NewGalaxy/style';
import { GalaxyInfo } from 'state/types';
import InfoModule from './InfoModule';
import OccupiedModul from './OccupiedModul';

const GalaxyInfoIndex: React.FC = () => {
  useGalaxyList();
  const dispatch = useDispatch();

  const { galaxyList, currentGalaxy, loadingGalaxy } = useStore(p => p.galaxy);
  const [OpenInfo, setOpenInfo] = useState(false);
  const [ShowListModule, setShowListModule] = useState(false);
  const [ActiveGalaxy, setActiveGalaxy] = useState(0);

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

  useEffect(() => {
    if (galaxyList.length) {
      const oWrap = document.getElementById('box');
      const InfoBox = document.getElementById('InfoBox');
      const oImg = document.getElementsByClassName('imgBox');

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
    <Box position='relative' height='100%'>
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
              <GalaxyImg src={`/images/galaxy/${index + 1}.png`} />
            </ItemGalaxyBox>
          ))}
        </Box>
      </GalaxyInfoBox>
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
