import eventBus from '../utils/eventBus';
import { ResponseCode } from './type';

const dispatchHttpErrorEvent = (data: Api.Error) => {
  if (data?.code === ResponseCode.NOTFOUNTUSER) {
    eventBus.dispatchEvent(new Event('unauthorized'));
    return;
  }
  if (data?.code === ResponseCode.PLANET_STRENGTHEN_NOT_RECORD) return;
  if (data?.code === ResponseCode.PLANET_UPGRADE_FAIL) return;
  if (data?.code !== 0) {
    eventBus.dispatchEvent(
      new MessageEvent('httpError', {
        data,
      }),
    );
  }
};

export default dispatchHttpErrorEvent;
