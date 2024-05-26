import DragEffect from "./DragEffect";

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
export default class DragBlock extends cc.Component {
    blockId:number = 1
    blockIndex:number = 0

    gotoInitPos(){
        this.node.position = this.node.getComponent<DragEffect>(DragEffect).initPos;
    }
    getInitPos(){
        return this.node.getComponent<DragEffect>(DragEffect).initPos;
    }
    upgradeDragBlock(){
        this.blockId = this.blockId + 1
        this.node.children[1].getComponent<cc.Label>(cc.Label).string = this.blockId.toString();
    }

    changeDragBlockPos(pos:cc.Vec2){
        this.node.position = pos
    }
}
