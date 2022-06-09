import { Text } from '@pixi/text';
import {
  RoundDescAttack,
  RoundDescMove,
  RoundInfo,
  RoundDescAxis,
  descType,
  DescType,
  RoundDescBoom,
  RoundDescAddBoom,
  RoundDescAddFiring,
  RoundDescFiring,
  RoundDescIceEnd,
  RoundDescStopMove,
  RoundDescIceStart,
  RoundDesc,
  RoundDescRemove,
  RoundDescBeat,
  RoundDescBeatMove,
  ReceiveChange,
  RoundDescCarshHarm,
  RoundDescTotalHp,
  RoundDescInset,
  MapBaseUnits,
  RoundDescPurify,
  SoldierMoveType,
} from 'game/types';
import { orderBy } from 'lodash';
import AxisPoint from './AxisPoint';
import { stateType } from './Chequer';
import Game from './Game';
import Soldier from './Soldier';
import { getEffectText } from './utils';

const handleType = {
  MOVE: 'move',
  ATTACK: 'attack',
};

type HandleType = typeof handleType[keyof typeof handleType];

// interface AttackDetail {

// }

interface PeopleInfo {
  pos: RoundDescAxis;
  isEnemy: boolean;
  receive_sub_hp?: number;
  now_shield?: number;
}
export interface DescInfo {
  sender: PeopleInfo;
  receives: PeopleInfo[];
  type: DescType;
  moveTo?: RoundDescAxis;
  id: string;
}

interface RunTrackDetail {
  currentAxisPoint: RoundDescAxis;
  targetAxisPoint: RoundDescAxis;
  receive_id: string;
  sender_id: string;
  around?: ReceiveChange[];
  attackInfo?: RoundDesc;
  id: string;
  detail?: TrackDetail[];
  descInfo?: DescInfo;
}
interface InfoTrackDetail {
  info: RoundDescTotalHp;
}
interface InfoTrackInset {
  active_unit_unique_id: number;
}
export interface TrackDetail
  extends RunTrackDetail,
    Partial<InfoTrackInset>,
    Partial<InfoTrackDetail> {
  type: DescType;
}
interface Track {
  list: TrackDetail[];
  children?: Track[];
  trackId: string;
}

export interface RoundsProps {
  round: {
    [round: number]: {
      data: RoundInfo[];
    };
  };
  base?: MapBaseUnits;
}

/**
 * 运行核心
 */
class Running extends EventTarget {
  constructor(game: Game, rounds: RoundsProps, loop?: boolean) {
    super();

    this.game = game;
    this.rounds = rounds.round;
    this.base = rounds.base;
    this.playLoop = loop || false;
    // this.game.app.stage.addChild(this.infoText);
    this.infoText.x = 10;
    this.infoText.y = 10;
    this.init();
  }

  game;

  base;

  rounds;

  rate = 1; // 速率

  moveTimePerChequer = 500; // 移动一格所占的时间

  attackTime = 1000; // 每次攻击所占的时间

  trackId = ''; // 表示当前正在执行的进程 [一级, 二级进程, 三级进程]

  round = 0;

  trackIndex = 0;

  trackSubIndex = 0;

  infoText = new Text('2121221', { fill: 0xffffff, fontSize: 24 });

  tracks: {
    [round: number]: Track;
  } = {};

  trackDetails: TrackDetail[] = [];

  paused = false;

  playCount = -1;

  playing = false;

  playEnd = false;

  playLoop = false;

  init() {
    this.getTracks();
    // this.runHandle();
  }

  // start() {

  // }

  play() {
    this.paused = false;
    this.runHandle();
    this.dispatchEvent(new Event('play'));
  }

  // 跳过当前回合
  skipStep() {
    // TODO:
    console.log(this);
  }

  skipAll() {
    // TODO: 跳过所有回合
    console.log(this);
  }

  reStart() {
    // this.paused = true;
    this.trackIndex = 0;
    this.paused = true;
  }

  pause() {
    this.paused = true;
  }

  stop() {
    this.game.app.stop();
  }

  start() {
    this.game.app.start();
  }

  // 设置轨道索引
  setTrackIndex(index: number) {
    if (index > 0 && index < this.trackDetails.length) {
      this.trackIndex = index;
    }
  }

