import { orderBy } from 'lodash';
import {
  RoundDescAttack,
  RoundDescMove,
  RoundInfo,
  RoundDescAxis,
  descType,
  DescType,
  RoundDesc,
  RoundDescRemove,
  RoundDescBeat,
  RoundDescBeatMove,
  ReceiveChange,
  RoundDescCarshHarm,
} from 'game/types';
import Game from './Game';
import Soldier from './Soldier';

interface TrackDetail {
  type: DescType;
  currentAxisPoint: RoundDescAxis;
  targetAxisPoint: RoundDescAxis;
  receive_id: string;
  sender_id: string;
  around?: ReceiveChange[];
  attackInfo?: RoundDesc;
  id: string;
  detail?: TrackDetail[];
}
interface Track {
  list: TrackDetail[];
  children?: Track[];
  trackId: string;
}

export interface RoundsProps {
  [round: number]: {
    data: RoundInfo[];
  };
}

/**
 * 运行核心
 */
class RunSimulation extends EventTarget {
  constructor(game: Game, rounds: RoundsProps) {
    super();
    this.game = game;
    // this.game.creatTerrain();
    this.rounds = rounds;
    this.init();
  }

  game;

  rounds;

  rate = 1; // 速率

  moveTimePerChequer = 500; // 移动一格所占的时间

  attackTime = 500; // 每次攻击所占的时间

  trackId = ''; // 表示当前正在执行的进程 [一级, 二级进程, 三级进程]

  round = 0;

  trackIndex = 0;

  trackSubIndex = 0;

  tracks: {
    [round: number]: Track;
  } = {};

  trackDetails: TrackDetail[] = [];

  paused = false;

  playCount = 1;

  playEnd = false;

  init() {
    this.getTracks();
    this.runHandle();
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
    const track = this.trackDetails[this.trackIndex];
    this.runTrack(track, () => {
      this.runningHandle();
    });
  }

  // 运行轨道
  runTrack(track: TrackDetail, callback: (soldier?: Soldier) => void) {
    if (track?.type) {
      return this.attackHandleRunning(track, s => {
        callback(s);
      });
    }
    callback();
    return null;
  }

  runningHandle() {
    if (this.playCount === 0) return;
    if (this.trackIndex < this.trackDetails.length) {
      this.trackIndex += 1;
      this.playCount -= 1;
      this.runHandle();
    } else {
      console.log('结束战斗');
      this.dispatchEvent(new CustomEvent('runEnd'));
      this.playEnd = true;
    }
  }

