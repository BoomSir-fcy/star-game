
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
    * @return priceBnb_ bnb购买价格
    * @return createdCount_ 已创建数量
    */
    function infoView() public view returns(address avatarNft_, address payToken_, address userProfile_, uint256 price_, uint256 priceBnb_, uint256 createdCount_);

    /**
    * 使用dsg注册
    * @param nickname 昵称
    * @param superior 邀请人
    * @param gender 性别 0.男 1.女
    */
    function registerWithDsg(string memory nickname, address superior, uint gender) public;

    // 使用bnb注册
    function registerWithBnb(string memory nickname, address superior, uint gender) public;


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
        uint maxSales; // 最大可销售量
        uint sold; // 已销售量
        uint maxHeld; // 每种盲盒最大可持有的数量
    }



    /**
    * 购买盲盒
    * @param boxId 0.普通 1.高级 2.超级
    * @param num 数量
    */
    function buy(uint boxId, uint256 num) public payable;

    /**
    * 开盲盒
    * @param boxId 0.普通 1.高级 2.超级
    * @param planetName 给星球的命名, 空字符代表使用默认命名
    * @param num 数量
    */
    function openBox(uint boxId,string memory planetName, uint256 num) public;

    /**
    * 更新随机数,使用openBoxWithKey前应先调用
    * @param boxId 0.普通 1.高级 2.超级
    */
    function upSeed(uint boxId) public;

    /**
    * 获取用户各盲盒持有的key数量,一个key可以开一次盲盒
    * @param user 用户地址
    */
    function getUserKeys(address user) public view returns(uint box0Count, uint box1Count, uint box2Count);
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


### 质押池合约

测试地址： 0xc07e12E94D54E316C0DFeDca1B3FE5461Abb3A07

```solidity
contract StakingPool {
    struct LockedBalance {
        int128 amount; // 锁仓数量
        uint256 end; // 结束时间
    }

    struct PoolView {
        uint256 maxLock; // 最大锁仓时间,秒
        address token; // 质押的token地址
        string tokenName; // 质押的token name
        string tokenSymbol; // 质押的token symbol
        uint8  tokenDecimals; // 质押的token decimals
        uint64 earlyWithdrawBpsPerWeek; // 提前提取每提前一周要支付的退出费百分比, 要除以10000
        uint64 redistributeBps; // 退出费中有多少比例是分给留存用户的, 要除以10000
        uint256 accumRedistribute; // 退出费总已分配给留在用户的数量
        uint256 totalSupply; // 当前vBOX总供应量
        uint256 totalStaking; // 总质押额
        uint256 epoch; // 当前周期
    }

    struct UserView {
        uint256 lockAmount; // 用户锁仓总数量, 为0使用createLock锁仓,不为零使用increaseLockAmount加仓
        uint256 lockEnd; // 锁仓结束时间
        uint256 balance; // vBOX余额
        uint64 earlyWithdrawBps; // 提前解锁要付的退出费百分比(如果没到期的话)
    }

    // 查询用户在某个区块的vBOX余额
    function balanceOfAt(address _user, uint256 _blockNumber) external view returns (uint256);

    // 查询在某个区块的总vBOX供应量
    function totalSupplyAt(uint256 _blockNumber) external view returns (uint256);

    // 查询用户的vBOX余额
    function balanceOf(address _user) external view returns (uint256);

    // 创建锁仓
    // @param _amount 要锁仓的金额
    // @param _unlockTime 结束锁仓时间, _unlockTime必须大于等于now() + 7 days, 小于等于now() + MAX_LOCK
    function createLock(uint256 _amount, uint256 _unlockTime) external;

    // 增加锁仓数量, 必须已经有锁仓才能调用
    function increaseLockAmount(uint256 _amount) external;

    // 增加锁仓时间, 必须已经有锁仓才能调用
    // @param _newUnlockTime新的锁仓时间, 必需大于旧的
    function increaseUnlockTime(uint256 _newUnlockTime) external;

    // 提取资金, 只有锁仓到期才能提
    function withdraw() external;

    // 提前提取, 只有锁仓未到期才能调用
    function earlyWithdraw(uint256 _amount) external;


    function getPoolView() public view returns(PoolView memory);


    function getUserView(address user) public view returns(UserView memory);
}
```

