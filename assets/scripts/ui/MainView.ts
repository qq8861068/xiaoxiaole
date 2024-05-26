import ViewBase from "./ViewBase";
import ResManager from "../manager/ResManager";
import Common from "../common/Common";
import BlockManager from "../manager/BlockManager";
import SoundManager from "../manager/SoundManager";
import Define from "../common/Define";
import Block from "../Block";
import UIManager from "../manager/UIManager";
import UserInfo from "../UserInfo";
import WXHelper from "../common/WXHelper";
import FlyEffect from "../FlyEffect";
import LDataChallengeManager from "../datas/LDataChallengeManager";
import GuidanceMgr from "../manager/GuidanceMgr";

const {ccclass, property} = cc._decorator;

class CollectInfo{
    node:cc.Node;
    blockId:number;
    curCount:number;
    maxCount:number;
    constructor(node:cc.Node,blockId:number,curCount:number,maxCount:number){
        this.node = node;
        this.blockId = blockId;
        this.curCount = curCount;
        this.maxCount = maxCount;
    }
}

@ccclass
export default class MainView extends ViewBase {


    @property(cc.Node)
    node_blockRoot: cc.Node = null;

    @property(cc.Node)
    node_items: cc.Node = null;

    @property(cc.Node)
    node_item: cc.Node = null;

    @property(cc.Label)
    text_step: cc.Label = null;

    @property(cc.Label)
    text_level: cc.Label = null;

    @property(cc.Label)
    text_gold: cc.Label = null;

    @property(cc.Node)
    btn_back: cc.Node = null;

    @property(cc.Node)
    node_blockBg: cc.Node = null;

    @property(cc.Node)
    node_spineRoot: cc.Node = null;

    @property(cc.Node)
    node_promptRoot: cc.Node = null;

    @property(cc.Node)
    node_selectedIcon: cc.Node = null;

    @property(cc.Sprite)
    sp_maskBg: cc.Sprite = null;
    
    @property(cc.Node)
    node_mask: cc.Node = null;

    @property(cc.Node)
    node_bgRoot: cc.Node = null;

    @property(cc.Node)
    xiaochu_niu: cc.Node = null;

    @property(cc.Node)
    ceshi_btn: cc.Node = null;

    //锤子，横竖消除道具
    @property(cc.Node) btn_game_tool_chui: cc.Node = null;
    @property(cc.Label) btn_game_tool_chui_label: cc.Label = null;
    @property(cc.Node) btn_game_tool_heng: cc.Node = null;
    @property(cc.Label) btn_game_tool_heng_label: cc.Label = null;
    @property(cc.Node) btn_game_tool_shu: cc.Node = null;
    @property(cc.Label) btn_game_tool_shu_label: cc.Label = null;

    @property(cc.Node) game_tool_zhezhao_chui: cc.Node = null;
    @property(cc.Node) game_tool_zhezhao_heng: cc.Node = null;
    @property(cc.Node) game_tool_zhezhao_shu: cc.Node = null;

    //星星显示的进度条 step 改变时触发
    // VictoryView 中的星星判断是 大于8步算三星，大于5步算二星
    //星星位置应该也跟配置进行变化，最好根据配置来
    @property(cc.Node) main_head_progress: cc.Node = null;
    @property([cc.Node]) main_head_stars: cc.Node[] = [];

    shengyubushu2:cc.Node = null;

    collectInfo:CollectInfo [] = []

    collectPos:cc.Vec2 [] = []

    flyBlockCacheList:Block[] = []

    //isadd5ed:boolean = false;

    blockBgEffect:cc.Node [] = [] 

