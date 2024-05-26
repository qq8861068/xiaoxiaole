
import UserInfo from "../UserInfo";
import Define from "../common/Define";
import HttpManager from "../manager/HttpManager";
import PastureConfigMgr from "./PastureConfigMgr";
import Biology from "../ui2/Biology";
import Common from '../common/Common';
import UIManager from "./UIManager";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const {ccclass, property} = cc._decorator;

@ccclass
class BiologyData{
    id=0;
    time=0;
    dur=0;
    pro=0;
    startPro=0;
    comp:Biology=null;
}
class PastureData{
    rainbowGrade=0;
    skinId=0;
    buildGrades:number[]=[];
    biologys:BiologyData[][]=[[],[],[],[]];
}
export default  class  PastureDataMgr {
 
    public static data:PastureData=null;
    public static maxBuildCount=0;
    public static fromServer=true;
    public static isLoaded=false;

    public static loadPastureData(callback:Function=null){
        this.maxBuildCount=PastureConfigMgr.maxBuildCount;
        if(this.fromServer){
            if(this.data==null){
                HttpManager.getInstance().getUserGameData(function(data){
                    if(data.obj != null){ 
                        this.data=new PastureData();
                        for(let i=0;i<this.maxBuildCount;++i){
                            this.data.buildGrades.push(0);
                        }
                        if(data.obj.buildings==null){
                            //星星机制改变，是统计的
                            // if(UserInfo.userStar==0){
                            //     UserInfo.userStar=1;
                            // }
                        }else{
                            this.data.rainbowGrade=data.obj.rainbow_grade;
                            this.data.skinId=data.obj.skin_id;
                            for(let k=0;k<data.obj.buildings.length;++k){
                                this.data.buildGrades[k]=data.obj.buildings[k].level;
                                let bios=data.obj.buildings[k].organism;
                                for(let i=0;i<bios.length;++i){
                                    let bdata=new BiologyData();
                                    bdata.id=parseInt(bios[i]);
                                    this.data.biologys[k].push(bdata);
                                    console.log("load生物："+bios[i]);
                                }
                            }
                        }
                        this.isLoaded=true;
                        UIManager.getInstance().sendMessage(Define.viewStart,"refreshInfo");
                        if(callback){callback();}
    
                    }
                }.bind(this));
            }else{

            }
            
        }else{
            this.data=JSON.parse(cc.sys.localStorage.getItem(Define.datakeyPastureData));
            if(!this.data){
                this.data=new PastureData();
                for(let i=0;i<this.maxBuildCount;++i){
                    this.data.buildGrades.push(0);
                }
            }
        }
        
    }
    public static clearAllBioForTest(){
        for(let k=0;k<this.maxBuildCount;++k){
            this.data.biologys[k].length=0;
            this.data.buildGrades[k]=0;
        }
        this.savePastureData();
    }
    public static savePastureData(){
        if(this.fromServer){
            let pasture={
                rainbow_grade:this.data.rainbowGrade,
                skin_id:this.data.skinId,
                buildings:[]
            };
            for(let k=0;k<this.maxBuildCount;++k){
                pasture.buildings.push({
                    name:"building"+k,
                    level:this.data.buildGrades[k],
                    organism:[]
                });
                for(let j=0;j<this.data.biologys[k].length;++j){
                    pasture.buildings[k].organism.push(this.data.biologys[k][j].id.toString());
                    console.log("up生物："+this.data.biologys[k][j].id);
                }
            }
            let obj={
                open_id:UserInfo.openid,
                pasture:pasture
            }
            HttpManager.getInstance().setUserGameData(obj,function(data){
                if(data.obj != null){
                   console.log(data);
                }
            }.bind(this));
            
        }else{
            cc.sys.localStorage.setItem(Define.datakeyPastureData,JSON.stringify(this.data));
        }
    }
    


    public static addBiology(buildId:number,bid:number=0){
        let data:BiologyData=new BiologyData();
        data.id=bid;
        this.data.biologys[buildId].push(data);
    }

    public static getPerMinute(buildId:number){
        let pro=0;
        for(let k=0;k<this.data.biologys[buildId].length;++k){
            let bid=this.data.biologys[buildId][k].id;
            let prod=PastureConfigMgr.biologysData[bid].produce;
            pro+=prod;
        }
        pro*=60;
        return Math.round(pro);
    }

    public static saveFeedData(buildId:number,index:number){
        let data=this.data.biologys[buildId][index];
        let data2={
            //id:data.id,
            time:data.time,
            pro:data.pro,
            startPro:data.startPro,
            dur:data.dur
        }
        UserInfo.setItem(Define.dataKeyFeedData+buildId+"_"+index,JSON.stringify(data2));
    }
    public static loadFeedData(buildId:number,index:number){
        let str=UserInfo.getItem(Define.dataKeyFeedData+buildId+"_"+index,false);
        if(str && str.length>0){
            let data2=JSON.parse(str);
            let data=this.data.biologys[buildId][index];
            //data.id=data2.id;
            data.time=data2.time;
            data.pro=data2.pro;
            data.startPro=data2.startPro;
            data.dur=data2.dur;
        }
    }
    public static getPro(data:BiologyData,ms:number):number{
        if(data.time){
            let duration=0;
            if((ms-data.time)*0.001<data.dur){//正在产出中
                duration=(ms-data.time)*0.001;
            }else{//已经结束
                duration=data.dur;
            }
            return data.pro*duration+data.startPro;
        }else{
            return data.startPro;
        }
    }
    public static getTotalPro(ms:number):number{
        let collect=0;
        for(let k=0;k<PastureConfigMgr.maxBuildCount;++k)
        {
            let bios=this.data.biologys[k];
            for(let j=0;j<bios.length;++j){
                let pro=this.getPro(bios[j],ms);
                collect+=pro;
            }
        }
        return Math.round(collect);
    }
    public static getRainbowLevel():number{
        return 0;
    }
    public static setRainbowLeval(level:number){

    }
    public static getPastureSkinId():number{
        return 0;
    }
    public static setPastureSkinId(id:number){

    }
}