  // 设置轨道索引更加id
  setTrackIndexById(id: string) {
    const index = this.trackDetails.findIndex(item => {
      return item.id.indexOf(id) === 0;
    });
    if (index) {
      // const index = this.trackDetails.indexOf(track);
      this.trackIndex = index;
    } else {
      console.warn(`not find id: ${id} by trackDetails`);
    }
  }

  // 运动
  async runHandle() {
    if (this.paused) return;
    this.playing = true;
    const track = this.trackDetails[this.trackIndex];
    this.dispatchEvent(new CustomEvent('updateTrack', { detail: track }));
    // setTimeout(() => {
    //   this.runningHandle();
    // }, 500);
    this.runTrack(track, () => {
      this.runningHandle();
    });
  }

  // 运行轨道
  runTrack(track: TrackDetail, callback: (soldier?: Soldier) => void) {
    // debugger;
    if (track?.type === descType.MOVE) {
      this.infoText.text = `回合: ${track.id}`;
      return this.moveHandle(track, s => {
        callback(s);
      });
    }
    if (track?.type === descType.BEAT_MOVE) {
      this.infoText.text = `回合: ${track.id}`;
      return this.beatMoveHandle(track, s => {
        callback(s);
      });
    }
    // if (track?.type === descType.REMOVE) {
    //   this.infoText.text = `回合: ${track.id}`;
    //   return this.removeHandle(track, s => {
    //     callback(s);
    //   });
    // }
    if (track?.type === descType.INSERT_UNIT) {
      this.infoText.text = `回合: ${track.id}`;
      return this.insetUnitHandle(track, s => {
        callback(s);
      });
    }
    if (track?.type === descType.BEAT) {
      this.infoText.text = `回合: ${track.id}`;
      return this.beatHandle(track, s => {
        callback(s);
      });
    }
    if (track?.type === descType.BEAT_COLLISION) {
      this.infoText.text = `回合: ${track.id}`;
      return this.beatCollision(track, s => {
        callback(s);
      });
    }
    if (track?.type === descType.PURIFY) {
      this.infoText.text = `回合: ${track.id}`;
      return this.handlePurify(track, s => {
        callback(s);
      });
    }
    if (track?.type === descType.TOTAL_INFO) {
      const round = `回合: ${track.id} \n`;
      const effect = `我方: ${track.info?.blue_total_hp}; 敌方${track.info?.red_total_hp} \n`;
      this.infoText.text = `${round}${effect}`;
      callback();
      return null;
    }
    if (track?.type) {
      const round = `回合: ${track.id} \n`;
      const effect = `技能: ${getEffectText(track.type)} \n`;
      const sender = `攻击者: (${track.currentAxisPoint.x}, ${track.currentAxisPoint.y}) \n`;
      const receive = `被攻击者: (${track.targetAxisPoint.x}, ${track.targetAxisPoint.y}) \n`;
      const newHp = `被攻击者血量: (${(track.attackInfo as any)?.now_hp}) \n`;
      this.infoText.text = `${round}${effect}${sender}${receive}${newHp}`;
      return this.attackHandleRunning(track, s => {
        callback(s);
      });
    }
    callback();

    return null;
  }

  runningHandle() {
    this.playing = false;
    if (this.paused) return;
    if (this.playCount === 0) return;
    if (this.trackIndex < this.trackDetails.length) {
      this.trackIndex += 1;
      this.playCount -= 1;
      this.runHandle();
    } else if (this.playLoop) {
      console.log('循环播放');
      this.playLoop = false;
      this.trackIndex = 0;
      this.runHandle();
    } else {
      // console.log(this.trackDetails[this.trackDetails.length - 1]);
      this.infoText.text = `结束战斗`;
      this.playing = false;
      this.dispatchEvent(new CustomEvent('runEnd'));
      this.playEnd = true;
    }
  }

  // 改变播放次数
  changePlayCount(count: number) {
    this.playCount = count;
    if (this.playing) return;
    if (this.playEnd) {
      this.trackIndex = 0;
      this.playEnd = false;
    }
    this.paused = false;
    this.runningHandle();
  }

  // 获取所有播放轨道
  getAllTracks(tracks?: Track[]) {
    let res: TrackDetail[] = [];
    tracks?.forEach(item => {
      if (item.children) {
        res = [...res, ...this.getAllTracks(item.children)];
      } else {
        res = [...item.list];
      }
    });
    return res;
  }

