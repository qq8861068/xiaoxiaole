import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import WXHelper from "../common/WXHelper";
import GameManager from "../manager/GameManager";
import UserInfo from "../UserInfo";
import ScollHelper from "../common/ScollHelper";
import HttpManager from "../manager/HttpManager";
import LDataShareManager from "../datas/LDataShareManager";
import LDataShare from "../datas/LDataShare";

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
export default class FriendHelpView extends ViewBase {


    @property(cc.Node)
    btn_close: cc.Node = null;

    @property(cc.Node)
    btn_share: cc.Node = null;

    @property(ScollHelper)
    scrollHelper: ScollHelper = null;

    infoList:any [] = []
    itemNodeList:cc.Node [] = []

    rewardInfo:string = ""

    refreshView(isFristRefresh:boolean = false){

        this.infoList = []
        HttpManager.getInstance().getFriendHelpState(function(data){
            console.log("this.infoList的长度"+this.infoList.length); 
            if(data != null){
                this.infoList = data   
                console.log("this.infoList的长度"+this.infoList.length);           
            } 
            this.initItems()
        }.bind(this))
    }

    initItems(){
        let maxSize = Math.max(this.infoList.length,7)
        this.scrollHelper.initItems(maxSize,7,function(idx:number, objIdx:number, obj:cc.Node){
            this.resetItemDataByIndexAndItemNode(idx,obj)
        }.bind(this),false)
    }
    //刷新item的状态
    resetItemDataByIndexAndItemNode(idx:number,obj:cc.Node){
        obj.children[5].getComponent<cc.Label>(cc.Label).string = idx.toString()
        obj.children[0].name = "share"
        //Common.removeClickEvent(obj.children[0])
        Common.addClickEvent(obj.children[0],this.onClickItem.bind(this),false,null,true)

        obj.children[2].active = false
        obj.children[3].active = false
        obj.children[4].active = false

        let shareData:LDataShare = LDataShareManager.GetDataById(idx+1)


        if(shareData == null){
            return
        }

        let rewardArrInfo:string [] =  shareData.invitationAward.split(";")

        this.rewardInfo = shareData.invitationAward

        for (let i = 0; i < obj.children[7].childrenCount; i++) {
            obj.children[7].children[i].active = false
        }

        for (let index = 0; index < rewardArrInfo.length; index++) {
            let info:string [] = rewardArrInfo[index].split(",")
            let id:number = Number(info[0])
            let count:number = Number(info[1])
            if(id == Define.prop_gold){
                obj.children[6].children[0].getComponent<cc.Label>(cc.Label).string = "x" + count.toString()
            }else{
                obj.children[7].children[index].active = true
                obj.children[7].children[index].children[1].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.getPropSpriteFrame(id)
                obj.children[7].children[index].children[2].getComponent<cc.Label>(cc.Label).string = "x" + count.toString()
            }
        }



        let data = this.infoList[idx]
        console.log("resetItemDataByIndexAndItemNode")
        console.log(data)
        if(data == null){
            //说明是不能领取
            obj.children[4].active = true
            return
        }else{
            if(data.Other.state == 0){
                // 未领取可以领取
                obj.children[2].active = true
            }else if(data.Other.state == 1){
                //已经领取
                obj.children[3].active = true
            }
        }
        obj.children[1].children[0].scale = 0.68
        WXHelper.createImage(data.avatar,obj.children[1].children[0].getComponent<cc.Sprite>(cc.Sprite))
        //Common.removeClickEvent(obj.children[2])
        Common.addClickEvent(obj.children[2],this.onClickItem.bind(this))
        obj.children[2].name = idx.toString()
        this.itemNodeList[idx] = obj
        // obj.children[2] 领取
        // obj.children[3] 已经领取
        // obj.children[4] 不能领取

    }

    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_share,this.onClick.bind(this));
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));
    }
    
    onClick(tag:string){
        if(tag == "btn_close"){
            UIManager.getInstance().hideView(Define.viewFriendHelp)
        }else if(tag == "btn_share"){   
            GameManager.getInstance().wxHelper.shareAppMessage("","openid="+UserInfo.openid)
        }
    }

    onClickItem(tag:string){
        console.log("onClickItem tag = " + tag)
        if(tag == "share"){
            GameManager.getInstance().wxHelper.shareAppMessage("","openid="+UserInfo.openid)
        }else{
            let index:number = Number(tag)
            let info = this.infoList[index]
            if(info != null){
                //这里执行领取奖励
                HttpManager.getInstance().drawDownFriendHelp(info.open_id,function(data){
                    if(data != null){
                        //说明返回成功
                        info.Other.state = 1
                        this.resetItemDataByIndexAndItemNode(index,this.itemNodeList[index])
                        UserInfo.addRewardInfo(this.rewardInfo)
                        Common.showRewardView(this.rewardInfo);
                        UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo")
                    }
                }.bind(this))
            }
        }
    }
    //只调用一次
    initView(){

    }
}
