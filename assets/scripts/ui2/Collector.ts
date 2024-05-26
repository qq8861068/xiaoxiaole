import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import Common from "../common/Common";

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
export default class Collector extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    start () {

    }

    collect(){
        let pos=this.node.position;
        let action1=cc.sequence(cc.callFunc(function(){
            UIManager.getInstance().sendMessage(Define.viewPasture,"show_build",0);
        },this),cc.moveTo(1.0,Common.pastureView.buildPosNodes[0].position.add(cc.v2(0,200))).easing(cc.easeCubicActionOut()),cc.delayTime(0.6),cc.callFunc(function(){
            UIManager.getInstance().sendMessage(Define.viewPasture,"collect",0);
        },this),cc.delayTime(0.6));

        let action2=cc.sequence(cc.callFunc(function(){
            UIManager.getInstance().sendMessage(Define.viewPasture,"show_build",1);
        },this),cc.moveTo(1.0,Common.pastureView.buildPosNodes[1].position.add(cc.v2(0,130)).add(cc.v2(0,170))).easing(cc.easeCubicActionOut()),cc.delayTime(0.6),cc.callFunc(function(){
            UIManager.getInstance().sendMessage(Define.viewPasture,"collect",1);
        },this),cc.delayTime(0.6));

        let action3=cc.sequence(cc.callFunc(function(){
            UIManager.getInstance().sendMessage(Define.viewPasture,"show_build",2);
        },this),cc.moveTo(1.0,Common.pastureView.buildPosNodes[2].position.add(cc.v2(0,-70)).add(cc.v2(0,170)).add(cc.v2(0,170))).easing(cc.easeCubicActionOut()),cc.delayTime(0.6),cc.callFunc(function(){
            UIManager.getInstance().sendMessage(Define.viewPasture,"collect",2);
        },this),cc.delayTime(0.6),cc.moveTo(1.0,pos).easing(cc.easeCubicActionIn()),cc.callFunc(function(){
            UIManager.getInstance().sendMessage(Define.viewPasture,"collect_ok");
        },this),cc.removeSelf());
        this.node.runAction(cc.sequence(action1,action2,action3));
    }
    // update (dt) {}
}
