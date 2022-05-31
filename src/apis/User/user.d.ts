declare namespace Api {
  namespace User {
    interface UserInfo {
      id: number;
      nickname: string;
      address: string;
      nft: string;
      avatar: string;
      firstLoginAt: number;
      addTime: number;
      updatedAt: string;
    }

    interface ParamsSignIn {
      nonce: string;
      timestamp: number;
      signature: string;
    }

    interface SignIn {
      SSID: 'string';
    }

    interface CheckParams {
      address: string;
    }

    interface vipList {
      id: number;
      vipPrice: string;
      vipDuration: number;
    }
  }
}
