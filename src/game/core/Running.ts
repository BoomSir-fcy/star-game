import {
  RoundDescAttack,
  RoundDescMove,
  RoundInfo,
  RoundDescAxis,
} from 'game/types';
import AxisPoint from './AxisPoint';
import { stateType } from './Chequer';
import Game from './Game';
import Soldier from './Soldier';

const handleType = {
  MOVE: 'move',
  ATTACK: 'attack',
};

type HandleType = typeof handleType[keyof typeof handleType];

// interface AttackDetail {

// }
interface TrackDetail {
  type: HandleType;
  currentAxisPoint: RoundDescAxis;
  targetAxisPoint: RoundDescAxis;
  attackInfo?: RoundDescAttack;
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
    this.init();
  }

  game;

  rounds;

  rate = 1; // 速率

  moveTimePerChequer = 500; // 移动一格所占的时间

  attackTime = 2000; // 每次攻击所占的时间

  trackId = ''; // 表示当前正在执行的进程 [一级, 二级进程, 三级进程]

  round = 0;

  trackIndex = 0;

  trackSubIndex = 0;

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
    console.log(this.trackIndex);
    const track = this.trackDetails[this.trackIndex];
    if (track?.type === handleType.MOVE) {
      const t = this.getMoveT();
      await Running.sleep(() => {
        this.moveHandle(track, t);
      }, t);
    }
    if (track?.type === handleType.ATTACK) {
      const t = this.getAttackT();
      await Running.sleep(() => {
        this.attackHandle(track, t);
      }, t);
    }
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

  getMoveTracks(moves: RoundDescMove): TrackDetail[] {
    const tracks: TrackDetail[] = moves.dest.map((item, index) => {
      const { x, y } = moves.starting_point;

      if (index !== 0) {
        this.trackDetails.push({
          type: handleType.MOVE,
          currentAxisPoint: {
            x: moves.dest[index - 1].x,
            y: moves.dest[index - 1].y,
          },
          targetAxisPoint: {
            x: item.x,
            y: item.y,
          },
        });
      } else {
        this.trackDetails.push({
          type: handleType.MOVE,
          currentAxisPoint: { x, y },
          targetAxisPoint: {
            x: item.x,
            y: item.y,
          },
        });
      }
      return {
        type: handleType.MOVE,
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

  getAttackTracks(attacks: RoundDescAttack): TrackDetail[] {
    this.trackDetails.push({
      type: handleType.ATTACK,
      currentAxisPoint: {
        x: attacks.sender_point.x,
        y: attacks.sender_point.y,
      },
      targetAxisPoint: {
        x: attacks.receive_point.x,
        y: attacks.receive_point.y,
      },
      attackInfo: { ...attacks },
    });
    return [
      {
        type: handleType.ATTACK,
        currentAxisPoint: {
          x: attacks.sender_point.x,
          y: attacks.sender_point.y,
        },
        targetAxisPoint: {
          x: attacks.receive_point.x,
          y: attacks.receive_point.y,
        },
        attackInfo: { ...attacks },
      },
    ];
  }

  attackHandle(attacks: TrackDetail, t?: number) {
    const senderAxis = this.game.getAxis(
      attacks.currentAxisPoint.x,
      attacks.currentAxisPoint.y,
    );
    const receiveAxis = this.game.getAxis(
      attacks.targetAxisPoint.x,
      attacks.targetAxisPoint.y,
    );
    if (!receiveAxis || !senderAxis) return false;

    const sendSoldier = this.game.findSoldierByAxis(senderAxis);
    const receiveSoldier = this.game.findSoldierByAxis(receiveAxis);
    if (!sendSoldier || !receiveSoldier) return false;
    sendSoldier.run();
    sendSoldier.attack(receiveSoldier, attacks?.attackInfo, t);
    sendSoldier.renderBullet();
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
        if (info.desc_type === 2) {
          this.tracks[round].children?.push({
            trackId: `${round}_${track}`,
            list: this.getMoveTracks(info.move),
            children: [],
          });
        }
        // 攻击
        if (info.desc_type === 3) {
          this.tracks[round].children?.push({
            trackId: `${round}_${track}`,
            list: this.getAttackTracks(info.attack),
            children: [],
          });
        }
      });
    });
  }

  static sleep(handle: any, delay: number) {
    return new Promise<void>((res, rej) => {
      setTimeout(() => {
        try {
          handle();
          res();
        } catch (error) {
          rej(error);
        }
      }, delay);
    });
  }
}

export default Running;
