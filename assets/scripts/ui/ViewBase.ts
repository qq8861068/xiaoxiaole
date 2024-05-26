import Define from "../common/Define";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewBase extends cc.Component {

    private isInit:boolean = true;
    protected showActionType:number = Define.center;
    protected actionDelayTime:number = 0;

    isShow:boolean = false;
    private isFirstShow:boolean = false
    //显示
    showView(){
        //只有第一次显示才会添加事件
        this.isFirstShow = false
        if(this.isInit){
            this.initView();
            this.addEvent();
            this.isInit = false;
            this.isFirstShow = true
        }

        this.node.setSiblingIndex(this.node.getParent().childrenCount)

        this.isShow = true;
        this.node.position = cc.Vec2.ZERO
        this.node.active = true;
        this.showAction();
        this.refreshView(this.isFirstShow);
    }
    
    //隐藏
    hideView(){
        this.node.position = new cc.Vec2(-9999,-9999);
        this.node.active = false;
        this.isShow = false;
        this.onHideView();
    }
    onHideView(){

    }

    refreshView(isFristRefresh:boolean = false){

    }

    //点击点击事件 //只调用一次
    addEvent(){
        //   Common.addClickEvent(this.btn_getReward,this.onClick.bind(this));
    }
    /*
    onClick(tag:string){
        if(tag == "btn_getReward"){
        }
    }*/
    //只调用一次
    initView(){

    }

    //显示界面的动作
    showAction(){

        if(this.showActionType == Define.left){
            this.node.children[1].position = new cc.Vec2(Define.designResolutionW*-1,0);
        }else if(this.showActionType == Define.right){
            this.node.children[1].position = new cc.Vec2(Define.designResolutionW,0);
        }else if(this.showActionType == Define.down){
            this.node.children[1].position = new cc.Vec2(0,-1*Define.designResolutionH);
        }else if(this.showActionType == Define.up){
            this.node.children[1].position = new cc.Vec2(0,Define.designResolutionH);
        }else{
            return
        }

        let moveAction = cc.moveTo(0.5,cc.Vec2.ZERO).easing(cc.easeBackOut());
        this.node.children[1].runAction(cc.sequence(cc.delayTime(this.actionDelayTime),moveAction,cc.callFunc(function(){
            this.showActionCallBack()
        }.bind(this))));
    }
    //动作完成回调
    showActionCallBack(){

    }
    //额外的事件调用
    message(tag:string = "defualt",args: any = null){

    }
}
