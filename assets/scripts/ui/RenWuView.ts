import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RenWuView extends ViewBase {

    @property(cc.Node) renwu_btn_close: cc.Node = null;

    refreshView(isFristRefresh: boolean = false) {

    }

    addEvent() {
        Common.addClickEvent(this.renwu_btn_close, this.onClick.bind(this));
    }

    onClick(tag: string) {
        if (tag == "renwu_btn_close") {
            UIManager.getInstance().hideView(Define.viewRenWu);
        }
    }

    start() {
    }

    // update (dt) {}
}
