import Common from "../common/Common";
import UserInfo from "../UserInfo";
import WXHelper from "../common/WXHelper";
import UIManager from "./UIManager";
import SoundManager from "./SoundManager";
import Define from "../common/Define";
import BlockManager from "./BlockManager";
import LDataLevelsManager from "../datas/LDataLevelsManager";
import TimeTaskManager from "./TimeTaskManager";
import HttpManager from "./HttpManager";
import ResManager from "./ResManager";
import TimeTask from "../common/TimeTask";
import LDataConsumeManager from "../datas/LDataConsumeManager";
import LDataChallengeManager from "../datas/LDataChallengeManager";
import LDataTurntableManager from "../datas/LDataTurntableManager";
import LDataShare from "../datas/LDataShare";
import LDataShareManager from "../datas/LDataShareManager";
import LDataGiftsManager from "../datas/LDataGiftsManager";
import LDataBlockManager from "../datas/LDataBlockManager";
import LDataChallengelevelsManager from "../datas/LDataChallengelevelsManager";
import LDataBannerManager from "../datas/LDataBannerManager";


// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Sprite)
    spDisplay: cc.Sprite = null;//显示子域

    @property(cc.Node)
    nodeUIRoot: cc.Node = null;//UI根节点

    @property(cc.Node)
    nodeGameRoot: cc.Node = null;//暂无使用

    @property(cc.Node)
    nodeSoundRoot: cc.Node = null;//执行播放声音的action

    @property(cc.Node)
    maskRoot: cc.Node = null;//假屏保


    @property(cc.Node)
    nodeEvent: cc.Node = null;//未使用

    @property(cc.SpriteAtlas)
    atlas_block: cc.SpriteAtlas = null;

    @property(cc.SpriteAtlas)
    atlas_block1: cc.SpriteAtlas = null;

    @property
    isEditor: boolean = false;

    @property
    mapInfo: string = "";






    public wxHelper: WXHelper = null
    private static instance: GameManager;
    public static getInstance(): GameManager {
        return GameManager.instance;
    }


    showMask()//暂停
    {
        //console.log("开启待机黑屏")
        Common.nodeMask.active = true;
        //cc.audioEngine.pauseMusic();
        SoundManager.pauseBackGroundSound(true, Common.curMusicRes)
        //cc.audioEngine.setMusicVolume(0.1);
    }

    closeMask()//恢复
    {
        Common.maskTaskTime.resetTotalTime()
        //console.log("关闭待机黑屏")
        Common.nodeMask.active = false;
        //cc.audioEngine.resumeMusic();
        SoundManager.pauseBackGroundSound(false, Common.curMusicRes)
        //cc.audioEngine.setMusicVolume(0.3);
        Common.isMaskTag = false;
    }

    onLoad() {
        console.log("ddd");
    }

    start() {
        //30秒切换一次banner 10 10 11 12 11 4
        Common.changeBannerTaskTime = TimeTaskManager.addTimeTask(30, function () {
            WXHelper.changeBanner();
        }.bind(this), "changeBanner")
        Common.changeBannerTaskTime.setPause(true)



        SoundManager.checkLoopMusic();
        console.log("开始检测循环音乐时间")





        Common.addClickEvent(this.maskRoot, this.closeMask.bind(this), false, null, false, this.closeMask.bind(this));

        Common.promptTaskTime = TimeTaskManager.addTimeTask(10, function () {
            //这里执行提示
            if (Common.isPromptTag) {
                return
            }
            BlockManager.getInstance().eliminateSuggest()
            //console.log("提示 ...................")
            Common.isPromptTag = true
        }.bind(this))


        Common.maskTaskTime = TimeTaskManager.addTimeTask(90, function () {
            //这里执行提示
            if (Common.isMaskTag) {
                return
            }
            this.showMask();
            //BlockManager.getInstance().eliminateSuggest()
            //console.log("待机 ...................")
            Common.isMaskTag = true
        }.bind(this))


        this.wxHelper = new WXHelper();
        this.wxHelper.initWXHelper();
        this.wxHelper.display = this.spDisplay


        //保存基础节点
        Common.nodeUiRoot = this.nodeUIRoot
        Common.nodeGameRoot = this.nodeGameRoot
        Common.nodeSoundRoot = this.nodeSoundRoot
        Common.nodeMask = this.maskRoot;
        Common.atlasBlock = this.atlas_block;
        Common.atlasBlock1 = this.atlas_block1;
        Common.isEditor = this.isEditor;
        Common.mapInfo = this.mapInfo;

        GameManager.instance = this

        //初始化基础表
        LDataLevelsManager.GetDataById(0)
        LDataConsumeManager.GetDataById(0)
        LDataChallengeManager.GetDataById(0)
        LDataTurntableManager.GetDataById(0)
        LDataShareManager.GetDataById(0)
        LDataGiftsManager.GetDataById(0)
        LDataBlockManager.GetDataById(0)
        LDataChallengelevelsManager.GetDataById(0)
        LDataBannerManager.GetDataById(0);

        Common.maxLevel = LDataLevelsManager.dataList.length - 1

        //UserInfo.clearAllDatas();
        UserInfo.loadAllData();
        //UserInfo.userLevel = 51;//14;//14; //5


        console.log("灌灌灌灌孤寡孤寡孤寡嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎");

        //初始化
        WXHelper.initRewardedVideoAd();

        UserInfo.checkVersion(this.init.bind(this));


        // let shareRes:string = "textures/shangxian_fenxiang"

        // let frame  = 
        // ResManager.loadFrame("textures/shangxian_fenxiang",function(spFrame){

        //     this.node.children[0].getComponent(cc.Sprite).spriteFrame = spFrame


        // }.bind(this));
        // console.log("sssssss")
        // console.log(Math.floor(-131.99999999994)) 

    }

    init() {



        //cc.audioEngine.setMusicVolume(0.3)




        Common.resetDatas();


        //WXHelper.showBannder(true);

        //界面能否显示广告按钮
        //WXHelper.isLoadVideoSuccessful
        //接广告
        // WXHelper.showVideo(function(state){
        //     if(state == 1){

        //     }
        // }.bind(this))


        //UserInfo.setItem(Define.datakeyLevel,3)
        if (UserInfo.isFirstLogin()) {
            UserInfo.addPropByIdAndCount(1, 30)
            UserInfo.addPropByIdAndCount(2, 30)
            UserInfo.addPropByIdAndCount(3, 30)
            UserInfo.addPropByIdAndCount(4, 30)
            UserInfo.addPropByIdAndCount(5, 30)
            UserInfo.addGold(3888)
            UserInfo.changeLoginState()
        }

        if (Common.isEditor) {
            UIManager.getInstance().showView(Define.viewEditor);
        } else {
            UIManager.getInstance().showView(Define.viewStart);


            //UIManager.getInstance().showView(Define.viewTurntable)
        }


        // HttpManager.getInstance().httpGets("http://192.168.0.106:3000/users","",function(res){
        //     console.log("0000000000000000000000")
        //     console.log(res)
        // }.bind(this))


        // HttpManager.getInstance().httpPost('http://192.168.0.106:3000/users',"",function(ttt){
        //     console.log("111111111111111111")
        //     console.log(ttt)
        // }.bind(this))


    }

    update(dt) {
        TimeTaskManager.updateTime(dt)
        this.wxHelper.update(dt)
        BlockManager.getInstance().updateTime(dt)

        if (Common.isCanMoveBlockTag && !Common.isHaveBlockDroping && !Common.isPlayAni && Common.gameProgress == Define.gameing && UIManager.getInstance().isShow(Define.viewMain)) {

        } else {
            Common.maskTaskTime.resetTotalTime()
            Common.promptTaskTime.resetTotalTime()
        }



        // if(Common.isCanMoveBlockTag && !Common.isHaveBlockDroping && !Common.isPlayAni&&Common.gameProgress == Define.gameing && UIManager.getInstance().isShow(Define.viewMain)){

        // }else if(UIManager.getInstance().isShow(Define.viewStart)||UIManager.getInstance().isShow(Define.viewOver)||UIManager.getInstance().isShow(Define.viewVictory))    
        // {                  
        // }else {

        // }


    }
}
