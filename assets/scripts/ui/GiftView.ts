import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import ViewBase from "./ViewBase";
import UserInfo from "../UserInfo";
import LDataGiftsManager from "../datas/LDataGiftsManager";

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
export default class GiftView extends ViewBase {

    @property(cc.Node)
    close_btn: cc.Node = null;
    @property(cc.Node)
    get_btn: cc.Node = null;
    @property(cc.Node)
    items_num: cc.Node = null;

    @property(cc.Label)
    gold_lab: cc.Label = null;

    refreshView(isFristRefresh:boolean = false){
        //道具金币奖励显示items_num，gold_lab
        let arrInfo:string [] = LDataGiftsManager.GetDataById(0).award.split(";")
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
    }
    onClick(tag:string){
        if(tag == "close_btn"){
            UIManager.getInstance().hideView(Define.viewGift)           
        }else if(tag == "get_btn"){ 
            // TODO道具领取    
            //let aa = LDataGiftsManager.GetDataById(0).award;
            UserInfo.addRewardInfo(LDataGiftsManager.GetDataById(0).award);            
            UserInfo.changeLoginState()
            //UIManager.getInstance().sendMessage(Define.viewStart,"refreshItem");


            Common.showRewardView(LDataGiftsManager.GetDataById(0).award);
            UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo");
            UIManager.getInstance().hideView(Define.viewGift)

            // UIManager.getInstance().showView(Define.viewShowReward,function(){
            //     UIManager.getInstance().sendMessage(Define.viewShowReward,"showReward",LDataGiftsManager.GetDataById(0).award);
            //     UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo");
            //     UIManager.getInstance().hideView(Define.viewGift) 
            // }.bind(this))        
        }
    }
    // update (dt) {}
}