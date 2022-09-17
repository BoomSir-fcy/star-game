import { useEffect, useMemo, useRef, useState } from 'react';
import Building, { GameOptionsProps } from '../core/Building';

const useBuilding = (option?: GameOptionsProps) => {
  const optionString = useMemo(() => {
    return option && JSON.stringify(option);
  }, [option]);
  const game = useMemo(() => {
    const _option = optionString && JSON.parse(optionString);
    return new Building(_option);
  }, [optionString]);

  useEffect(() => {
    const destroy = () => {
      game.app.destroy(true);
      delete game.app;
    };
    return destroy;
  }, [game]);
  return game;
};

export default useBuilding;
