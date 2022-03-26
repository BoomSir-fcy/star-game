import { ResponseCode } from "apis/type";

type eventType = 'http' | 'message' | 'httpError'

class EventBus extends EventTarget {
  constructor() {
    super()
    this.init()
  }

  name = 'EventBus';

  private init() {
    // TODO:
  }
}

const eventBus = new EventBus()

export default eventBus
