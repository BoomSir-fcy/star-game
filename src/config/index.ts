import BigNumber from 'bignumber.js';
import { BIG_TEN } from './constants/bigNumber';
import { ChainId } from './wallet/config';

export * from './token';
export const BASE_URL = `${window.location.origin}/`;
export const BASE_IMAGE_URL = 'https://static.social.qgx.io/';

export const BASE_BSC_SCAN_URLS = {
  [ChainId.BSC_MAINNET]: 'https://bscscan.com',
  [ChainId.BSC_TESTNET]: 'https://testnet.bscscan.com',
};

export const storage = {
  SSID: 'SSID',
  UserInfo: 'userInfo',
  systemCustom: 'systemCustom',
};

export const DEFAULT_GAS_LIMIT = 2000000;
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18);

export const BSC_BLOCK_TIME = 3;
export const BLOCKS_PER_YEAR = new BigNumber(
  (60 / BSC_BLOCK_TIME) * 60 * 24 * 365,
); // 10512000

export const REFRESH_TIME_BURN_PER_CIRCLE = 1000 * 60; // 60 秒 转完一圈

export const SERVICE_TIME_LIMIT = 60 * 5; // 剩余使用时间, 小于这个时间后提示用户 单位 （s）
export const PER_ARTICLE_FETCH_SPEND = 3; // 拉取每条文章花费TIME数
export const DEFAULT_FIRST_COMMENT_PAGE = 2; // 评论第一次获取
export const MAX_SPEND_TIME_PAGE_TATOL = 5; // 拉取花费TIME的接口时最大条数
export const MAX_PER_SPEND_TIME =
  PER_ARTICLE_FETCH_SPEND * MAX_SPEND_TIME_PAGE_TATOL; // 单次最大花费

export const GET_DSG_NFT_URL = 'https://dsgmetaverse.com/#/nft/socialfi';

export const ARTICLE_IMAGE_CLASS_NAME = 'article-image-display_with_load';
export const CONNECT_WALLET_BODY_CLASS_NAME =
  'connect-wallet-modal__Body--open';

export const ARTICLE_POST_MAX_LEN = 600; // 发帖最大字数

export const ARTICLE_COMMENTS_MAX_LEN = 280; // 评论最大字数

export const HUGE_ARTICLE_IMAGE_MAX_LEN = 5; // 长文发图数量

export const HUGE_ARTICLE_POST_MAX_LEN = 40000; // 长文最大字数
export const HUGE_ARTICLE_TITLE_MAX_LEN = 50; // 长文标题最大字数

// 帖子显示折行
export const ARTICLE_POST_MAX_ROW = 12;
export const ARTICLE_POST_FORWARD_ROW = 6;

export const SEARCH_MAX_HISTORY_LEN = 14;

export const POST_UPLOAD_IMG = 4;

export const BASE_USER_PROFILE_URL = '/me/profile/';

export const BICONOMY_DAPP_API_KEY = 'njaxQMHS7.352026d6-de3c-4faf-a0f2-9a64acbbab1c'

// setTotalSupply []
export const EXCEPT_TOTALSUPPPPLY_ADDRESS = [
  '0x718da2e74fff28b0a0d62aeb4f2afa8f7b521154',
  '0xe32c5352d3ba108374701d5333daa3db35345cf0',
];

// 部落阅读计费默认值

export const TRIBE_FEE_DEFAULT_SECOND_CONSUMES_TIME = '1'; // 每秒消耗TIME
export const TRIBE_FEE_DEFAULT_MAX_CONSUMES_TIME = '60'; // 每条内容最多消耗TIME
export const TRIBE_FEE_DEFAULT_MASTER_REWARD = '50'; // 部落主TIME奖励分配
export const TRIBE_FEE_DEFAULT_CREATOR_REWARD = '50'; // 创作者TIME奖励分配
export const TRIBE_FEE_DEFAULT_MEMBER_REWARD = '0'; // 部落成员TIME奖励分配
export const TRIBE_FEE_BNB_TOKEN = '0x0000000000000000000000000000000000000001'; // BNB token

export const TEIBE_FILE_TYPES = ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'txt', 'ppt']
