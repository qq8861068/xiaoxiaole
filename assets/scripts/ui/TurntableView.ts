import ViewBase from "./ViewBase";
import Define from "../common/Define";
import Common from "../common/Common";
import HttpManager from "../manager/HttpManager";
import UIManager from "../manager/UIManager";
import WXHelper from "../common/WXHelper";
import LDataTurntable from "../datas/LDataTurntable";
import LDataTurntableManager from "../datas/LDataTurntableManager";
import UserInfo from "../UserInfo";
import SoundManager from "../manager/SoundManager";
import ScollHelper from "../common/ScollHelper";
import GuidanceMgr from "../manager/GuidanceMgr";
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
export default class TurntableView extends ViewBase {
    
    @property(cc.Node)
    btn_spin: cc.Node = null; //转盘开始按钮

    @property(cc.Node)
    close_btn: cc.Node = null; //关闭

    @property(cc.Node)
    btn_kefu: cc.Node = null; //联系客服

    @property(cc.Node)
    btn_back:cc.Node = null; //确认

    @property(cc.Node)
    mask1: cc.Node = null; 
    @property(cc.Node)
    mask2: cc.Node = null; 
   
    @property(cc.Node)
    wheelSp:cc.Node=null;   //转盘

    @property(cc.Label)
    show_lab1:cc.Label=null;   //转盘

    @property(cc.Label)
    show_lab2:cc.Label=null;   //转盘

    @property(cc.Label)
    turnCount_lab:cc.Label=null;   //转盘

    @property(cc.Node)
    zhuanpan_btn:cc.Node=null;   //



    @property(cc.Node)
    kouhong_plan:cc.Node = null;

    @property(cc.Node)
    notkouhong_plan:cc.Node = null;


    @property(cc.Node)
    gongxihuode:cc.Node = null;

    @property(cc.Node)
    skeyon:cc.Node = null;
    @property(cc.Node)
    skeyon1:cc.Node = null;
    @property(cc.Node)
    skeyon2:cc.Node = null;
    

    @property(cc.Node)
    geticon:cc.Node = null;

    @property(cc.Node)
    node_item:cc.Node = null;

    @property(cc.Node)
    node_items:cc.Node = null;//转盘获奖消息

    @property(cc.ScrollView)
    node_scrollView:cc.ScrollView = null;//转盘获奖消息


    @property(ScollHelper)
    node_scrollViewHelper:ScollHelper = null;
    

    @property(cc.Node)
    quanquan:cc.Node = null;//等待服务器动画
    

    isShowByVictoryTag:boolean = false

    clickTimes = 5; //设置转盘指针多时间
    rounds = 5;    //设置转盘指针多少圈
    //arr:number[] = [5,47,92,137,182,227,272,317]
    arr:number[] = [2,32,62,92,122,152,182,213,242,272,302,332]


    targetIndex:number=0;


    isTurning:boolean = false //转盘是否在中

    turnCount:number = 0;

    refreshView(isFristRefresh:boolean = false){
        GuidanceMgr.getInstance().tryShowGuid(9);
        this.isShowByVictoryTag = false
        this.turnCount = Common.userLotteryResidueCount
        this.quanquan.active=true;
        //测试
        //this.turnCount=100;

        this.turnCount_lab.string = this.turnCount.toString();
        this.isTurning = false

        this.skeyon.removeAllChildren(true);
        Common.playSkeletonById(Define.skeleton_zhuanpandonghua1,this.skeyon,0,0,null,false,false);

        // let xinxi1=this.huodexiaoxi.children[0].getComponent<cc.RichText>(cc.RichText);
        // let xinxi2=this.huodexiaoxi.children[1].getComponent<cc.RichText>(cc.RichText);
        // let xinxi3=this.huodexiaoxi.children[2].getComponent<cc.RichText>(cc.RichText);

        

        //刷新中奖信息
        this.showPlayerInformation()
        // HttpManager.getInstance().getThreeLotteryInfo(function(info){
        //     console.log("中奖信息.................")
        //     console.log(info)
        //     console.log(info.length)
        //     if(info != null && info.length > 0){
        //         for (let index = 0; index < info.length; index++) {
        //             console.log(info[index].nickname)
        //             console.log(info[index].time)                       
        //         }
        //     }
        // }.bind(this))
        //展示玩家中奖信息
        
    }

