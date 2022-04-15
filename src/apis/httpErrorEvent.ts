import eventBus from '../utils/eventBus';
import { ResponseCode } from './type';

const dispatchHttpErrorEvent = (data: Api.Error) => {
  if (data?.code === ResponseCode.NOTFOUNTUSER) return;
  if (data?.code !== 0) {
    eventBus.dispatchEvent(
      new MessageEvent('httpError', {
        data,
      }),
    );
  }
};

export default dispatchHttpErrorEvent;
