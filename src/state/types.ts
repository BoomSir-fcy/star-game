/* eslint-disable */
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { Qualities } from 'uikit/theme/types';
import { RoundInfo, RoundDescAxis, MapBaseUnits } from 'game/types';

// 性别
export enum Gender {
  MAN = 0,
  WOMAN = 1,
}

// 用户余额
export interface UserBalanceView {
  uid: number;
  coinId: string;
  amount: number;
  frozen: number;
  symbol: string;
  name: string;
  limitMini: number;
  limitMax: number;
  addTime: number;
  updatedAt: string;
}

export interface UserAgentInfoView {
  avatarNft_: string; // 头像nft的合约地址
  payToken_: string; // 要支付的token的合约地址
  userProfile_: string; // 用户信息合约地址
  price_: string; // 价格
  priceBnb_: string; // BNB价格
  createdCount_: string; // 已创建数量
  loading?: boolean;
}

export interface UserInfoView {
  nickname: string;
  nftAddress: string;
  tokenId: number;
  isActive: boolean;
  superior: string;
  loading?: boolean;
}

export interface userProductView {
  planet_num: number;
  stone_product: number;
  energy_product: number;
  population_product: number;
  stone: number;
  energy: number;
  population: number;
}

export interface UserInfoState {
  userBalance: UserBalanceView[];
  infoView: UserAgentInfoView;
  userInfoView: UserInfoView;
  userInfo: Api.User.UserInfo;
  allowance: {
    allowance: string;
    loading: boolean;
  };
  userProduct: userProductView;
}

export interface MysteryBoxView {
  priceBNB: string[]; // 三种盲盒对应的bnb价格
  seedBlocks: number[]; // 三种盲盒对应的预定区块, 与当前区块相差超过230个区块应让用户重新预定
  burnRatio: string; // 销毁比例
  vdsgRatio: string; // 给vdsg的比例
  dsgPoolRatio: string; // 给dsg质押池的比例
  bnbPoolRatio: string; // 给bnb质押池的比例
  superiorRatio: string; // 给邀请人的比例
  defaultSuperior: string; // 默认邀请人
  miniDistributeAmount: string; //
  totalBurnt: string; // 总销毁量dsg
  totalVDsgDonated: string; // 总给vdsg的量dsg
  totalPoolSent: string; // 总给质押池的量dsg
  totalPoolSentBNB: string; // 总给质押池的量bnb
  loading?: boolean;
}

export interface MysteryBoxState {
  boxView: MysteryBoxView;
}

export interface GalaxyInfo extends Api.Galaxy.GalaxyInfo {
  id: number;
  label: string;
  badge: boolean;
  starTotal: number;
  starOwnerTotal: number;
  nickname: string;
}

export interface StarLevelInfo {
  id: number; // 恒星等级范围id
  label: string; // // 恒星等级范围名称
  levels: Api.Galaxy.StarInfo[];
}

export interface GalaxyNft {
  id: string;
  lastPrice: string; // 最后一次交易的价格
  currentPrice: string; // 当前购买需要支付的价格
  miniBuyDuration: string; // 最小购买的时间间隔
  lastTimestamp: string; // 最后购买时间
}
export interface GalaxyState {
  currentGalaxy: GalaxyInfo;
  currentStarPeriod: StarLevelInfo;
  galaxyList: GalaxyInfo[];
  galaxyStarList: StarLevelInfo[];
  galaxyNft: GalaxyNft;
  loadingGalaxy: boolean;
  loading: boolean;
  auctionRecordList: any[];
}
export interface PlanetState {
  mePlanet: Api.Planet.PlanetInfo[];
  planetInfo: { [x: number]: Api.Planet.PlanetInfo };
  activePlanet: Api.Planet.PlanetInfo;
  activeMaterialMap: { [x: number]: Api.Planet.PlanetInfo | null };
  upgradePlanetId: number | null;
  activeNavId: string;
}

