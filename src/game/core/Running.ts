import { RoundDescAttack, RoundDescMove, RoundInfo } from 'game/types';
import { DisplayObject } from 'pixi.js';
import AxisPoint from './AxisPoint';
import Game from './Game';
import Soldier from './Soldier';

const handleType = {
  MOVE: 'move',
  ATTACK: 'attack',
};

type HandleType = typeof handleType[keyof typeof handleType];

interface TrackDetail {
  handle: () => void;
  type: HandleType;
  currentSoldier?: Soldier;
  targetSoldier?: Soldier;
  currentAxisPoint?: AxisPoint;
  targetAxisPoint?: AxisPoint;
}
interface Track {
  detail?: TrackDetail;
  children?: Track[];
}

interface RoundsProps {
  [round: number]: RoundInfo;
}

class Running extends EventTarget {
  constructor(game: Game, rounds: RoundsProps) {
    super();

    this.game = game;
    this.rounds = rounds;
  }

  game;

  rounds;

  rate = 1; // 速率

  moveTimePerChequer = 500; // 移动一格所占的时间

  attackTime = 300; // 每次攻击所占的时间

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

  moveHandle(soldier: Soldier, axisPoint: AxisPoint) {
    const t = this.moveTimePerChequer / this.rate;
    soldier.run();
    soldier.moveTo(axisPoint, t);
  }

  getMoveTracks(moves: RoundDescMove): Track[] {
    // const axis = this.game.getAxis(
    //   moves.starting_point.x,
    //   moves.starting_point.y,
    // );
    // if (!axis) return [];
    // const soldier = this.game.findSoldierByAxis(axis);
    // if (!soldier) return [];
    const handle = () => {
      const t = this.moveTimePerChequer / this.rate;

      const axis = this.game.getAxis(
        moves.starting_point.x,
        moves.starting_point.y,
      );
      if (!axis) return;
      const soldier = this.game.findSoldierByAxis(axis);
      if (!soldier) return;
    };
    const tracks: Track[] = moves.dest.map(item => {
      return {
        detail: {
          handle,
          type: handleType.MOVE,
        },
      };
    });

    return tracks;
  }

  attackHandle(attacks: RoundDescAttack) {
    const handle = () => {
      const senderAxis = this.game.getAxis(
        attacks.sender_point.x,
        attacks.sender_point.y,
      );
      const receiveAxis = this.game.getAxis(
        attacks.receive_point.x,
        attacks.receive_point.y,
      );

      if (!receiveAxis || !senderAxis) return;

      const sendSoldier = this.game.findSoldierByAxis(senderAxis);
      const receiveSoldier = this.game.findSoldierByAxis(receiveAxis);
      if (!sendSoldier || !receiveSoldier) {
        return [];
      }
      sendSoldier.run();
      sendSoldier.attack();
      receiveSoldier.run();
    };
    return [
      {
        handle,
        sleep: 3000,
      },
    ];
  }

  getTracks(rounds: RoundsProps) {
    const tracks = [];
    for (const round in rounds) {
    }
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

  static async handle(track: Track[]) {
    for (const item of track) {
      console.log(item);
      if (item.children) {
        await Running.handle(item.children);
      }
      if (item?.detail?.handle) {
        await Running.sleep(item.detail.handle, 0);
      }
    }
  }
}

export default Running;
