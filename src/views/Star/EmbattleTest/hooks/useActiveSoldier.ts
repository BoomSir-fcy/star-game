import { eventsType } from 'game/core/event';
import Game from 'game/core/Game';
import Soldier from 'game/core/Soldier';
import { useCallback, useEffect, useState } from 'react';

const useActiveSoldier = (game: Game) => {
  const [activeSolider, setActiveSolider] = useState<null | Soldier>(null);

  const handleAddActiveSoldier = useCallback((event: any) => {
    const { soldier } = event.detail as { soldier: Soldier };
    setActiveSolider(soldier);
  }, []);
  const handleRemoveActiveSoldier = useCallback(() => {
    setActiveSolider(null);
  }, []);

  useEffect(() => {
    game.addEventListener(
      eventsType.ADD_ACTIVE_SOLDIER,
      handleAddActiveSoldier,
    );
    game.addEventListener(
      eventsType.REMOVE_ACTIVE_SOLDIER,
      handleRemoveActiveSoldier,
    );
    return () => {
      game.removeEventListener(
        eventsType.ADD_ACTIVE_SOLDIER,
        handleAddActiveSoldier,
      );
      game.addEventListener(
        eventsType.REMOVE_ACTIVE_SOLDIER,
        handleRemoveActiveSoldier,
      );
    };
  }, [handleAddActiveSoldier, handleRemoveActiveSoldier, game]);

  return activeSolider;
};

export default useActiveSoldier;
