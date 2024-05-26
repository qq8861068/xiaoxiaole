import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import ViewBase from "./ViewBase";
import HttpManager from "../manager/HttpManager";
import GuidanceMgr from "../manager/GuidanceMgr";
import BlockManager from "../manager/BlockManager";
import GameManager from "../manager/GameManager";
import WXHelper from "../common/WXHelper";
import UserInfo from "../UserInfo";
import SoundManager from "../manager/SoundManager";

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
export default class ChallengeVictoryView extends ViewBase {

    @property(cc.Node)
    abandon_btn: cc.Node = null;
    @property(cc.Node)
    continue_btn: cc.Node = null;
    @property(cc.Node)
    back_btn: cc.Node = null;
    @property(cc.Node)
    gift_btn: cc.Node = null;
    @property(cc.Node)
    gongxishengli: cc.Node = null;

    @property(cc.Node)
    item1: cc.Node = null;
    @property(cc.Node)
    item2: cc.Node = null;

    @property(cc.Node)
    share_btn: cc.Node = null;
    @property(cc.Node)
    shiping_btn: cc.Node = null;

    @property(cc.Label)
    xinxi_Label: cc.Label = null;

    @property(cc.Node)
    node_items: cc.Node = null;
    @property(cc.Node)
    node_item: cc.Node = null;

    //获得金币显示
    @property(cc.Label)
    gold_lab: cc.Label = null;


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

        
        //Common.playSkeletonById(Define.skeleton_gongxishengli,this.gongxishengli,0,0,null,false,false);
        Common.playSkeletonById(Define.skeleton_gongxishengli,this.gongxishengli,0,0,function(effect){                      
            effect.getComponent(sp.Skeleton).setAnimation(0,"gongxishengli", false);
            effect.runAction(cc.sequence(cc.delayTime(1.2),cc.callFunc(function(){ 
            effect.getComponent(sp.Skeleton).setAnimation(0, "gongxishengli2", true);                
            }.bind(this))));
        }.bind(this),false,false)

        // Common.playSkeletonById(Define.skeleton_xiaoniu,this.xiaoniu_node,0,0,function(effect){                      
        //     effect.getComponent(sp.Skeleton).setAnimation(0,"1ruchang", false);
        //     effect.runAction(cc.sequence(cc.delayTime(3.65),cc.callFunc(function(){ 
        //     effect.getComponent(sp.Skeleton).setAnimation(0, "4shengli", true);                
        //     }.bind(this))));
        // }.bind(this),false,false)

        this.gold_lab.string=(UserInfo.userGold-Common.userGetgold).toString();

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



        let gold:number=UserInfo.userGold-Common.userGetgold;

        this.btn_get2.parent.active = false
        if(WXHelper.isLoadVideoSuccessful){
            //460   2
            //300   1
            this.node_bg.height = 460
            this.btn_get2.parent.active = true
            this.btn_get1.parent.active = true
        }else{
            this.node_bg.height = 300
            this.btn_get1.parent.active = true
        }

        this.text_reward1.string = "x"+gold.toString();
        this.text_reward2.string = "x"+(gold*3).toString();

        //写入本地
        UserInfo.addGold(0);

        //清空道具id数组
        this.curID.splice(0,this.curID.length);
        this.curCount.splice(0,this.curCount.length);
      

        console.log("Common.challengeLevel = " + Common.challengeLevel);

        this.item1.active=false;
        this.item2.active=false;

        this.abandon_btn.active=true;
        this.continue_btn.active = false;
        this.back_btn.active=false;
        this.gift_btn.active = false;

        if(Common.challengeLevel==1)
        {
            BlockManager.getInstance().end_guid();
            //this.xinxi_Label.string="恭喜通过第一关,连闯三关就\n有机会抽取大牌奶粉！"

            // this.getAward();
            // this.item1.active=false;
            // this.item2.active=false;

            // this.abandon_btn.active=true;
            // this.continue_btn.active = true;
            // this.back_btn.active=false;
            // this.gift_btn.active = false;
        }else if(Common.challengeLevel==2)
        {
            //this.xinxi_Label.string="太棒了,马上可以抽取奶粉大奖了！"
            // this.getAward();
            // this.item1.active=false;
            // this.item2.active=false;

            // this.abandon_btn.active=true;
            // this.continue_btn.active = true;
            // this.back_btn.active=false;
            // this.gift_btn.active = false;
        }else if(Common.challengeLevel==3)
        {
            //this.xinxi_Label.string="太棒了,马上可以抽取奶粉大奖了！"
            // this.getAward();
            // this.item1.active=false;
            // this.item2.active=false;

            // this.abandon_btn.active=true;
            // this.continue_btn.active = true;
            // this.back_btn.active=false;
            // this.gift_btn.active = false;
            
        }else if(Common.challengeLevel==4)
        {
            this.btn_get1.parent.active = false
            this.btn_get2.parent.active = false
            this.node_bg.height = 550

            this.gold_lab.node.parent.active=false;
            this.share_btn.active=false;
            this.shiping_btn.active=false;
            //this.xinxi_Label.string="胜利了,赶紧去抽取奶粉大奖吧！"

            this.item1.active=false;
            this.item2.active=true;

            this.abandon_btn.active=false;
            this.continue_btn.active = false;
            this.back_btn.active=true;
            this.gift_btn.active = true;
        }

