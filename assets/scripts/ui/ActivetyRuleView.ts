import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";

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
export default class ActivetyRuleView extends ViewBase {

    @property (cc.Node)
    btn_close:cc.Node = null;

    @property (cc.Node)
    btn_confirm:cc.Node = null;

    @property (cc.Label)
    text_desc:cc.Label = null;

    @property (cc.Label)
    text_desc1:cc.Label = null;

    @property (cc.Label)
    text_desc2:cc.Label = null;

    refreshView(isFristRefresh:boolean = false){
        this.text_desc.node.active = false
        this.text_desc1.node.active = false
        this.text_desc2.node.active = false
    }

    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_confirm,this.onClick.bind(this));
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));
    }
    
    onClick(tag:string){
        if(tag == "btn_confirm" || tag == "btn_close" ){
            UIManager.getInstance().hideView(Define.viewActivetyRule)
        }
    }

    //额外的事件调用
    message(tag:string = "defualt",args: any = null){ 
        // 0 闯三关规则  1是摇奖规则 2兑换活动
        if(args == 0){
            this.text_desc.node.active = true
        }else if(args == 1){
            this.text_desc1.node.active = true
        }else if(args == 2){
            this.text_desc2.node.active = true 
        }
    }
}
