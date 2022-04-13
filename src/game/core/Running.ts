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

  init() {
    this.getTracks();
    this.runHandle();
  }

  play() {
    console.log(this);
    console.log('start');
  }

  reverse() {
    console.log(this);
    console.log('reverse');
  }

  pause() {
    console.log(this);
    console.log('pause');
  }

  stop() {
    console.log(this);
    console.log('stop');
  }

  async runHandle() {
    const track = this.trackDetails[this.trackIndex];
    if (track?.type === effectType.MOVE) {
      this.infoText.text = `回合: ${track.id}`;
      const t = this.getMoveT();
      const handle = () => this.moveHandle(track, t);
      await Running.sleep(handle, t, true);
    } else if (track?.type) {
      const round = `回合: ${track.id} \n`;
      const effect = `技能: ${getEffectText(track.type)} \n`;
      const sender = `攻击者: (${track.currentAxisPoint.x}, ${track.currentAxisPoint.y}) \n`;
      const receive = `被攻击者: (${track.targetAxisPoint.x}, ${track.targetAxisPoint.y}) \n`;
      this.infoText.text = `${round}${effect}${sender}${receive}`;
      const t = this.getAttackT();
      const handle = () => this.attackHandle(track, track.type, t);
      await Running.sleep(handle, t, true);
    }
    // if (track?.type === effectType.ATTACK) {
    //   const t = this.getAttackT();
    //   const handle = () => this.attackHandle(track, t);
    //   await Running.sleep(handle, t, true);
    // }

    if (this.trackIndex < this.trackDetails.length) {
      this.trackIndex += 1;
      await this.runHandle();
    } else {
      console.log('end');
      this.dispatchEvent(new CustomEvent('runEnd'));
    }
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
    if (!axis || !axisPoint) return false;
    const soldier = this.game.findSoldierByAxis(axis);
    if (!soldier) return false;
    soldier.run();
    soldier.moveTo(axisPoint, t);
    return true;
  }

  static getAttackTracks(
    attacks: RoundDesc,
    desc_type: EffectType,
    id: string,
  ): TrackDetail[] {
    // this.trackDetails.push({
    //   type: handleType.ATTACK,
    //   currentAxisPoint: {
    //     x: attacks.sender_point.x,
    //     y: attacks.sender_point.y,
    //   },
    //   targetAxisPoint: {
    //     x: attacks.receive_point.x,
    //     y: attacks.receive_point.y,
    //   },
    //   attackInfo: { ...attacks },
    // });
    return [
      {
        id,
        type: desc_type,
        currentAxisPoint: {
          x: attacks.sender_point?.x || attacks.receive_point?.x,
          y: attacks.sender_point?.y || attacks.receive_point?.y,
        },
        targetAxisPoint: {
          x: attacks.receive_point?.x || attacks.sender_point?.x,
          y: attacks.receive_point?.y || attacks.sender_point?.y,
        },
        attackInfo: { ...attacks },
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
    if (!sendSoldier || !receiveSoldier) return false;
    sendSoldier.renderBullet();
    sendSoldier.run();
    sendSoldier.attack(receiveSoldier, effect, attacks?.attackInfo, t);
    // receiveSoldier.changeState(stateType.DISABLE, true);
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