  // 获取移动轨道详情
  getMoveTracks(moves: RoundDescMove, id: string): TrackDetail[] {
    const startPoint = moves.starting_point || moves.from;
    const moveToPoint = moves.dest[moves.dest.length - 1];
    const descInfo: DescInfo = {
      type: descType.MOVE,
      id,
      sender: {
        isEnemy: this.game.getSoliderEnemyById(moves.id),
        pos: {
          x: startPoint?.x ?? 0,
          y: startPoint?.y ?? 0,
        },
      },
      moveTo: moveToPoint,
      receives: [],
    };
    const tracks: TrackDetail[] = moves.dest.map((item, index) => {
      const point = moves.starting_point || moves.from;
      const { x, y } = index === 0 && point ? point : moves.dest[index - 1];
      return {
        id: `${id}-${index}`,
        type: descType.MOVE,
        receive_id: moves.id,
        sender_id: moves.id,
        descInfo,
        currentAxisPoint: { x, y },
        targetAxisPoint: {
          x: item.x,
          y: item.y,
        },
      };
    });

    return tracks;
  }

  // 获取血量轨道详情
  static getTotalHpTracks(info: RoundDescTotalHp, id: string): TrackDetail[] {
    return [
      {
        id,
        info,
        type: descType.TOTAL_INFO,
        receive_id: '',
        sender_id: '',
        currentAxisPoint: { x: 0, y: 0 },
        targetAxisPoint: {
          x: 0,
          y: 0,
        },
      },
    ];
  }

  // 获取击退轨道详情
  getBeatMoveTracks(
    moves: RoundDescBeatMove,
    id: string,
    descId: string,
  ): TrackDetail[] {
    const { x, y } = moves.from;
    const { x: x1, y: y1 } = moves.dest;
    const descInfo: DescInfo = {
      id: descId,
      type: descType.BEAT_MOVE,
      sender: {
        isEnemy: this.game.getSoliderEnemyById(moves.move_unit),
        pos: {
          x,
          y,
        },
      },
      moveTo: {
        x: x1,
        y: y1,
      },
      receives: [],
    };

    return [
      {
        id: `${id}`,
        type: descType.BEAT_MOVE,
        sender_id: moves.move_unit,
        receive_id: moves.move_unit,
        descInfo,
        currentAxisPoint: { x, y },
        targetAxisPoint: {
          x: x1,
          y: y1,
        },
      },
    ];
  }

  getMoveT() {
    return this.moveTimePerChequer / this.rate;
  }

  getAttackT() {
    return this.attackTime / this.rate;
  }

  // 移动
  moveHandle(track: TrackDetail, callback: (soldier?: Soldier) => void) {
    const t = this.getMoveT();

    const axisPoint = this.game.getAxis(
      track.targetAxisPoint.x,
      track.targetAxisPoint.y,
    );
    const soldier = this.game.findSoldierById(track.sender_id);
    if (!soldier || !axisPoint) {
      console.warn(`warn: ${track.id}`);
      callback();
      return null;
    }
    soldier.once('moveEnd', () => {
      callback(soldier);
    });
    soldier.moveTo(axisPoint);

    return soldier;
  }

  // 击退
  beatMoveHandle(
    track: TrackDetail,
    callback: (soldier?: Soldier) => void,
  ): Soldier | null {
    const t = this.getMoveT();

    const axisPoint = this.game.getAxis(
      track.targetAxisPoint.x,
      track.targetAxisPoint.y,
    );
    const soldier = this.game.findSoldierById(track.sender_id);
    if (!soldier || !axisPoint) {
      console.warn(`warn: ${track.id}`);
      callback();
      return null;
    }
    soldier.once('moveEnd', () => {
      callback(soldier);
    });
    soldier.moveTo(axisPoint, SoldierMoveType.BE_MOVED);

    return soldier;
  }

  // 阵亡
  removeHandle(track: TrackDetail, callback: (soldier?: Soldier) => void) {
    const soldier = this.game.findSoldierById(track.receive_id);
    if (!soldier) {
      console.warn(`warn: ${track.id}`);
      callback();
      return null;
    }
    soldier.dispatchEvent(new Event('death'));
    callback(soldier);
    return soldier;
  }

