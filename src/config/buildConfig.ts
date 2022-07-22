import { RaceType } from 'uikit/theme/types';

// type 1 生产 储存   2 战斗 buff
export const raceData = {
  [RaceType.PROTOSS]: {
    '1': {
      name: 'Watcher’s Temple',
      desc: '生产各种兵种的工厂：等级越高解锁兵种越多，兵种等级越高。随机生产兵种，不同兵种消耗时间和资源不同。各兵种储存量不同。资源不足将跳过或停止生产。',
      type: 2,
    },
    '2': {
      name: 'Gate Temple',
      desc: '生产各种兵种的工厂：等级越高解锁兵种越多，兵种等级越高。随机生产兵种，不同兵种消耗时间和资源不同。各兵种储存量不同。资源不足将跳过或停止生产。',
      type: 2,
    },
    '3': {
      name: 'Arbitration Temple',
      desc: '生产各种兵种的工厂：等级越高解锁兵种越多，兵种等级越高。随机生产兵种，不同兵种消耗时间和资源不同。各兵种储存量不同。资源不足将跳过或停止生产。',
      type: 2,
    },
    '4': {
      name: 'Spice Refinery',
      desc: '可以生产香料资源的工厂',
      type: 1,
    },
    '7': {
      name: 'Biohacking Institute(HP)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '8': {
      name: 'Biohacking Institute(ATK)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '9': {
      name: 'Biohacking Institute(EVA)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '10': {
      name: 'Energy Center',
      desc: '可以生产能量资源的工厂',
      type: 1,
    },
    '11': {
      name: 'Ore Mines',
      desc: '可以生产矿石资源的工厂',
      type: 1,
    },
    '12': {
      name: 'Biohacking Institute(CRI)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '13': {
      name: 'Biohacking Institute(MAG)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '14': {
      name: 'Cellar',
      desc: '可以保护一部分资源在行星联盟战斗中不被其他玩家掠夺。',
      type: 1,
    },
    '15': {
      name: 'Storage Tank',
      desc: '资源工厂产生的资源都汇集在这里。建筑的消耗资源将从储存罐中使用。',
      type: 1,
    },
    '16': {
      name: 'Biohacking Institute(DEF)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
  },
  [RaceType.HUMAN]: {
    '2': {
      name: 'Spice Refinery',
      desc: '可以生产香料资源的工厂',
      type: 1,
    },
    '3': {
      name: 'Ore Mines',
      desc: '可以生产矿石资源的工厂',
      type: 1,
    },
    '4': {
      name: 'Biohacking Institute(EVA)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '5': {
      name: 'Energy Center',
      desc: '可以生产能量资源的工厂',
      type: 1,
    },
    '6': {
      name: 'Prism Barracks',
      desc: '生产各种兵种的工厂：等级越高解锁兵种越多，兵种等级越高。随机生产兵种，不同兵种消耗时间和资源不同。各兵种储存量不同。资源不足将跳过或停止生产。',
      type: 2,
    },
    '9': {
      name: 'Biohacking Institute(CRI)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '10': {
      name: 'Magnetic Barracks',
      desc: '生产各种兵种的工厂：等级越高解锁兵种越多，兵种等级越高。随机生产兵种，不同兵种消耗时间和资源不同。各兵种储存量不同。资源不足将跳过或停止生产。',
      type: 2,
    },
    '11': {
      name: 'Biohacking Institute(MAG)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '12': {
      name: 'Biohacking Institute(DEF)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '13': {
      name: 'Cellar',
      desc: '可以保护一部分资源在行星联盟战斗中不被其他玩家掠夺。',
      type: 1,
    },
    '15': {
      name: 'Biohacking Institute(ATK)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '16': {
      name: 'Refinement Barracks',
      desc: '生产各种兵种的工厂：等级越高解锁兵种越多，兵种等级越高。随机生产兵种，不同兵种消耗时间和资源不同。各兵种储存量不同。资源不足将跳过或停止生产。',
      type: 2,
    },
    '17': {
      name: 'Biohacking Institute(HP)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '18': {
      name: 'Storage Tank',
      desc: '资源工厂产生的资源都汇集在这里。建筑的消耗资源将从储存罐中使用。',
      type: 1,
    },
  },
  [RaceType.ZERG]: {
    '1': {
      name: 'Biohacking Institute(DEF)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '2': {
      name: 'Biohacking Institute(CRI)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '4': {
      name: 'Biohacking Institute(EVA)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '5': {
      name: 'Biohacking Institute(MAG)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '7': {
      name: 'Energy Center',
      desc: '可以生产能量资源的工厂',
      type: 1,
    },
    '8': {
      name: 'Biohacking Institute(HP)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '10': {
      name: 'Mind Hive',
      desc: '生产各种兵种的工厂：等级越高解锁兵种越多，兵种等级越高。随机生产兵种，不同兵种消耗时间和资源不同。各兵种储存量不同。资源不足将跳过或停止生产。',
      type: 2,
    },
    '11': {
      name: 'Yuri Hive',
      desc: '生产各种兵种的工厂：等级越高解锁兵种越多，兵种等级越高。随机生产兵种，不同兵种消耗时间和资源不同。各兵种储存量不同。资源不足将跳过或停止生产。',
      type: 2,
    },
    '12': {
      name: 'UFO Hive',
      desc: '生产各种兵种的工厂：等级越高解锁兵种越多，兵种等级越高。随机生产兵种，不同兵种消耗时间和资源不同。各兵种储存量不同。资源不足将跳过或停止生产。',
      type: 2,
    },
    '14': {
      name: 'Spice Refinery',
      desc: '可以生产香料资源的工厂',
      type: 1,
    },
    '15': {
      name: 'Ore Mines',
      desc: '可以生产矿石资源的工厂',
      type: 1,
    },
    '16': {
      name: 'Biohacking Institute(ATK)',
      desc: '可以增加战斗属性的建筑，每个BUFF建筑都有指定的属性增幅。',
      type: 2,
    },
    '17': {
      name: 'Cellar',
      desc: '可以保护一部分资源在行星联盟战斗中不被其他玩家掠夺。',
      type: 1,
    },
    '19': {
      name: 'Storage Tank',
      desc: '资源工厂产生的资源都汇集在这里。建筑的消耗资源将从储存罐中使用。',
      type: 1,
    },
  },
};
