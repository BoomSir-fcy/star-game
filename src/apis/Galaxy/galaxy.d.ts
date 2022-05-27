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
