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
} from 'game/types';
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
class Running extends EventTarget {
  constructor(game: Game, rounds: RoundsProps) {
    super();

    this.game = game;
    this.rounds = rounds;
    this.game.app.stage.addChild(this.infoText);
    this.infoText.x = 10;
    this.infoText.y = 10;
    this.init();
  }

  game;

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

  playCount = 1;

  playing = false;

  playEnd = false;

  init() {
    this.getTracks();
    console.log(this.trackDetails);
    this.runHandle();
  }

  play() {
    this.paused = false;
    this.runHandle();
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
    this.runTrack(track, () => {
      console.log(track);
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
    if (track?.type === descType.REMOVE) {
      this.infoText.text = `回合: ${track.id}`;
      return this.removeHandle(track, s => {
        callback(s);
      });
    }
    if (track?.type === descType.BEAT) {
      this.infoText.text = `回合: ${track.id}`;
      return this.beatHandle(track, s => {
        console.log('beatHandle');
        callback(s);
      });
    }
    if (track?.type === descType.BEAT_COLLISION) {
      this.infoText.text = `回合: ${track.id}`;
      return this.beatCollision(track, s => {
        callback(s);
      });
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
    console.log(this.trackIndex, this.trackDetails.length);
    if (this.trackIndex < this.trackDetails.length) {
      this.trackIndex += 1;
      this.playCount -= 1;
      this.runHandle();
    } else {
      console.log('结束战斗');
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
    soldier.moveTo(axisPoint, t);

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
    soldier.moveTo(axisPoint, t);

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
    soldier.showEffectText('阵亡');
    soldier.dispatchEvent(new Event('death'));
    callback(soldier);
    return soldier;
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
    const detail = Running.getDetails(attacks.detail, id, true);

    return [
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
        detail,
      },
      // ...detail,
    ];
  }

  // 更加轨道详情获取小人
  getSoldiersByTrack(attacks: TrackDetail) {
    const senderAxis = this.game.getAxis(
      attacks.currentAxisPoint.x,
      attacks.currentAxisPoint.y,
    );
    const receiveAxis = this.game.getAxis(
      attacks.targetAxisPoint.x,
      attacks.targetAxisPoint.y,
    );
    if (!receiveAxis || !senderAxis)
      return {
        sendSoldier: null,
        receiveSoldier: null,
      };
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
        attacks.around.forEach(item => {
          const receiveAxis = this.game.getAxis(
            item.receive_point.x,
            item.receive_point.y,
          );
          if (receiveAxis) {
            const activeSoldier = this.game.findSoldierByAxis(receiveAxis);
            if (activeSoldier) {
              activeSoldier.setActiveHp(
                activeSoldier.activePh - (item.receive_sub_hp || 0),
              );
              activeSoldier.changeEffect(attacks.type, activeSoldier);
            }
          }
        });
      } else if (receiveSoldier) {
        receiveSoldier.changeEffect(attacks.type, receiveSoldier);
        if (attacks?.attackInfo?.receive_sub_hp) {
          receiveSoldier.setActiveHp(
            receiveSoldier.activePh - (attacks.attackInfo.receive_sub_hp || 0),
          );
        }
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
      console.log(attacks.detail, 'attackEnd');
      if (attacks.detail) {
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
    console.log(sendSoldier, receiveSoldier, 'sendSoldier === receiveSoldier');
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
      callback();
    });
    console.log(
      receiveSoldier,
      sendSoldier,
      'sendSoldier=sendSoldier=sendSoldiersendSoldiersendSoldier',
    );
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
      const detail = Running.getDetails(this.rounds[round].data, round);
      this.trackDetails.push(...detail);
    });
  }

  // 获取轨道详情
  static getDetails(
    roundInfo: RoundInfo[],
    round: string | number,
    self?: boolean,
  ) {
    const details: TrackDetail[] = [];

    Object.keys(roundInfo).forEach(_track => {
      const track = Number(_track);
      const info = roundInfo[track];
      // 移动
      if (info.desc_type === descType.MOVE) {
        details.push(...Running.getMoveTracks(info.move, `${round}-${_track}`));
      }
      // 攻击
      if (info.desc_type === descType.ATTACK) {
        details.push(
          ...Running.getAttackTracks(
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
          ...Running.getAttackTracks(
            info.boom,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.ADD_BOOM) {
        details.push(
          ...Running.getAttackTracks(
            info.add_boom,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.ADD_FIRING) {
        details.push(
          ...Running.getAttackTracks(
            info.add_firing,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.FIRING) {
        details.push(
          ...Running.getAttackTracks(
            info.firing,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.ICE_END) {
        details.push(
          ...Running.getAttackTracks(
            info.ice_end,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.ICE_START) {
        details.push(
          ...Running.getAttackTracks(
            info.ice_start,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.STOP_MOVE) {
        details.push(
          ...Running.getAttackTracks(
            info.stop_move,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === descType.REMOVE) {
        details.push(
          ...Running.getRemoveTracks(
            info.unit_remove,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      if (info.desc_type === descType.BEAT) {
        details.push(
          ...Running.getBeatTracks(
            info.beat,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      if (info.desc_type === descType.BEAT_MOVE) {
        details.push(
          ...Running.getBeatMoveTracks(info.beat_move, `${round}-${_track}`),
        );
      }
      if (info.desc_type === descType.BEAT_COLLISION) {
        details.push(
          ...Running.getAttackTracks(
            info.carsh_harm,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      if (info.desc_type === descType.REMOVE_FIRING) {
        details.push(
          ...Running.getAttackTracks(
            info.remove_firing,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      // if (info.desc_type === descType.REMOVE_STOP_MOVE) {
      //   details.push(
      //     ...Running.getAttackTracks(
      //       info.remove_firing,
      //       info.desc_type,
      //       `${round}-${_track}`,
      //     ),
      //   );
      // }
      if (info.desc_type === descType.ADD_SHIELD) {
        details.push(
          ...Running.getAttackTracks(
            info.add_shield,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      if (info.desc_type === descType.REMOVE_SHIELD) {
        details.push(
          ...Running.getAttackTracks(
            info.sub_shield,
            info.desc_type,
            `${round}-${_track}`,
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

export default Running;
