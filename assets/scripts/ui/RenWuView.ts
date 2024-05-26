import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RenWuView extends ViewBase {

    @property(cc.Node) renwu_btn_close: cc.Node = null;
    @property(cc.Node) renwu_bk: cc.Node = null;

    refreshView(isFristRefresh:boolean = false){
        //弹出动画
        this.renwu_bk.stopAllActions();
        //延迟一帧，等待父节点适配全屏
        this.scheduleOnce(() => {
            this.renwu_bk.y = -1800;
            const aimY = -this.renwu_bk.parent.height / 2;
            this.renwu_bk.runAction(cc.moveTo(0.2, 0, aimY).easing(cc.easeOut(2.0)));
        }, 0);
    }

    addEvent(){
        Common.addClickEvent(this.renwu_btn_close,this.onClick.bind(this));
    }

    onClick(tag:string){
        if (tag == "renwu_btn_close"){
            this.renwu_bk.runAction(
                cc.sequence(
                    cc.moveTo(0.2, 0, -1800).easing(cc.easeIn(2.0)),
                    cc.callFunc(() => {
                        UIManager.getInstance().hideView(Define.viewRenWu);

                    })
                )
            )
        }
    }

    start () {
    }

    // update (dt) {}
}