        Common.challengeLevel++
        if(Common.challengeLevel == 5){
            //挑战关卡完成
            GuidanceMgr.getInstance().tryShowGuid(8);
            HttpManager.getInstance().addResidueLottery(function(data){
                if(data.obj != null){
                   Common.userLotteryResidueCount = data.obj.residue_lottery
                }else{
                    if(data.msg != null){
                        Common.showPrompt(data.msg)
                    }
                }
            }.bind(this))
        }
    }


    getAward(){
        if(Common.curLevelData != null){
           
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
               
                if(id == Define.prop_star){
                    //星星机制改变，以下代码作废
                    // UserInfo.addStar(count,true);
                }
                let tempNode:cc.Node = cc.instantiate(this.node_item)
                tempNode.position = cc.Vec2.ZERO
                this.node_items.addChild(tempNode)

                tempNode.children[0].children[1].getComponent<cc.Label>(cc.Label).string = count.toString();
                
                tempNode.children[0].children[0].runAction(cc.sequence(cc.delayTime(1.2),cc.callFunc(function(){

                    Common.playSkeletonById(Define.skeleton_huodetishi2,tempNode.children[0].children[0],0,0,null,false,true);

                }.bind(this))))
                tempNode.children[0].children[0].getComponent<cc.Sprite>(cc.Sprite).spriteFrame =Common.getPropSpriteFrame(id);                
            }
        }
    }

    addEvent(){
        Common.addClickEvent(this.abandon_btn,this.onClick.bind(this));
        Common.addClickEvent(this.continue_btn,this.onClick.bind(this));
        Common.addClickEvent(this.back_btn,this.onClick.bind(this));
        Common.addClickEvent(this.gift_btn,this.onClick.bind(this));
        Common.addClickEvent(this.share_btn,this.onClick.bind(this));
        Common.addClickEvent(this.shiping_btn,this.onClick.bind(this));
        Common.addClickEvent(this.btn_get1,this.onClick.bind(this));
        Common.addClickEvent(this.btn_get2,this.onClick.bind(this));
    }
    onClick(tag:string){
        if(GuidanceMgr.getInstance().isShowing){
            if(tag!="gift_btn"){
                return;
            }
            else{
                GuidanceMgr.getInstance().closeGuid();
            }
        }
        if(tag == "abandon_btn"){
            //放弃   
            UIManager.getInstance().showView(Define.viewChallengeExit)
            //UIManager.getInstance().hideView(Define.viewChallengeVictory)           
        }else if(tag == "continue_btn" || tag == "btn_get1"){ 
            // 继续 
            UIManager.getInstance().sendMessage(Define.viewMain,'clear',null)
            UIManager.getInstance().showView(Define.viewMain,function(){
                UIManager.getInstance().hideView(Define.viewChallengeVictory)               
            }.bind(this))
            //UIManager.getInstance().hideView(Define.viewChallengeVictory)           
        }else if(tag == "back_btn"){ 
            // 退出  
            UIManager.getInstance().showView(Define.viewStart,function(){
                UIManager.getInstance().hideView(Define.viewChallengeVictory)
                UIManager.getInstance().hideView(Define.viewMain)
            }.bind(this)) 
            //UIManager.getInstance().hideView(Define.viewChallengeVictory)           
        }else if(tag == "gift_btn"){ 
            // 抽奖    
            UIManager.getInstance().showView(Define.viewTurntable,function(){
                UIManager.getInstance().sendMessage(Define.viewTurntable,"victory")
            }.bind(this))
            //UIManager.getInstance().hideView(Define.viewChallengeVictory)           
        }else if(tag == "btn_get2"){

            WXHelper.showVideo(function(state){
                if(state == 1){
                    let gold:number=UserInfo.userGold-Common.userGetgold;

                    UIManager.getInstance().sendMessage(Define.viewMain,'clear',null)
                    UIManager.getInstance().showView(Define.viewMain,function(){
                    UIManager.getInstance().hideView(Define.viewChallengeVictory)               
                    }.bind(this))
                    //UIManager.getInstance().sendMessage(Define.viewMain,'add5',null)                 
                    //四倍奖励逻辑
                    let Rewardstring="";
                    let RewardstringShow="";
          
                    Rewardstring=Rewardstring+"101,"+(gold*2).toString();
                    RewardstringShow=RewardstringShow+"101,"+(gold*3).toString();
                    UserInfo.addRewardInfo(Rewardstring);     
                    Common.showRewardView(RewardstringShow);       
                    //Common.showRewardView("1,1;2,1;3,1;4,1;5,1;101,100");
                    UIManager.getInstance().sendMessage(Define.viewMain,"refreshGold");
                }else{
                    Common.showPrompt("广告未观看完!");
                    SoundManager.pauseBackGroundSound(false,Common.curMusicRes);
                }
                
            }.bind(this))
        }else if(tag == "share_btn"){
            // let gold:number=UserInfo.userGold-Common.userGetgold;
            // UIManager.getInstance().sendMessage(Define.viewMain,'clear',null)
            // UIManager.getInstance().showView(Define.viewMain,function(){
            // UIManager.getInstance().hideView(Define.viewChallengeVictory)               
            // }.bind(this))
            // //UIManager.getInstance().sendMessage(Define.viewMain,'add5',null)                 
            // //三倍奖励逻辑
            // let Rewardstring="";
            // for(let index = 0; index < this.curID.length; index++)
            // {
            //     if(this.curID[index]<18)
            //     {
            //         Rewardstring=Rewardstring+this.curID[index].toString()+","+(this.curCount[index]*3).toString()+";"
            //     }else if(this.curID[index]=Define.prop_star)
            //     {
            //         Rewardstring=Rewardstring+this.curID[index].toString()+","+(this.curCount[index]*3).toString()+";"
                    
            //     }                       
            // }
            // Rewardstring=Rewardstring+"101,"+(gold*3).toString();
            // UserInfo.addRewardInfo(Rewardstring);     
            // Common.showRewardView(Rewardstring);       
            // //Common.showRewardView("1,1;2,1;3,1;4,1;5,1;101,100");
            // UIManager.getInstance().sendMessage(Define.viewMain,"refreshGold");
            GameManager.getInstance().wxHelper.shareAppMessage("")   
        }else if(tag == "shiping_btn"){


            //视频四倍奖励
            // 接广告
            WXHelper.showVideo(function(state){
                if(state == 1){
                    let gold:number=UserInfo.userGold-Common.userGetgold;

                    UIManager.getInstance().sendMessage(Define.viewMain,'clear',null)
                    UIManager.getInstance().showView(Define.viewMain,function(){
                    UIManager.getInstance().hideView(Define.viewChallengeVictory)               
                    }.bind(this))
                    //UIManager.getInstance().sendMessage(Define.viewMain,'add5',null)                 
                    //四倍奖励逻辑
                    let Rewardstring="";
                    let RewardstringShow="";
                    for(let index = 0; index < this.curID.length; index++)
                    {
                        if(this.curID[index]<18)
                        {
                            Rewardstring=Rewardstring+this.curID[index].toString()+","+(this.curCount[index]*3).toString()+";"
                            RewardstringShow=RewardstringShow+this.curID[index].toString()+","+(this.curCount[index]*4).toString()+";"
                        }else if(this.curID[index]=Define.prop_star)
                        {
                            Rewardstring=Rewardstring+this.curID[index].toString()+","+(this.curCount[index]*3).toString()+";"
                            RewardstringShow=RewardstringShow+this.curID[index].toString()+","+(this.curCount[index]*4).toString()+";"
                            
                        }                       
                    }
                    Rewardstring=Rewardstring+"101,"+(gold*3).toString();
                    RewardstringShow=RewardstringShow+"101,"+(gold*4).toString();
                    UserInfo.addRewardInfo(Rewardstring);     
                    Common.showRewardView(RewardstringShow);       
                    //Common.showRewardView("1,1;2,1;3,1;4,1;5,1;101,100");
                    UIManager.getInstance().sendMessage(Define.viewMain,"refreshGold");
                }else{
                    Common.showPrompt("广告未观看完!");
                    SoundManager.pauseBackGroundSound(false,Common.curMusicRes);
                }
                
            }.bind(this))
        }
    }
    hideView(){
        super.hideView();
        this.gongxishengli.removeAllChildren(true)
        this.node_items.removeAllChildren(true)
    }

    // update (dt) {}
}
