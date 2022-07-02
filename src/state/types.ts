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
  power: number;
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
  zIndex: boolean; // 导航层级
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
  maxSales: string; // 最大可销售量
  sold: string; // 已销售量
  maxHeld: string; // 每种盲盒最大可持有的数量
  loading?: boolean;
  boxCount: string[]; // 用户持有的各盲盒数量
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
  galaxyStarList: Api.Galaxy.StarInfo[];
  galaxyNft: GalaxyNft;
  loadingGalaxy: boolean;
  loading: boolean;
  auctionRecordList: any[];
  AllLogs: AllLogsInfo[];
  OwnerInfo: OwnerInfoView;
  galaxy_total_box: number;
  planet_total_box: number;
}

export interface OwnerInfoView {
  hold_time: number;
  nickname: string;
  avatar: string;
  owner_get_box: number;
  all_get_box: number;
  all_auction_num: number;
  power: number;
}
export interface AllLogsInfo {
  id: number;
  galaxyId: number;
  nickname: string;
  oldOwner: string;
  newOwner: string;
  price: number;
  auctionAt: number;
  addTime: number;
  avatar: string;
  name: string;
}

export interface PlanetState {
  mePlanet: Api.Planet.PlanetInfo[];
  mePlanetLoading: boolean;
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
  destroyBuilding: {
    visible: boolean;
    destory: any;
  };
  upgradesBuilding: {
    visible: boolean;
    upgrad: any;
  };
  planetAssets: {
    energy: number;
    population: number;
    stone: number;
  };
  queue: {
    visible: boolean;
  };
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
  success: boolean; // 当场战斗输赢
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
  pkRes: boolean;
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
  planet: Api.Planet.PlanetInfo;
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
  max_work_count: number;
  now_work_count: number;
  unread_plunder_count: number;
  message_count: number;
}
export interface AllianceState {
  allianceView: AllianceView;
  workingPlanet: number[];
  pkRecord: PkRecord;
}

export interface PkRecord {
  record: RecordInfo[];
  page: number;
  page_size: number;
  count: number;
  win_count: number;
  failed_count: number;
  isEnd: boolean;
  loading: boolean;
}

export interface PlunderInfo {
  id: number;
  fromAddress: string;
  toAddress: string;
  incomeStone: number;
  incomeEnergy: number;
  incomePopulation: number;
  success: number;
  createTime: number;
  detail: string;
  blueLoseUnit: number;
  lostDurability: number;
  redLoseUnit: number;
  loseStone: number;
  loseEnergy: number;
  losePopulation: number;
}

export interface RecordInfo {
  id: number;
  startTime: number;
  endTime: number;
  plunderCount: number;
  workCount: number;
  working: number;
  lostDurability: number;
  loseUnit: number;
  loseEnergy: number;
  loseStone: number;
  losePopulation: number;
  address: string;
  getStone: number;
  getEnergy: number;
  getPopulation: number;
  plunder: PlunderInfo[];
}

export enum PlanetStatus {
  Upgrade = 1,
  Enhancement = 2,
  BuildingUpgrades = 3,
  BuildingsDurability = 4,
}

export interface GuideState {
  visible: boolean;
  lastStep: number;
  pathname?: string;
}

export enum BuildingDetailType {
  BuildDetailTypeNULL = 0,
  BuildingDetailTypeStore = 1, // 存储
  BuildingDetailTypeStone = 2, // 生成石头
  BuildingDetailTypeEnergy = 3, // 生成能量
  BuildingDetailTypePopulation = 4, // 生成人口
  BuildingDetailTypeAk = 5, // 核心战斗buff加成
  BuildingDetailTypeCellar = 6, // 地窖
  BuildingDetailTypeFactory1 = 7, // 士兵培养皿
  BuildingDetailTypeFactory2 = 8, // 士兵培养皿
  BuildingDetailTypeFactory3 = 9, // 士兵培养皿
}
