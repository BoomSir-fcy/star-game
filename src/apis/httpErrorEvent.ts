import { ResponseCode } from './type';
import eventBus from '../utils/eventBus';

const dispatchHttpErrorEvent = (data: Api.Error) => {
  if (data?.code !== 1) {
    eventBus.dispatchEvent(
      new MessageEvent('httpError', {
        data,
      }),
    );
  }
};

export default dispatchHttpErrorEvent;
