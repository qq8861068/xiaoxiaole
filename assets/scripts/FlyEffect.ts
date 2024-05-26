import Common from "./common/Common";
import Define from "./common/Define";
import UIManager from "./manager/UIManager";

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
export default class FlyEffect extends cc.Component {


    static effectIdList:number [] = [0,Define.skeleton_tishi2,Define.skeleton_tishi1,Define.skeleton_tishi3,Define.skeleton_tishi4,Define.skeleton_tishi5]

    static effectIdList2:number[]=[0,Define.skeleton_kouhong,Define.skeleton_xiangshui,Define.skeleton_fenbing,Define.skeleton_yanying,Define.skeleton_zhijiayou];
    start () {

    }
    
    Fly(startPos:cc.Vec2,targetPos:cc.Vec2,delayTime:number,blockId:number,callBack:Function){

        this.node.position = new cc.Vec2(-9999,-9999)
        this.node.runAction(cc.sequence(cc.delayTime(delayTime),cc.callFunc(function(){
            this.node.position = startPos
            this.node.runAction(cc.sequence(cc.moveTo(0.5,targetPos),cc.callFunc(function(){
                UIManager.getInstance().sendMessage(Define.viewMain,'subStep',null)
                this.node.destroy()
                Common.playSkeletonById(Define.skeleton_shengyufeixiao2,Common.nodeSpineRoot,targetPos.x,targetPos.y,function(effectNode:cc.Node){
                    
                    effectNode.runAction(cc.sequence(cc.delayTime(0.8),cc.callFunc(function(){
    
                        Common.playSkeletonById(FlyEffect.effectIdList[blockId],Common.nodeSpineRoot,targetPos.x,targetPos.y,function(effectNode1:cc.Node){
                            //effectNode1.scale=0.8;
                            UIManager.getInstance().sendMessage(Define.viewMain,'bgEffect',effectNode1)
                            effectNode1.runAction(cc.sequence(cc.delayTime(0.2),cc.callFunc(function(){
                                if(callBack != null){
                                    callBack();
                                }
                            }.bind(this))))           
                        }.bind(this),false,false)
    
                    }.bind(this))))
    
                }.bind(this),false,true)
            }.bind(this))))

        }.bind(this))))
    }
}