### 质押池奖励发放合约

测试地址：0x58bFBD731D18B8974E78Bf154A369d02a663570c

contract StakingPoolRewarder {

    struct PoolView {
        bool isKilled; // 是否已终止
        uint256 startWeekCursor; // 开始时间
        uint256 weekCursor; // 当前周期时间
        uint256 lastTokenTimestamp; // 最后对周期进行分配token(checkpoint)的时间
        address rewardToken; // 奖励的token
        string rewardTokenName; // 奖励的token名
        string rewardTokenSymbol; // 奖励的token标识
        uint8 rewardTokenDecimals; // 奖励的token小数位
        uint256 lastTokenBalance; // 未分配的token余额
        uint256 tokensPerWeek; // 当前周期基础奖励总额
        uint256 tokensAdditionalPerWeek; // 当前周期附加奖励总额
    }

    struct UserView {
        uint256 weekCursor; // 用户最新一次领取奖励的周期时间
        uint256 userEpoch; // 用户最新一次领取奖励的周期数
    }

    /**
    * 收益率计算
    * 基础收益率 = (PoolView.tokensPerWeek * USD_PRICE) / (StakingPool.PoolView.totalStaking * USD_PRICE) * 52
    * 附加收益率 = (PoolView.tokensAdditionalPerWeek * USD_PRICE) / (StakingPool.PoolView.totalStaking * USD_PRICE) / 当前周已过去的天数 * 365
    */

    // 提取收益(使call方法取未提现收益)
    function claim(address _user) public returns (uint256);


    function getPoolView() public view returns(PoolView memory);


    function getUserView(address user) public view returns(UserView memory);
}


### 质押池金库合约

测试地址： 0x44ee3570daEE160eDD9D9F38555D1B3BF7cA5046

contract StakingPoolVault {
    struct PoolView {
        address rewarder; //质押池奖励发放合约
        bool isKilled; // 是否已终止
        uint256 startWeekCursor; // 开始时间
        uint256 weekCursor; // 当前周期时间
        uint256 lastTokenTimestamp; // 最后对周期进行分配token(checkpoint)的时间
        address rewardToken; // 奖励的token
        string rewardTokenName; // 奖励的token名
        string rewardTokenSymbol; // 奖励的token标识
        uint8 rewardTokenDecimals; // 奖励的token小数位
        uint256 lastTokenBalance; // 未分配的token余额
        uint256 tokensPerWeek; // 当前周期基础奖励总额
        uint256 tokensAdditionalPerWeek; // 当前周期附加奖励总额
    }

    // 获取奖励池列表
    function getPoolViews() public view returns(PoolView[] memory ret);


    // 提取所有奖励池的收益
    function claimAll() public;
}


### 空投合约

测试地址： 0x538C77373df7b920D3254c0570eC3E5A2f602Df2

contract Airdrop {

    struct InfoView {
        address rewardToken; // 空投代币地址
        string rewardTokenName; // 空投代币名称
        string rewardTokenSymbol; // 空投代币标识
        uint8 rewardTokenDecimals; // 空投代币小数位
        bool enableClaim; // 是否开启了领取, 开启时才允许领取奖励
        uint superiorPoint; // 邀请一个用户可奖励的积分
        uint256 totalRewardSupply; // 空投代币总量
        uint256 distributedRewards; // 已被领取代币总量
        uint256 totalPoint; // 所有用户的总积分数
        uint256 totalUsers; // 所有用户数
        uint256 registerEndAt; // 注册结束时间, 0代表未开始
    }

    struct UserView {
        uint256 createdAt; // 注册时间, 为0则未注册
        uint basePoint; // 基础积分数
        uint invitePoint; // 邀请用户额外获得的积分数
        uint256 claimed; // 已领取的代币数, 不为0代表已领取
    }

    // 注册, 只有未注册的情况下才可调用
    // @param superior 邀请人
    function register(address superior) public;

    // 领取空投, enableRegister为false时才能领取
    function claim() public;

    // 取用户信息
    function getInfoView() public view returns (InfoView memory)

    // 取合约信息
    function getUserView(address user) public view returns(UserView memory);
}