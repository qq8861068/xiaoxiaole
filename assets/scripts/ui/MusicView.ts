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
export default class MusicView extends ViewBase {

    @property(cc.Node)
    btn_close: cc.Node = null;

    @property(cc.Node)
    btn_xunhuan: cc.Node = null;

    @property(cc.Node)
    node_item1: cc.Node = null;   
    @property(cc.Node)
    node_item2: cc.Node = null;
    @property(cc.Node)
    node_item3: cc.Node = null;
    @property(cc.Node)
    node_item4: cc.Node = null;

    @property(cc.Node)
    node_items: cc.Node = null;

    refreshView(isFristRefresh:boolean = false){

        this.changeMusicState(UserInfo.musicID);

        if(UserInfo.isLoop==1)
        {
            this.changeXun(true);
        }else{

            this.changeXun(false);
        }


    }

    changeXun(isLoop:boolean){
        this.btn_xunhuan.children[1].active = isLoop;
        this.btn_xunhuan.children[0].active = !isLoop;
    }

    addEvent(){
        Common.addClickEvent(this.node_item1,this.onClick.bind(this),false,null,true);
        Common.addClickEvent(this.node_item2,this.onClick.bind(this),false,null,true);
        Common.addClickEvent(this.node_item3,this.onClick.bind(this),false,null,true);
        Common.addClickEvent(this.node_item4,this.onClick.bind(this),false,null,true);
        Common.addClickEvent(this.btn_close,this.onClick.bind(this));
        Common.addClickEvent(this.btn_xunhuan,this.onClick.bind(this)); 
    }   


    onClick(tag:string){

        if(tag == "btn_close"){
            UIManager.getInstance().hideView(Define.viewMusic);
        }else if(tag == "btn_xunhuan"){
            if(UserInfo.isLoop==1){
                Common.changeMusicTaskTime.setPause(true);
                UserInfo.setisLoop(0);
                this.changeMusicState(0);
                SoundManager.pauseBackGroundSound(false,Define.backgroundmusic[0]);

                this.changeXun(false);
            }else{
                UserInfo.setisLoop(1);
                UserInfo.setMusicID(0);
                SoundManager.pauseBackGroundSound(false,Define.gamemusic[1],false);
                this.changeMusicState(1);
                Common.changeMusicTaskTime.setPause(false);

                this.changeXun(true);
            }         
        }else if(tag == "node_item1"){

            Common.changeMusicTaskTime.setPause(true);
            UserInfo.setisLoop(0);
            this.changeXun(false);

            if(UserInfo.musicID!=1){
                this.changeMusicState(1);
            }else{
                this.changeMusicState(0);
            }

        }else if(tag == "node_item2"){

            Common.changeMusicTaskTime.setPause(true);
            UserInfo.setisLoop(0);
            this.changeXun(false);

            if(UserInfo.musicID!=2){
                this.changeMusicState(2);
            }else{
                this.changeMusicState(0);
            }

        }else if(tag == "node_item3"){

            Common.changeMusicTaskTime.setPause(true);
            UserInfo.setisLoop(0);
            this.changeXun(false);

            if(UserInfo.musicID!=3){
                this.changeMusicState(3);
            }else{
                this.changeMusicState(0);
            }

        }else if(tag == "node_item4"){

            Common.changeMusicTaskTime.setPause(true);
            UserInfo.setisLoop(0);
            this.changeXun(false);

            if(UserInfo.musicID!=4){
                this.changeMusicState(4);
            }else{
                this.changeMusicState(0);
            }

        }
    }


    changeMusicState(itemId:number){
        if(itemId==0){
            UserInfo.setMusicID(0);
            if(UserInfo.isLoop==0){
                SoundManager.pauseBackGroundSound(false,Define.backgroundmusic[0]);
            }
            

            for(let i=0;i<4;i++){               
                this.node_items.children[i].children[0].active=false;
                this.node_items.children[i].children[1].active=true;
            }
            return;
        }
        else{
            for(let i=1;i<=4;i++){
                if(itemId==i){

                    UserInfo.setMusicID(itemId);
                    if(UserInfo.isLoop==1){

                        SoundManager.pauseBackGroundSound(false,Define.gamemusic[UserInfo.musicID],false);
                    }else{
                        SoundManager.pauseBackGroundSound(false,Define.gamemusic[UserInfo.musicID]);
                    }
                    

                    this.node_items.children[i-1].children[0].active=true;
                    this.node_items.children[i-1].children[1].active=false;
                }else{
                    this.node_items.children[i-1].children[0].active=false;
                    this.node_items.children[i-1].children[1].active=true;
                }
            }
        }      
    }

    message(tag:string = "defualt",args: any = null){
        if(tag == "changeMusic"){
            this.changeMusicState(Number(args))
        }
    }
    //只调用一次
    initView(){
    }
    

}