  // 空降添加小人
  insetUnitHandle(track: TrackDetail, callback: (soldier?: Soldier) => void) {
    const { active_unit_unique_id, receive_id, currentAxisPoint } = track;
    console.log(this.base, active_unit_unique_id);
    if (
      this.base &&
      active_unit_unique_id &&
      this.base[active_unit_unique_id]
    ) {
      console.log(6666);
      this.game.once('soldierCreated', () => {
        callback();
      });

      this.game.createSoldier(currentAxisPoint.x, currentAxisPoint.y, {
        srcId: `${track.receive_id}`,
        race: this.base[active_unit_unique_id]?.race || 1,
        id: active_unit_unique_id,
        sid: receive_id,
        hp: this.base[active_unit_unique_id]?.hp,
        isEnemy: false,
        enableDrag: false,
        unique_id: active_unit_unique_id,
      });
    } else {
      callback();
    }
    // const soldier = this.game.findSoldierById(track.receive_id);
    // if (!soldier) {
    //   console.warn(`warn: ${track.id}`);
    //   callback();
    //   return null;
    // }
    // soldier.dispatchEvent(new Event('death'));
    // callback(soldier);
    // return soldier;
  }

  // 获取攻击轨道
  getAttackTracks(
    attacks: RoundDesc,
    desc_type: DescType,
    id: string,
    self?: boolean, // 没有动画效果的攻击(自伤、仅前端概念)
    info?: RoundDescTotalHp,
  ): TrackDetail[] {
    const receives: PeopleInfo[] = [];
    if (attacks.around && attacks.around.length > 1) {
      attacks.around.forEach(item => {
        receives.push({
          pos: item.receive_point,
          isEnemy: this.game.getSoliderEnemyById(item.receive_id),
          receive_sub_hp: item.receive_sub_hp,
          now_shield: item.now_shield,
        });
      });
    } else {
      receives.push({
        pos: attacks.receive_point,
        isEnemy: this.game.getSoliderEnemyById(attacks.receive_id),
        receive_sub_hp:
          attacks.receive_sub_hp ?? attacks.around?.[0]?.receive_sub_hp,
        now_shield: attacks.now_shield ?? attacks.around?.[0]?.now_shield,
      });
    }
    const descInfo: DescInfo = {
      type: desc_type,
      id,
      sender: {
        isEnemy: this.game.getSoliderEnemyById(attacks.sender_id),
        pos: {
          x: attacks.sender_point?.x ?? 0,
          y: attacks.sender_point?.y ?? 0,
        },
      },
      receives,
    };

    const currentAxisPoint = {
      x: self
        ? attacks.receive_point?.x
        : attacks.sender_point?.x ?? attacks.receive_point?.x,
      y: self
        ? attacks.receive_point?.y
        : attacks.sender_point?.y ?? attacks.receive_point?.y,
    };
    // 炸弹自己炸
    const sender_id =
      self || desc_type === descType.BOOM
        ? attacks.receive_id
        : attacks.sender_id ?? attacks.receive_id;

    return [
      {
        id,
        type: desc_type,
        currentAxisPoint,
        targetAxisPoint: {
          x: attacks.receive_point?.x ?? attacks.sender_point?.x,
          y: attacks.receive_point?.y ?? attacks.sender_point?.y,
        },
        around: attacks.around,
        receive_id: attacks.receive_id ?? attacks.sender_id,
        sender_id,
        info,
        descInfo,
        attackInfo: { ...attacks },
      },
    ];
  }

  // 获取移除轨道
  getRemoveTracks(
    attacks: RoundDescRemove,
    desc_type: DescType,
    id: string,
  ): TrackDetail[] {
    const descInfo: DescInfo = {
      type: desc_type,
      id,
      sender: {
        isEnemy: this.game.getSoliderEnemyById(attacks.receive_id),
        pos: {
          x: attacks.receive_point?.x ?? 0,
          y: attacks.receive_point?.y ?? 0,
        },
      },
      receives: [],
    };
    return [
      {
        id,
        type: desc_type,
        descInfo,
        receive_id: attacks.receive_id,
        sender_id: attacks.receive_id,
        currentAxisPoint: {
          x: attacks.receive_point?.x,
          y: attacks.receive_point?.y,
        },
        targetAxisPoint: {
          x: attacks.receive_point?.x,
          y: attacks.receive_point?.y,
        },
      },
    ];
  }

