import { Text } from '@pixi/text';
import {
  RoundDescAttack,
  RoundDescMove,
  RoundInfo,
  RoundDescAxis,
  effectType,
  EffectType,
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
  type: EffectType;
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

/* 
  1.应该在执行移动/攻击前绑定事件 不然可能触发不到事件
  2.绑定事件的行为同一个事件可能有不同的处理方法
  3.几个移动/攻击可能同时发生
  
  处理方法
  1.分别用需要同时发生和不同时发生的方法做处理
  2.主线程的和次级线程的分开处理

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

  playCount = -1;

  playing = false;

  playEnd = false;

  init() {
    this.getTracks();
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

  setTrackIndex(index: number) {
    if (index > 0 && index < this.trackDetails.length) {
      this.trackIndex = index;
    }
  }

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

  async runHandle() {
    if (this.paused) return;
    this.playing = true;
    const track = this.trackDetails[this.trackIndex];
    this.runTrack(track, () => {
      this.runningHandle();
    });
  }

  runTrack(track: TrackDetail, callback: (soldier?: Soldier) => void) {
    if (track?.type === effectType.MOVE) {
      this.infoText.text = `回合: ${track.id}`;
      return this.mainMove(track, s => {
        callback(s);
      });
    }
    if (track?.type === effectType.BEAT_MOVE) {
      this.infoText.text = `回合: ${track.id}`;
      return this.beatMoveHandle(track, s => {
        callback(s);
      });
    }
    if (track?.type === effectType.REMOVE) {
      this.infoText.text = `回合: ${track.id}`;
      return this.removeHandle(track, s => {
        callback(s);
      });
    }
    if (track?.type === effectType.BEAT) {
      this.infoText.text = `回合: ${track.id}`;
      return this.beatHandle(track, s => {
        callback(s);
      });
    }
    if (track?.type === effectType.BEAT_COLLISION) {
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

  static getMoveTracks(moves: RoundDescMove, id: string): TrackDetail[] {
    const tracks: TrackDetail[] = moves.dest.map((item, index) => {
      const point = moves.starting_point || moves.from;
      const { x, y } = index === 0 && point ? point : moves.dest[index - 1];
      return {
        id: `${id}-${index}`,
        type: effectType.MOVE,
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

  static getBeatMoveTracks(
    moves: RoundDescBeatMove,
    id: string,
  ): TrackDetail[] {
    const { x, y } = moves.from;
    const { x: x1, y: y1 } = moves.dest;

    return [
      {
        id: `${id}`,
        type: effectType.BEAT_MOVE,
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

  moveHandle(track: TrackDetail): Soldier | null {
    const t = this.getMoveT();

    const axisPoint = this.game.getAxis(
      track.targetAxisPoint.x,
      track.targetAxisPoint.y,
    );
    const soldier = this.game.findSoldierById(track.sender_id);
    if (!soldier || !axisPoint) {
      console.warn(`warn: ${track.id}`);
      return null;
    }
    soldier.moveTo(axisPoint, t);

    return soldier;
  }

  mainMove(track: TrackDetail, callback: (soldier?: Soldier) => void) {
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

  static getAttackTracks(
    attacks: RoundDesc,
    desc_type: EffectType,
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

  static getRemoveTracks(
    attacks: RoundDescRemove,
    desc_type: EffectType,
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

  static getBeatTracks(
    attacks: RoundDescBeat,
    desc_type: EffectType,
    id: string,
  ): TrackDetail[] {
    const detail = Running.getDetails(attacks.detail, 1, true);

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
      },
      ...detail,
    ];
  }

  getSoldiers(attacks: TrackDetail) {
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

  attackHandleRunning(
    attacks: TrackDetail,
    callback: (soldier?: Soldier) => void,
  ) {
    const endHandle = () => {
      if (attacks.around) {
        attacks.around.forEach(item => {
          const receiveAxis = this.game.getAxis(
            item.receive_point.x,
            item.receive_point.y,
          );
          if (receiveAxis) {
            const soldier = this.game.findSoldierByAxis(receiveAxis);
            if (soldier) {
              soldier.setActiveHp(
                soldier.activePh - (item.receive_sub_hp || 0),
              );
              soldier.addEffect(attacks.type);
            }
          }
        });
      }
    };

    const sendSoldier = this.attackHandle(attacks, {
      onBulletMoveEnd: () => {
        endHandle();
      },
      onAttackEnd: () => {
        callback();
      },
    });

    return sendSoldier;
  }

  attackHandle(
    attacks: TrackDetail,
    event: {
      onBulletMoveEnd?: (soldier?: Soldier) => void;
      onAttackEnd: (soldier?: Soldier) => void;
    },
  ): null | Soldier {
    const { sendSoldier, receiveSoldier } = this.getSoldiers(attacks);
    if (!sendSoldier || !receiveSoldier) {
      console.warn(`warn: ${attacks.id}`);
      event.onAttackEnd();
      return null;
    }
    const t = this.getAttackT();
    sendSoldier.once('bulletMoveEnd', () => {
      if (event?.onBulletMoveEnd) {
        event?.onBulletMoveEnd();
      }
    });
    sendSoldier.once('attackEnd', () => {
      event.onAttackEnd();
    });
    sendSoldier.attack(receiveSoldier, attacks.type, attacks?.attackInfo, t);

    return sendSoldier;
  }

  beatHandle(
    attacks: TrackDetail,
    callback: (soldier?: Soldier) => void,
  ): Soldier | null {
    const { sendSoldier, receiveSoldier } = this.getSoldiers(attacks);
    if (!sendSoldier || !receiveSoldier) {
      console.warn(`warn: ${attacks.id}`);
      return null;
    }
    sendSoldier.attack(receiveSoldier, attacks.type, attacks?.attackInfo);
    sendSoldier.once('attackEnd', () => {
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
    return sendSoldier;
  }

  beatCollision(attacks: TrackDetail, callback: (soldier?: Soldier) => void) {
    const { sendSoldier, receiveSoldier } = this.getSoldiers(attacks);
    if (!sendSoldier || !receiveSoldier) {
      console.warn(`warn: ${attacks.id}`);
      callback();
      return null;
    }
    sendSoldier.once('collisionEnd', () => {
      callback();
    });
    sendSoldier.beatCollision(receiveSoldier);
    return sendSoldier;
  }

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

  static getDetails(roundInfo: RoundInfo[], round: number, self?: boolean) {
    const details: TrackDetail[] = [];

    Object.keys(roundInfo).forEach(_track => {
      const track = Number(_track);
      const info = roundInfo[track];
      // 移动
      if (info.desc_type === effectType.MOVE) {
        details.push(...Running.getMoveTracks(info.move, `${round}-${_track}`));
      }
      // 攻击
      if (info.desc_type === effectType.ATTACK) {
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
      if (info.desc_type === effectType.BOOM) {
        details.push(
          ...Running.getAttackTracks(
            info.boom,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === effectType.ADD_BOOM) {
        details.push(
          ...Running.getAttackTracks(
            info.add_boom,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === effectType.ADD_FIRING) {
        details.push(
          ...Running.getAttackTracks(
            info.add_firing,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === effectType.FIRING) {
        details.push(
          ...Running.getAttackTracks(
            info.firing,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === effectType.ICE_END) {
        details.push(
          ...Running.getAttackTracks(
            info.ice_end,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === effectType.ICE_START) {
        details.push(
          ...Running.getAttackTracks(
            info.ice_start,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === effectType.STOP_MOVE) {
        details.push(
          ...Running.getAttackTracks(
            info.stop_move,
            info.desc_type,
            `${round}-${_track}`,
            self,
          ),
        );
      }
      if (info.desc_type === effectType.REMOVE) {
        details.push(
          ...Running.getRemoveTracks(
            info.unit_remove,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      if (info.desc_type === effectType.BEAT) {
        details.push(
          ...Running.getBeatTracks(
            info.beat,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      if (info.desc_type === effectType.BEAT_MOVE) {
        details.push(
          ...Running.getBeatMoveTracks(info.beat_move, `${round}-${_track}`),
        );
      }
      if (info.desc_type === effectType.BEAT_COLLISION) {
        details.push(
          ...Running.getAttackTracks(
            info.carsh_harm,
            info.desc_type,
            `${round}-${_track}`,
          ),
        );
      }
      if (info.desc_type === effectType.REMOVE_FIRING) {
        details.push(
          ...Running.getAttackTracks(
            info.remove_firing,
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
