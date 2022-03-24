import React, { lazy } from 'react';

const TestBgCard = lazy(() => import('./BgCard'));
const TestButton = lazy(() => import('./Button'));
const TestCard = lazy(() => import('./Card'));
const Test = lazy(() => import('./Test'));

export { TestBgCard, Test, TestCard, TestButton };