  // 获取空降轨道
  getInsetUnitTracks(
    attacks: RoundDescInset,
    desc_type: DescType,
    id: string,
  ): TrackDetail[] {
    const descInfo: DescInfo = {
      type: desc_type,
      id,
      sender: {
        isEnemy: this.game.getSoliderEnemyById(attacks.active_unit_id),
        pos: {
          x: attacks.active_unit_pos?.x ?? 0,
          y: attacks.active_unit_pos?.y ?? 0,
        },
      },
      receives: [],
    };
    return [
      {
        id,
        type: desc_type,
        descInfo,
        active_unit_unique_id: attacks.active_unit_unique_id,

        receive_id: attacks.active_unit_id,
        sender_id: attacks.active_unit_id,
        currentAxisPoint: {
          x: attacks.active_unit_pos?.x,
          y: attacks.active_unit_pos?.y,
        },
        targetAxisPoint: {
          x: attacks.active_unit_pos?.x,
          y: attacks.active_unit_pos?.y,
        },
      },
    ];
  }

  // 获取AOE轨道
  getBeatTracks(
    attacks: RoundDescBeat | RoundDescPurify,
    desc_type: DescType,
    id: string,
    self?: boolean,
  ): TrackDetail[] {
    const detail = this.getDetails(attacks.detail || [], id, true);

    const attack: TrackDetail[] = [
      {
        id,
        type: desc_type,
        receive_id: attacks.receive_id,
        sender_id: self ? attacks.receive_id : attacks.sender_id,
        currentAxisPoint: {
          x: attacks.receive_point?.x,
          y: attacks.receive_point?.y,
        },
        targetAxisPoint: {
          x: attacks.sender_point?.x,
          y: attacks.sender_point?.y,
        },
        detail: [],
      },
      // ...detail,
    ];

    let lastSender = '';
    let lastReceive = '';
    // 拆分动作 分解执行
    detail.forEach((item, index) => {
      /**
       * 当前执行的攻击者和上一个攻击者相同
       * 或者
       * 当前执行的受害者和上一个受害者相同
       * 并且
       * 攻击者和受害者不是同一人(相同时没有攻击动画 忽略处理)
       * 并且
       * 只处理击退和碰撞
       *
       * 当满足以上条件时 拆分到下一个轨道执行
       */
      if (
        (lastReceive === item.receive_id || lastSender === item.sender_id) &&
        item.sender_id !== item.receive_id &&
        (item.type === descType.BEAT_COLLISION ||
          item.type === descType.BEAT_MOVE)
      ) {
        attack.push(item);
      } else {
        if (!attack[attack.length - 1].detail) {
          attack[attack.length - 1].detail = [];
        }
        (attack[attack.length - 1].detail as TrackDetail[]).push(item);
      }
      if (
        item.type === descType.BEAT_COLLISION ||
        item.type === descType.BEAT_MOVE
      ) {
        lastSender = item.sender_id;
        lastReceive = item.receive_id;
      }
      // lastSender = item.sender_id;
      // lastReceive = item.receive_id;
    });

    if (attack.length !== 1) {
      console.log(attack, '===attack');
    }
    return attack;
  }

  // 根据轨道详情获取小人
  getSoldiersByTrack(attacks: TrackDetail) {
    // const senderAxis = this.game.getAxis(
    //   attacks.currentAxisPoint.x,
    //   attacks.currentAxisPoint.y,
    // );
    // const receiveAxis = this.game.getAxis(
    //   attacks.targetAxisPoint.x,
    //   attacks.targetAxisPoint.y,
    // );
    // if (!receiveAxis || !senderAxis)
    //   return {
    //     sendSoldier: null,
    //     receiveSoldier: null,
    //   };
    if (attacks.sender_id && attacks.receive_id) {
      const sendSoldier = this.game.findSoldierById(attacks.sender_id);
      const receiveSoldier = this.game.findSoldierById(attacks.receive_id);
      // if (!sendSoldier || !receiveSoldier) return false;
      return {
        sendSoldier,
        receiveSoldier,
      };
    }
    return {
      sendSoldier: null,
      receiveSoldier: null,
    };
  }

