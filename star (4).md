
### 用户代理合约

合约地址：0x380F9e3F556e1F568e66aF16EAe49dF38313Fb57

```solidity

contract UserAgent {

    /**
    * 检查昵称有效性
    */
    function checkNickname(string memory nickname) external view returns (bool);

    /**
    * 获取用户信息
    */
    function getUserView(address user) external view returns(string memory nickname, address nftAddress, uint256 tokenId, bool isAcctive, address superior);

    /**
    * 获取合约基本信息
    * @return avatarNft_ 头像nft的合约地址
    * @return payToken_ 要支付的token的合约地址
    * @return userProfile_ 用户信息合约地址
    * @return price_ 价格
    * @return createdCount_ 已创建数量
    */
    function infoView() public view returns(address avatarNft_, address payToken_, address userProfile_, uint256 price_, uint256 createdCount_);

    /**
    * 使用dsg注册
    * @param nickname 昵称
    * @param superior 邀请人
    * @param gender 性别 0.男 1.女
    */
    function registerWithDsg(string memory nickname, address superior, uint gender) public;


}

```

### 盲盒合约

合约地址: 0xa9da2bFea47D45F0fe1809ea760CBd956EeC58cC

```solidity
contract MysteryBox {

	struct BoxView {
        uint256[3] priceBNB; // 三种盲盒对应的bnb价格
        uint256[3] seedBlocks; // 三种盲盒对应的预定区块, 与当前区块相差超过230个区块应让用户重新预定
        uint256 burnRatio; // 销毁比例
        uint256 vdsgRatio; // 给vdsg的比例
        uint256 dsgPoolRatio; // 给dsg质押池的比例
        uint256 bnbPoolRatio; // 给bnb质押池的比例
        uint256 superiorRatio; // 给邀请人的比例
        address defaultSuperior; // 默认邀请人
        uint256 miniDistributeAmount; // 
        uint256 totalBurnt; // 总销毁量dsg
        uint256 totalVDsgDonated; // 总给vdsg的量dsg
        uint256 totalPoolSent; // 总给质押池的量dsg
        uint256 totalPoolSentBNB; // 总给质押池的量bnb
    }



    /**
    * 购买盲盒
    * @param boxId 0.普通 1.高级 2.超级
    */
    function buy(uint boxId) public payable;

    /**
    * 开盲盒
    * @param boxId 0.普通 1.高级 2.超级
    * @param planetName 给星球的命名
    */
    function openBox(uint boxId,string memory planetName) public payable;

}


```


### 星系合约

合约地址: 0x29b4b2e169EFA9ABF5C90E012D81694FB2D5D7e4

```solidity
contract Galaxy {

    struct NftView {
        uint256 id;
        address owner;  // 所有者
        uint256 lastPrice; // 最后一次交易的价格
        uint256 currentPrice; // 当前购买需要支付的价格
        uint256 miniBuyDuration; // 最小购买的时间间隔
        uint256 lastTimestamp; // 最后购买时间
    }

    // 取nft信息
    function getNftView(uint256 tokenId) public view returns(NftView memory);

	/**
    * 获取星系的价格
    * @param tokenId 要购买的星系id
    * @return lastPrice_ 最新的成交价
    * @return currentPrice_ 当前价格(购买要支付的金额)
    */
	function tokenPrice(uint256 tokenId) public view returns (uint256 lastPrice_, uint256 currentPrice_);


	/**
    * 购买星系
    * @param tokenId 要购买的星系id
    */
	function buy(uint256 tokenId) public payable;
}
```


### 星球合约

合约地址: 0x59F71c8a1082EE1329486464206330f307565089

```solidity
contract Planet {
	event Mint(address indexed user, uint256 planetId, string name, uint rarity);
    event UpgradePlanet(uint256 indexed planetId, uint256[] materialIds, bytes32 materialHash, uint256 timestamp);
    event DoneUpgradePlanet(uint256 indexed planetId, bytes32 materialHash, uint256 timestamp);
    event CancelUpgradePlanet(uint256 indexed planetId, bytes32 materialHash, uint256 timestamp);
    event SetWorking(address indexed user, uint256[] oldPlanets, uint256[] newPlanets);

    /**
    * 将星球设置为工作
    * @param planetIds 要工作的星球id, 会替换之前已经设置的, 最多5个
    */
    function setWorking(uint256[] memory planetIds) public;


    /**
    * 升级星球
    * @param planetId 要升级的星球
    * @param materialIds 材料星球
    */
    function upgradePlanet(uint256 planetId, uint256[] memory materialIds) public payable;


}
```


### 金库合约

合约地址: 0xb4980C5121dce73BC7E554ffe6ab6262598774CC

```solidity

contract UserVault {
	struct VaultView {
        address bnb;
        address dsg;
        address box;
        address vdsg;
        address pool;
        uint256 totalBurnt;
        uint256 totalVDsgDonated;
        uint256 totalPoolSent;
        address[] supportTokens;
    }

    event Deposit(address indexed user, address token, uint256 amount, uint256 timestamp);
    event DistributeDSG(address caller, uint256 burnAmount, uint256 vdsgAmount, uint256 poolAmount);
    event AddSupportToken(address Token, uint256 timestamp);
    event WithdrawToken(address indexed sender, address indexed token, uint256 value, uint256 timestamp);

    // 充值token
    function deposit(address token, uint256 amount) public payable;

    // 充值bnb
    function depositBNB() public payable;



}
```






