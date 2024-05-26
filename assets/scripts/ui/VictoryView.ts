import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import GameManager from "../manager/GameManager";
import SoundManager from "../manager/SoundManager";
import UserInfo from "../UserInfo";
import HttpManager from "../manager/HttpManager";
import WXHelper from "../common/WXHelper";
import LDataGiftsManager from "../datas/LDataGiftsManager";
import BlockManager from "../manager/BlockManager";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class VictoryView extends ViewBase {

    @property(cc.Node)
    continue_btn: cc.Node = null;    
    @property(cc.Node)
    share_btn: cc.Node = null;
    @property(cc.Node)
    close_btn: cc.Node = null;

    @property(cc.Node)
    gongxishengli: cc.Node = null;

    //获得金币显示
    @property(cc.Label)
    gold_lab: cc.Label = null;

    @property(cc.Label)
    text_level: cc.Label = null;

    @property(cc.Node)
    node_items: cc.Node = null;
    @property(cc.Node)
    node_item: cc.Node = null;

    @property(cc.Node)
    shiping_btn: cc.Node = null;

    
    @property(cc.Node)
    node_bg: cc.Node = null;

    @property(cc.Node)
    btn_get1: cc.Node = null;

    @property(cc.Node)
    btn_get2: cc.Node = null;

    @property(cc.Label)
    text_reward1: cc.Label = null;

    @property(cc.Label)
    text_reward2: cc.Label = null;
    
    

    curID:number[]=[];
    curCount:number[]=[];

    

    refreshView(isFristRefresh:boolean = false){
        BlockManager.getInstance().end_guid();
        // if(WXHelper.isLoadVideoSuccessful)
        // //if(false)
        // {
        //     this.share_btn.active=false;
        //     this.shiping_btn.active=true;
        // }else 
        // {
        //     this.share_btn.active=true;
        //     this.shiping_btn.active=false;
        // }

        this.gold_lab.string=(UserInfo.userGold-Common.userGetgold).toString();
        this.text_level.string=Common.mapLevel.toString();

        let starCount = 1;
        //根据剩余步数，给予不同的胜利星星
        if (Common.useTempTotalStep >= 8) {
            //大于8步算三星
            starCount = 3;
        } else if (Common.useTempTotalStep >= 5) {
            //大于5步算二星
            starCount = 2;
        } else {
            //胜利就一星
            starCount = 1;
        }
        console.log(`胜利，计算星星数：level: ${Common.mapLevel}, step: ${Common.useTempTotalStep}, star: ${starCount}`);
        UserInfo.saveStar(Common.mapLevel, starCount);

        this.text_level.node.active = false
        this.text_level.node.active = true
        //以关卡上传分数
        //更新排行榜
        GameManager.getInstance().wxHelper.submitScore(Common.mapLevel)
        //清空道具id数组
        this.curID.splice(0,this.curID.length);
        this.curCount.splice(0,this.curCount.length);

        //Common.playSkeletonById(Define.skeleton_gongxishengli,this.gongxishengli,0,0,null,false,false);

        Common.playSkeletonById(Define.skeleton_gongxishengli,this.gongxishengli,0,0,function(effect){                      
            effect.getComponent(sp.Skeleton).setAnimation(0,"gongxishengli", false);
            effect.runAction(cc.sequence(cc.delayTime(1.2),cc.callFunc(function(){ 
            effect.getComponent(sp.Skeleton).setAnimation(0, "gongxishengli2", true);                
            }.bind(this))));
        }.bind(this),false,false)

        let gold:number=UserInfo.userGold-Common.userGetgold;

        if(WXHelper.isLoadVideoSuccessful){
            //460   2
            //300   1
            this.node_bg.height = 460
            this.btn_get2.parent.active = true
        }else{
            this.node_bg.height = 300
            this.btn_get2.parent.active = false
        }

        this.text_reward1.string = "x"+gold.toString();
        this.text_reward2.string = "x"+(gold*3).toString();

        //写入本地
        UserInfo.addGold(0);
        if(Common.curLevelData != null){
            //let isRewardTag:boolean = false
            /*
            let infoArr:string [] = Common.curLevelData.award.split(';')
            for (let index = 0; index < infoArr.length; index++) {
                let arr:string [] = infoArr[index].split(',')
                let id:number = Number(arr[0])
                let count:number=Number(arr[1])
                this.curID.push(id);
                this.curCount.push(count);
                if(id<6)
                {
                    UserInfo.addPropByIdAndCount(id,count)
                }               
                // if(id == Define.prop_kouhong){
                //     isRewardTag = true
                // }
                if(id == Define.prop_star){
                    UserInfo.addStar(count,true);
                }
                let tempNode:cc.Node = cc.instantiate(this.node_item)
                tempNode.position = cc.Vec2.ZERO
                this.node_items.addChild(tempNode)

                // if(id<6)
                // {
                //     tempNode.children[0].children[1].getComponent<cc.Label>(cc.Label).string = "1"
                // }else if(id>=6&&id<24)
                // {
                //     tempNode.children[0].children[1].getComponent<cc.Label>(cc.Label).string = "";
                // }else if(id==Define.prop_star)
                // {

                // }

                tempNode.children[0].children[1].getComponent<cc.Label>(cc.Label).string = count.toString();
                
                tempNode.children[0].children[0].runAction(cc.sequence(cc.delayTime(1.2),cc.callFunc(function(){

                    Common.playSkeletonById(Define.skeleton_huodetishi2,tempNode.children[0].children[0],0,0,null,false,true);

                }.bind(this))))
                // if(id<18)
                // {
                //     tempNode.children[0].children[0].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock.getSpriteFrame(Define.blockIconArr[id])
                // }if(id>=18&&id<24){
                //     tempNode.children[0].children[0].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.getFormSpriteFrame(id);
                // }
                tempNode.children[0].children[0].getComponent<cc.Sprite>(cc.Sprite).spriteFrame =Common.getPropSpriteFrame(id); 
                
                
            }*/
            // if(isRewardTag){
            //     //将口红的数量上传到微信服务器
            //     GameManager.getInstance().wxHelper.submitScore(UserInfo.getPropCountById(Define.prop_kouhong))
            // }

            if(Common.gameModel == Define.gameModel_Normal){
                if (Common.mapLevel === UserInfo.userLevel) {
                    UserInfo.nextLevel()
                }
                this.close_btn.active = true
            }else{
                this.close_btn.active = false
                Common.challengeLevel++
                if(Common.challengeLevel == 4){
                    //挑战关卡完成
                    HttpManager.getInstance().addResidueLottery(function(data){
                        if(data.obj != null){
                           Common.userLotteryResidueCount = data.obj.residue_lottery
                        //    UIManager.getInstance().showView(Define.viewTurntable,function(){
                        //        UIManager.getInstance().sendMessage(Define.viewTurntable,"victory")
                        //    }.bind(this))
                        }
                    }.bind(this))
                }
            }
        }   
    }

    //隐藏
    hideView(){
        super.hideView();
        this.node_items.removeAllChildren(true)
        this.gongxishengli.removeAllChildren(true)
    }

    addEvent(){
        Common.addClickEvent(this.continue_btn,this.onClick.bind(this));
        Common.addClickEvent(this.share_btn,this.onClick.bind(this));
        Common.addClickEvent(this.close_btn,this.onClick.bind(this));
        Common.addClickEvent(this.shiping_btn,this.onClick.bind(this));

        Common.addClickEvent(this.btn_get1,this.onClick.bind(this));
        Common.addClickEvent(this.btn_get2,this.onClick.bind(this));
    }

    onClick(tag:string){       
        if(tag == "continue_btn" || tag == "btn_get1"){
            Common.mapLevel = UserInfo.userLevel;
            UIManager.getInstance().showView(Define.viewStart,function(){
                UIManager.getInstance().hideView(Define.viewVictory)
                UIManager.getInstance().showView(Define.viewBegin)
                UIManager.getInstance().hideView(Define.viewMain)                
            }.bind(this))

            // this.scheduleOnce(() => {
            //     UIManager.getInstance().hideView(Define.viewVictory)
            //     UIManager.getInstance().showView(Define.viewBegin)
            //     UIManager.getInstance().hideView(Define.viewMain)
            // }, 0);

            // UIManager.getInstance().sendMessage(Define.viewMain,'clear',null)
            // UIManager.getInstance().showView(Define.viewMain,function(){
            //     UIManager.getInstance().hideView(Define.viewVictory)               
            // }.bind(this))
        }else if(tag == "share_btn"){


            //测试用
            // UIManager.getInstance().showView(Define.viewStart,function(){
            //     UIManager.getInstance().showView(Define.viewBegin)
            //     UIManager.getInstance().hideView(Define.viewVictory)
            //     UIManager.getInstance().hideView(Define.viewMain)                          
            // }.bind(this))                   
            // //三倍奖励逻辑
            // let Rewardstring="";
            // for(let index = 0; index < this.curID.length; index++)
            // {
            //     if(this.curID[index]<18)
            //     {
            //         Rewardstring=Rewardstring+this.curID[index].toString()+","+(this.curCount[index]*2).toString()+";"
            //     }else if(this.curID[index]=Define.prop_star)
            //     {
            //         Rewardstring=Rewardstring+this.curID[index].toString()+","+(this.curCount[index]*2).toString()+";"
                    
            //     }                       
            // }
            // Rewardstring=Rewardstring+"101,"+((UserInfo.userGold-Common.userGetgold)*2).toString();
            // UserInfo.addRewardInfo(Rewardstring);     
            // Common.showRewardView(Rewardstring);       
            // //Common.showRewardView("1,1;2,1;3,1;4,1;5,1;101,100");
            // UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo");

            
            
            GameManager.getInstance().wxHelper.shareAppMessage("")         
        }else if(tag == "close_btn"){
            UIManager.getInstance().showView(Define.viewStart,function(){
                UIManager.getInstance().hideView(Define.viewVictory)
                UIManager.getInstance().hideView(Define.viewMain)                          
            }.bind(this))           
        }else if(tag == "btn_get2"){
            WXHelper.showVideo(function(state){
                if(state == 1){

                    let gold:number=UserInfo.userGold-Common.userGetgold;
                    //UIManager.getInstance().sendMessage(Define.viewMain,'add5',null)
                    UIManager.getInstance().showView(Define.viewStart,function(){
                        UIManager.getInstance().hideView(Define.viewVictory)
                        UIManager.getInstance().showView(Define.viewBegin)
                        UIManager.getInstance().hideView(Define.viewMain)                          
                    }.bind(this))                   
                    //三倍奖励逻辑
                    let Rewardstring="";
                    let RewardstringShow="";
                    Rewardstring=Rewardstring+"101,"+(gold*2).toString();
                    RewardstringShow=RewardstringShow+"101,"+(gold*3).toString();
                    UserInfo.addRewardInfo(Rewardstring);     
                    Common.showRewardView(RewardstringShow);       
                    UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo");
                }else{
                    Common.showPrompt("广告未观看完!");
                }
                SoundManager.pauseBackGroundSound(false,Define.backgroundmusic[0]);
            }.bind(this))
        }else if(tag == "shiping_btn"){
            //视频三倍奖励
            // 接广告
            WXHelper.showVideo(function(state){
                if(state == 1){

                    let gold:number=UserInfo.userGold-Common.userGetgold;
                    //UIManager.getInstance().sendMessage(Define.viewMain,'add5',null)
                    UIManager.getInstance().showView(Define.viewStart,function(){
                        UIManager.getInstance().hideView(Define.viewVictory)
                        UIManager.getInstance().showView(Define.viewBegin)
                        UIManager.getInstance().hideView(Define.viewMain)                          
                    }.bind(this))                   
                    //三倍奖励逻辑
                    let Rewardstring="";
                    let RewardstringShow="";
                    for(let index = 0; index < this.curID.length; index++)
                    {
                        if(this.curID[index]<18)
                        {
                            Rewardstring=Rewardstring+this.curID[index].toString()+","+(this.curCount[index]*2).toString()+";"
                            RewardstringShow=RewardstringShow+this.curID[index].toString()+","+(this.curCount[index]*3).toString()+";"
                        }else if(this.curID[index]=Define.prop_star)
                        {
                            Rewardstring=Rewardstring+this.curID[index].toString()+","+(this.curCount[index]*2).toString()+";"
                            RewardstringShow=RewardstringShow+this.curID[index].toString()+","+(this.curCount[index]*3).toString()+";"                           
                        }                       
                    }
                    Rewardstring=Rewardstring+"101,"+(gold*2).toString();
                    RewardstringShow=RewardstringShow+"101,"+(gold*3).toString();
                    UserInfo.addRewardInfo(Rewardstring);     
                    Common.showRewardView(RewardstringShow);       
                    //Common.showRewardView("1,1;2,1;3,1;4,1;5,1;101,100");
                    UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo");
                }else{
                    Common.showPrompt("广告未观看完!");
                    SoundManager.pauseBackGroundSound(false,Common.curMusicRes);
                }
                //SoundManager.pauseBackGroundSound(false,Define.backgroundmusic[0]);
            }.bind(this))

        }
    }
}