  // 攻击
  attackHandleRunning(
    attacks: TrackDetail,
    callback: (soldier?: Soldier, receiveSoldier?: Soldier) => void,
  ) {
    const endHandle = (soldier?: Soldier, receiveSoldier?: Soldier) => {
      if (attacks.around) {
        // 群体效果
        attacks.around.forEach(item => {
          const receiveAxis = this.game.getAxis(
            item.receive_point.x,
            item.receive_point.y,
          );
          if (receiveAxis) {
            const activeSoldier = this.game.findSoldierByAxis(receiveAxis);
            if (activeSoldier) {
              activeSoldier.changeEffect(attacks.type, activeSoldier);
              if (
                typeof item.now_hp === 'number' &&
                typeof item.now_shield === 'number'
              ) {
                activeSoldier.setActiveHpWithShield(
                  item.now_hp,
                  item.now_shield,
                );
              }
              if (item.now_hp === 0) {
                activeSoldier.dispatchEvent(new Event('death'));
              }
            }
          }
        });
      } else if (receiveSoldier) {
        // 单体效果
        receiveSoldier.changeEffect(attacks.type, receiveSoldier);
        if (
          typeof attacks?.attackInfo?.now_hp === 'number' &&
          typeof attacks?.attackInfo?.now_shield === 'number'
        ) {
          receiveSoldier.setActiveHpWithShield(
            attacks?.attackInfo?.now_hp,
            attacks?.attackInfo.now_shield,
          );
        }
        if (attacks?.attackInfo?.now_hp === 0) {
          receiveSoldier.dispatchEvent(new Event('death'));
        }
        // if (attacks?.attackInfo?.receive_sub_hp) {
        //   receiveSoldier.setActiveHp(
        //     receiveSoldier.activePh - (attacks.attackInfo.receive_sub_hp || 0),
        //   );
        // }
      }
    };

    const sendSoldier = this.attackHandle(attacks, {
      onBulletMoveEnd: (s0, s1) => {
        endHandle(s0, s1);
      },
      onAttackEnd: () => {
        callback();
      },
    });

    return sendSoldier;
  }

  // 攻击
  attackHandle(
    attacks: TrackDetail,
    event: {
      onBulletMoveEnd?: (soldier?: Soldier, receiveSoldier?: Soldier) => void;
      onAttackEnd: (soldier?: Soldier, receiveSoldier?: Soldier) => void;
    },
  ): null | Soldier {
    const { sendSoldier, receiveSoldier } = this.getSoldiersByTrack(attacks);
    if (!sendSoldier || !receiveSoldier) {
      console.warn(`warn: ${attacks.id}`);
      event.onAttackEnd();
      return null;
    }
    const t = this.getAttackT();
    sendSoldier.once('bulletMoveEnd', () => {
      if (event?.onBulletMoveEnd) {
        event?.onBulletMoveEnd(sendSoldier, receiveSoldier);
      }
    });
    sendSoldier.once('attackEnd', () => {
      event.onAttackEnd(sendSoldier, receiveSoldier);
    });
    sendSoldier.attack(receiveSoldier, attacks.type, attacks?.attackInfo, t);

    return sendSoldier;
  }

  // 击退
  beatHandle(
    attacks: TrackDetail,
    callback: (soldier?: Soldier) => void,
  ): Soldier | null {
    const { sendSoldier, receiveSoldier } = this.getSoldiersByTrack(attacks);
    if (!sendSoldier || !receiveSoldier) {
      console.warn(`warn: ${attacks.id}`);
      callback();
      return null;
    }
    // 判断其他效果有没有执行完成
    let endTag = false;

    sendSoldier.once('bulletMoveEnd', () => {
      if (attacks.detail) {
        // const sendIds = [];
        // const receiveIds = [];
        const ids: {
          [id: string]: {
            send: number;
            receive: number;
          };
        } = {};
        attacks.detail.forEach((item, index) => {
          if (ids[item.receive_id]) {
            ids[item.receive_id].receive += 1;
          } else {
            ids[item.receive_id] = {
              send: 0,
              receive: 1,
            };
          }
          if (ids[item.sender_id]) {
            ids[item.sender_id].send += 1;
          } else {
            ids[item.sender_id] = {
              send: 1,
              receive: 0,
            };
          }
          // sendIds.push(item.receive_id);
          // sendIds.push(item.receive_id);
        });

        let trackIndex = 0;
        attacks.detail.forEach((item, index) => {
          this.runTrack(item, () => {
            trackIndex += 1;

            if (trackIndex === attacks.detail?.length) {
              if (endTag) {
                callback();
              }
              endTag = true;
            }
          });
        });
      } else {
        if (endTag) {
          callback();
        }
        endTag = true;
      }
    });
    sendSoldier.once('attackEnd', () => {
      if (endTag) {
        callback();
      }
      endTag = true;
    });
    sendSoldier.attack(receiveSoldier, attacks.type, attacks?.attackInfo);

    return sendSoldier;
  }

