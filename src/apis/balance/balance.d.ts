declare namespace Api {
  namespace Balance {
    interface DrawbalanceSignMessage {
      nonce: string; // 随机数
      timestamp: number; // 签名时间
      signature: string;
      coin: string;
      amount: number;
    }
  }
}
