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
  attackInfo?: RoundDesc;
  id: string;
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

  // reverse() {
  //   console.log(this);
  //   console.log('reverse');
  // }

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
    console.log(this.trackDetails);
    const index = this.trackDetails.findIndex(item => {
      console.log(item.id.indexOf(id) === 0, 'item.id.indexOf(id) === 0');
      return item.id.indexOf(id) === 0;
    });
    if (index) {
      // const index = this.trackDetails.indexOf(track);
      console.log(index, id, '==index');
      this.trackIndex = index;
    } else {
      console.log(`not find id: ${id} by trackDetails`);
    }
  }

  async runHandle() {
    if (this.paused) return;
    this.playing = true;
    const track = this.trackDetails[this.trackIndex];
    if (track?.type === effectType.MOVE) {
      this.infoText.text = `回合: ${track.id}`;
      const t = this.getMoveT();
      const res = this.moveHandle(track, t);
      if (!res) {
        console.warn(`移动失效:${track.id}`);
        this.runningHandle();
      }
      // const handle = () => this.moveHandle(track, t);
      // await Running.sleep(handle, t, true);
    } else if (track?.type === effectType.REMOVE) {
      this.removeHandle(track);
    } else if (track?.type) {
      const round = `回合: ${track.id} \n`;
      const effect = `技能: ${getEffectText(track.type)} \n`;
      const sender = `攻击者: (${track.currentAxisPoint.x}, ${track.currentAxisPoint.y}) \n`;
      const receive = `被攻击者: (${track.targetAxisPoint.x}, ${track.targetAxisPoint.y}) \n`;
      const newHp = `被攻击者血量: (${(track.attackInfo as any)?.now_hp}) \n`;
      this.infoText.text = `${round}${effect}${sender}${receive}${newHp}`;
      const t = this.getAttackT();
      const res = this.attackHandle(track, track.type, t);
      if (!res) {
        console.warn(`攻击失效:${track.id}`);
        console.log(track);
        this.runningHandle();
      }
      // const handle = () => this.attackHandle(track, track.type, t);
      // await Running.sleep(handle, t, true);
    }
    // if (track?.type === effectType.ATTACK) {
    //   const t = this.getAttackT();
    //   const handle = () => this.attackHandle(track, t);
    //   await Running.sleep(handle, t, true);
    // }
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
    // if (this.trackIndex)
    this.runningHandle();
  }

  // getActiveTrackList(index: number, track: Track) {
  //   if (track) {
  //   }
  // }

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
      // const { x: x0, y: y0 } = moves.starting_point;
      // const { x: x1, y: y1 } = item;
      const { x, y } =
        index === 0 ? moves.starting_point : moves.dest[index - 1];
      // this.trackDetails.push({
      //   type: handleType.MOVE,
      //   currentAxisPoint: { x, y },
      //   targetAxisPoint: {
      //     x: item.x,
      //     y: item.y,
      //   },
      // });
      return {
        id: `${id}-${index}`,
        type: effectType.MOVE,
        currentAxisPoint: { x, y },
        targetAxisPoint: {
          x: item.x,
          y: item.y,
        },
      };
    });

    return tracks;
  }

  getMoveT() {
    return this.moveTimePerChequer / this.rate;
  }

  getAttackT() {
    return this.attackTime / this.rate;
  }

  moveHandle(track: TrackDetail, t: number) {
    const axis = this.game.getAxis(
      track.currentAxisPoint.x,
      track.currentAxisPoint.y,
    );
    const axisPoint = this.game.getAxis(
      track.targetAxisPoint.x,
      track.targetAxisPoint.y,
    );
    if (!axis || !axisPoint) {
      console.log(`warn: ${track.id}`);
      return false;
    }
    const soldier = this.game.findSoldierByAxis(axis);
    if (!soldier) {
      console.log(`warn: ${track.id}`);
      return false;
    }
    soldier.run();
    soldier.moveTo(axisPoint, t);
    soldier.once('moveEnd', () => {
      this.runningHandle();
    });

    return true;
  }

  removeHandle(track: TrackDetail) {
    const axis = this.game.getAxis(
      track.currentAxisPoint.x,
      track.currentAxisPoint.y,
    );
    if (!axis) {
      console.log(`warn: ${track.id}`);
      return false;
    }
    const soldier = this.game.findSoldierByAxis(axis);
    if (!soldier) {
      console.log(`warn: ${track.id}`);
      return false;
    }
    soldier.showEffectText('阵亡');
    soldier.dispatchEvent(new Event('death'));
    this.runningHandle();
    return true;
  }

  static getAttackTracks(
    attacks: RoundDesc,
    desc_type: EffectType,
    id: string,
  ): TrackDetail[] {
    return [
      {
        id,
        type: desc_type,
        currentAxisPoint: {
          x: attacks.sender_point?.x ?? attacks.receive_point?.x,
          y: attacks.sender_point?.y ?? attacks.receive_point?.y,
        },
        targetAxisPoint: {
          x: attacks.receive_point?.x ?? attacks.sender_point?.x,
          y: attacks.receive_point?.y ?? attacks.sender_point?.y,
        },
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

    const sendSoldier = this.game.findSoldierByAxis(senderAxis);
    const receiveSoldier = this.game.findSoldierByAxis(receiveAxis);
    // if (!sendSoldier || !receiveSoldier) return false;
    return {
      sendSoldier,
      receiveSoldier,
    };
  }

  attackHandle(attacks: TrackDetail, effect: EffectType, t?: number) {
    const { sendSoldier, receiveSoldier } = this.getSoldiers(attacks);
    if (!sendSoldier || !receiveSoldier) {
      console.log(`warn: ${attacks.id}`);
      return false;
    }
    sendSoldier.renderBullet();
    sendSoldier.run();
    sendSoldier.attack(receiveSoldier, effect, attacks?.attackInfo, t);
    // receiveSoldier.changeState(stateType.DISABLE, true);
    sendSoldier.once('attackEnd', () => {
      this.runningHandle();
    });
    return true;
  }

  getTracks() {
    Object.keys(this.rounds).forEach((_round: string) => {
      const round = Number(_round);
      this.tracks[round] = {
        children: [],
        trackId: `${round}`,
        list: [],
      };
      Object.keys(this.rounds[round].data).forEach(_track => {
        const track = Number(_track);
        const info = this.rounds[round].data[track];
        // 移动
        if (info.desc_type === effectType.MOVE) {
          this.trackDetails.push(
            ...Running.getMoveTracks(info.move, `${round}-${_track}`),
          );
        }
        // 攻击
        if (info.desc_type === effectType.ATTACK) {
          this.trackDetails.push(
            ...Running.getAttackTracks(
              info.attack,
              info.desc_type,
              `${round}-${_track}`,
            ),
          );
        }
        // 攻击
        if (info.desc_type === effectType.BOOM) {
          this.trackDetails.push(
            ...Running.getAttackTracks(
              info.boom,
              info.desc_type,
              `${round}-${_track}`,
            ),
          );
        }
        if (info.desc_type === effectType.ADD_BOOM) {
          this.trackDetails.push(
            ...Running.getAttackTracks(
              info.add_boom,
              info.desc_type,
              `${round}-${_track}`,
            ),
          );
        }
        if (info.desc_type === effectType.ADD_FIRING) {
          this.trackDetails.push(
            ...Running.getAttackTracks(
              info.add_firing,
              info.desc_type,
              `${round}-${_track}`,
            ),
          );
        }
        if (info.desc_type === effectType.FIRING) {
          this.trackDetails.push(
            ...Running.getAttackTracks(
              info.firing,
              info.desc_type,
              `${round}-${_track}`,
            ),
          );
        }
        if (info.desc_type === effectType.ICE_END) {
          this.trackDetails.push(
            ...Running.getAttackTracks(
              info.ice_end,
              info.desc_type,
              `${round}-${_track}`,
            ),
          );
        }
        if (info.desc_type === effectType.ICE_START) {
          this.trackDetails.push(
            ...Running.getAttackTracks(
              info.ice_start,
              info.desc_type,
              `${round}-${_track}`,
            ),
          );
        }
        if (info.desc_type === effectType.STOP_MOVE) {
          this.trackDetails.push(
            ...Running.getAttackTracks(
              info.stop_move,
              info.desc_type,
              `${round}-${_track}`,
            ),
          );
        }
        if (info.desc_type === effectType.REMOVE) {
          this.trackDetails.push(
            ...Running.getRemoveTracks(
              info.unit_remove,
              info.desc_type,
              `${round}-${_track}`,
            ),
          );
        }
      });
    });
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
