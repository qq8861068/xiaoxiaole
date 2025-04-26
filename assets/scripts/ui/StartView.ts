import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import GameManager from "../manager/GameManager";
import UserInfo from "../UserInfo";
import SoundManager from "../manager/SoundManager";
import WXHelper from "../common/WXHelper";
import HttpManager from "../manager/HttpManager";
import LDataConsume from "../datas/LDataConsume";
import LDataConsumeManager from "../datas/LDataConsumeManager";
import GuidanceMgr from "../manager/GuidanceMgr";
import PastureDataMgr from "../manager/PastureDataMgr";
import LevelItem from "../ui2/LevelItem";
import EventClass from "../manager/EventClass";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class StartView extends ViewBase {

    @property(cc.Node)
    btn_setup: cc.Node = null;

    @property(cc.Node)
    btn_rank: cc.Node = null;

    @property(cc.Node)
    btn_challenge: cc.Node = null;

    @property(cc.Label)
    text_gold: cc.Label = null;

    @property(cc.Label)
    text_star: cc.Label = null;

    //体力文本
    @property(cc.Label)
    text_xin: cc.Label = null;

    @property(cc.Node)
    kuaisukaishinode: cc.Node = null;

    isFrist: boolean = true;

    @property(cc.ScrollView) ScrollView: cc.ScrollView = null;
    @property(cc.Node) all_levels_root: cc.Node = null;
    @property(cc.Node) head_row: cc.Node = null;
    @property(cc.Label) start_btn_label: cc.Label = null;

    @property(cc.Node) xin_add_btn: cc.Node = null;

    //用户头像与昵称
    @property(cc.Sprite) main_head_show: cc.Sprite = null;
    @property(cc.Sprite) row_main_head_show: cc.Sprite = null;
    @property(cc.Label) main_head_name: cc.Label = null;

    //弹窗预制体
    @property(cc.Prefab) tiliPop: cc.Prefab = null;

    isCanClickchallenge: boolean = true;
    isCanClicklottery: boolean = true;

    protected start(): void {
        EventClass.getInstance().addEventListener("changtili", this.changtili, this)
    }
    protected onDestroy(): void {
        EventClass.getInstance().removeEventListener("changtili", this.changtili, this)
    }
    changtili() {
        this.text_xin.string = UserInfo.userXin > 999 ? "999+" : UserInfo.userXin.toString();
    }
    refreshView(isFristRefresh: boolean = false) {

        this.removeAllAni();
        //处理用户传入的头像和昵称
        this.dealUserHeadName();

        this.isCanClickchallenge = true;
        this.isCanClicklottery = true;

        this.isFrist = isFristRefresh;
        // this.fenxiangdongnode.runAction(cc.sequence(cc.callFunc(function(){
        //     Common.playSkeletonById(Define.skeleton_fenxiangdong1,this.fenxiangdongnode,0,0,null,false,false)
        // }.bind(this)),cc.delayTime(3),cc.callFunc(function(){
        //     this.fenxiangdongnode.removeAllChildren(true);
        //     Common.playSkeletonById(Define.skeleton_fenxiangdong2,this.fenxiangdongnode,0,0,null,false,false)
        // }.bind(this)),))

        // Common.playSkeletonById(Define.skeleton_fenxiangdong1,this.fenxiangdongnode,0,0,function(effectNode:cc.Node){                   
        //     effectNode.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
        //         effectNode.active=false;
        //         Common.playSkeletonById(Define.skeleton_fenxiangdong2,this.fenxiangdongnode,0,0,null,false,false)
        //     }.bind(this))))
        // }.bind(this),false,false)

        // Common.playSkeletonById(Define.skeleton_jiemiandonghua1, this.jiemiandonghuanode, 0, 0, function (effectNode: cc.Node) {
        //     effectNode.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
        //         let mmm = effectNode;
        //         //this.fenxiangdongnode.active=false;
        //         Common.playSkeletonById(Define.skeleton_jiemiandonghua2, this.jiemiandonghuanode, 0, 0, function (effectNode: cc.Node) {
        //             mmm.active = false;
        //             //this.fenxiangdongnode.active=true;
        //         }.bind(this), false, false)
        //     }.bind(this))))
        // }.bind(this), false, false)


        // Common.playSkeletonById(Define.skeleton_fenxiangdong1, this.fenxiangdongnode, 0, 0, function (effectNode: cc.Node) {
        //     effectNode.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
        //         let mmm = effectNode;
        //         //this.fenxiangdongnode.active=false;
        //         Common.playSkeletonById(Define.skeleton_fenxiangdong2, this.fenxiangdongnode, 0, 0, function (effectNode: cc.Node) {
        //             mmm.active = false;
        //             //this.fenxiangdongnode.active=true;
        //         }.bind(this), false, false)
        //     }.bind(this))))
        // }.bind(this), false, false)


        // Common.playSkeletonById(Define.skeleton_kaishidong1, this.kaishidongnode, 0, 0, function (effectNode: cc.Node) {
        //     effectNode.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
        //         let mmm = effectNode;
        //         //this.fenxiangdongnode.active=false;
        //         Common.playSkeletonById(Define.skeleton_kaishidong2, this.kaishidongnode, 0, 0, function (effectNode: cc.Node) {
        //             mmm.active = false;
        //             //this.fenxiangdongnode.active=true;
        //         }.bind(this), false, false)
        //     }.bind(this))))
        // }.bind(this), false, false)


        // Common.playSkeletonById(Define.skeleton_kuaisukaishi1, this.kuaisukaishinode, 0, 0, function (effectNode: cc.Node) {
        //     effectNode.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
        //         let mmm = effectNode;
        //         //this.fenxiangdongnode.active=false;
        //         Common.playSkeletonById(Define.skeleton_kuaisukaishi2, this.kuaisukaishinode, 0, 0, function (effectNode: cc.Node) {
        //             mmm.active = false;
        //             //this.fenxiangdongnode.active=true;
        //         }.bind(this), false, false)
        //     }.bind(this))))
        // }.bind(this), false, false)



        // Common.playSkeletonById(Define.skeleton_jiemiandonghua1,this.fenxiangdongnode,0,0,function(effectNode:cc.Node){                   
        //     effectNode.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
        //         let mmm=effectNode;
        //         this.fenxiangdongnode.active=false;
        //         Common.playSkeletonById(Define.skeleton_jiemiandonghua2,this.fenxiangdongnode,0,0,function(effectNode:cc.Node){
        //             mmm.active=false;
        //             this.fenxiangdongnode.active=true;
        //         }.bind(this),false,false)
        //     }.bind(this))))
        // }.bind(this),false,false)

        // Common.playSkeletonById(Define.skeleton_kaishidong1,this.kaishidongnode,0,0,function(effectNode:cc.Node){                   
        //     effectNode.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
        //         effectNode.active=false;
        //         Common.playSkeletonById(Define.skeleton_kaishidong2,this.kaishidongnode,0,0,null,false,false)
        //     }.bind(this))))
        // }.bind(this),false,false)


        // this.jiemiandonghuanode.runAction(cc.sequence(cc.callFunc(function(){
        //     Common.playSkeletonById(Define.skeleton_jiemiandonghua1,this.jiemiandonghuanode,0,0,null,false,false)
        // }.bind(this)),cc.delayTime(3),cc.callFunc(function(){
        //     this.jiemiandonghuanode.removeAllChildren(true);
        //     Common.playSkeletonById(Define.skeleton_jiemiandonghua2,this.jiemiandonghuanode,0,0,null,false,false)
        // }.bind(this)),))

        // this.kaishidongnode.runAction(cc.sequence(cc.callFunc(function(){
        //     Common.playSkeletonById(Define.skeleton_kaishidong1,this.kaishidongnode,0,0,null,false,false)
        // }.bind(this)),cc.delayTime(3),cc.callFunc(function(){
        //     this.kaishidongnode.removeAllChildren(true);
        //     Common.playSkeletonById(Define.skeleton_kaishidong2,this.kaishidongnode,0,0,null,false,false)
        // }.bind(this)),))

        //Common.playSkeletonById(Define.skeleton_hengshutishi,Common.nodeSpineRoot,posList[index].getScenePos().x,posList[index].getScenePos().y,null,false,true)

        // Common.playSkeletonById(Define.skeleton_jiemiandonghua1,this.fenxiangdongnode,0,0,null,false,true)
        // Common.playSkeletonById(Define.skeleton_kaishidong1,this.fenxiangdongnode,0,0,null,false,true)

        this.refreshAllLevelItems()
        this.refreshPropInfo()
        this.refreshScrollPosition()


        // SoundManager.pauseBackGroundSound(true,Define.xiaochuyinyue)
        // SoundManager.pauseBackGroundSound(false,Define.datingyinyue)
        if (UserInfo.isLoop == 1) {
            SoundManager.pauseBackGroundSound(false, Define.gamemusic[1], false);
            // if(Common.changeMusicTaskTime!=null){
            //     Common.changeMusicTaskTime.setPause(false)
            // }            
        } else if (UserInfo.musicID == 0) {
            SoundManager.pauseBackGroundSound(false, Define.backgroundmusic[0]);
        } else {
            SoundManager.pauseBackGroundSound(false, Define.gamemusic[UserInfo.musicID]);
        }


        if (isFristRefresh) {

        }

        //  isFristRefresh = false

        if (isFristRefresh) {
            // if(UserInfo.isFirstLogin()){
            //     UIManager.getInstance().showView(Define.viewGift)
            // }

            // if(UserInfo.getDayRewardCount()<30)
            // {
            //     UIManager.getInstance().showView(Define.viewDailyReward);
            // }

            // this.btn_xinshou.active = true;


            // if (!UserInfo.isFirstLogin() && UserInfo.getDayRewardCount() >= 30) {
            //     this.btn_xinshou.active = false;
            // }

            // console.log("展示口红介绍")
            // UIManager.getInstance().showView(Define.viewLipstick);

            //引导入口
            // if(this.checkPropAndGoldIsEnough()==1)
            // {//金币不足
            //     // UIManager.getInstance().showView(Define.viewGoldLack,function()
            //     // {
            //     //     UIManager.getInstance().sendMessage(Define.viewGoldLack,"jingbi",this)
            //     // }.bind(this));

            // }else if(this.checkPropAndGoldIsEnough()==2)
            // {//道具不足
            //     // UIManager.getInstance().showView(Define.viewGoldLack,function()
            //     // {
            //     //     UIManager.getInstance().sendMessage(Define.viewGoldLack,"daoju",this)
            //     // }.bind(this));

            // }else if(this.checkPropAndGoldIsEnough()==3)
            // {//金币道具充足

            // }else{

            // }            
        }


        // HttpManager.getInstance().checkLottery(function(info){
        //     if(info != null){
        //         Common.userLotteryResidueCount = info.residue;
        //     }
        // }.bind(this))

        // this.items_mask.active = false;
        // this.items_on_off.children[0].active = false;
        // this.items_on_off.children[1].active = true;

        HttpManager.getInstance().getGameAddress();
    }


    removeAllAni() {
        this.kuaisukaishinode.removeAllChildren(true);
    }
    //检测是否有足够的道具
    checkPropAndGoldIsEnough() {
        let id: number = Common.userPassChallengeCount > LDataConsumeManager.dataList.length - 1 ? LDataConsumeManager.dataList.length - 1 : Common.userPassChallengeCount
        let data: LDataConsume = LDataConsumeManager.GetDataById(id)
        //this.data = data
        if (data == null) {
            console.log("数据错误。。。。。。。。。。。。")
            return
        }

        if (UserInfo.userGold < data.gold) {
            //金币不足Todo:
            //Common.showPrompt("金币不足!")
            return 1
        }

        let arrInfo: string[] = data.item.split(";")
        for (let index = 0; index < arrInfo.length; index++) {
            let info: string[] = arrInfo[index].split(",")
            let id: number = Number(info[0])
            let count: number = Number(info[1])
            let haveCount: number = UserInfo.getPropCountById(id)
            if (haveCount < count) {
                return 2
            }
        }
        return 3
    }
    //刷新关卡 levelItem
    refreshAllLevelItems() {
        const levelUnLock = UserInfo.userLevel;
        const userStarArr = UserInfo.userStarArr;
        for (let i = 0; i < this.all_levels_root.childrenCount; i++) {
            const comp = this.all_levels_root.children[i].getComponent(LevelItem);
            const level = i + 1;
            if (levelUnLock >= level) {
                comp.isUnLock = true;
                comp.level = level;
                comp.starCount = userStarArr[level] || 0;
                comp.refresh();
            }
        }
    }
    //根据当前关卡，滚动对应位置
    refreshScrollPosition() {
        const levelUnLock = UserInfo.userLevel;
        const child = this.all_levels_root.children[levelUnLock - 1];
        const posx = child.x;
        const posy = child.y;
        this.head_row.stopAllActions();
        this.head_row.x = posx;
        this.head_row.y = posy + 130;
        this.head_row.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1, 0, -20), cc.moveBy(1, 0, 20))));
        this.scheduleOnce(() => {
            // -1334是正好滚动长度少一个屏幕高，350是以底部为标准
            this.ScrollView.scrollToOffset(cc.v2(0, this.ScrollView.content.height - 1334 - posy + 350), 0);
        }, 0);
        // console.log(posy)
        // this.ScrollView.node.on('scrolling', () => {
        //     console.log(this.ScrollView.getScrollOffset().y)
        // })
    }
    //刷新道具信息
    refreshPropInfo() {

        // this.hongdian.active = Common.userLotteryResidueCount >= 1 ? true : false;


        // let goldCount:string=UserInfo.userGold.toString();
        // if(UserInfo.userGold>999999)
        // {
        //     goldCount="999999+";
        // }
        // this.text_gold.string = goldCount.toString();
        this.text_gold.string = UserInfo.userGold > 999999 ? "999999+" : UserInfo.userGold.toString();
        this.text_xin.string = UserInfo.userXin > 999 ? "999+" : UserInfo.userXin.toString();
        const starCount = UserInfo.userStarArr.reduce((p, c) => p + c, 0);
        this.text_star.string = starCount > 999 ? "999+" : starCount.toString();
        this.start_btn_label.string = `${UserInfo.userLevel}`;
    }
    public changxin() {
        this.text_xin.string = UserInfo.userXin > 999 ? "999+" : UserInfo.userXin.toString();
    }
    dealUserHeadName() {
        //本地测试，不会跨域。接入头像跨域问题需要接入方开跨域自己解决
        // const headUrl = 'http://192.168.0.115:5500/headxx12.png'
        // const headUrl = 'https://www.kuokuo666.com/test/png/headxx12.png';
        const headUrl = '';
        const name = '游戏玩家';

        this.main_head_name.string = name;

        if (!headUrl) {
            console.log('未传入头像url')
            return;
        }
        cc.loader.load(headUrl, (err, texture) => {
            if (err) {
                console.error(err);
                return;
            }
            // console.log(texture)
            const sf = new cc.SpriteFrame(texture);
            this.main_head_show.spriteFrame = sf;
            this.main_head_show.node.width = 100;
            this.main_head_show.node.height = 100;

            this.row_main_head_show.spriteFrame = sf;
            this.row_main_head_show.node.width = 100;
            this.row_main_head_show.node.height = 100;
        });
    }

    //点击点击事件 //只调用一次
    addEvent() {
        Common.addClickEvent(this.btn_setup, this.onClick.bind(this));
        Common.addClickEvent(this.btn_rank, this.onClick.bind(this));
        Common.addClickEvent(this.btn_challenge, this.onClick.bind(this));

        //Common.addClickEvent(this.btn_go,this.onClick.bind(this)); 
        for (let i = 0; i < this.all_levels_root.childrenCount; i++) {
            Common.addClickEvent(this.all_levels_root.children[i], this.onClick.bind(this));
        }

        Common.addClickEvent(this.xin_add_btn, this.onClick.bind(this));
    }

    onClick(tag: string) {
        if (tag == "btn_start") {
            GuidanceMgr.getInstance().closeGuid();
        } else if (GuidanceMgr.getInstance().isShowing) {
            return;
        }
        if (tag.indexOf('level_item_') !== -1) {
            //level_item_1   level_item_66
            const levelStr = tag.split('level_item_')[1];
            const level = Number(levelStr);
            const childIndex = level - 1;
            const comp = this.all_levels_root.children[childIndex].getComponent(LevelItem);
            if (!comp.isUnLock) {
                return;
            }
            // console.log(level);

            Common.gameModel = Define.gameModel_Normal;
            //用户可能点击之前的关卡
            Common.mapLevel = level;
            UIManager.getInstance().showView(Define.viewBegin);

        } else if (tag == "xin_add_btn") {
            //展示获取体力的弹窗
            // UIManager.getInstance().showView(Define.tiliPpo);
            let pop = cc.instantiate(this.tiliPop)
            pop.parent = this.node

        } else if (tag == "btn_setup") {
            //UIManager.getInstance().showView(Define.viewSetup)

            UIManager.getInstance().showView(Define.viewMusic)
        } else if (tag == "btn_rank") {
            UIManager.getInstance().showView(Define.viewRanking)
        } else if (tag == "btn_share") {

            UIManager.getInstance().showView(Define.viewFriendHelp)

            //UIManager.getInstance().showView(Define.viewInviteFriend)
        } else if (tag == "btn_exchange") {
            UIManager.getInstance().showView(Define.viewExchangeCode)
        } else if (tag == "btn_start") {

            if (this.isCanClickchallenge) {
                this.isCanClickchallenge = false;
                HttpManager.getInstance().checkLottery(function (info) {
                    if (info != null) {
                        console.log("info.residue = " + info.residue.toString())
                        console.log("info.amount = " + info.amount.toString()) //今日抽奖次数
                        Common.userLotteryCount = info.amount //已经抽奖的次数
                        Common.userLotteryResidueCount = info.residue //剩余抽奖的次数
                        console.log("剩余抽奖的次数:" + Common.userLotteryResidueCount);
                        Common.userPassChallengeCount = info.challenge_success //成功挑战的次数
                        Common.userMaxChallengeCount = info.maxChallenge
                        console.log("成功挑战的次数:" + Common.userPassChallengeCount);
                        UIManager.getInstance().showView(Define.viewChallengePrompt)
                    }
                    this.isCanClickchallenge = true;
                }.bind(this))
            }
            // Common.gameModel = Define.gameModel_Normal
            // UIManager.getInstance().showView(Define.viewMain,function(){
            //     UIManager.getInstance().hideView(Define.viewStart)
            // }.bind(this))
        } else if (tag == "btn_server") {
            WXHelper.openCustomerServiceConversation()
        } else if (tag == "btn_challenge") {
            Common.gameModel = Define.gameModel_Normal
            //按最新的关卡
            Common.mapLevel = UserInfo.userLevel;
            //测试代码
            UIManager.getInstance().showView(Define.viewBegin)

            // UIManager.getInstance().showView(Define.viewMain,function(){
            //     UIManager.getInstance().hideView(Define.viewStart)
            // }.bind(this))

            // HttpManager.getInstance().checkLottery(function(info){
            //     if(info != null){
            //         console.log("info.residue = " + info.residue.toString())
            //         console.log("info.amount = " + info.amount.toString()) //今日抽奖次数
            //         Common.userLotteryCount = info.amount //已经抽奖的次数
            //         Common.userLotteryResidueCount = info.residue //剩余抽奖的次数
            //         Common.userPassChallengeCount = info.challenge_success //成功挑战的次数           
            //         UIManager.getInstance().showView(Define.viewChallengePrompt)
            //     }
            // }.bind(this))

            // Common.userPassChallengeCount = 1
            // UIManager.getInstance().showView(Define.viewChallengePrompt)
        }
    }
    //只调用一次
    initView() {
    }

    setItemCount(itemNode: cc.Node, count: number) {
        let countlab: string = count.toString();
        if (count > 999) {
            countlab = "999+";
        }
        itemNode.children[2].getComponent<cc.Label>(cc.Label).string = countlab;
    }

    //额外的事件调用
    message(tag: string = "defualt", args: any = null) {
        if (tag == "refreshPropInfo") {
            this.refreshPropInfo();
        } else if (tag == "yindao") {
        } else if (tag == "refreshInfo") {
            this.text_gold.string = UserInfo.userGold > 999999 ? "999999+" : UserInfo.userGold.toString();
            this.text_xin.string = UserInfo.userXin > 999 ? "999+" : UserInfo.userXin.toString();
            const starCount = UserInfo.userStarArr.reduce((p, c) => p + c, 0);
            this.text_star.string = starCount > 999 ? "999+" : starCount.toString();
        }
    }
}