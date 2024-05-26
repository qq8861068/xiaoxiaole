import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import LDataConsumeManager from "../datas/LDataConsumeManager";
import LDataConsume from "../datas/LDataConsume";
import UserInfo from "../UserInfo";
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
export default class ChallengePromptView extends ViewBase {

    @property(cc. Node)
    btn_confirm: cc.Node = null;

    @property(cc. Node)
    btn_close: cc.Node = null;

    @property(cc. Node)
    node_item: cc.Node = null;

    @property(cc. Node)
    node_items: cc.Node = null;

    @property(cc. Node)
    btn_rule: cc.Node = null;

    @property(cc.Label)
    text_challengeCount: cc.Label = null;
    

    spendGoldCount:number = 0
    spendPropId:number = 0
    spendPropCount:number = 0

    data:LDataConsume = null
    isGuid:boolean = false;

    refreshView(isFristRefresh:boolean = false){
        if(GuidanceMgr.getInstance().tryShowGuid(2)){
            this.isGuid=true;
        }
        if(Common.userPassChallengeCount>=LDataConsumeManager.dataList.length)
        {
            this.node_item.active=false;
            this.node_items.active=false;
        }else{
            this.node_item.active=true;
            this.node_items.active=false;
        }
        console.log("Common.userPassChallengeCount = " + Common.userPassChallengeCount.toString())
        let id:number = Common.userPassChallengeCount>LDataConsumeManager.dataList.length-1?LDataConsumeManager.dataList.length-1:Common.userPassChallengeCount
        let data:LDataConsume = LDataConsumeManager.GetDataById(id)
        this.data = data

        this.text_challengeCount.string=(LDataConsumeManager.dataList.length-Common.userPassChallengeCount).toString();
        if(data == null){
            console.log("数据错误。。。。。。。。。。。。")
            return
        }
        this.setItemInfo(this.node_item,data,true)

        //this.setItemsInfo(data)
        

    }

    setItemsInfo(data:LDataConsume){
        //1,1;2,1;3,1;4,1;5,1
        let arrInfo:string [] = data.item.split(";")
        for (let index = 0; index < this.node_items.childrenCount; index++) {
            let info:string [] = arrInfo[index].split(",")
            let id:number = Number(info[0])
            let count:number = Number(info[1])
            this.node_items.children[index].children[2].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock.getSpriteFrame(Define.blockIconArr[id])
            this.node_items.children[index].children[1].getComponent<cc.Label>(cc.Label).string = "x" + count.toString()            
        }
    }

    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_confirm,this.onClick.bind(this));
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));
        Common.addClickEvent(this.btn_rule,this.onClick.bind(this));
    }
    //检测是否有足够的道具
    checkPropIsEnough(){
        let isEnough:boolean = true
        let arrInfo:string [] = this.data.item.split(";")
        for (let index = 0; index < this.node_items.childrenCount; index++) {
            let info:string [] = arrInfo[index].split(",")
            let id:number = Number(info[0])
            let count:number = Number(info[1])
            let haveCount:number = UserInfo.getPropCountById(id)
            if(haveCount < count){
                isEnough = false
                break
            }
        }
        return isEnough
    }
    
    onClick(tag:string){
        
        if(tag == "btn_close"){
            if(this.isGuid){return;}
            UIManager.getInstance().hideView(Define.viewChallengePrompt)
        }else if(tag == "btn_confirm"){
            if(this.isGuid){this.isGuid=false;GuidanceMgr.getInstance().closeGuid();}
            if(Common.userPassChallengeCount>=LDataConsumeManager.dataList.length)
            {
                //TODO弹出挑战次数不足弹框
                UIManager.getInstance().showView(Define.viewChallengeCount);
                return
            }
            if(UserInfo.userGold < this.spendGoldCount){
                //金币不足Todo:
                //Common.showPrompt("金币不足!")
                UIManager.getInstance().showView(Define.viewGoldLack,function()
                {
                    UIManager.getInstance().sendMessage(Define.viewGoldLack,"jingbi",this)
                }.bind(this));
                return
            }

            // if(!this.checkPropIsEnough()){
            //     //道具不足Todo：
            //     //Common.showPrompt("道具不足!")
            //     UIManager.getInstance().showView(Define.viewGoldLack,function()
            //     {
            //         UIManager.getInstance().sendMessage(Define.viewGoldLack,"daoju",this)
            //     }.bind(this));
            //     return
            // }
            //这里减少金币和道具
            UserInfo.addGold(this.spendGoldCount*-1)

            //UserInfo.addPropInfoByInfo(this.data.item,true)

            Common.gameModel = Define.gameModel_Challenge
            Common.challengeLevel = 1
            UIManager.getInstance().showView(Define.viewMain,function(){
                UIManager.getInstance().hideView(Define.viewStart)
                UIManager.getInstance().hideView(Define.viewChallengePrompt)
            }.bind(this))
        }else if(tag == "btn_rule"){
            if(this.isGuid){return;}
            UIManager.getInstance().showView(Define.viewActivetyRule,function(){
                UIManager.getInstance().sendMessage(Define.viewActivetyRule,"",0)//
            }.bind(this))
        }
    }

    setItemInfo(itemNode:cc.Node,data:LDataConsume,isGold:boolean){
        if(isGold){
            itemNode.children[1].getComponent<cc.Label>(cc.Label).string = "x" + data.gold.toString()
            this.spendGoldCount = data.gold
        }else{
            // let strArr:string[] = data.item.split(";")
            // itemNode.children[2].setScale(0.7,0.7)
            // itemNode.children[2].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock.getSpriteFrame(Define.blockIconArr[Number(strArr[0])])
            // itemNode.children[1].getComponent<cc.Label>(cc.Label).string = "x" + strArr[1]
            // //花费的道具及其数量
            // this.spendPropId = Number(strArr[0])
            // this.spendPropCount = Number(strArr[1])
        }
    }
}
