export declare const mintVDSG: (masterChefContract: any, amount: any, dsgTeam: any) => Promise<any>;
/**
 * @dev 赎回vDSG
 * @param vDsgAmount 要赎回的vDSG数量
 * @param all 是否全部赎回
 */
export declare const unstakeVDsg: (masterChefContract: any, amount: any, all: any) => Promise<any>;
/**
 * @dev 赎回vDSG
 * @param vDsgAmount 要赎回的vDSG数量
 * @param all 是否全部赎回
 */
export declare const getWithdrawResult: (masterChefContract: any, amount: any) => Promise<any>;
