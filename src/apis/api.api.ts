import { isSuccess } from './util';
import { UserApi } from './User';
import { GalaxyApi } from './Galaxy';
import { BalanceApi } from './balance';
import { PlanetApi } from './Planet';
import { AllianceApi } from './alliance';
import { BuildingApi } from './Building';
import { GameApi } from './game';
import { GuideApi } from './guide';

export const Api = {
  isSuccess,
  UserApi: new UserApi(),
  GalaxyApi: new GalaxyApi(),
  BalanceApi: new BalanceApi(),
  PlanetApi: new PlanetApi(),
  AllianceApi: new AllianceApi(),
  BuildingApi: new BuildingApi(),
  GameApi: new GameApi(),
  GuideApi: new GuideApi(),
};