    showPlayerInformation()
    {
        let descArr:cc.RichText [] = []

        for (let index = 0; index < descArr.length; index++) {
            descArr[index].node.active = false
        }

        this.node_scrollView.scrollToTop(0)

        
        for (let index = 0; index < this.node_items.childrenCount; index++) {
            let element:cc.Node = this.node_items.children[index];
            element.active = false
        }

        console.log("抽奖前 ：" + new Date().getTime())
        HttpManager.getInstance().getThreeLotteryInfo(function(info){
            // console.log("中奖信息.................")        
            // console.log(info)
            // console.log(info.length)

            console.log("抽奖后 ：" + new Date().getTime())


            this.node_scrollViewHelper.initItems(info.length,3,function(idx:number, objIdx:number, obj:cc.Node){
                //obj.children[4].getComponent<cc.Label>(cc.Label).string = idx.toString()

                if(idx==0)
                {
                    obj.children[0].getComponent<cc.RichText>(cc.RichText).string="<color=#e77400>"+info[idx].nickname+"</c>"+"：鸿运当头，喜中大奖，"+Common.getDateTime(info[idx].time*1000)+"<color=#e77400> 抽中了10元话费。</color>";
                }else{                       
                    obj.children[0].getComponent<cc.RichText>(cc.RichText).string="<color=#e77400>"+info[idx].nickname+"</c>"+"："+Common.getDateTime(info[idx].time*1000)+" 参与了幸运转盘大抽奖。";
                }

                //obj.children[0].getComponent<cc.RichText>(cc.RichText).string="<color=#e77400>"+info[idx].nickname+"</c>"+"：鸿运当头，喜中大奖，"+Common.getDateTime(info[idx].time*1000)+"<color=#e77400> 抽中了口红大奖。</color>";
            }.bind(this),false)

            this.quanquan.active = false;




        //     if(info != null && info.length > 0){
                
        //         let size = info.length
        //         this.node_items.height = 80 * size
        //         for (let index = 0; index < size; index++) {
        //             //descArr[index].node.active = true
        //             let element:cc.Node = this.node_items.children[index];
        //             if(element == null){
        //                 let itemNode:cc.Node = cc.instantiate(this.node_items.children[0])
        //                 this.node_items.addChild(itemNode)
        //                 itemNode.position = new cc.Vec2(this.node_items.children[index-1].position.x,this.node_items.children[index-1].position.y - 80)
        //                 element = itemNode
        //             }

        //             element.active = true

        //             //element.children[0].getComponent<cc.RichText>(cc.RichText).string="<color=#e77400>"+info[index].nickname+"</c>"+"：在"+Common.getDateTime(info[index].time*1000)+"<color=#e77400>抽中了口红大奖！！</color>";
        //             if(index==0)
        //             {
        //                // element.children[0].getComponent<cc.RichText>(cc.RichText).string="<color=#e77400>"+info[index].nickname+"</c>"+"：鸿运当头，喜中大奖，"+Common.getDateTime(info[index].time*1000)+"<color=#e77400> 抽中了口红大奖。</color>";
        //             }else{                       
        //                 //element.children[0].getComponent<cc.RichText>(cc.RichText).string="<color=#e77400>"+info[index].nickname+"</c>"+"："+Common.getDateTime(info[index].time*1000)+" 参与了幸运转盘大抽奖。";
        //             }
                    
        //         }
        //     }this.quanquan.active = false;
        //     console.log("创建ui完成 ：" + new Date().getTime())
        }.bind(this))

    }

    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_spin,this.onClick.bind(this));
        Common.addClickEvent(this.close_btn,this.onClick.bind(this));
        
        Common.addClickEvent(this.btn_kefu,this.onClick.bind(this));
        Common.addClickEvent(this.btn_back,this.onClick.bind(this));
        Common.addClickEvent(this.mask1,this.onClick.bind(this),false,null,false,this.onClick.bind(this));
        Common.addClickEvent(this.mask2,this.onClick.bind(this),false,null,false,this.onClick.bind(this)); 
        Common.addClickEvent(this.zhuanpan_btn,this.onClick.bind(this));
        
        
    }
    
    tempindex:number  = 0
    onClick(tag:string){
        if(tag == "btn_spin"){
            
            if(this.isTurning){
                Common.showPrompt("请等待抽奖结果");
                return
            }   
            if(this.turnCount == 0){
                Common.showPrompt("次数不足！参加挑战赛可以获取抽奖次数")
                return
            }

            this.isTurning = true;
            this.startTurn(3)
      
            // HttpManager.getInstance().lottery(function(data){
            //     if(data != null){
            //         this.startTurn(data.index)
            //     }else{
            //         Common.showPrompt("抽奖失败请检测网络!");
            //         this.isTurning = false;
            //     }
            // }.bind(this))
            //测试
        }else if(tag =="zhuanpan_btn")
        {
            UIManager.getInstance().showView(Define.viewActivetyRule,function(){
                UIManager.getInstance().sendMessage(Define.viewActivetyRule,"",1)//
            }.bind(this))
        }
        else  if(tag =="close_btn")
        {
            if(this.isTurning){
                Common.showPrompt("请等待抽奖结果");
                return
            }
            this.skeyon.removeAllChildren(true);
            if(this.isShowByVictoryTag){

                UIManager.getInstance().showView(Define.viewStart,function(){
                    // if(Common.gameModel == Define.gameModel_Normal){
                    //     UIManager.getInstance().hideView(Define.viewVictory)
                    // }else if(Common.gameModel == Define.gameModel_Challenge){
                    //     UIManager.getInstance().hideView(Define.viewChallengeVictory)
                    // }
                    UIManager.getInstance().hideView(Define.viewChallengeVictory)
                    UIManager.getInstance().hideView(Define.viewMain)                          
                }.bind(this))                             
                //UIManager.getInstance().hideView(Define.viewVictory)
            }
            SoundManager.pauseBackGroundSound(false,Common.curMusicRes);
            UIManager.getInstance().hideView(Define.viewTurntable);
        }else if(tag =="btn_kefu")
        {
            //联系客服
            WXHelper.openCustomerServiceConversation()

        }else if(tag =="btn_back")
        {
            this.removeEffect()
            this.notkouhong_plan.active=false;
        }
        else if(tag =="mask1")
        {          
            this.removeEffect()
            this.kouhong_plan.active = false;
        }else if(tag =="mask2")
        {   
            this.removeEffect()
            this.notkouhong_plan.active=false;
        }
    }   

    removeEffect(){
        this.skeyon2.removeAllChildren(true);
        this.gongxihuode.removeAllChildren(true);
        this.skeyon1.removeAllChildren(true);
    }

    startTurn(rewardid:number){
        SoundManager.pauseBackGroundSound(true,Common.curMusicRes);
        SoundManager.palySoundById(Define.zhuanpan,false);

        this.skeyon.removeAllChildren();
        Common.playSkeletonById(Define.skeleton_zhuanpandonghua2,this.skeyon,0,0,null,false,false);
        this.turnCount = this.turnCount - 1;
        this.turnCount_lab.string =this.turnCount.toString();
        Common.userLotteryResidueCount = this.turnCount
        let angleArr:number [] = [];
        this.targetIndex = rewardid;
        for (let index = 0; index < this.arr.length; index++) {
            angleArr.push(Math.floor(Math.random()*25 + this.arr[index] - 15))
        }
        let rotateBy01 = cc.rotateTo(this.clickTimes,angleArr[this.targetIndex] + 360 * this.rounds).easing(cc.easeCubicActionOut())

        let iconFrame:cc.Sprite =  this.geticon.getComponent<cc.Sprite>(cc.Sprite)
        //this.geticon.getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock.getSpriteFrame(Define.blockIconArr[1])

        this.wheelSp.runAction(cc.sequence(rotateBy01,cc.callFunc(function(){
            this.isTurning = false;
            this.skeyon.removeAllChildren();
            Common.playSkeletonById(Define.skeleton_zhuanpandonghua1,this.skeyon,0,0,null,false,false);
            
            let data:LDataTurntable = LDataTurntableManager.GetDataById(3);

            let strIdArr:string [] = data.itemID.split(";") //道具id
            let strNumberArr:string [] = data.itemNumber.split(";") //道具数量
      
            let ids:string [] = strIdArr[this.targetIndex].split(",")
            let nums:string [] = strNumberArr[this.targetIndex].split(",") 

            // ids.splice(0,ids.length);
            // ids[0]="1003";
            // // let mm:string="1002";
            // // ids=mm;
            
            let isRewardSpecialTag:boolean = false;

            if(ids.length == 1){
                if(Number(ids[0]) > 1000){
                    //实物奖励
                    SoundManager.palySoundById(Define.zhongjiang,false);                             
                    this.kouhong_plan.active = true;
                    
                    this.show_lab1.string = "";
                    if(Number(ids[0]) == 1001)
                    {
                        iconFrame.spriteFrame = Common.atlasBlock.getSpriteFrame('zhuanpan_kouhongtu')
                    }else if(Number(ids[0]) == 1002)
                    {
                        iconFrame.spriteFrame = Common.atlasBlock.getSpriteFrame('zhuanpan_5')
                    }else if(Number(ids[0]) == 1003)
                    {
                        iconFrame.spriteFrame = Common.atlasBlock.getSpriteFrame('zhuanpan_10')                       
                    }                   

                    Common.playSkeletonById(Define.skeleton_zhuanguang1,this.skeyon1,0,0,function(effectNode:cc.Node){
                        effectNode.runAction(cc.sequence(cc.delayTime(0.65),cc.callFunc(function(){
                            Common.playSkeletonById(Define.skeleton_zhuanguang2,this.skeyon1,0,0,null,false,false);                   
                        }.bind(this))))                                       
                    }.bind(this),false,true);                                  
                    Common.playSkeletonById(Define.skeleton_gongxihuode,this.gongxihuode,0,0,function(effectNode:cc.Node){
                        effectNode.runAction(cc.sequence(cc.delayTime(0.6),cc.callFunc(function(){
                            SoundManager.pauseBackGroundSound(false,Common.curMusicRes);                                  
                        }.bind(this))))                                       
                    }.bind(this),false,false); 

                }else if(Number(ids[0]) == 102){
                    //奖励再来一次
                    this.show_lab2.string = "";
                    this.turnCount = this.turnCount + 1;
                    this.turnCount_lab.string = this.turnCount.toString();
                    Common.userLotteryResidueCount = this.turnCount
                    Common.showPrompt("再来一次");
                    return;
                }
            }else{
                //其它的道具
                //SoundManager.palySoundById(Define.zhongjiang,false);
                let rewardInfo:string = Common.getRewardInfoByIdsAndNums(ids,nums)
                Common.showRewardView(rewardInfo)
                Common.nodeGameRoot.runAction
                UserInfo.addPropInfoByInfo(rewardInfo,false)
                UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo")
            }

        }.bind(this))))         
    }

    //额外的事件调用
    message(tag:string = "defualt",args: any = null){
        if(tag == "victory"){
            this.isShowByVictoryTag = true
        }else if(tag == "showPlayerInformation"){
            //刷新中奖信息
            this.showPlayerInformation();
            GuidanceMgr.getInstance().tryShowGuid(10);
        }
    }
}