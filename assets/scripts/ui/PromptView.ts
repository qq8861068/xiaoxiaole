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
export default class PromptView extends cc.Component {

    @property(cc.Label)
    text_desc: cc.Label = null;

    showPrompt(desc:string){
        Common.nodeUiRoot.addChild(this.node);
        this.text_desc.string = desc
        this.node.setSiblingIndex(this.node.getParent().childrenCount)

        this.node.children[0].setScale(1,0)
        this.node.children[0].runAction(cc.sequence(cc.scaleTo(0.2,1,1),cc.delayTime(1.2),cc.scaleTo(0.3,1,0),cc.callFunc(function(){
            this.node.destroy()
        }.bind(this))))        
    }
}
