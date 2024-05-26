import ViewBase from "./ViewBase";
import HttpManager from "../manager/HttpManager";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import GameManager from "../manager/GameManager";
import UserInfo from "../UserInfo";

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
export default class InviteFriendView extends ViewBase {

    @property(cc.Node)
    btn_close: cc.Node = null;

    @property(cc.Node)
    btn_share: cc.Node = null;

    @property(cc.Node)
    getItems: cc.Node = null;


    @property(cc.Node)
    bar: cc.Node = null;

    
    infoList:any [] = []

    @property(cc.Node)
    text_friendhelp: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    refreshView(isFristRefresh:boolean = false){
        this.infoList = []
        console.log("this.infoList的长度"+this.infoList.length);
        HttpManager.getInstance().getFriendHelpState(function(data){
            if(data != null){
                this.infoList = data               
            } 
            this.initItems()
        }.bind(this))
    }
    //刷新item的状态
    initItems(){
        //this.infoList.length=1;
        let barRectWidth=this.bar.getComponent(cc.Sprite).spriteFrame.getRect().width;
        this.bar.width=this.infoList.length/12*barRectWidth;

        if(this.infoList.length<2){
            UserInfo.getItem1=0
            UserInfo.getItem2=0
            UserInfo.getItem3=0
            UserInfo.getItem4=0
        }else if(this.infoList.length<5){
            if(UserInfo.getItem1==0){
                UserInfo.getItem1=1
            }
            UserInfo.getItem2=0
            UserInfo.getItem3=0
            UserInfo.getItem4=0
           
        }else if(this.infoList.length<8){
            if(UserInfo.getItem1==0){
                UserInfo.getItem1=1
            }
            if(UserInfo.getItem2==0){
                UserInfo.getItem2=1
            }
            UserInfo.getItem3=0
            UserInfo.getItem4=0


        }else if(this.infoList.length<12){
            if(UserInfo.getItem1==0){
                UserInfo.getItem1=1
            }
            if(UserInfo.getItem2==0){
                UserInfo.getItem2=1
            }
            if(UserInfo.getItem3==0){
                UserInfo.getItem3=1
            }
            UserInfo.getItem4=0



        }else if(this.infoList.length>=12){
            if(UserInfo.getItem1==0){
                UserInfo.getItem1=1
            }
            if(UserInfo.getItem2==0){
                UserInfo.getItem2=1
            }
            if(UserInfo.getItem3==0){
                UserInfo.getItem3=1
            }
            if(UserInfo.getItem4==0){
                UserInfo.getItem4=1
            }
        }
        UserInfo.saveGetItemState();
        this.initItemsBtn();
    }

    initItemsBtn(){
        for(let i=0;i<4;i++){
            this.getItems.children[i].children[0].active=false;
            this.getItems.children[i].children[1].active=false;
            this.getItems.children[i].children[2].active=false;           
        }

        if(UserInfo.getItem1==0){
            this.getItems.children[0].children[0].active=true;
        }else if(UserInfo.getItem1==1){
            this.getItems.children[0].children[1].active=true;
            Common.addClickEvent(this.getItems.children[0].children[1],this.onClickItem.bind(this))
        }else if(UserInfo.getItem1==2){
            this.getItems.children[0].children[2].active=true;
        }
        if(UserInfo.getItem2==0){
            this.getItems.children[1].children[0].active=true;
        }else if(UserInfo.getItem2==1){
            this.getItems.children[1].children[1].active=true;
            Common.addClickEvent(this.getItems.children[1].children[1],this.onClickItem.bind(this))
        }else if(UserInfo.getItem2==2){
            this.getItems.children[1].children[2].active=true;
        }
        if(UserInfo.getItem3==0){
            this.getItems.children[2].children[0].active=true;
        }else if(UserInfo.getItem3==1){
            this.getItems.children[2].children[1].active=true;
            Common.addClickEvent(this.getItems.children[2].children[1],this.onClickItem.bind(this))
        }else if(UserInfo.getItem3==2){
            this.getItems.children[2].children[2].active=true;
        }
        if(UserInfo.getItem4==0){
            this.getItems.children[3].children[0].active=true;
        }else if(UserInfo.getItem4==1){
            this.getItems.children[3].children[1].active=true;
            Common.addClickEvent(this.getItems.children[3].children[1],this.onClickItem.bind(this))
        }else if(UserInfo.getItem4==2){
            this.getItems.children[3].children[2].active=true;
        }
    }


    onClickItem(tag:string){
        if(tag == "btn_get1"){
            UserInfo.addGold(100);
            UserInfo.getItem1=2
        }else if(tag == "btn_get2"){
            UserInfo.addGold(100);
            UserInfo.getItem2=2
        }else if(tag == "btn_get3"){
            UserInfo.addGold(100);
            UserInfo.getItem3=2
        }else if(tag == "btn_get4"){
            UserInfo.addGold(100);
            UserInfo.getItem4=2
        }
        this.initItemsBtn();
        UserInfo.saveGetItemState();
        UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo")
    }

    addEvent(){
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));
        Common.addClickEvent(this.btn_share,this.onClick.bind(this));
        Common.addClickEvent(this.text_friendhelp,this.onClick.bind(this));
    }


    onClick(tag:string){
        if(tag == "btn_close"){
            UIManager.getInstance().hideView(Define.viewInviteFriend)
        }else if(tag == "btn_share"){   
            GameManager.getInstance().wxHelper.shareAppMessage("","openid="+UserInfo.openid)
        }else if(tag == "text_friendhelp"){
            UIManager.getInstance().showView(Define.viewFriendHelp)
        }
    }
}