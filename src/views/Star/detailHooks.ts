import Builder from 'building/core/Builder';
import Building, { ChequerPosition } from 'building/core/Building';
import { eventsType } from 'building/core/event';
import { useTranslation } from 'contexts/Localization';
import { useToast } from 'contexts/ToastsContext';
import { useCallback, useEffect, useState } from 'react';

export const useActiveBuilder = (building: Building) => {
  const { toastError } = useToast();
  const { t } = useTranslation();

  const [activeSolider, setActiveSolider] = useState<null | Builder>(null);
  const [ActiveCheqer, setActiveCheqer] = useState<null | ChequerPosition>(
    null,
  );

  const handleAddActiveBuilder = useCallback((event: any) => {
    const { builder } = event.detail as { builder: Builder };
    setActiveSolider(builder);
  }, []);
  const handleRemoveActiveBuilder = useCallback(() => {
    setActiveSolider(null);
  }, []);

  const handleAddActiveCheqer = useCallback((event: any) => {
    const { chequerXY } = event.detail as { chequerXY: ChequerPosition };
    setActiveCheqer(chequerXY);
  }, []);

  const handleErrorMessage = useCallback(
    (event: any) => {
      const { errText } = event.detail as { errText: string };
      toastError(t(errText));
    },
    [toastError, t],
  );

  useEffect(() => {
    building.addEventListener(eventsType.ERROR_MESSAGE, handleErrorMessage);
    building.addEventListener(
      eventsType.ADD_ACTIVE_CHEQUER,
      handleAddActiveCheqer,
    );
    building.addEventListener(
      eventsType.ADD_ACTIVE_SOLDIER,
      handleAddActiveBuilder,
    );
    building.addEventListener(
      eventsType.REMOVE_ACTIVE_SOLDIER,
      handleRemoveActiveBuilder,
    );
    return () => {
      building.removeEventListener(
        eventsType.ERROR_MESSAGE,
        handleErrorMessage,
      );

      building.removeEventListener(
        eventsType.ADD_ACTIVE_CHEQUER,
        handleAddActiveCheqer,
      );
      building.removeEventListener(
        eventsType.ADD_ACTIVE_SOLDIER,
        handleAddActiveBuilder,
      );
      building.removeEventListener(
        eventsType.REMOVE_ACTIVE_SOLDIER,
        handleRemoveActiveBuilder,
      );
    };
  }, [
    handleAddActiveBuilder,
    handleRemoveActiveBuilder,
    handleAddActiveCheqer,
    handleErrorMessage,
    building,
  ]);

  return { activeSolider, ActiveCheqer };
};
