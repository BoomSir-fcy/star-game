import { RaceType } from 'uikit/theme/types';

// type 1 生产 储存   2 战斗 buff
export const BuildRaceData = {
  [RaceType.PROTOSS]: {
    '1': {
      name: 'Watcher’s Temple',
      desc: "Factories that produce various troop types: The higher the level, the more troop types you can unlock, and the higher the troops' level. Troop types are randomly produced, and different troops consume different time and resources. The storage capacity of each troop type is different. Insufficient resources will make you skip or stop production.",
      type: 2,
    },
    '2': {
      name: 'Gate Temple',
      desc: "Factories that produce various troop types: The higher the level, the more troop types you can unlock, and the higher the troops' level. Troop types are randomly produced, and different troops consume different time and resources. The storage capacity of each troop type is different. Insufficient resources will make you skip or stop production.",
      type: 2,
    },
    '3': {
      name: 'Arbitration Temple',
      desc: "Factories that produce various troop types: The higher the level, the more troop types you can unlock, and the higher the troops' level. Troop types are randomly produced, and different troops consume different time and resources. The storage capacity of each troop type is different. Insufficient resources will make you skip or stop production.",
      type: 2,
    },
    '4': {
      name: 'Spice Refinery',
      desc: 'Factories that produce spice resources',
      type: 1,
    },
    '7': {
      name: 'Biohacking Institute(HP)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '8': {
      name: 'Biohacking Institute(ATK)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '9': {
      name: 'Biohacking Institute(EVA)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '10': {
      name: 'Energy Center',
      desc: 'Factories that produce energy resources',
      type: 1,
    },
    '11': {
      name: 'Ore Mines',
      desc: 'Factories that produce ore resources',
      type: 1,
    },
    '12': {
      name: 'Biohacking Institute(CRI)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '13': {
      name: 'Biohacking Institute(MAG)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '14': {
      name: 'Cellar',
      desc: 'It can protect part of resources from being looted by other players in Planet Alliance battles.',
      type: 1,
    },
    '15': {
      name: 'Storage Tank',
      desc: 'The resources generated by resource factories are stored here. Buildings  consume resources from storage tanks.',
      type: 1,
    },
    '16': {
      name: 'Biohacking Institute(DEF)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
  },
  [RaceType.HUMAN]: {
    '2': {
      name: 'Spice Refinery',
      desc: 'Factories that produce spice resources',
      type: 1,
    },
    '3': {
      name: 'Ore Mines',
      desc: 'Factories that produce ore resources',
      type: 1,
    },
    '4': {
      name: 'Biohacking Institute(EVA)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '5': {
      name: 'Energy Center',
      desc: 'Factories that produce energy resources',
      type: 1,
    },
    '6': {
      name: 'Prism Barrack',
      desc: "Factories that produce various troop types: The higher the level, the more troop types you can unlock, and the higher the troops' level. Troop types are randomly produced, and different troops consume different time and resources. The storage capacity of each troop type is different. Insufficient resources will make you skip or stop production.",
      type: 2,
    },
    '9': {
      name: 'Biohacking Institute(CRI)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '10': {
      name: 'Magnetic Barrack',
      desc: "Factories that produce various troop types: The higher the level, the more troop types you can unlock, and the higher the troops' level. Troop types are randomly produced, and different troops consume different time and resources. The storage capacity of each troop type is different. Insufficient resources will make you skip or stop production.",
      type: 2,
    },
    '11': {
      name: 'Biohacking Institute(MAG)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '12': {
      name: 'Biohacking Institute(DEF)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '13': {
      name: 'Cellar',
      desc: 'It can protect part of resources from being looted by other players in Planet Alliance battles.',
      type: 1,
    },
    '15': {
      name: 'Biohacking Institute(ATK)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '16': {
      name: 'Refinement Barrack',
      desc: "Factories that produce various troop types: The higher the level, the more troop types you can unlock, and the higher the troops' level. Troop types are randomly produced, and different troops consume different time and resources. The storage capacity of each troop type is different. Insufficient resources will make you skip or stop production.",
      type: 2,
    },
    '17': {
      name: 'Biohacking Institute(HP)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '18': {
      name: 'Storage Tank',
      desc: 'The resources generated by resource factories are stored here. Buildings  consume resources from storage tanks.',
      type: 1,
    },
  },
  [RaceType.ZERG]: {
    '1': {
      name: 'Biohacking Institute(DEF)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '2': {
      name: 'Biohacking Institute(CRI)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '4': {
      name: 'Biohacking Institute(EVA)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '5': {
      name: 'Biohacking Institute(MAG)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '7': {
      name: 'Energy Center',
      desc: 'Factories that produce energy resources',
      type: 1,
    },
    '8': {
      name: 'Biohacking Institute(HP)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '10': {
      name: 'Mind Hive',
      desc: "Factories that produce various troop types: The higher the level, the more troop types you can unlock, and the higher the troops' level. Troop types are randomly produced, and different troops consume different time and resources. The storage capacity of each troop type is different. Insufficient resources will make you skip or stop production.",
      type: 2,
    },
    '11': {
      name: 'Yuri Hive',
      desc: "Factories that produce various troop types: The higher the level, the more troop types you can unlock, and the higher the troops' level. Troop types are randomly produced, and different troops consume different time and resources. The storage capacity of each troop type is different. Insufficient resources will make you skip or stop production.",
      type: 2,
    },
    '12': {
      name: 'UFO Hive',
      desc: "Factories that produce various troop types: The higher the level, the more troop types you can unlock, and the higher the troops' level. Troop types are randomly produced, and different troops consume different time and resources. The storage capacity of each troop type is different. Insufficient resources will make you skip or stop production.",
      type: 2,
    },
    '14': {
      name: 'Spice Refinery',
      desc: 'Factories that produce spice resources',
      type: 1,
    },
    '15': {
      name: 'Ore Mines',
      desc: 'Factories that produce ore resources',
      type: 1,
    },
    '16': {
      name: 'Biohacking Institute(ATK)',
      desc: 'Buildings that offer combat attributes BUFF, each BUFF building can deliver a specified attribute enhancement.',
      type: 2,
    },
    '17': {
      name: 'Cellar',
      desc: 'It can protect part of resources from being looted by other players in Planet Alliance battles.',
      type: 1,
    },
    '19': {
      name: 'Storage Tank',
      desc: 'The resources generated by resource factories are stored here. Buildings  consume resources from storage tanks.',
      type: 1,
    },
  },
};
