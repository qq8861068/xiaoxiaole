import ViewBase from "./ViewBase";
import UIManager from "../manager/UIManager";
import GameManager from "../manager/GameManager";
import Define from "../common/Define";
import TimeTaskManager from "../manager/TimeTaskManager";
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
export default class LoadingView extends ViewBase {


    @property(cc.Node)
    bar: cc.Node = null;

    @property(cc.Label)
    load_lab: cc.Label = null;

    loadProgress:number = 0;
    isLoadFinish:boolean = false;
    isLoadGuidSound:boolean = false;

    addTime:number = 0.8
    barRectWidth:number=0;
    
    refreshView(isFristRefresh:boolean = false){
        //this.loadingbar.progress=0;
        
        this.bar.width=0;
        this.load_lab.string="0%";

        this.barRectWidth=this.bar.getComponent(cc.Sprite).spriteFrame.getRect().width;
        //console.log("888888888888888888888888888888888888"+this.barRectWidth);

        TimeTaskManager.addTimeTask(0.01,function(){
            this.loadProgress = this.loadProgress + this.addTime
            if(!this.isLoadFinish || !this.isLoadGuidSound){
                if(this.loadProgress > 98){
                    this.loadProgress = 98
                    this.bar.width=this.barRectWidth*0.95;
                }else if(this.loadProgress > 90){
                    this.addTime = 0.01
                }else if(this.loadProgress > 70){
                    this.addTime = 0.3
                }else if(this.loadProgress > 50){
                    this.addTime = 0.6
                }
            }else{
                this.addTime = 0.8
            }
            if(this.loadProgress > 100){
                this.loadProgress = 100
                this.bar.width=this.barRectWidth;

            }
            let progress = Math.ceil(this.loadProgress); 
            this.bar.width=this.barRectWidth*progress/100;

            //this.loadingbar.progress = progress/100;
            this.message("update",progress)
            if(this.loadProgress >= 100){
                GameManager.getInstance().init()
                UIManager.getInstance().hideView(Define.viewLoading)
                TimeTaskManager.removeTimeTask("loadProgress")
            }
            
        }.bind(this),"loadProgress")

        cc.loader.loadResDir("prefabs",function(completedCount: number, totalCount: number, item: any){
            // console.log("completedCount = " + completedCount);
            // console.log("totalCount = " + totalCount);
            // let progress=Math.ceil(completedCount/totalCount*100); 
            // this.loadingbar.progress = progress/100;
            // this.message("update",progress)

        }.bind(this),function (err, assets) {
            
                this.isLoadFinish = true
            
        }.bind(this));

        cc.loader.loadResDir("guidsounds",cc.AudioClip,function(error: Error, resource: any[], urls: string[]){
            console.log("load guid sounds ok");
            for(let k=0;k<resource.length;++k){
                let res=resource[k];
                SoundManager.addGuidSound(res.name,res);
            }
            this.isLoadGuidSound=true;
        }.bind(this));

    }

    message(tag:string = "defualt",args: any = null){
        if(tag == "update"){
            this.load_lab.string=args+"%";          
        }
    }
}
