import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ResetCSS, Flex, Box } from 'uikit'
import StarrySky from 'components/StarrySky'

const Home = lazy(() => import('./views/Home'))
const Test = lazy(() => import('./views/Test'))

function App() {
  return (
    <BrowserRouter>
      <ResetCSS />
      <StarrySky />
      <Suspense fallback="loading...">
        <Flex justifyContent="center">
          <Box margin="16px">
            <Link to="/">Home</Link>
          </Box>
          <Box margin="16px">
            <Link to="/test">Test</Link>
          </Box>
        </Flex>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
