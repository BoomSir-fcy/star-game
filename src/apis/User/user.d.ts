declare namespace Api {
  namespace User {

    interface UserInfo {
      "id": 0,
      "nickname": "string",
      "address": "string",
      "nft": "string",
      "avatar": "string",
      "firstLoginAt": 0,
      "addTime": 0,
      "updatedAt": "string"
    }

    interface ParamsSignIn {
      "nonce": "string",
      "timestamp": 0,
      "signature": "string"
    }

    interface SignIn {
      "SSID": "string"
    }
  }
}
