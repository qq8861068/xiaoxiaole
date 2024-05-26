import ViewBase from "../ui/ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import GameManager from "../manager/GameManager";
import UserInfo from "../UserInfo";
import SoundManager from "../manager/SoundManager";
import WXHelper from "../common/WXHelper";
import HttpManager from "../manager/HttpManager";
import LDataConsume from "../datas/LDataConsume";
import LDataConsumeManager from "../datas/LDataConsumeManager";
import GuidanceMgr from "../manager/GuidanceMgr";
import LDataBiology from "../datas/LDataBiology";
import ResManager from "../manager/ResManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopItem extends cc.Component {

    @property(cc.Sprite)
    item_spt:cc.Sprite = null;

    @property(cc.Node)
    item_node:cc.Node = null;

    @property(cc.Node)
    btn_buy:cc.Node=null;

    @property(cc.Label)
    label_price:cc.Label=null;

    @property(cc.Node)
    btn_buy_disabled:cc.Node=null;

    @property(cc.Node)
    spt_an:cc.Node=null;

    @property(cc.Label)
    label_unlock:cc.Label=null;
    
    data:LDataBiology=null;
    noStar=false;
    onLoad(){
        this.btn_buy.on(cc.Node.EventType.TOUCH_END, (e: cc.Event.EventTouch) => this.onClick(e))
    }
    setDisable(){
        this.btn_buy.active=false;
        this.btn_buy_disabled.active=true;
    }
    showBuyGrade(grade:number){
        this.label_unlock.node.active=true;
        this.label_unlock.string=grade.toString()+"级解锁";
        this.spt_an.active=true;
    }

    initWithData(data:LDataBiology){
        this.data=data;
        ResManager.loadFrame("pasturetextures/"+data.icon,function(frame){
            this.item_spt.spriteFrame=frame;
        }.bind(this));
        this.label_price.string=data.price.toString();
    }

    onClick (event:cc.Event.EventTouch){
        if(this.noStar){
            UIManager.getInstance().hideView(Define.viewShop);
            UIManager.getInstance().showView2(Define.viewNoEnoughStar);
        }else{
            Common.curBuyId=this.data.ID;
            UIManager.getInstance().hideView(Define.viewShop);
            UIManager.getInstance().showView2(Define.viewBuy);
        }

    }
   


}