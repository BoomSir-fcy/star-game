import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ResetCSS, Flex, Box, BoxProps } from 'uikit';
import StarrySky from 'components/StarrySky';
import detectOrient from 'utils/detectOrient';
import Providers from './Providers';

const Home = lazy(() => import('./views/Home'));
const Test = lazy(() => import('./views/Test'));
const Login = lazy(() => import('./views/Login'));

const Content = styled(Box)<{ scale: number }>`
  width: 1980px;
  height: 900px;
  transform-origin: 0 0;
  z-index: 2;
  /* transform: scale(${({ scale }) => scale}); */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: ${({ scale }) =>
    `translate(${-scale * 50}%, ${-scale * 50}%) scale(${scale})`};
`;
const ContentInner = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
`;

const ScaleContent: React.FC<BoxProps> = ({ children, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const handleResize = useCallback(() => {
    const { width, height } =
      window.document.documentElement.getBoundingClientRect();
    const maxV = Math.max(width, height);
    const rate = maxV / 1980;
    setScale(rate);
    if (ref.current) {
      detectOrient(ref.current, false);
    }
  }, [ref]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
  return (
    <Box overflow='hidden' position='relative' id='detect-orient' ref={ref}>
      <StarrySky />
      <Content id='scale-content' scale={scale}>
        {/* <ContentInner>{}</ContentInner> */}
        {children}
      </Content>
    </Box>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <ResetCSS />
        <ScaleContent>
          <Suspense fallback='loading...'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/test' element={<Test />} />
            </Routes>
          </Suspense>
        </ScaleContent>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
