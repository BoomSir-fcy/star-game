import React, { useState, useMemo, useCallback, useEffect } from 'react';
import random from 'lodash/random';
import { signMessage } from 'utils/web3React';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useToast } from 'contexts/ToastsContext';
import { Api } from 'apis';
import { useDispatch } from 'react-redux';
import { fetchAllianceViewAsync } from 'state/alliance/reducer';
import { useImmer } from 'use-immer';
import { useTranslation } from 'contexts/Localization';
import { useStore } from 'state';

const useExtract = () => {
  const { t } = useTranslation();
  const { account, library } = useActiveWeb3React();
  const { toastError, toastSuccess } = useToast();
  const dispatch = useDispatch();
  const { alliance, later_extract_time } = useStore(
    p => p.alliance.allianceView,
  );
  const [state, setState] = useImmer({
    Extracttime: 0,
  });
  let Extracttimer = null as any;

  const ExtractResources = useCallback(async () => {
    if (alliance.working !== 0) {
      toastError(t('Stop working to claim'));
      return;
    }
    if (later_extract_time > 0) {
      toastError(t('Claim Freezing'));
      return;
    }
    try {
      const sign = {
        nonce: `${random(0xffff, 0xffff_ffff_ffff)}`,
        timestamp: new Date().getTime(),
      };
      const signature = await signMessage(
        library,
        account,
        JSON.stringify(sign),
      );
      const params = {
        ...sign,
        signature,
      };
      const res = await Api.AllianceApi.AllianceExtract(params);
      if (Api.isSuccess(res)) {
        toastSuccess(t('Claim Succeeded'));
      } else {
        toastError(t('Claim Failed'));
      }
    } catch (error) {
      toastError(t('Claim Failed'));
    }
    dispatch(fetchAllianceViewAsync());
  }, [
    alliance,
    account,
    library,
    t,
    dispatch,
    toastError,
    toastSuccess,
    later_extract_time,
  ]);

  const ExtractCountDown = () => {
    if (later_extract_time > 0) {
      Extracttimer = setInterval(() => {
        const { Extracttime } = state;
        if (Extracttime > 0) {
          setState(p => {
            p.Extracttime = Extracttime - 1;
          });
        } else {
          clearInterval(Extracttimer);
          if (later_extract_time > 0) {
            dispatch(fetchAllianceViewAsync());
          }
        }
      }, 1000);
    }
  };

  useEffect(() => {
    if (alliance.working <= 0) {
      setState({ Extracttime: later_extract_time });
      return;
    }
    setState({ Extracttime: later_extract_time });
  }, [alliance, later_extract_time, setState]);

  useEffect(() => {
    ExtractCountDown();
    return () => {
      if (Extracttimer) clearInterval(Extracttimer);
    };
    // eslint-disable-next-line
  }, [state]);

  return { state, ExtractResources };
};

// export  const useRepairRecharge = ()=>{

// }

export default useExtract;
