declare namespace Api {
  namespace Alliance {
    interface PlunderInfoMatchUser {
      address: string;
      ak: number;
      avatar: string;
      build_count: number;
      df: number;
      hp: number;
      nick_name: string;
      planet_count: number;
      power: number;
    }

    interface Plunder {
      to_address: string;
      nonce: string;
      timestamp: number;
      signature: string;
    }
  }
}
