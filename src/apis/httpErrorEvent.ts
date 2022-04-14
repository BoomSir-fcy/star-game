import eventBus from '../utils/eventBus';

const dispatchHttpErrorEvent = (data: Api.Error) => {
  if (data?.code !== 0) {
    eventBus.dispatchEvent(
      new MessageEvent('httpError', {
        data,
      }),
    );
  }
};

export default dispatchHttpErrorEvent;
