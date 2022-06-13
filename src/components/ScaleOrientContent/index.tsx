import StarrySky from 'components/StarrySky';
import { VideoComponent } from 'components/Video';
import { APP_HEIGHT, APP_WIDTH, VIDEO_GLOBAL_CLASS_NAME } from 'config';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setGlobalClient, setGlobalScale } from 'state/user/actions';
import styled, { createGlobalStyle } from 'styled-components';
import { Box } from 'uikit';
import agentClient from 'utils/client';
import { storeAction, useStore } from 'state';
import detectOrient from 'utils/detectOrient';

import Dashboard from 'components/Dashboard';
import { GuideModal } from 'components/Modal/guideModal';

// .introjs-tooltip{
//   transform-origin: ${({ rotate }) => (rotate ? 'center' : '0  0')};
//   transform: ${({ scale, rotate }) =>
//     `${rotate ? 'rotate(90deg)' : ''} scale(${scale})`};

// }
const ResetCSS = createGlobalStyle<{ scale: number; rotate: boolean }>`
.introjs-tooltip{
  transform-origin: ${({ rotate }) => (rotate ? 'center' : '0  0')};
  transform: ${({ scale, rotate }) => `${rotate ? 'rotate(90deg)' : ''} `};

}
  
`;
// const ResetCSS = createGlobalStyle<{ scale: number; rotate: boolean }>`

//   .introjs-tooltip{
//     transform-origin: ${({ rotate }) => (rotate ? 'center' : '0  0')};
//     transform: ${({ scale, rotate }) => `${rotate ? 'rotate(90deg)' : ''}`};
//       max-width: ${({ scale }) => scale * 475}px !important;
//       width: ${({ scale }) => scale * 475}px !important;
//       height: ${({ scale }) => scale * 327}px !important;
//     padding: ${({ scale }) =>
//       `${scale * 20 < 10 ? 10 : scale * 20}px ${
//         scale * 30 < 15 ? 15 : scale * 30
//       }px`};

//   }
//   .introjs-skipbutton {
//     width: ${({ scale }) => (scale * 43 < 20 ? 20 : scale * 43)}px !important;
//     height: ${({ scale }) => (scale * 43 < 20 ? 20 : scale * 43)}px !important;
//   }
//   .introjs-tooltiptext {
//     min-height: ${({ scale }) => scale * 180}px;
//     max-height: ${({ scale }) => scale * 180}px;
//     font-size: ${({ scale }) => scale * 16}px;
//     padding: ${({ scale }) => (scale * 20 < 12 ? 12 : scale * 20)}px !important;
//     line-height: ${({ scale }) => (scale * 20 < 16 ? 16 : scale * 20)}px;
//     font-weight: bold;
//   }

// `;

window.addEventListener(
  'click',
  () => {
    // document.documentElement.requestFullscreen();
    try {
      if (agentClient.android) {
        document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error(error);
    }
  },
  { once: true },
);

const Content = styled(Box)<{ scale: number }>`
  width: 1920px;
  height: 900px;
  transform-origin: 0 0;
  position: absolute;
  top: 2px;
  left: 50%;
  /* background: pink; */
  transform: ${({ scale }) => `translate(${-scale * 50}%) scale(${scale})`};
  /* ${({ theme }) => theme.mediaQueries.sm} {
    top: ${({ scale }) => `${scale * 58}%`};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    top: ${({ scale }) => `${scale * 48}%`};
  } */
`;

const ScaleOrientContent: React.FC = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { client } = useStore(p => p.user);
  const guideState = useStore(p => p.guide);

  const [minHeight, setMinHeight] = useState(900);
  const [cHeight, setCHeight] = useState(900);
  const [scale, setScale] = useState(1);

  const handleResize = useCallback(
    (mode?: boolean | Event) => {
      const { clientHeight, clientWidth } = window.document.body;

      const maxV = Math.max(clientWidth, clientHeight);
      const minV = Math.min(clientWidth, clientHeight);

      const rateMax = maxV / APP_WIDTH;
      const rateMin = minV / APP_HEIGHT;

      // 处理高度不够显示不全bug
      const rate = Math.min(rateMax, rateMin);

      console.log(rateMax, rateMin);

      // dispatch(setScale)
      setScale(rate);
      setMinHeight(Math.min(clientWidth, clientHeight));
      setCHeight(clientHeight);

      dispatch(
        setGlobalClient({
          width: clientWidth,
          height: clientHeight,
        }),
      );
      dispatch(setGlobalScale(rate));
      if (ref.current) {
        console.log(
          typeof mode === 'boolean' ? mode : false,
          "typeof mode === 'boolean' ? mode : false",
        );
        detectOrient(ref.current, typeof mode === 'boolean' ? mode : false);
      }
    },
    [ref, dispatch],
  );

  const onFocusin = useCallback(
    (event: FocusEvent) => {
      console.log(event.target, 'focusin');
      if ((event?.target as HTMLElement)?.nodeName === 'INPUT') {
        handleResize(true);
      }
    },
    [handleResize],
  );

  const onFocusout = useCallback(
    (event: FocusEvent) => {
      if ((event?.target as HTMLElement)?.nodeName === 'INPUT') {
        handleResize(false);
      }
    },
    [handleResize],
  );

  useEffect(() => {
    handleResize();

    if (agentClient.ios) {
      // 软键盘弹出的事件处理
      document.body.addEventListener('focusin', onFocusin);
      // 软键盘收起的事件处理
      document.body.addEventListener('focusout', onFocusout);
    } else {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (agentClient.ios) {
        // 软键盘弹出的事件处理
        document.body.removeEventListener('focusin', onFocusin);
        // 软键盘收起的事件处理
        document.body.removeEventListener('focusout', onFocusout);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [handleResize, onFocusout, onFocusin]);

  const bgType = useMemo(() => {
    const secondList = [
      '/mystery-box/state',
      '/mystery-box',
      '/mystery-box/list',
      '/mystery-box/detail',
      '/plant-league',
    ];
    if (secondList.includes(pathname)) return 2;
    if (pathname === '/plant-league') return 2;
    if (pathname === '/') return 1;
    return 0;
  }, [pathname]);
  return (
    <Box position='relative' id='detect-orient' ref={ref}>
      <ResetCSS scale={scale} rotate={client?.width < client?.height} />
      <StarrySky bgType={bgType} />
      <VideoComponent
        cHeight={APP_HEIGHT}
        minHeight={minHeight}
        scale={scale}
      />
      <div className={VIDEO_GLOBAL_CLASS_NAME} />
      <Content id='scale-content' scale={scale}>
        <Dashboard />
        {children}

        {/* 引导提示框 */}
        {guideState.visible && (
          <GuideModal
            visible={guideState.visible}
            lastStep={guideState.lastStep}
            pathname={guideState.pathname}
            onClose={() =>
              dispatch(storeAction.toggleVisible({ visible: false }))
            }
          />
        )}
      </Content>
      {/* <Box>
      </Box> */}
    </Box>
  );
};

export default ScaleOrientContent;
