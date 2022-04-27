import Game, { GameOptionsProps } from 'game/core/Game';
import { useEffect, useMemo, useRef, useState } from 'react';

const useGame = (option?: GameOptionsProps) => {
  const optionString = useMemo(() => {
    return option && JSON.stringify(option);
  }, [option]);
  const game = useMemo(() => {
    const _option = optionString && JSON.parse(optionString);
    return new Game(_option);
  }, [optionString]);

  useEffect(() => {
    const destroy = () => {
      game.app.destroy();
    };
    return destroy;
  }, [game]);
  return game;
};

export default useGame;