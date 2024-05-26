import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import ViewBase from "./ViewBase";
import WXHelper from "../common/WXHelper";
import UserInfo from "../UserInfo";
import LDataGiftsManager from "../datas/LDataGiftsManager";
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
export default class GoldLackView extends ViewBase {


    @property(cc.Node)
    close_btn: cc.Node = null;
    
    @property(cc.Node)
    getgold_btn: cc.Node = null;

    @property(cc.Node)
    getgold_btn1: cc.Node = null;

    @property(cc.Label)    
    lose_lab: cc.Label = null; 

    @property(cc.Node) 
    shipinggetgold_btn:cc.Node = null;

    @property(cc.Node)
    items: cc.Node = null;

    refreshView(isFristRefresh:boolean = false){

        // 界面能否显示广告按钮
        // WXHelper.isLoadVideoSuccessful

        if(WXHelper.isLoadVideoSuccessful)
        //if(false)
        {
            this.getgold_btn.active=false;
            this.getgold_btn1.active=true;
            this.shipinggetgold_btn.active=true;
        }else 
        {
            this.getgold_btn.active=true;
            this.getgold_btn1.active=false;
            this.shipinggetgold_btn.active=false;
        }


        //道具金币奖励显示items_num，gold_lab
        let arrInfo:string [] = LDataGiftsManager.GetDataById(3).award.split(";")
        console.log("******************");
        for (let index = 0; index < arrInfo.length; index++) {
            let info:string [] = arrInfo[index].split(",")
            let id:number = Number(info[0])
            let count:number = Number(info[1])

            if(id == Define.prop_kouhong)
            {
                this.items.children[0].children[0].getComponent<cc.Label>(cc.Label).string="X"+count.toString();               
            }else if(id == Define.prop_gold)
            {
                this.items.children[5].children[0].getComponent<cc.Label>(cc.Label).string="X"+ count.toString();
            }else if(id == Define.prop_xiangshui)
            {
                this.items.children[1].children[0].getComponent<cc.Label>(cc.Label).string="X"+count.toString();
            }
            else if(id == Define.prop_fenbing)
            {
                this.items.children[2].children[0].getComponent<cc.Label>(cc.Label).string="X"+count.toString();
            }
            else if(id == Define.prop_yanying)
            {
                this.items.children[3].children[0].getComponent<cc.Label>(cc.Label).string="X"+count.toString();
            }
            else if(id == Define.prop_zhiyayou)
            {
                this.items.children[4].children[0].getComponent<cc.Label>(cc.Label).string="X"+count.toString();
            }
        }
        // 接广告
        // WXHelper.showVideo(function(state){
        //     if(state == 1){

        //     }
        // }.bind(this))
    }
    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.getgold_btn,this.onClick.bind(this));
        Common.addClickEvent(this.close_btn,this.onClick.bind(this));
        Common.addClickEvent(this.getgold_btn1,this.onClick.bind(this));
        Common.addClickEvent(this.shipinggetgold_btn,this.onClick.bind(this));
    }
    
    onClick(tag:string){
        if(tag == "close_btn"){
            UIManager.getInstance().hideView(Define.viewGoldLack)
        }else if(tag == "getgold_btn"||tag == "getgold_btn1"){ 
            //TODO非强制指引   
            UIManager.getInstance().hideView(Define.viewGoldLack,function(){
                UIManager.getInstance().hideView(Define.viewChallengePrompt)
                UIManager.getInstance().sendMessage(Define.viewStart,"yindao",this)
                //UIManager.getInstance().hideView(Define.viewMain)
            }.bind(this))    
        }else if(tag =="shipinggetgold_btn"){
            WXHelper.showVideo(function(state){
                if(state == 1){
                    UserInfo.addRewardInfo(LDataGiftsManager.GetDataById(3).award);                    
                    Common.showRewardView(LDataGiftsManager.GetDataById(3).award);
                    UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo");
                    UIManager.getInstance().hideView(Define.viewGoldLack)
                }else{
                    Common.showPrompt("广告未观看完，不能领取奖励。");
                }
                SoundManager.pauseBackGroundSound(false,Common.curMusicRes);
            }.bind(this)) 
        }
    }

    //额外的事件调用
    message(tag:string = "defualt",args: any = null){
        if(tag == "jingbi"){
            this.lose_lab.string="金币不足，去赚些金币吧！" 
            this.items.active=false;
            if(WXHelper.isLoadVideoSuccessful)
            //if(false)
            {
                this.items.active=true;
                this.lose_lab.string="金币不足，看视频获得"
            }          
        }else if(tag == "daoju"){
            this.lose_lab.string="道具不足，去赚些道具吧！"
            this.items.active=false;
            if(WXHelper.isLoadVideoSuccessful)
            //if(false)
            {
                this.items.active=true;
                this.lose_lab.string="道具不足，看视频获得"
            } 
        }
    }
    start () {
    }
    // update (dt) {}
}