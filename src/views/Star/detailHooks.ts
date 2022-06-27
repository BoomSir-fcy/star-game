import Builder from 'building/core/Builder';
import Building from 'building/core/Building';
import { eventsType } from 'building/core/event';
import { useCallback, useEffect, useState } from 'react';

export const useActiveBuilder = (building: Building) => {
  const [activeSolider, setActiveSolider] = useState<null | Builder>(null);

  const handleAddActiveBuilder = useCallback((event: any) => {
    const { builder } = event.detail as { builder: Builder };
    setActiveSolider(builder);
  }, []);
  const handleRemoveActiveBuilder = useCallback(() => {
    setActiveSolider(null);
  }, []);

  useEffect(() => {
    building.addEventListener(
      eventsType.ADD_ACTIVE_SOLDIER,
      handleAddActiveBuilder,
    );
    return () => {
      building.removeEventListener(
        eventsType.ADD_ACTIVE_SOLDIER,
        handleAddActiveBuilder,
      );
    };
  }, [handleAddActiveBuilder, handleRemoveActiveBuilder, building]);

  return activeSolider;
};