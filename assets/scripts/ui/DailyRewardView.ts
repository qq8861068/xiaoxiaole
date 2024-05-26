import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import LDataGiftsManager from "../datas/LDataGiftsManager";
import UserInfo from "../UserInfo";
import WXHelper from "../common/WXHelper";
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
export default class DailyRewardView extends ViewBase {


    @property(cc.Node)
    close_btn: cc.Node = null;

    @property(cc.Node)
    get_btn: cc.Node = null;

    @property(cc.Node)
    get_btn1: cc.Node = null;

    @property(cc.Node)
    shipingget_btn: cc.Node = null;

    @property(cc.Node)
    items_num: cc.Node = null;

    @property(cc.Label)
    gold_lab: cc.Label = null;

    refreshView(isFristRefresh:boolean = false){
        if(WXHelper.isLoadVideoSuccessful)
        {
            this.get_btn.active=false;
            this.get_btn1.active=true;
            this.shipingget_btn.active=true;
        }else 
        {
            this.get_btn.active=true;
            this.get_btn1.active=false;
            this.shipingget_btn.active=false;
        }
        //道具金币奖励显示items_num，gold_lab
        let arrInfo:string [] = LDataGiftsManager.GetDataById(1).award.split(";")
        console.log("******************");
        for (let index = 0; index < arrInfo.length; index++) {
            let info:string [] = arrInfo[index].split(",")
            let id:number = Number(info[0])
            let count:number = Number(info[1])

            if(id == Define.prop_kouhong)
            {
                this.items_num.children[0].getComponent<cc.Label>(cc.Label).string="x"+count.toString();               
            }else if(id == Define.prop_gold)
            {
                this.gold_lab.string="x"+ count.toString();
            }else if(id == Define.prop_xiangshui)
            {
                this.items_num.children[1].getComponent<cc.Label>(cc.Label).string="x"+count.toString();
            }
            else if(id == Define.prop_fenbing)
            {
                this.items_num.children[2].getComponent<cc.Label>(cc.Label).string="x"+count.toString();
            }
            else if(id == Define.prop_yanying)
            {
                this.items_num.children[3].getComponent<cc.Label>(cc.Label).string="x"+count.toString();
            }
            else if(id == Define.prop_zhiyayou)
            {
                this.items_num.children[4].getComponent<cc.Label>(cc.Label).string="x"+count.toString();
            }
        }
    }

    addEvent(){
        Common.addClickEvent(this.close_btn,this.onClick.bind(this));
        Common.addClickEvent(this.get_btn,this.onClick.bind(this));
        Common.addClickEvent(this.get_btn1,this.onClick.bind(this));
        Common.addClickEvent(this.shipingget_btn,this.onClick.bind(this));
    }

    onClick(tag:string){
        if(tag == "close_btn"){
            UIManager.getInstance().hideView(Define.viewDailyReward)           
        }else if(tag == "get_btn"||tag == "get_btn1"){ 
            // TODO道具领取    
            //let aa = LDataGiftsManager.GetDataById(0).award;
            UserInfo.addRewardInfo(LDataGiftsManager.GetDataById(1).award);            
            UserInfo.changeLoginState()

            UserInfo.addDayRewardCount();


            Common.showRewardView(LDataGiftsManager.GetDataById(1).award);
            UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo");
            UIManager.getInstance().hideView(Define.viewDailyReward)
            // UIManager.getInstance().showView(Define.viewShowReward,function(){
            //     UIManager.getInstance().sendMessage(Define.viewShowReward,"showReward",LDataGiftsManager.GetDataById(1).award);
                 
            // }.bind(this))
            //UIManager.getInstance().sendMessage(Define.viewStart,"refreshItem");
                      
        }else if(tag =="shipingget_btn")
        {

             // 接广告
            WXHelper.showVideo(function(state){
                if(state == 1){
                    UserInfo.addRewardInfo(LDataGiftsManager.GetDataById(2).award);            
                    UserInfo.changeLoginState()
        
                    //添加每日领取奖励的次数
                    UserInfo.addDayRewardCount();
               
                    Common.showRewardView(LDataGiftsManager.GetDataById(2).award);
                    UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo");
                    UIManager.getInstance().hideView(Define.viewDailyReward)
                }else{
                    Common.showPrompt("广告未观看完，不能领取奖励。");
                }
                SoundManager.pauseBackGroundSound(false,Common.curMusicRes)
            }.bind(this))

        }
    }
   

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