  // 净化
  handlePurify(
    attacks: TrackDetail,
    callback: (soldier?: Soldier) => void,
  ): Soldier | null {
    const { sendSoldier, receiveSoldier } = this.getSoldiersByTrack(attacks);
    if (!sendSoldier || !receiveSoldier) {
      console.warn(`warn: ${attacks.id}`);
      callback();
      return null;
    }
    // 判断其他效果有没有执行完成
    let endTag = false;

    sendSoldier.once('bulletMoveEnd', () => {
      if (attacks.detail?.length) {
        // const sendIds = [];
        // const receiveIds = [];
        // const ids: {
        //   [id: string]: {
        //     send: number;
        //     receive: number;
        //   };
        // } = {};
        // attacks.detail.forEach((item, index) => {
        //   if (ids[item.receive_id]) {
        //     ids[item.receive_id].receive += 1;
        //   } else {
        //     ids[item.receive_id] = {
        //       send: 0,
        //       receive: 1,
        //     };
        //   }
        //   if (ids[item.sender_id]) {
        //     ids[item.sender_id].send += 1;
        //   } else {
        //     ids[item.sender_id] = {
        //       send: 1,
        //       receive: 0,
        //     };
        //   }
        //   // sendIds.push(item.receive_id);
        //   // sendIds.push(item.receive_id);
        // });

        let trackIndex = 0;
        attacks.detail.forEach((item, index) => {
          this.runTrack(item, () => {
            trackIndex += 1;
            if (trackIndex === attacks.detail?.length) {
              if (endTag) {
                callback();
              }
              endTag = true;
            }
          });
        });
      } else {
        if (endTag) {
          callback();
        }
        endTag = true;
      }
    });
    sendSoldier.once('attackEnd', () => {
      if (endTag) {
        callback();
      }
      endTag = true;
    });
    sendSoldier.attack(receiveSoldier, attacks.type, attacks?.attackInfo);

    return sendSoldier;
  }

  // 碰撞
  beatCollision(attacks: TrackDetail, callback: (soldier?: Soldier) => void) {
    const { sendSoldier, receiveSoldier } = this.getSoldiersByTrack(attacks);
    if (!sendSoldier || !receiveSoldier) {
      console.warn(`warn: ${attacks.id}`);
      callback();
      return null;
    }
    sendSoldier.once('collisionEnd', () => {
      if (attacks.attackInfo) {
        const { sender_vhp, receive_vhp } =
          attacks.attackInfo as RoundDescCarshHarm;
        if (
          typeof sender_vhp.now_hp === 'number' &&
          typeof sender_vhp.now_shield === 'number'
        ) {
          sendSoldier.setActiveHpWithShield(
            sender_vhp.now_hp,
            sender_vhp.now_shield,
          );
        }
        if (sender_vhp.now_hp === 0) {
          sendSoldier.dispatchEvent(new Event('death'));
        }
        if (
          typeof receive_vhp.now_hp === 'number' &&
          typeof receive_vhp.now_shield === 'number'
        ) {
          receiveSoldier.setActiveHpWithShield(
            receive_vhp.now_hp,
            receive_vhp.now_shield,
          );
        }
        if (receive_vhp.now_hp === 0) {
          receiveSoldier.dispatchEvent(new Event('death'));
        }
      }

      callback();
    });
    if (attacks.attackInfo) {
      // const { sender_vhp, receive_vhp } =
      //   attacks.attackInfo as RoundDescCarshHarm;
      // if (
      //   typeof sender_vhp.now_hp === 'number' &&
      //   typeof sender_vhp.now_shield === 'number'
      // ) {
      //   sendSoldier.setActiveHpWithShield(
      //     sender_vhp.now_hp,
      //     sender_vhp.now_shield,
      //   );
      // }
      // if (
      //   typeof receive_vhp.now_hp === 'number' &&
      //   typeof receive_vhp.now_shield === 'number'
      // ) {
      //   receiveSoldier.setActiveHpWithShield(
      //     receive_vhp.now_hp,
      //     receive_vhp.now_shield,
      //   );
      // }
    }
    sendSoldier.beatCollision(receiveSoldier);
    return sendSoldier;
  }

  // 获取轨道
  getTracks() {
    Object.keys(this.rounds).forEach((_round: string, index) => {
      const round = Number(_round);
      this.tracks[round] = {
        children: [],
        trackId: `${round}`,
        list: [],
      };
      // if (this.rounds[])
      const detail = this.getDetails(this.rounds[round].data, round);
      this.trackDetails.push(...detail);
    });
  }