    refreshView(isFristRefresh:boolean = false){
        //测试用
        // (window as any).CommonTest = Common;
        
        Common.userGetgold = UserInfo.userGold;

        Common.curSelectBlock = null
        Common.oldSelectBlock = null

        //根据步数安排进度条星星位置
        const allStep = Common.curLevelData.step;
        const x0 = (allStep - 8) / allStep * 128;
        this.main_head_stars[0].x = x0;
        const x1 = (allStep - 5) / allStep * 128;
        this.main_head_stars[1].x = x1;

        Common.DaoJuSum.splice(0,Common.DaoJuSum.length);
        for(let i=0;i<19;i++){
            Common.DaoJuSum[i]=0;
        }
        console.log("*************************开始统计步数和道具消除情况**********************")

        // SoundManager.pauseBackGroundSound(true,Define.datingyinyue)
        // SoundManager.pauseBackGroundSound(false,Define.xiaochuyinyue)

        //SoundManager.playBackGroundMusic(Define.backgroundmusic[1]);
        //this.isadd5ed = false;
        //this.text_gold.string = UserInfo.userGold.toString();
        this.text_gold.string = UserInfo.userGold>999999?"999999+":UserInfo.userGold.toString();

        this.btn_game_tool_chui_label.string = `${UserInfo.gameTools[0]}`
        this.btn_game_tool_heng_label.string = `${UserInfo.gameTools[1]}`
        this.btn_game_tool_shu_label.string = `${UserInfo.gameTools[2]}`

        

        //鹤待机动画
        //this.node_juesehe.removeAllChildren(true);
        // Common.playSkeletonById(Define.skeleton_juesehe,this.node_juesehe,0,0,function(effectNode:cc.Node){
        //     effectNode.name="juesehe"
        //     effectNode.getComponent(sp.Skeleton).setAnimation(0,"1daiji", true);
        // }.bind(this),false,false);

        // let mmm=this.node_juese.children[0];
        //     Common.playSkeletonById(Define.skeleton_juesedonghua3,this.node_juese,0,0,function(effectNode:cc.Node){
        //         mmm.active=false;
        //     }.bind(this),false,false);
        // Common.playSkeletonById(Define.skeleton_kuaisukaishi1,this.kuaisukaishinode,0,0,function(effectNode:cc.Node){                   
        //     effectNode.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
        //         let mmm=effectNode;
        //         //this.fenxiangdongnode.active=false;
        //         Common.playSkeletonById(Define.skeleton_kuaisukaishi2,this.kuaisukaishinode,0,0,function(effectNode:cc.Node){
        //             mmm.active=false;
        //             //this.fenxiangdongnode.active=true;
        //         }.bind(this),false,false)
        //     }.bind(this))))
        // }.bind(this),false,false)

        //let effect=this.node.getChildByName("juesedonghua");
        // Common.playSkeletonById(Define.skeleton_juesedonghua1,this.node_juese,0,0,function(effectNode:cc.Node){
        //     effectNode.name="juesedonghua"
        //     effectNode.getComponent(sp.Skeleton).setAnimation(0,"1ruchang", false);

        //     effectNode.runAction(cc.sequence(cc.delayTime(3.65),cc.callFunc(function(){               
        //         effectNode.getComponent(sp.Skeleton).setAnimation(0, "2daiji", true);
        //     }.bind(this))))
        // }.bind(this),false,false);


        this.node_selectedIcon.setPosition(10000,10000);
        this.node_selectedIcon.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5))));


        Common.resetDatas()

        if(Common.gameModel == Define.gameModel_Normal){
            this.xiaochu_niu.active=false;
            //let level:number = UserInfo.userLevel>Common.maxLevel?Common.getRandom(38,Common.maxLevel+1):UserInfo.userLevel;
            let level:number=Common.mapLevel;

            // let aa=level%3+1;
            // //console.log("播放了背景音乐"+aa);

            // SoundManager.playBackGroundMusic(Define.backgroundmusic[aa]);
            
            this.text_level.string = `第${UserInfo.userLevel.toString()}关`;

            if(UserInfo.userLevel>Common.maxLevel){
                WXHelper.addTotalEvent("关卡等级 : ",UserInfo.userLevel.toString())
            }else{
                WXHelper.addTotalEvent("关卡等级 : ",level.toString())
            }
            BlockManager.getInstance().initAllBlocks(level,this.node_blockBg)
            this.initLevelInfo()

        }else if(Common.gameModel == Define.gameModel_Challenge){
            // WXHelper.addTotalEvent("挑战赛 : ",Common.challengeLevel.toString())
            // this.xiaochu_niu.active =false;

            // let strArr:string [] = LDataChallengeManager.GetDataById(Common.challengeLevel).level.split(";")
            // let level = Number(strArr[Common.getRandom(0,strArr.length)])
            // //-----guid-------
            // let curBig=GuidanceMgr.getInstance().getBigStepById(3);
            // let fbig=GuidanceMgr.getInstance().getFinishedBigStep();
            // if(curBig===fbig+1){
            //     level=1;
            // }
            // BlockManager.getInstance().initAllBlocks(level,this.node_blockBg,true)
            // this.initLevelInfo()

            //临时测试
            //UIManager.getInstance().showView(Define.viewGuid3);
        }

        
        let tempStrArr:string [] = Common.curLevelData.mapImg.split(";")
        let mapId:number = Number(tempStrArr[Common.getRandom(0,tempStrArr.length)])



        //let tempArr:string [] = Common.curLevelData.music.split(";")
        let musicId:number =  Common.curLevelData.music+1;
        // console.log("mapId::"+mapId);
        // let aa=mapId+1;  
        // if(aa==5)
        // {
        //     let tempArr:string [] = Common.curLevelData.music.split(";")
        //     let mapId:number = Number(tempStrArr[Common.getRandom(0,tempStrArr.length)])

        //     aa=1;
        // }
        
        
        //console.log("aa::"+aa);

        if(UserInfo.isLoop==1){
            // if(Common.changeMusicTaskTime!=null){
            //     Common.changeMusicTaskTime.setPause(false)
            // }
        }else if(UserInfo.musicID==0){
            SoundManager.pauseBackGroundSound(false,Define.backgroundmusic[musicId]);
        }else{
            SoundManager.pauseBackGroundSound(false,Define.gamemusic[UserInfo.musicID]);
        }


        //SoundManager.pauseBackGroundSound(false,Define.backgroundmusic[musicId]);

        for (let index = 0; index < this.node_bgRoot.childrenCount; index++) {
            if(index == mapId){
                this.node_bgRoot.children[index].active = true
            }else{
                this.node_bgRoot.children[index].active = false
            }
        }
    }

    addEvent(){
        Common.addClickEvent(this.btn_back,this.onClick.bind(this));
        Common.addClickEvent(this.ceshi_btn,this.onClick.bind(this));
        Common.addClickEvent(this.btn_game_tool_chui, this.onClick.bind(this));
        Common.addClickEvent(this.btn_game_tool_heng, this.onClick.bind(this));
        Common.addClickEvent(this.btn_game_tool_shu, this.onClick.bind(this));

        //道具的使用
        this.game_tool_zhezhao_chui.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            const touchPos = event.getLocation();
            const pos = this.game_tool_zhezhao_chui.parent.convertToNodeSpaceAR(touchPos);
            const [row, col] = Common.getRowColByBlockPos(pos.x, pos.y);
            console.log(row, col)
            const block = BlockManager.getInstance().getBlockByRowCol(row, col);
            if (block) {
                BlockManager.getInstance().clearOneBlock(block);
                this.game_tool_zhezhao_chui.active = false;
            }
        }, this);
        this.game_tool_zhezhao_heng.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            const touchPos = event.getLocation();
            const pos = this.game_tool_zhezhao_heng.parent.convertToNodeSpaceAR(touchPos);
            const [row, col] = Common.getRowColByBlockPos(pos.x, pos.y);
            console.log(row, col)
            const block = BlockManager.getInstance().getBlockByRowCol(row, col);
            if (block) {
                BlockManager.getInstance().clearOneLineHeng(block);
                this.game_tool_zhezhao_heng.active = false;
            }
        }, this);
        this.game_tool_zhezhao_shu.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            const touchPos = event.getLocation();
            const pos = this.game_tool_zhezhao_shu.parent.convertToNodeSpaceAR(touchPos);
            const [row, col] = Common.getRowColByBlockPos(pos.x, pos.y);
            console.log(row, col)
            const block = BlockManager.getInstance().getBlockByRowCol(row, col);
            if (block) {
                BlockManager.getInstance().clearOneLineShu(block);
                this.game_tool_zhezhao_shu.active = false;
            }
        }, this);
    }

    onClick(tag:string){
        
        if(tag == "btn_back"){
            if(GuidanceMgr.getInstance().isShowing || (GuidanceMgr.getInstance().getCurId()>=3 && GuidanceMgr.getInstance().getCurId()<=7)){
                return;
            }
            if(Common.gameModel == Define.gameModel_Normal){
                UIManager.getInstance().showView(Define.viewExit)
            }else if(Common.gameModel == Define.gameModel_Challenge){
                // UIManager.getInstance().showView(Define.viewChallengeExit)
            }

            //BlockManager.getInstance().eliminateSuggest();
            //UIManager.getInstance().hideView(Define.viewMain)
            //UIManager.getInstance().showView(Define.viewStart)
        } else if(tag == "btn_game_tool_chui") {
            const chuiCount = UserInfo.gameTools[0];
            if (chuiCount <= 0) {
                return;
            }
            UserInfo.saveGameTools(0, chuiCount - 1);
            this.btn_game_tool_chui_label.string = `${chuiCount - 1}`;
            //展示道具指示界面
            this.game_tool_zhezhao_chui.active = true;
        } else if(tag == "btn_game_tool_heng") {
            const hengCount = UserInfo.gameTools[1];
            if (hengCount <= 0) {
                return;
            }
            UserInfo.saveGameTools(1, hengCount - 1);
            this.btn_game_tool_heng_label.string = `${hengCount - 1}`;
            //展示道具指示界面
            this.game_tool_zhezhao_heng.active = true;
        } else if(tag == "btn_game_tool_shu") {
            const shuCount = UserInfo.gameTools[2];
            if (shuCount <= 0) {
                return;
            }
            UserInfo.saveGameTools(2, shuCount - 1);
            this.btn_game_tool_shu_label.string = `${shuCount - 1}`;
            //展示道具指示界面
            this.game_tool_zhezhao_shu.active = true;
        } else if(tag == "ceshi_btn"){
            console.log("按钮下落检测"); 
            BlockManager.getInstance().handlerBlocks();
        }
    }

    initView(){       
        Common.blockNodeRoot = this.node_blockRoot;
        
        Common.nodeSpineRoot = this.node_spineRoot;

        Common.nodePromptRoot = this.node_promptRoot;

        Common.nodeSelectedRoot =this.node_selectedIcon;
        //SoundManager.palySoundById(Define.xiaochuyinyue,true);
    }

    //初始化关卡信息
    initLevelInfo(){

        console.log("主界面初始化关卡数据");
        this.collectInfo = []
        this.collectPos = []
        let infoArr:string [] = Common.curLevelData.collectInfo.split(';')
        for (let index = 0; index < infoArr.length; index++) {
            let arr:string [] = infoArr[index].split(',')
            let tempNode:cc.Node = cc.instantiate(this.node_item)
            this.collectInfo.push(new CollectInfo(tempNode,Number(arr[0]),0,Number(arr[1])))
        }

        for (let index = 0; index < this.collectInfo.length; index++) {
            let info:CollectInfo = this.collectInfo[index]
            //info.maxCount=5;//测试临时        
            info.node.position = cc.Vec2.ZERO


            if(info.blockId<18)
            {
                Common.collectFormID=0;
                let tempNode = info.node.children[1]
                tempNode.children[2].getComponent<cc.Label>(cc.Label).string = "0/"+info.maxCount.toString()
                tempNode.children[0].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock.getSpriteFrame(Define.blockIconArr[info.blockId])
                this.node_items.addChild(info.node)
            }else if(info.blockId>=18&&info.blockId<24){
                Common.collectFormID = info.blockId;
                info.node.getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock1.getSpriteFrame("shoujixingzhuang_dizuo");
                info.node.children[0].active = false;
                let tempNode = info.node.children[1]
                tempNode.children[2].getComponent<cc.Label>(cc.Label).string ="0/"+ info.maxCount.toString()
                tempNode.children[0].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.getFormSpriteFrame(info.blockId);
                this.node_items.addChild(info.node)
            }  
            
        }

        this.node_items.getComponent<cc.Layout>(cc.Layout).updateLayout()
        for (let index = 0; index < this.collectInfo.length; index++) {
            let info:CollectInfo = this.collectInfo[index]
            this.collectPos[info.blockId] = info.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        }
        // this.collectPos[info.blockId] = info.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        console.log(this.collectPos)
    }
    //获得收集信息
    getCollectInfoByBlockId(id:number){
        for (let index = 0; index < this.collectInfo.length; index++) {
            if(this.collectInfo[index].blockId == id){
                return this.collectInfo[index]
            }
        }
        return null
    }
    //是否胜利
    isGameWin(){
        let count:number = 0
        for (let index = 0; index < this.collectInfo.length; index++) {
            if(this.collectInfo[index].curCount >= this.collectInfo[index].maxCount){
                count = count + 1
            }
        }
        return count == this.collectInfo.length
    }
    //更新收集信息
    updateCollectInfo(blockId:number){
        let info:CollectInfo =  this.getCollectInfoByBlockId(blockId)
        if(info != null){
            info.curCount = info.curCount + 1
            info.curCount = Math.min(info.curCount,info.maxCount)

            info.node.children[1].children[2].runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                info.node.children[1].children[2].getComponent<cc.Label>(cc.Label).string = info.curCount.toString()+'/'+info.maxCount.toString()
            }.bind(this))))            
            //info.node.children[0].children[2].getComponent<cc.Label>(cc.Label).string = info.curCount.toString()+'/'+info.maxCount.toString()
        }
        return info
    }

    hideView(){
        super.hideView();
        BlockManager.getInstance().clearAll()
        for (let index = 0; index < this.collectInfo.length; index++) {
            this.collectInfo[index].node.destroy()
        }
        this.node_items.removeAllChildren(true);
        //这里执行界面清空的逻辑
        this.node_spineRoot.removeAllChildren();
    }

    //额外的事件调用
    message(eventTag:string = "defualt",args:any = null){
        if(eventTag == "start"){
            //开始游戏
            BlockManager.getInstance().initAllBlocks(args,this.node_blockBg)
        }else if(eventTag == 'step'){
            this.text_step.string = Common.curTotalStep.toString();

            if(Common.curTotalStep<=5 && Common.curTotalStep>=1)
            {
                this.text_step.node.parent.scale=1;
                this.text_step.node.parent.stopAllActions();
                //let doudong = cc.sequence(cc.moveBy(0.1,0,10), cc.moveBy(0.1,-10,0),cc.moveBy(0.1,0,-10),cc.moveBy(0.1,10,0));
                let suofang = cc.sequence(cc.scaleTo(0.1, 1.4, 1.4), cc.scaleTo(0.1, 1, 1));
                let ani = cc.sequence(suofang,suofang,suofang,suofang,suofang,cc.delayTime(2));
                this.text_step.node.parent.runAction(cc.repeatForever(ani));
            }
            else
            {
                this.text_step.node.parent.scale=1;
                this.text_step.node.parent.stopAllActions();
            }

            // console.log(Common.curTotalStep, Common.curLevelData.step)
            //进度就是剩余步数除以总步数
            const p = Common.curTotalStep / Common.curLevelData.step;
            const width = 18 + (128 - 18) * p;
            this.main_head_progress.width = width;

        }else if(eventTag == "subStep"){
            Common.isCheckGameOver = false
            Common.curTotalStep = Common.curTotalStep - 1

            this.text_step.string = Common.curTotalStep.toString();
            if(Common.curTotalStep == 0){
                this.shengyubushu2.destroy();
                this.shengyubushu2 = null
            }
        }else if(eventTag == 'gold'){
            
            let goldPos=this.text_gold.node.parent.children[0].convertToWorldSpaceAR(cc.Vec2.ZERO)
            
            // Common.playSkeletonById(Define.skeleton_jibixiaoguo2,Common.nodeSpineRoot,args.x,args.y,function(effectNode:cc.Node){

            //     let ani = cc.spawn(cc.moveTo(2,goldPos.x,goldPos.y).easing(cc.easeBackInOut()),cc.sequence(cc.scaleTo(0.15,2.2),cc.scaleTo(1.25,1)))
            //     effectNode.runAction(cc.sequence(ani,cc.callFunc(function(){                    
            //         effectNode.destroy();                  
            //     }.bind(this)))) 
                
            //     effectNode.runAction(cc.sequence(cc.delayTime(1.8),cc.callFunc(function(){
            //         Common.playSkeletonById(Define.skeleton_jibixiaoguo1,Common.nodeSpineRoot,goldPos.x,goldPos.y,function(effectNode:cc.Node){
            //             effectNode.runAction(cc.sequence(cc.delayTime(0.4),cc.callFunc(function(){
            //                 this.text_gold.string = UserInfo.userGold.toString();
            //             }.bind(this))))                        
            //         }.bind(this),false,true)                  
            //     }.bind(this)))) 
                
            // }.bind(this),false,false);


            Common.playSkeletonById(Define.skeleton_jibixiaoguo1,Common.nodeSpineRoot,args.x,args.y,function(effectNode:cc.Node){
                effectNode.runAction(cc.sequence(cc.delayTime(0.65),cc.callFunc(function(){
                    Common.playSkeletonById(Define.skeleton_jibixiaoguo2,Common.nodeSpineRoot,args.x,args.y,function(effectNode:cc.Node){ 
                        let bezier = [cc.v2(0, 1000), cc.v2(100, 1200), cc.v2(goldPos.x, goldPos.y)];
                        if(effectNode.x>360)
                        {
                            bezier = [cc.v2(750, 1000), cc.v2(500, 1200), cc.v2(goldPos.x, goldPos.y)];
                        }
                        //let moveto=cc.moveTo(2,goldPos.x,goldPos.y).easing(cc.easeBackInOut())                       
                        let bezierTo = cc.bezierTo(1.5, bezier); 

                        let ani = cc.spawn(bezierTo,cc.sequence(cc.scaleTo(0.15,2.2),cc.scaleTo(1.25,1)))
                        effectNode.runAction(cc.sequence(ani,cc.callFunc(function(){  

                            //UserInfo.addGold(1,false);
                            //console.log("金币加1");
                            this.text_gold.string = UserInfo.userGold>999999?"999999+":UserInfo.userGold.toString();                            
                            //console.log("金币刷新了");
                            effectNode.destroy();                  
                        }.bind(this)))) 
                    }.bind(this),false,false)                  
                }.bind(this))))                
            }.bind(this),false,true);

                       
        }else if(eventTag == "collect"){

    
            let block:Block = args as Block

            let newBlockId=block.blockId;
            if(block.data.eliminateType==2||block.data.eliminateType==3)
            {
                newBlockId=block.blockId-2;
            }
            if(this.updateCollectInfo(newBlockId) == null){
                return
            }

            
            this.createFlyBlockById(10000,10000,newBlockId,function(newBlock:Block){ 
                
                

                newBlock.flyEffect(block.getScenePos(),this.collectPos[newBlockId])
                
                
                let info:CollectInfo = this.getCollectInfoByBlockId(newBlockId)
                if(info != null)
                {
                    info.node.children[1].children[0].stopAllActions();
                   
                    info.node.children[1].children[0].runAction(cc.sequence(cc.delayTime(0.4),cc.callFunc(function(){ 
                        Common.playSkeletonById(Define.skeleton_huodetishi1,info.node.children[1],0,0,null,false,true);
                    }.bind(this)),cc.scaleTo(0.2, 1.2, 1.2), cc.scaleTo(0.3, 1,1)));
                    
                }               
            }.bind(this),this.node_spineRoot,false)

            if(this.isGameWin()){
                if(Common.gameProgress == Define.gameing){
                    Common.gameProgress = Define.gameCollectFinish
                    console.log("游戏胜利了")
                }
               
                // if(!Common.isGameOver)
                // {
                //     this.victoryEffect();
                //     //UIManager.getInstance().showView(Define.viewVictory);
                // }               
                // 
                // Common.isGameOver = true              
            }
        }else if(eventTag == "recycle")
        {
            args.node.scale = 1;
            this.flyBlockCacheList.push(args)
        }
        else if(eventTag == "clear")
        {           
            this.clear();
        }else if(eventTag =="gameover")
        {
            // let ani=cc.sequence(cc.callFunc(function(){}.bind(this),cc.delayTime(3),cc.callFunc(function(){}.bind(this),cc.delayTime(1)))
            // .runAction(ani);

            Common.nodeSoundRoot.runAction(cc.sequence(cc.callFunc(function(){
                SoundManager.pauseBackGroundSound(true,Common.curMusicRes);
                      
            }.bind(this)),cc.delayTime(1),cc.callFunc(function(){
                SoundManager.pauseBackGroundSound(false,Common.curMusicRes);
            }.bind(this))))
               

            SoundManager.palySoundById(Define.shibaiyinxiao,false);

            if(!Common.isGameOver)
            {
                if(Common.isAdd5ed)
                {
                    if(Common.gameModel == Define.gameModel_Normal){
                        UIManager.getInstance().showView(Define.viewOver,function(){
                            console.log("显示失败界面");
                            UIManager.getInstance().sendMessage(Define.viewOver,'update',this.collectInfo)
                        }.bind(this));
                        
                    }else if(Common.gameModel == Define.gameModel_Challenge){
               
                        // UIManager.getInstance().showView(Define.viewChallengeLose,function(){
                        //     UIManager.getInstance().sendMessage(Define.viewChallengeLose,'3')
                        // }.bind(this));
                    }
                    //UIManager.getInstance().showView(Define.viewOver);
                    //Common.isGameOver = true;
                }
                else
                {
                    if(Common.gameModel == Define.gameModel_Normal){
                        UIManager.getInstance().showView(Define.viewLose);
                    }else if(Common.gameModel == Define.gameModel_Challenge){
                        // UIManager.getInstance().showView(Define.viewChallengeLose,function(){
                        //     UIManager.getInstance().sendMessage(Define.viewChallengeLose,'1')
                        // }.bind(this));
                    }
                    //UIManager.getInstance().showView(Define.viewLose);
                }                
            }        
        }else if(eventTag =="add5")
        {
            Common.isGameOver = false;
            Common.isAdd5ed = true;
            Common.curTotalStep = 10;
            UIManager.getInstance().sendMessage(Define.viewMain,'step')
        }else if(eventTag == "flyEffect"){
            //this.node_juese.removeAllChildren(true);

            // let effectNode=this.node_juese.getChildByName("juesedonghua");

            // effectNode.getComponent(sp.Skeleton).setAnimation(0, "4shengli", true);

            //鹤胜利动画
            // let effectjueseNode=this.node_juesehe.getChildByName("juesehe");

            // effectjueseNode.getComponent(sp.Skeleton).setAnimation(0, "2shengli", false);

            // Common.playSkeletonById(Define.skeleton_juesedonghua3,this.node_juese,0,0,function(effectNode:cc.Node){
            //     mmm.active=false;
            // }.bind(this),false,false);

            // Common.playSkeletonById(Define.skeleton_juesedonghua3,this.node_juese,0,0,function(effectNode:cc.Node){
            //     effectNode.runAction(cc.sequence(cc.delayTime(0.65),cc.callFunc(function(){
            //         Common.playSkeletonById(Define.skeleton_juesedonghua1,this.node_juese,0,0,null,false,false);                   
            //     }.bind(this))))                                       
            // }.bind(this),false,true); 

            this.victoryEffect(args)

        }else if(eventTag == 'bgEffect'){
            this.blockBgEffect.push(args)
        }else if(eventTag == "changeMapMask"){
            this.changeMaskBgByMapType(args)
        }else if(eventTag == "juesedonghua1"){ 
            
            
            // let effectNode=this.node_juese.getChildByName("juesedonghua");
            
            // effectNode.getComponent(sp.Skeleton).setAnimation(0,"3dianzan", false);

            // effectNode.runAction(cc.sequence(cc.delayTime(3.5),cc.callFunc(function(){               
            //     effectNode.getComponent(sp.Skeleton).setAnimation(0, "2daiji", true);
            // }.bind(this))))

            
            // this.node_juese.removeAllChildren(true);
            // Common.playSkeletonById(Define.skeleton_juesedonghua2,this.node_juese,0,0,function(effectNode:cc.Node){
            //     Common.isJueseTag=true;                   
            //     Common.playSkeletonById(Define.skeleton_juesedonghua1,this.node_juese,0,0,null,false,false);       
            //     effectNode.runAction(cc.sequence(cc.delayTime(3),cc.callFunc(function(){
            //         Common.isJueseTag=false;                                                       
            //     }.bind(this))))                                       
            // }.bind(this),false,true);

            // if(!Common.isJueseTag)
            // {
            //     this.node_juese.removeAllChildren(true);              
            //     Common.playSkeletonById(Define.skeleton_juesedonghua2,this.node_juese,0,0,function(effectNode:cc.Node){
            //         Common.isJueseTag=true;                                             
            //         effectNode.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
            //             Common.playSkeletonById(Define.skeleton_juesedonghua1,this.node_juese,0,0,null,false,false);
            //             Common.isJueseTag=false;
            //             effectNode.destroy();                                                                              
            //         }.bind(this))))                                       
            //     }.bind(this),false,false);
            // }           
        }else if(eventTag == "shareAdd8"){
            Common.isGameOver = false;
            Common.curTotalStep = 8;
            UIManager.getInstance().sendMessage(Define.viewMain,'step')
        }else if(eventTag =="collectshuye"){

            //TODO树叶掉落
            console.log("收集到一个树叶"+args.data.ID);
        }else if(eventTag == "collectForm"){


            let newBlockId:number=args as number;
            
            if(this.updateCollectInfo(newBlockId) == null){
                return
            }

            
            // this.createFlyBlockById(10000,10000,newBlockId,function(newBlock:Block){ 
                
                

            //     newBlock.flyEffect(block.getScenePos(),this.collectPos[newBlockId])
                
                
            //     let info:CollectInfo = this.getCollectInfoByBlockId(newBlockId)
            //     if(info != null)
            //     {
            //         info.node.children[1].children[0].stopAllActions();
                   
            //         info.node.children[1].children[0].runAction(cc.sequence(cc.delayTime(0.4),cc.callFunc(function(){ 
            //             Common.playSkeletonById(Define.skeleton_huodetishi1,info.node.children[1],0,0,null,false,true);
            //         }.bind(this)),cc.scaleTo(0.2, 1.2, 1.2), cc.scaleTo(0.3, 1,1)));
                    
            //     }               
            // }.bind(this),this.node_spineRoot,false)

            if(this.isGameWin()){
                if(Common.gameProgress == Define.gameing){
                    Common.gameProgress = Define.gameCollectFinish
                    console.log("游戏胜利了")
                }
               
                // if(!Common.isGameOver)
                // {
                //     this.victoryEffect();
                //     //UIManager.getInstance().showView(Define.viewVictory);
                // }               
                // 
                // Common.isGameOver = true              
            }


        }else if(eventTag == "refreshGold"){
            this.text_gold.string = UserInfo.userGold>999999?"999999+":UserInfo.userGold.toString();
            Common.userGetgold = UserInfo.userGold;
        }
    }
    victoryEffect(blockList)
    {
        let sPos = this.text_step.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        Common.playSkeletonById(Define.skeleton_shengyubushu1,Common.nodeSpineRoot,sPos.x,sPos.y+5,null,false,true);

        Common.playSkeletonById(Define.skeleton_shengyubushu2,Common.nodeSpineRoot,sPos.x,sPos.y+5,function(effect){
            this.shengyubushu2 = effect
        }.bind(this),false,false);

        for (let index = 0; index < blockList.length; index++) {
            Common.playSkeletonById(Define.skeleton_shengyufeixiao1,Common.nodeSpineRoot,sPos.x,sPos.y,function(effect:cc.Node){

                let angel=(Math.atan2((blockList[index].getScenePos().x-sPos.x),(blockList[index].getScenePos().y-sPos.y)))*180/Math.PI;                   
                effect.rotation = angel+180;

                if(index == blockList.length - 1){  
                                    
                    effect.addComponent<FlyEffect>(FlyEffect).Fly(sPos,blockList[index].getScenePos(),index*0.2,blockList[index].blockId,function(){
                        console.log("飞行成功")
                        BlockManager.getInstance().removeBlockFlyEffect(blockList)
                        for (let index = 0; index < this.blockBgEffect.length; index++) {
                            this.blockBgEffect[index].destroy()
                        }
                        this.blockBgEffect = [] 
                    }.bind(this))
                }else{
                    effect.addComponent<FlyEffect>(FlyEffect).Fly(sPos,blockList[index].getScenePos(),index*0.2,blockList[index].blockId,null)
                }
            }.bind(this),false,false)    
        }
    }


    flySpine(sPos:cc.Vec2,ePoS:cc.Vec2,spineNode:cc.Node)
    {
        let luodi:cc.Node = null;
        spineNode.runAction(cc.sequence(cc.moveTo(0.6,ePoS),cc.callFunc(function(){
            luodi = Common.playSkeletonById(Define.skeleton_shengyufeixiao2,Common.nodeSpineRoot,sPos.x,sPos.y,function(){               
            }.bind(this),false,false)
            //spineNode.destroy();
        }.bind(this))));
        luodi.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){           
            luodi.destroy();
        }.bind(this))));
    }


    clear(){       
        BlockManager.getInstance().clearAll()
        for (let index = 0; index < this.collectInfo .length; index++) {
            this.collectInfo[index].node.destroy()
        }
        this.node_items.removeAllChildren(true);
        //这里执行界面清空的逻辑
        this.node_spineRoot.removeAllChildren();
    }

    //创建一个Fly格子
    createFlyBlockById(row:number,col:number,blockId:number,callBack:Function = null,nodeRoot:cc.Node = null,isAddTag:boolean = true){

        if(this.flyBlockCacheList.length > 0){
            let block:Block = this.flyBlockCacheList[0]
            this.flyBlockCacheList.splice(0,1)
            nodeRoot.addChild(block.node)
            block.initFlyRowCol(row,col,blockId)
            if(isAddTag){
                //this.blockList.push(block)
            }
            if(callBack){
                callBack(block)
            }
            return
        }

        ResManager.loadBlock(blockId,function(prefab){
            let blockNode:cc.Node = cc.instantiate(prefab)
            nodeRoot.addChild(blockNode)
            let block:Block = blockNode.addComponent<Block>(Block);
            if(isAddTag){
                //this.blockList.push(block)
            }
            block.initFlyRowCol(row,col,blockId)
            if(callBack){
                callBack(block)
            }
        }.bind(this))
    }
    //切换遮挡的图
    changeMaskBgByMapType(mapType:number){
        let strbg:string = Define.mapMask[mapType]
        let strbgMask:string = strbg + "_mask"
        
        ResManager.loadLevelBg(strbg,function(frame){
            this.sp_maskBg.spriteFrame = frame
        }.bind(this))

        let tempMask:cc.Mask = this.node_mask.getComponent<cc.Mask>(cc.Mask)
        ResManager.loadLevelBg(strbgMask,function(frame){
            tempMask.spriteFrame = frame
        }.bind(this))
    }
}