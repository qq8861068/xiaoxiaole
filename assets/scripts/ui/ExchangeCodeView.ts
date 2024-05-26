import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import HttpManager from "../manager/HttpManager";
import WXHelper from "../common/WXHelper";

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
export default class ExchangeCodeView extends ViewBase {

    @property(cc.Node)
    btn_close:cc.Node = null;

    @property(cc.Node)
    btn_exchange:cc.Node = null;

    @property(cc.Node)
    btn_myExchangeCode:cc.Node = null;

    @property(cc.Node)
    btn_server:cc.Node = null;

    @property(cc.Label)
    text_count:cc.Label = null;

    @property(cc.Label)
    text_desc:cc.Label = null; //获得激活码后请联系客服  //
    
    @property(cc.Node)
    btn_help:cc.Node = null;
    //最大兑换次数
    exchangeMaxCount:number = 66;

    refreshView(isFristRefresh:boolean = false){
        this.text_desc.string = "获得激活码后请联系客服"
        HttpManager.getInstance().checkLottery(function(info){
            if(info != null){
                Common.userLotteryResidueCount = info.residue //剩余抽奖的次数
                this.text_count.string = Common.userLotteryResidueCount.toString()
            }
        }.bind(this))
    }

    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));
        Common.addClickEvent(this.btn_exchange,this.onClick.bind(this));
        Common.addClickEvent(this.btn_myExchangeCode,this.onClick.bind(this));
        Common.addClickEvent(this.btn_server,this.onClick.bind(this));
        Common.addClickEvent(this.btn_help,this.onClick.bind(this));
    }
    
    onClick(tag:string){
        if(tag == "btn_close"){
            UIManager.getInstance().hideView(Define.viewExchangeCode)
        }else if(tag == "btn_exchange"){
            if(Common.userLotteryResidueCount >= this.exchangeMaxCount){
                //说明可以执行兑换
                HttpManager.getInstance().exchangeCode(function(data){
                    if(data.obj != null){
                        //说明兑换成
                        this.text_desc.string = data.obj
                        Common.userLotteryResidueCount = Common.userLotteryResidueCount - 66  //Todo:修改次数记得修改显示
                        this.text_count.string = Common.userLotteryResidueCount.toString()
                        Common.showPrompt("兑换成功，请联系客服。")
                    }
                }.bind(this))
            }else{
                Common.showPrompt("兑换失败。")
            }
        }else if(tag == "btn_myExchangeCode"){
            UIManager.getInstance().showView(Define.viewExchangeCodeRecord)
        }else if(tag == "btn_server"){
            WXHelper.openCustomerServiceConversation()
        }else if(tag == "btn_help"){
            UIManager.getInstance().showView(Define.viewActivetyRule,function(){
                UIManager.getInstance().sendMessage(Define.viewActivetyRule,"",2)
            }.bind(this))
        }
    }
}