export interface BuildlingState {
  selfBuildings: Api.Building.SelfBuildings;
  upgradeIds: string[];
  buildings: { [type: number]: Api.Building.Building[] };
  destroyBuilding: boolean;
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  State,
  unknown,
  AnyAction
>;

enum DescType {
  MOVE = 1,
  ATTACK = 2,
}

export interface RoundInitState {
  boom: boolean;
  firing: boolean;
  hp: number;
  ice: boolean;
  id: string;
  max_hp: number;
  pos: RoundDescAxis;
  red: boolean;
  stop_move: boolean;
  base_id: number;
}

export interface GamePkInfo {
  init: {
    base_unit: MapBaseUnits;
    blue_units: Api.Game.UnitPlanetPos[];
    red_units: Api.Game.UnitPlanetPos[];
    ids: {
      [sid: string]: Api.Game.Pos;
    };
    show_hp: {
      blue_total_hp: number;
      red_total_hp: number;
    };
  };
  slot: {
    [round: number]: {
      data: RoundInfo[];
    };
  };
  status: {
    status: {
      [round: string]: RoundInitState[];
    };
  };
}

export enum GamePkState {
  MATCHING, // 匹配中
  MATCH_ERROR, // 匹配失败
  MATCHED, // 匹配完成
  CONFIRMING, // 确定中
  START, // 开始战斗
  BATTLING, // 战斗中
  VICTORY, // 胜利
  DEFEAT, // 失败
}

export interface GameState {
  baseUnits: {
    [race: string]: MapBaseUnits;
  };
  baseSkill: {
    boom?: Api.Game.BoomSkill[];
    firing?: Api.Game.FiringSkill[];
  };
  plantUnits: {
    [id: number]: Api.Game.UnitPlanetPos[];
  };
  testPlantUnits: {
    [id: string]: {
      units1: Api.Game.UnitPlanetPos[];
      units2: Api.Game.UnitPlanetPos[];
      tag: string;
    };
  };
  process: any;
  PKInfo: null | GamePkInfo[];
  state: GamePkState;
  matchUser: Api.Alliance.PlunderInfoMatchUser | null;
  mineUser: Api.Alliance.PlunderInfoMatchUser | null;
  plunderPK: {
    [id: string]: {
      pkInfo: GamePkInfo;
    };
  };
  TerrainInfo: Api.Game.TerrainList[];
}

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number;

  isDark: boolean;

  scale: number; // 缩放比列

  client: {
    width: number;
    height: number;
  };
}
export interface State {
  user: UserState;
  userInfo: UserInfoState;
  mysteryBox: MysteryBoxState;
  galaxy: GalaxyState;
  alliance: AllianceState;
  planet: PlanetState;
  buildling: BuildlingState;
  game: GameState;
  guide: GuideState;
}

export interface planetInfo {
  id: number;
  name: string;
  owner: string;
  oldOwner: string;
  rarity: Qualities;
  level: number;
  strengthenLevel: number;
  working: boolean;
  workTime: number;
  areaX: number;
  areaY: number;
  oreYield: number;
  oreConsumption: number;
  energyYield: number;
  energyConsumption: number;
  populationYield: number;
  populationConsumption: number;
  settleAt: number;
  addTime: number;
  update_finish_time: number;
  strengthen_finish_time: number;
  build_count: number;
  energy: number;
  attack: number;
  build: number;
  defense: number;
  hp: number;
  product: number;
  is_available: boolean;
  plunder_speed: number;
  population: number;
  race: number;
  stone: number;
}
export interface allianceInfo {
  id: number;
  uid: number;
  beforeStoneCap: string;
  beforePopulationCap: string;
  beforeEnergyCap: string;
  createTime: number;
  laterExtractTime: number;
  power: number;
  working: number;
}

export interface orderInfo {
  id: number;
  planetId: number;
  order: number;
  uid: number;
  planet: planetInfo;
}
export interface energyInfo {
  total_population: number;
  total_stone: number;
  total_energy: number;
  per_population: number;
  per_stone: number;
  per_energy: number;
}
export interface AllianceView {
  alliance: allianceInfo;
  end_time: number;
  free_time: number;
  later_extract_time: number;
  order: orderInfo[];
  energy: energyInfo;
}
export interface AllianceState {
  allianceView: AllianceView;
  workingPlanet: number[];
}

export enum PlanetStatus {
  Upgrade = 1,
  Enhancement = 2,
  BuildingUpgrades = 3,
  BuildingsDurability = 4,
}

export interface GuideState {
  visible: boolean;
}
