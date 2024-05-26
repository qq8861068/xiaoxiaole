import ViewBase from "./ViewBase";
import Common from "../common/Common";
import ScollHelper from "../common/ScollHelper";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import HttpManager from "../manager/HttpManager";

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
export default class ExchangeCodeRecordView extends ViewBase {

    
    @property(cc.Node)
    btn_close:cc.Node = null;

    @property(cc.Node)
    node_items:cc.Node = null;

    @property(ScollHelper)
    scroll_helper:ScollHelper = null;

    refreshView(isFristRefresh:boolean = false){
        this.node_items.active = true
        
        HttpManager.getInstance().getAllCDKey(function(data){
            if(data.obj != null){
                let datas = data.obj
                console.log(datas)
                this.scroll_helper.initItems(datas.length,5,function(idx:number, objIdx:number, obj:cc.Node){
                    if(datas[idx] != null){
                        obj.children[1].getComponent<cc.Label>(cc.Label).string = datas[idx].cd_key

                        if(datas[idx].state == 0){
                            obj.children[2].active = true
                            obj.children[3].active = false
                        }else{
                            obj.children[2].active = false
                            obj.children[3].active = true
                        }
                    }
                }.bind(this),false)
            }
        }.bind(this))


    }

    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));
    }
    
    onClick(tag:string){
        if(tag == "btn_close"){
            UIManager.getInstance().hideView(Define.viewExchangeCodeRecord)
        }
    }
}
