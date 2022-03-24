import React, { lazy } from 'react';

const Star = lazy(() => import('./Star'));
const StarBuild = lazy(() => import('./Build'));
const StarGrow = lazy(() => import('./Grow'));
const StarUpgrade = lazy(() => import('./Upgrade'));
const StarSearch = lazy(() => import('./Search'));

export { Star, StarBuild, StarGrow, StarUpgrade, StarSearch };