  static attackOfType = {
    [descType.ATTACK]: 'attack',
    [descType.BOOM]: 'boom',
    [descType.ADD_BOOM]: 'add_boom',
    [descType.ADD_FIRING]: 'add_firing',
    [descType.FIRING]: 'firing',
    [descType.ICE_END]: 'ice_end',
    [descType.ICE_START]: 'ice_start',
    [descType.STOP_MOVE]: 'stop_move',
    [descType.REMOVE_FIRING]: 'remove_firing',
    [descType.REMOVE_STOP_MOVE]: 'remove_stop_move',
    [descType.ADD_SHIELD]: 'add_shield',
    [descType.REMOVE_SHIELD]: 'sub_shield',
    [descType.RESTORE]: 'restore',
    [descType.ATTACK_DODGE]: 'attack_dodge',
    [descType.ATTACK_MISS]: 'attack_miss',
    // [descType.REMOVE_BOMB]: 'restore',
    // [descType.ADD_TERRAIN_FIRING]: 'add_terrain_firing',
    // [descType.TERRAIN_FIRING]: 'terrain_firing',
  };

  // 获取轨道详情
  getDetails(roundInfo: RoundInfo[], round: string | number, self?: boolean) {
    const details: TrackDetail[] = [];

    // const roundInfo = orderBy(
    //   roundInfos,
    //   item => item.desc_type === descType.REMOVE,
    // );

    Object.keys(roundInfo).forEach((_track, index) => {
      const track = Number(_track);
      const info = roundInfo[track];
      let totalInfo;
      if (roundInfo[index + 1]?.desc_type === descType.TOTAL_INFO) {
        totalInfo = roundInfo[index + 1];
      }

      // 移动
      if (info.desc_type === descType.MOVE) {
        details.push(...this.getMoveTracks(info.move, `${round}-${_track}`));
      }

      // 攻击
      const type = Running.attackOfType[info.desc_type] as 'attack';
      if (Running.attackOfType[info.desc_type]) {
        details.push(
          ...this.getAttackTracks(
            info[type],
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }

      // 闪避
      if (info.desc_type === descType.ATTACK_DODGE) {
        details.push(
          ...this.getMoveTracks(
            info.attack_dodge.detail[0].move,
            `${round}-${_track}-${1}`,
          ),
        );
      }

      // 移除
      if (info.desc_type === descType.REMOVE) {
        details.push(
          ...this.getRemoveTracks(
            info.unit_remove,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      // 击退(AOE)
      if (info.desc_type === descType.BEAT) {
        details.push(
          ...this.getBeatTracks(
            info.beat,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      // 净化
      if (info.desc_type === descType.PURIFY) {
        details.push(
          ...this.getBeatTracks(
            info.purify,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }

      // 击退产生位移
      if (info.desc_type === descType.BEAT_MOVE) {
        details.push(
          ...this.getBeatMoveTracks(
            info.beat_move,
            `${round}-${_track}`,
            `${round}`,
          ),
        );
      }
      // 击退产生碰撞
      if (info.desc_type === descType.BEAT_COLLISION) {
        details.push(
          ...this.getAttackTracks(
            info.carsh_harm,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }

      if (info.desc_type === descType.ADD_TERRAIN_FIRING) {
        details.push(
          ...this.getAttackTracks(
            info.add_terrain_firing,
            info.desc_type,
            `${round}-${_track}`,
            true,
          ),
        );
      }
      if (info.desc_type === descType.TERRAIN_FIRING) {
        details.push(
          ...this.getAttackTracks(
            info.terrain_firing,
            info.desc_type,
            `${round}-${_track}`,
            true,
          ),
        );
      }
      if (info.desc_type === descType.INSERT_UNIT) {
        details.push(
          ...this.getInsetUnitTracks(
            info.unit_activing,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }

      if (info.desc_type === descType.TOTAL_INFO) {
        details.push(
          ...Running.getTotalHpTracks(info.info, `${round}-${_track}`),
        );
      }
    });
    return details;
  }

  /**
   *
   * @param handle 需要执行的函数
   * @param delay 延迟时间
   * @param right 是否立即执行函数
   * @returns
   */
  static sleep(handle: any, delay: number, right?: boolean) {
    return new Promise<void>((res, rej) => {
      if (right) {
        handle();
      }
      setTimeout(() => {
        try {
          if (!right) {
            handle();
          }
          res();
        } catch (error) {
          rej(error);
        }
      }, delay);
    });
  }
}

export default Running;
