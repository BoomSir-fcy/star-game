declare namespace Api {
  namespace Galaxy {
    interface GalaxyInfo {
      id?: number;
      name?: string;
      owner?: string; // 当前所有人
      oldOwner?: string; // 上一个所有人
      addTime?: number; // 添加时间,毫秒
    }

    interface StarInfo {
      token_id: number;
      number: number; // 星系恒星编号
      name: string; // 名称
      owner: string; // 拥有者
      ownerAvatar: string; // 拥有者头像
      hold_time: number; // 占领开始时间
      protect_timestamp: number; // 保护结束时间
      history_hold_number: number; // 历史占领次数
      disapth_box: number; // 恒星收益分配比例
      nick_name: string;
      product_box: number; // 产出box
      power: number; // 战斗力
      cost_star: number; // 挑战门票
      destroy_star: number; // 销毁
      staking_pool_star: number; // 分配质押池
      planet_owner_star: number; // 恒星主获得
      storage_pool_star: number; // 分配给储备池
      pre_box: number; // 恒星主24小时预计获得box
    }

    interface OwnerInfo {
      [key: string]: Api.User.UserInfo;
    }

    interface GalaxyStarList {
      galaxy: GalaxyInfo;
      data: StarInfo[];
      users: OwnerInfo;
    }

    interface AttckStarParams {
      nft_id: number;
      number: number;
      nonce: string;
      timestamp: number;
      signature: string;
    }
  }
}
