import Soldier from './Soldier';

export type SoldierCustomEvent = CustomEvent<{
  soldier: Soldier;
}>;

export const eventsType = {
  REMOVE_ACTIVE_SOLDIER: 'removeActiveSoldier',
  ADD_ACTIVE_SOLDIER: 'addActiveSoldier',
  UPDATE_SOLDIER_POSITION: 'updateSoldierPosition',
};

export const getSoliderEvent = (
  type: string,
  soldier: Soldier,
): SoldierCustomEvent => {
  return new CustomEvent(type, { detail: { soldier } });
};

export const getRemoveActiveSoliderEvent = () =>
  new CustomEvent(eventsType.REMOVE_ACTIVE_SOLDIER);

export const getAddActiveSoliderEvent = (soldier: Soldier) =>
  getSoliderEvent(eventsType.ADD_ACTIVE_SOLDIER, soldier);

export const getUpdateSoldierPosition = (soldiers: Soldier[]) =>
  new CustomEvent(eventsType.UPDATE_SOLDIER_POSITION, { detail: { soldiers } });
