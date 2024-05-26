// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class Define  {
    //设计分辨率
    public static designResolutionW:number = 750;
    public static designResolutionH:number = 1334;

    //注意 注意 注意 注意 注意 注意 注意 注意 注意 注意 注意 
    public static testState:number = 0;  //注意  1=取测试服务器  非1取正式服务器
    static version:string = "1.2.3";
    
    public static gameId:string = "1001"; //1001 奶粉消消乐
    public static maxRow:number = 10
    public static maxCol:number = 8

    public static blockWidth:number = 82;
    public static blockHeight:number = 82;

    public static blockDropSpeed:number = 1200;
    

    //定的方向枚举
    static left:number = 0;
    static right:number = 1;
    static down:number = 2;
    static up:number = 3;
    static center:number = 4;

    // public static strIp = "https://www.bubblepunk.shop";//外网
    // public static strPort = ""

    // public static strIp = "http://192.168.0.104:"; //内网
    // public static strPort = "8080";

    // //测试自己的服务器
    // public static strIp = "http://192.168.0.106:"; //内网
    // public static strPort = "3000";


    public static strIp = ""; //外网
    public static strPort = "";
   
    //加载资源的类型
    static loadTypePrefab:number = 0;
    static loadTypeFrame:number = 1;

    static viewUrl:string[] = ["MainView","BattleView","EditorView","LoginView","RankingView","ExitView","VictoryView",
                                "LoseView","OverView","SetupView","StartView","TurntableView","ChallengeExitView","ChallengePromptView",
                                "GiftView","ChallengeVictoryView","FriendHelpView","ShowRewardView","ActivetyRuleView","ChallengeLoseView",
                                "ExchangeCodeView","ExchangeCodeRecordView","LipstickView","GoldLackView","LoadingView","DailyRewardView",
                                "BeginView","Guid1View","Guid2View","Guid3View","Guid4View","Guid5View","Guid6View","Guid7View","Guid8View",
                                "Guid9View","Guid10View","ChallengeCountView","PastureView","ShopView","UpgradeView","UpgradeOkView","BuyView",
                                "NoEnoughStarView","UpgradeHouseView","UpgradeHouseOkView","FeedYuView","FeedOkYuView","CollectView",
                                "InviteFriendView","FeedHuaView","FeedNiuView","MusicView","PuzzleView","NoXinView","RenWuView"];

    //界面的ID
    static viewMain:number = 0;                 //消除界面
    static viewBattle:number = 1;               //忽略
    static viewEditor:number = 2;               //关卡编辑器界面
    static viewLogin:number = 3;                //忽略
    static viewRanking:number = 4;              //排行榜
    static viewExit:number = 5;                 //普通关卡中途退出弹框
    static viewVictory:number = 6;              //普通关卡胜利弹框
    static viewLose:number = 7;                 //普通关卡加十步弹框
    static viewOver:number = 8;                 //普通关卡失败弹框
    static viewSetup:number = 9;                //设置界面
    static viewStart:number = 10;               //大厅界面
    static viewTurntable:number = 11;           //转盘界面
    static viewChallengeExit:number = 12;       //挑战赛中途退出弹框
    static viewChallengePrompt:number = 13;     //挑战赛开始弹框
    static viewGift:number = 14;                //新手奖励弹框
    static viewChallengeVictory:number = 15;    //挑战赛胜利框
    static viewFriendHelp:number = 16;          //好友助力弹框
    static viewShowReward:number = 17;          //奖励展示弹框
    static viewActivetyRule:number = 18;        //活动规则弹框
    static viewChallengeLose:number = 19;       //挑战赛加十步弹框
    static viewExchangeCode:number = 20;        //兑换奖品弹框
    static viewExchangeCodeRecord:number = 21;  //奖品兑换码显示弹框
    static viewLipstick:number = 22;            //本期奖品展示弹框
    static viewGoldLack:number = 23;            //挑战赛金币不足弹框
    static viewLoading:number = 24;             //游戏Loading界面
    static viewDailyReward:number = 25;         //每日奖励弹框
    static viewBegin:number = 26;               //普通关卡开始弹框
    static viewGuid1:number = 27;               //新手引导1-10
    static viewGuid2:number = 28;
    static viewGuid3:number = 29;
    static viewGuid4:number = 30;
    static viewGuid5:number = 31;
    static viewGuid6:number = 32;
    static viewGuid7:number = 33;
    static viewGuid8:number = 34;
    static viewGuid9:number = 35;
    static viewGuid10:number = 36;
    static viewChallengeCount:number = 37;       //剩余挑战次数不足弹框
    static viewPasture:number = 38;              //牧场家园界面
    static viewShop:number = 39;                 //牧场家园商店界面
    static viewUpgrade:number = 40;              //花仙子升级弹框
    static viewUpgradeOk:number = 41;            //花仙子升级成功弹框
    static viewBuy:number = 42;                  //购买鲜花弹框
    static viewNoEnoughStar:number=43;           //没有足够星星弹框
    static viewUpgradeHouse:number = 44;         //花仙子升级弹框
    static viewUpgradeHouseOk:number = 45;       //花仙子升级成功弹框
    static viewFeedYu:number = 46;               //浇花弹框
    static viewFeedOkYu:number = 47;             //浇花成功弹框
    static viewCollect:number = 48;              //领取浇花收获金币弹框
    static viewInviteFriend:number = 49;         //邀请好友界面
    static viewFeedHua:number = 50;         //邀请好友界面
    static viewFeedNiu:number = 51;         //邀请好友界面
    static viewMusic:number = 52;           //背景音效选择界面
    static viewPuzzle:number = 53;           //拼图界面
    
    //无体力弹窗
    static viewNoXin:number = 54;
    //任务弹窗
    static viewRenWu:number = 55;

    static datakeyDate:string = 'datakeyDate';
    static dataKeyGold:string = 'dataKeyGold';
    // static dataKeyStar:string = 'dataKeyStar';
    static dataKeyStarArr:string = 'dataKeyStarArr';
    static dataKeyGameTools: string = 'dataKeyGameTools';
    static datakeyLevel:string = 'datakeyLevel';
    static datakeyProp:string = 'datakeyProp';
    static datakeyMusic:string = 'datakeyMusic';
    static datakeySound:string = 'datakeySound';
    static datakeyBrate:string = 'datakeyBrate';
    static datakeyVersion:string = 'datakeyVersion';
    static datakeyFirstLogin:string = "datakeyFirstLogin";
    static datakeyPastureData:string = "pastureData";
    static dataKeyFeedData:string = "feedData";
    static dataKeyGetItem1:string = "getItem1";
    static dataKeyGetItem2:string = "getItem2";
    static dataKeyGetItem3:string = "getItem3";
    static dataKeyGetItem4:string = "getItem4";

    static dataKeyMusicID:string = "datakeymusicID";
    static dataKeyIsLoop:string = "datakeyIsLoop";




    static blockIconArr:string [] = ['shezhi_cuo1','kouhong','xiangshui','fenbing','yanying','zhijiayou','zhangaiwu_huaban_three','zhangaiwu_huaban_two',
                                    'zhangaiwu_huaban_one','zhangaiwu_wuya_three','zhangaiwu_wuya_two','zhangaiwu_wuya_one','zhangaiwu_tengman_three',
                                    'zhangaiwu_tengman_two','zhangaiwu_tengman_one','zhangaiwu_apple','zhangaiwu_bananer','zhangaiwu_orange',
                                    ]; //shezhi_cuo1透明的格子
    static formIconArr:string [] = ['','shoujixingzhuang_shuzi1','shoujixingzhuang_shuzi2','shoujixingzhuang_shuzi3',
                                    'shoujixingzhuang_shuzi4','shoujixingzhuang_shuzi5','shoujixingzhuang_shuzi6'];                       

    static promptSpriteArr:string [] = ['','language_good','language_perfect','language_victory']
    //道具
    static prop_kouhong:number = 1;
    static prop_xiangshui:number = 2;
    static prop_fenbing:number = 3;
    static prop_yanying:number = 4;
    static prop_zhiyayou:number = 5;

    static prop_gold:number = 101; //金币
    static prop_star:number = 103; //星星



    //音效(19)
    static datingyinyue:string = 'datingyinyue';    //datingyinyue-大厅音乐（角色设计界面用一样的背景音乐）
    
    static duoxiao:string [] = ['','duoxiao1','duoxiao2','duoxiao3','duoxiao4','duoxiao5','duoxiao6','duoxiao7']; // 连消1-7
    
    static backgroundmusic:string[]=['datingyinyue','xia','qiu','dong','chun']; //背景音乐
    static sanxiaoyinxiao:string = 'sanxiaoyinxiao'; // sanxiaoyinxiao-三消音效（后期会添加配音）
    static shengliyinxiao:string = 'shengliyinxiao'; //
    static shibaiyinxiao:string = 'shibaiyinxiao';  // 
    static sixiaoyinxiao:string = 'sixiaoyinxiao';  // sixiaoyinxiao-四消音效（后期会添加配音）   
    static UIyinxiao:string = 'UIyinxiao';          // UIyinxiao-UI图标按钮
    static wuxiaoyinxiao:string = 'wuxiaoyinxiao';  // wuxiaoyinxiao-五消音效（后期会添加配音）   
    static xiaochuyinyue:string = 'xiaochuyinyue';  // xiaochuyinyue-消除界面音乐（合成界面用一样的背景音乐)
    static xuanzhongdianjiyinxiao:string = 'xuanzhongdianjiyinxiao';    // xuanzhongdianjiyinxiao-消除过程中的，选中道具移动的点击音效
    static good:string = 'good';
    static perfect:string = 'perfect';
    static victory:string = 'victory';
    static zhongjiang:string = 'zhongjiang';
    static zhuanpan:string = 'zhuanpan';
    static yinyue1:string = 'yinyue1';
    static yinyue2:string = 'yinyue2';

    static gamemusic:string []=['','hanghai','lanse','senglin','yese'];



    static jianzushengji:string = 'jianzushengji';//建筑升级
    
    

    static yindaoSound:string [] = ['','choujiangnaifen','tiaozhansai','sange','sige','xiaochuzishi','wuge','xiaochuzhilv','canjiachoujiang','dianjikaishi','duihuannaifen'];

    

    //动画(24)
    static skeleton_gongxishengli:number = 1   
    static skeleton_hengliexiao:number = 2
    static skeleton_hengshuxiao:number = 3 //四肖
    static skeleton_huodetishi1:number = 4
    static skeleton_huodetishi2:number = 5   
    static skeleton_kuangtishi:number = 6
    static skeleton_shengyubushu1:number = 7
    static skeleton_shengyubushu2:number = 8
    static skeleton_shengyufeixiao1:number = 9
    static skeleton_shengyufeixiao2:number = 10
    static skeleton_tishi1:number = 11
    static skeleton_tishi2:number = 12
    static skeleton_tishi3:number = 13
    static skeleton_tishi4:number = 14 
    static skeleton_tishi5:number = 15  
    static skeleton_xiaoshi:number = 16
    static skeleton_jibixiaoguo1:number = 17
    static skeleton_jibixiaoguo2:number = 18
    static skeleton_qiehuantishi:number = 19

    static skeleton_gongxihuode:number = 20
    static skeleton_zhuanguang1:number = 21
    static skeleton_zhuanguang2:number = 22
    static skeleton_zhuanpandonghua1:number = 23
    static skeleton_zhuanpandonghua2:number = 24

    static skeleton_juesedonghua1:number = 25
    static skeleton_juesedonghua2:number = 26
    static skeleton_juesedonghua3:number = 27

    static skeleton_xiaomao:number = 28
    static skeleton_xiaomao2:number = 29
    static skeleton_lianzi:number = 30
    static skeleton_dianji:number = 31
    static skeleton_zhishi:number = 32
    static skeleton_quanquan:number = 33
    static skeleton_hengshutishi:number = 34
    static skeleton_fenxiangdong1:number = 35
    static skeleton_fenxiangdong2:number = 36
    static skeleton_jiemiandonghua1:number = 37
    static skeleton_jiemiandonghua2:number = 38
    static skeleton_kaishidong1:number = 39
    static skeleton_kaishidong2:number = 40
    static skeleton_fenbing:number =41
    static skeleton_kouhong:number =42
    static skeleton_xiangshui:number =43
    static skeleton_yanying:number =44
    static skeleton_zhijiayou:number =45
    static skeleton_xinyindao:number =46
    static skeleton_xinyindaoright:number =47
    static skeleton_xinyindaodianji:number =48
    static skeleton_kuaisukaishi1:number = 49
    static skeleton_kuaisukaishi2:number = 50
    static skeleton_xinyindaoleft:number =51
    static skeleton_xinyindaoup:number =52
    static skeleton_xingzhuang:number =53
    static skeleton_yidongguai:number =54
    static skeleton_yidongguaisiwang:number =55
    static skeleton_juesedonghua4:number = 56
    static skeleton_juesehe:number = 57
    static skeleton_huaxiao:number = 58
    static skeleton_tengxiao:number = 59
    static skeleton_xiaoniu:number = 60
    static skeleton_update_guang:number = 61



    static skeletonInfo:string [] = ["","gongxishengli","hengliexiao","hengshuxiao","huodetishi1","huodetishi2","kuangtishi","shengyubushu1",
    "shengyubushu2","shengyufeixiao1","shengyufeixiao2","tishi1","tishi2","tishi3","tishi4","tishi5","xiaoshi","jibixiaoguo1","jibixiaoguo2",
    "qiehuantishi","gongxihuode","zhuanguang1","zhuanguang2","zhuanpandonghua1","zhuanpandonghua2","juesedonghua1","juesedonghua2",
    "juesedonghua3","xiaomao","xiaomao2","lianzi","dianji","zhishi","quanquan","hengshutishi","fenxiangdong1","fenxiangdong2","jiemiandonghua1",
    "jiemiandonghua2","kaishidong1","kaishidong2","fenbing","kouhong","xiangshui","yanying","zhijiayou","xinyindao","xinyindaoright",
    "xinyindaodianji","kuaisukaishi1","kuaisukaishi2","xinyindaoleft","xinyindaoup","xingzhuang","yidongguai","yidongguaisiwang","juesedonghua4",
    "juesehe","huaxiao","tengxiao","xiaoniu","update_guang"];




    //static prizeInfo:string[]=["口红实物X1","X300","香水道具X1","再来一次","眼影道具X1","再来一次","指甲油道具X1","X500"]

    static mapMask:string [] = ["","gezi","bao","kouhong","naifen_ditu5","naifen_ditu1","naifen_ditu2","naifen_ditu3","naifen_ditu4","naifen_ditu6"]

    static gameMain:number = -1
    //游戏中
    static gameing:number = 0;
    //游戏收集完成
    static gameCollectFinish:number = 1;
    //游戏下落完成
    static gameBlockDropFinish:number = 2;
    //飞特效
    static gameFlyEffect:number = 3;
    //飞特效下落完成
    static gameFlyEffectDropFinish:number = 4;

    static gameModel_Normal:number = 0; //正常模式
    static gameModel_Challenge:number = 1; //挑战模式

    //static shareDesc1:string = "炫彩口红，轻松消除，把彩虹画在嘴上"
    //static shareDesc1:string = "朋友做的休闲消除游戏，闯三关真的可以抽大牌口红哦"
    static shareDesc1:string = "轻松愉快消消乐，大牌奶粉抽回家。"

    static blockNoneId:number = 0 //空的格子id
}
