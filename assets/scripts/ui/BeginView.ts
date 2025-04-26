import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import UserInfo from "../UserInfo";
import BlockManager from "../manager/BlockManager";
import LDataLevelsManager from "../datas/LDataLevelsManager";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;


class CollectInf {
    node: cc.Node;
    blockId: number;
    curCount: number;
    maxCount: number;
    constructor(node: cc.Node, blockId: number, curCount: number, maxCount: number) {
        this.node = node;
        this.blockId = blockId;
        this.curCount = curCount;
        this.maxCount = maxCount;
    }
}
@ccclass
export default class BeginView extends ViewBase {



    @property(cc.Node)
    btn_start: cc.Node = null;

    @property(cc.Node)
    close_btn: cc.Node = null;

    @property(cc.Node)
    node_items: cc.Node = null;

    @property(cc.Node)
    node_item: cc.Node = null;

    @property(cc.Label)
    text_level: cc.Label = null;

    collectInfo: CollectInf[] = []

    collectPos: cc.Vec2[] = []


    refreshView(isFristRefresh: boolean = false) {

        // Common.mapLevel = UserInfo.userLevel>Common.maxLevel?Common.getRandom(38,Common.maxLevel+1):UserInfo.userLevel;

        this.text_level.string = Common.mapLevel.toString();
        this.text_level.node.active = false
        this.text_level.node.active = true
        console.log("开始界面初始化关卡数据");
        this.showLevelInfo();
    }


    addEvent() {
        Common.addClickEvent(this.btn_start, this.onClick.bind(this));
        Common.addClickEvent(this.close_btn, this.onClick.bind(this));
    }

    hideView() {
        super.hideView();
        this.node_items.removeAllChildren(true)
    }


    showLevelInfo() {

        Common.curLevelData = LDataLevelsManager.GetDataById(Common.mapLevel);
        //BlockManager.getInstance().initAllBlocks(null,null);
        console.log("开始界面初始化关卡数据");
        this.collectInfo = []
        this.collectPos = []
        let infoArr: string[] = Common.curLevelData.collectInfo.split(';')
        for (let index = 0; index < infoArr.length; index++) {
            let arr: string[] = infoArr[index].split(',')
            let tempNode: cc.Node = cc.instantiate(this.node_item)
            this.collectInfo.push(new CollectInf(tempNode, Number(arr[0]), 0, Number(arr[1])))
        }

        for (let index = 0; index < this.collectInfo.length; index++) {
            let info: CollectInf = this.collectInfo[index]
            info.node.position = cc.Vec2.ZERO


            //判断是收集道具还是形状
            if (info.blockId < 18) {
                Common.collectFormID = 0;
                let tempNode = info.node.children[1]
                tempNode.children[2].getComponent<cc.Label>(cc.Label).string = info.maxCount.toString()
                tempNode.children[0].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock.getSpriteFrame(Define.blockIconArr[info.blockId])
                this.node_items.addChild(info.node)
            } else if (info.blockId >= 18 && info.blockId < 24) {

                Common.collectFormID = info.blockId;
                info.node.getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.atlasBlock1.getSpriteFrame("shoujixingzhuang_dizuo");
                let tempNode = info.node.children[1]
                tempNode.children[2].getComponent<cc.Label>(cc.Label).string = info.maxCount.toString()
                tempNode.children[0].getComponent<cc.Sprite>(cc.Sprite).spriteFrame = Common.getFormSpriteFrame(info.blockId);
                this.node_items.addChild(info.node)
            }
        }

        this.node_items.getComponent<cc.Layout>(cc.Layout).updateLayout()
        for (let index = 0; index < this.collectInfo.length; index++) {
            let info: CollectInf = this.collectInfo[index]
            this.collectPos[info.blockId] = info.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        }
        // this.collectPos[info.blockId] = info.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        console.log(this.collectPos)

        //this.node_itemBg.width = this.collectInfo.length * 85
    }

    onClick(tag: string) {
        if (tag == "btn_start") {
            //开始游戏这里要判断体力
            if (UserInfo.userXin <= 0) {
                UserInfo.userXin = 0;
                console.log('无体力值');
                UIManager.getInstance().showView(Define.viewNoXin);
                return;
            }
            UserInfo.userXin -= 1;
            UIManager.getInstance().showView(Define.viewMain, function () {
                UIManager.getInstance().hideView(Define.viewBegin)
                if (UIManager.getInstance().isShow(Define.viewPasture)) {
                    UIManager.getInstance().hideView(Define.viewPasture)
                }
                if (UIManager.getInstance().isShow(Define.viewStart)) {
                    UIManager.getInstance().hideView(Define.viewStart)
                }
            }.bind(this))

            // UIManager.getInstance().showView(Define.viewMain,function(){
            //     UIManager.getInstance().hideView(Define.viewVictory)               
            // }.bind(this))

        } else if (tag == "close_btn") {
            UIManager.getInstance().hideView(Define.viewBegin);
            // UIManager.getInstance().showView(Define.viewStart,function(){
            //     UIManager.getInstance().hideView(Define.viewVictory)
            //     UIManager.getInstance().hideView(Define.viewMain)                          
            // }.bind(this))           
        }
    }
    // LIFE-CYCLE CALLBACKS:

    start() {

    }
}