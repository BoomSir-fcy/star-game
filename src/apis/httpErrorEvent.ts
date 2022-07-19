import eventBus from '../utils/eventBus';
import { InsufficientBalance, ResponseCode } from './type';

const dispatchHttpErrorEvent = (data: Api.Error) => {
  if (data?.code === ResponseCode.NOTFOUNTUSER) {
    eventBus.dispatchEvent(new Event('unauthorized'));
    return;
  }
  if (data?.code === ResponseCode.PLANET_STRENGTHEN_NOT_RECORD) return;
  if (data?.code === ResponseCode.PLANET_UPGRADE_FAIL) return;
  if (InsufficientBalance.indexOf(Number(data?.code)) !== -1) {
    eventBus.dispatchEvent(
      new MessageEvent('insufficient', {
        data,
      }),
    );
    return;
  }
  if (data?.code !== 0) {
    eventBus.dispatchEvent(
      new MessageEvent('httpError', {
        data,
      }),
    );
  }
};

export default dispatchHttpErrorEvent;
