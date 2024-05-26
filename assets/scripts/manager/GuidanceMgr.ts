import LDataGuidance from "../datas/LDataGuidance";
import LDataGuidanceManager from "../datas/LDataGuidanceManager";
import UserInfo from "../UserInfo";
import Define from "../common/Define";
import UIManager from "./UIManager";
import SoundManager from "./SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GuidanceMgr {
    private static instance:GuidanceMgr = null;
    private guidBlocks:number[][]=[
        [],//0 null
        [],//1
        [],//2
        [9,2],//3lianxiao 3
        [7,3],//4lianxiao  5
        [3,7],//fangkuai   4
        [3,0],//5lianxiao  6
        [3,0],//5lianxiao  7
        [3,0],//5lianxiao  8
        [3,0],//5lianxiao  9
        [3,0],//5lianxiao  10
        [3,0]//5lianxiao  11

    ];
    private delays:number[]=[0.1,3.8,3.3,3.1,3.1,3.8,4.4,4.0,4.3,3.9,4.3,4.3];
    private guidDirs:number[]=[-1,-1,-1,Define.right,Define.up,Define.up,Define.right,-1,-1,-1,-1,-1];
    private curId=0;
    public maxId = 10;
    public maxBigStep=3;
    isFinished = false;
    isShowing=false;
    
    public static getInstance():GuidanceMgr{
        if(this.instance == null){
            this.instance = new GuidanceMgr();
        }
        return this.instance;
    }

    /* 得到helpId（小步）所属于的大步 */
    public getBigStepById(helpId:number):number{
        if(helpId<=0){
            return 0;
        }
        if(helpId>this.maxId){
            return this.maxBigStep+1;
        }
        let data=LDataGuidanceManager.GetDataById(helpId);
        return data.bigStep;
    }

    public getGuidDir():number{
        let curBig=this.getBigStepById(3);
        let fBig=this.getFinishedBigStep();
        if(fBig>=curBig){return -1;}
        if(this.isFinished){
            return -1;
        }
        if(this.isShowing===false){
            if(this.curId>=3 && this.curId<=7){
                return -1;
            }
        }
        if(this.curId>=3 && this.curId<=7){
            let dir=this.guidDirs[this.curId];
            return dir;
        }else{
            return -1;
        }
    }

    /*得到当前引导音效的播放时间 秒*/
    public getDelayById(helpId:number):number{
        if(helpId<0 || helpId>this.maxId){
            console.log("err getDelayById:helpId="+helpId);
            return 0.1;
        }
        return this.delays[helpId];
    }

    /* 得到helpId(小步)所对应的提示信息 */
    public getTishiById(helpId:number):string{
        let data=LDataGuidanceManager.GetDataById(helpId);
        return data.msg;
    }

    /* 得到当前完成到哪一大步，初次进游戏返回0 */
    public getFinishedBigStep():number{
        let ret = UserInfo.getItem("helpBigStep",true);
        if(ret>=this.maxBigStep){
            this.isFinished=true;
        }
        return ret;
    }

    /* 设置当前完成的大步 */
    public setFinishedBigStep(step:number){
        UserInfo.setItem("helpBigStep",step);
        if(step>=this.maxBigStep){
            this.isFinished=true;
        }
    }

    public isGuidBlock(row:number,col:number):boolean{
        let curBig=this.getBigStepById(3);
        let fBig=this.getFinishedBigStep();
        if(fBig>=curBig){return true;}
        if(this.isFinished){
            return true;
        }
        if(this.isShowing===false){
            if(this.curId>=3 && this.curId<=7){
                return false;
            }
        }
        if(this.curId>=3 && this.curId<=7){
            let pos=this.guidBlocks[this.curId];
            if(pos.length>1 && row===pos[0] && col===pos[1]){
                return true;
            }
            return false;
        }else{
            return true;
        }
        
    }
    public setCurId(curId:number){
        this.curId=curId;
    }
    public getCurId():number{
        return this.curId;
    }
    public getCurIdByBigStep(bigStep:number):number{
        for(let k=1;k<=this.maxId;++k){
            let data=LDataGuidanceManager.GetDataById(k);
            if(data.bigStep===bigStep){
                return k;
            }
        }
        return 0;
    }
    public getGuidViewId():number{
        if(this.curId===1){
            return Define.viewGuid1;
        }
        else if(this.curId===2){
            return Define.viewGuid2;
        }
        else if(this.curId===3){
            return Define.viewGuid3;
        }
        else if(this.curId===4){
            return Define.viewGuid4;
        }
        else if(this.curId===5){
            return Define.viewGuid5;
        }
        else if(this.curId===6){
            return Define.viewGuid6;
        }
        else if(this.curId===7){
            return Define.viewGuid10;
        }
        else if(this.curId===8){
            return Define.viewGuid7;
        }
        else if(this.curId===9){
            return Define.viewGuid8;
        }
        else if(this.curId===10){
            return Define.viewGuid9;
        }
        else{
            return 0;
        }
           
    }

    public tryShowGuid(cid:number):boolean{

        if(this.isShowing){return false;}
        if(this.isFinished){return false;}
        if(this.curId===0){//没有从上一个guid来，直接进来的
            let fbig=this.getFinishedBigStep();
            let myBig=this.getBigStepById(cid);
            if(fbig>=this.maxBigStep){
                this.isFinished=true;
                return false;
            }else if(myBig===fbig+1 ||cid==9){
                this.curId=cid;
                UIManager.getInstance().showView(this.getGuidViewId());
                this.isShowing=true;
                return true;
            }else{
                return false;
            }
        }else{//从上一个来的
            if(this.curId===cid || cid==9){
                this.curId=cid;
                UIManager.getInstance().showView(this.getGuidViewId());
                this.isShowing=true;
                return true;
            }else{
                return false;
            }
        }
    }
    
    public closeGuid(){
            if(this.isShowing){
                UIManager.getInstance().removeView(this.getGuidViewId());
                this.isShowing=false;
                this.curId++;
                let fbig=this.getFinishedBigStep();
                let newBig=this.getBigStepById(this.curId);
                if(newBig>fbig+1){
                    this.setFinishedBigStep(newBig-1);
                }
            }
        
    }
    public endGuid(){
        if(this.isShowing){
            UIManager.getInstance().removeView(this.getGuidViewId());
            this.isShowing=false;
            UserInfo.openSoundTag=0;
        }
        
        this.curId=8
    
}

}
