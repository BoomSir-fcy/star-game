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
      vipBenefits?: any;
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

    interface InviteParams {
      page: number;
      page_size: number;
    }

    interface vipList {
      id: number;
      vipPrice: string;
      vipDuration: number;
    }
  }
}
