import ViewBase from "./ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import UserInfo from "../UserInfo";
import SoundManager from "../manager/SoundManager";

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
export default class SetupView extends ViewBase {
 
    @property(cc.Node)
    btn_close: cc.Node = null;

    @property(cc.Node)
    btn_close1: cc.Node = null;

    @property(cc.Node)
    node_item1: cc.Node = null;
    
    
    @property(cc.Node)
    node_item2: cc.Node = null;

    @property(cc.Node)
    node_item3: cc.Node = null;


    refreshView(isFristRefresh:boolean = false){
        this.changeItemState(this.node_item1,false)
        this.changeItemState(this.node_item2,false)
        this.changeItemState(this.node_item3,false)
    }

    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.node_item1,this.onClick.bind(this),false,null,true);
        Common.addClickEvent(this.node_item2,this.onClick.bind(this),false,null,true);
        Common.addClickEvent(this.node_item3,this.onClick.bind(this),false,null,true);
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));
        Common.addClickEvent(this.btn_close1,this.onClick.bind(this));
    }
    
    onClick(tag:string){
        if(tag == "btn_close"||tag == "btn_close1"){
            UIManager.getInstance().hideView(Define.viewSetup)
        }else if(tag == "node_item1"){
            this.changeItemState(this.node_item1,true)
        }else if(tag == "node_item2"){  
            this.changeItemState(this.node_item2,true)
        }else if(tag == "node_item3"){
            this.changeItemState(this.node_item3,true)
        }
    }

    changeItemState(nodeItem:cc.Node,isChange:boolean){
        let openTag:boolean = false
        if(isChange){
            if(nodeItem.name == "node_item1"){ //音效   
                UserInfo.openSoundTag = UserInfo.openSoundTag==0?1:0
                openTag = UserInfo.openSoundTag==0?true:false
            }else if(nodeItem.name == "node_item2"){ //音乐
                UserInfo.openMusicTag = UserInfo.openMusicTag==0?1:0
                openTag = UserInfo.openMusicTag==0?true:false
            }else if(nodeItem.name == "node_item3"){ //震动
                UserInfo.openBrateTag = UserInfo.openBrateTag==0?1:0
                openTag = UserInfo.openBrateTag==0?true:false
            }
            UserInfo.saveSetUpState()
        }else{
            if(nodeItem.name == "node_item1"){ //音效   
                openTag = UserInfo.openSoundTag==0?true:false
            }else if(nodeItem.name == "node_item2"){ //音乐
                openTag = UserInfo.openMusicTag==0?true:false
            }else if(nodeItem.name == "node_item3"){ //震动
                openTag = UserInfo.openBrateTag==0?true:false
            }
        }
        //这里额外处理背景音效
        if(nodeItem.name == "node_item2" && isChange){
            if(openTag){
                SoundManager.pauseBackGroundSound(false,Common.curMusicRes)
            }else{
                SoundManager.pauseBackGroundSound(true,Common.curMusicRes)
            }
        }

        if(openTag){
            nodeItem.children[0].active = true
            nodeItem.children[1].active = false
        }else{
            nodeItem.children[0].active = false
            nodeItem.children[1].active = true
        }    
    }
    //只调用一次
    initView(){

    }

}
