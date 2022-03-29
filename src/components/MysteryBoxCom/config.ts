import { qualities } from './types'

export const mysteryConfig = {
  [qualities.ORDINARY]: {
    label: '普通',
    tips: '普通、良好、稀有星球',
    srcName: 'ordinary',
  },
  [qualities.ADVANCED]: {
    label: '高级',
    tips: '良好、稀有、史诗星球',
    srcName: 'advanced',
  },
  [qualities.SUPER]: {
    label: '超级',
    tips: '史诗、传说、神话星球',
    srcName: 'super',
  },
}