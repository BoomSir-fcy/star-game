import Builder from './Builder';

export type BuilderCustomEvent = CustomEvent<{
  builder: Builder;
}>;

export const eventsType = {
  REMOVE_ACTIVE_SOLDIER: 'removeActiveBuilder',
  ADD_ACTIVE_SOLDIER: 'addActiveBuilder',
  UPDATE_SOLDIER_POSITION: 'updateBuilderPosition',
};

export const getBuilderEvent = (
  type: string,
  builder: Builder,
): BuilderCustomEvent => {
  return new CustomEvent(type, { detail: { builder } });
};

export const getRemoveActiveBuilderEvent = () =>
  new CustomEvent(eventsType.REMOVE_ACTIVE_SOLDIER);

export const getAddActiveBuilderEvent = (builder: Builder) =>
  getBuilderEvent(eventsType.ADD_ACTIVE_SOLDIER, builder);

export const getUpdateBuilderPosition = (builders: Builder[]) =>
  new CustomEvent(eventsType.UPDATE_SOLDIER_POSITION, { detail: { builders } });