  // 改变播放次数
  changePlayCount(count: number) {
    this.playCount = count;
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
  static getMoveTracks(moves: RoundDescMove, id: string): TrackDetail[] {
    const tracks: TrackDetail[] = moves.dest.map((item, index) => {
      const point = moves.starting_point || moves.from;
      const { x, y } = index === 0 && point ? point : moves.dest[index - 1];
      return {
        id: `${id}-${index}`,
        type: descType.MOVE,
        receive_id: moves.id,
        sender_id: moves.id,
        currentAxisPoint: { x, y },
        targetAxisPoint: {
          x: item.x,
          y: item.y,
        },
      };
    });

    return tracks;
  }

  // 获取击退轨道详情
  static getBeatMoveTracks(
    moves: RoundDescBeatMove,
    id: string,
  ): TrackDetail[] {
    const { x, y } = moves.from;
    const { x: x1, y: y1 } = moves.dest;
    return [
      {
        id: `${id}`,
        type: descType.BEAT_MOVE,
        sender_id: moves.move_unit,
        receive_id: moves.move_unit,
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

  // 获取攻击轨道
  static getAttackTracks(
    attacks: RoundDesc,
    desc_type: DescType,
    id: string,
    self?: boolean, // 没有动画效果的攻击(自伤、仅前端概念)
  ): TrackDetail[] {
    const currentAxisPoint = {
      x: self
        ? attacks.receive_point?.x
        : attacks.sender_point?.x ?? attacks.receive_point?.x,
      y: self
        ? attacks.receive_point?.y
        : attacks.sender_point?.y ?? attacks.receive_point?.y,
    };
    const sender_id = self
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
        attackInfo: { ...attacks },
      },
    ];
  }

  // 获取移除轨道
  static getRemoveTracks(
    attacks: RoundDescRemove,
    desc_type: DescType,
    id: string,
  ): TrackDetail[] {
    return [
      {
        id,
        type: desc_type,
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

  // 获取AOE轨道
  static getBeatTracks(
    attacks: RoundDescBeat,
    desc_type: DescType,
    id: string,
  ): TrackDetail[] {
    const detail = RunSimulation.getDetails(attacks.detail, id, true);

    const attack: TrackDetail[] = [
      {
        id,
        type: desc_type,
        receive_id: attacks.receive_id,
        sender_id: attacks.sender_id,
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

    return attack;
  }

  // 更加轨道详情获取小人
  getSoldiersByTrack(attacks: TrackDetail) {
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
      return null;
    }
    sendSoldier.once('attackEnd', () => {
      if (attacks.detail) {
        // const sendIds = [];
        // const receiveIds = [];
        const ids: {
          [id: string]: {
            send: number;
            receive: number;
          };
        } = {};
        console.log(attacks.detail);
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
        console.log(ids);

        attacks.detail.forEach((item, index) => {
          this.runTrack(item, () => {
            if (index + 1 === attacks.detail?.length) {
              callback();
            }
          });
        });
      } else {
        callback();
      }
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
      // if (attacks.attackInfo) {
      //   const { sender_vhp, receive_vhp } =
      //     attacks.attackInfo as RoundDescCarshHarm;
      //   if (
      //     typeof sender_vhp.now_hp === 'number' &&
      //     typeof sender_vhp.now_shield === 'number'
      //   ) {
      //     sendSoldier.setActiveHpWithShield(
      //       sender_vhp.now_hp,
      //       sender_vhp.now_shield,
      //     );
      //   }
      //   if (
      //     typeof receive_vhp.now_hp === 'number' &&
      //     typeof receive_vhp.now_shield === 'number'
      //   ) {
      //     receiveSoldier.setActiveHpWithShield(
      //       receive_vhp.now_hp,
      //       receive_vhp.now_shield,
      //     );
      //   }
      // }

      callback();
    });
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
      if (
        typeof receive_vhp.now_hp === 'number' &&
        typeof receive_vhp.now_shield === 'number'
      ) {
        receiveSoldier.setActiveHpWithShield(
          receive_vhp.now_hp,
          receive_vhp.now_shield,
        );
      }
    }
    sendSoldier.beatCollision(receiveSoldier);
    return sendSoldier;
  }

  // 获取轨道
  getTracks() {
    Object.keys(this.rounds).forEach((_round: string) => {
      const round = Number(_round);
      this.tracks[round] = {
        children: [],
        trackId: `${round}`,
        list: [],
      };
      const detail = RunSimulation.getDetails(this.rounds[round].data, round);
      this.trackDetails.push(...detail);
    });
  }

  // 获取轨道详情
  static getDetails(
    roundInfos: RoundInfo[],
    round: string | number,
    self?: boolean,
  ) {
    const details: TrackDetail[] = [];

    const roundInfo = orderBy(
      roundInfos,
      item => item.desc_type === descType.REMOVE,
    );

    Object.keys(roundInfo).forEach(_track => {
      const track = Number(_track);
      const info = roundInfo[track];
      // 移动
      if (info.desc_type === descType.MOVE) {
        details.push(
          ...RunSimulation.getMoveTracks(info.move, `${round}-${_track}`),
        );
      }
      // 攻击
      if (info.desc_type === descType.ATTACK) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.attack,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      // 攻击
      if (info.desc_type === descType.BOOM) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.boom,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.ADD_BOOM) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.add_boom,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.ADD_FIRING) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.add_firing,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.FIRING) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.firing,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.ICE_END) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.ice_end,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.ICE_START) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.ice_start,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.STOP_MOVE) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.stop_move,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.REMOVE) {
        details.push(
          ...RunSimulation.getRemoveTracks(
            info.unit_remove,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      if (info.desc_type === descType.BEAT) {
        details.push(
          ...RunSimulation.getBeatTracks(
            info.beat,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      if (info.desc_type === descType.BEAT_MOVE) {
        details.push(
          ...RunSimulation.getBeatMoveTracks(
            info.beat_move,
            `${round}-${_track}`,
          ),
        );
      }
      if (info.desc_type === descType.BEAT_COLLISION) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.carsh_harm,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      if (info.desc_type === descType.REMOVE_FIRING) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.remove_firing,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.REMOVE_STOP_MOVE) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.remove_stop_move,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.ADD_SHIELD) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.add_shield,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      if (info.desc_type === descType.REMOVE_SHIELD) {
        details.push(
          ...RunSimulation.getAttackTracks(
            info.sub_shield,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
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

export default RunSimulation;
