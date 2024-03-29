import React, { lazy } from 'react';

const Test = lazy(() => import('./Test'));
const TestBgCard = lazy(() => import('./BgCard'));
const TestButton = lazy(() => import('./Button'));
const TestCard = lazy(() => import('./Card'));
const TestStar = lazy(() => import('./Star'));
const TestText = lazy(() => import('./Text'));
const TestLabel = lazy(() => import('./Label'));
const TestDrag = lazy(() => import('./Drag'));
const TestDragAndPut = lazy(() => import('./DragAndPut'));

export {
  TestBgCard,
  Test,
  TestCard,
  TestButton,
  TestStar,
  TestText,
  TestLabel,
  TestDrag,
  TestDragAndPut,
};
