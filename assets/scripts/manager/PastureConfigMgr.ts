
import UserInfo from "../UserInfo";
import Define from "../common/Define";
import LDataBuilding from "../datas/LDataBuilding";
import LDataBuildingManager from "../datas/LDataBuildingManager";
import LDataBiology from "../datas/LDataBiology";
import LDataBiologyManager from "../datas/LDataBiologyManager";

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

export default  class  PastureConfigMgr {
 
    public static icons:string[][]=[];
    public static prefabs:string[][]=[];
    public static upgradeConsume:number[][]=[];
    public static feedConsume:number[][]=[];
    public static proFactors:number[][]=[];
    public static maxBiologyCount:number[][]=[];//对应等级的建筑物可以拥有的最多生物数量
    public static biologyCanHave:number[][][]=[];//对应等级新增物品
    public static biologyTotalHave:number[][][]=[];//对应等级所有物品
    public static feedDurations:number[][]=[];
    public static data:any=null;
    public static maxBuildCount=0;
    public static biologyKinds=0;
    public static biologysData:LDataBiology[]=[];
    public static maxGrade:number[]=[];

    public static loadPastureConfig(){

        if(this.biologyKinds==0){
            LDataBiologyManager.GetDataById(0);
            for(let k=0;k<LDataBiologyManager.dataList.length;++k){
                let data=LDataBiologyManager.GetDataById(k);
                if(data!==null && typeof data!="undefined"){
                    this.biologysData.push(data);
                }
            }
            this.biologyKinds=this.biologysData.length;
       }


       if(this.maxBuildCount==0){
        LDataBuildingManager.GetDataById(0);
            this.maxBuildCount=LDataBuildingManager.dataList.length;
            for(let k=0;k<this.maxBuildCount;++k){
                this.icons.push(new Array());
                this.prefabs.push(new Array());
                this.upgradeConsume.push(new Array());
                this.feedConsume.push(new Array());
                this.proFactors.push(new Array());
                this.feedDurations.push(new Array());
                this.maxBiologyCount.push(new Array());
                this.biologyCanHave.push(new Array());
                this.biologyTotalHave.push(new Array());

                let data=LDataBuildingManager.GetDataById(k);
                if(data){
                let strs=data.upConsumption.split(";");
                for(let j=0;j<strs.length;++j){
                    this.upgradeConsume[k].push(parseInt(strs[j]));
                }

                strs=data.Feed.split(";");
                for(let j=0;j<strs.length;++j){
                    this.feedConsume[k].push(parseInt(strs[j]));
                }
                strs=data.addition.split(";");
                for(let j=0;j<strs.length;++j){
                    this.proFactors[k].push(parseInt(strs[j]));
                }
                strs=data.duration.split(";");
                for(let j=0;j<strs.length;++j){
                    this.feedDurations[k].push(parseInt(strs[j]));
                }

                    strs=data.maxNumber.split(";");
                    for(let j=0;j<strs.length;++j){
                        this.maxBiologyCount[k].push(parseInt(strs[j]));
                    }
                    strs=data.biology.split(";");
                    for(let j=0;j<strs.length;++j){
                        this.biologyCanHave[k].push(new Array());
                        let strs2=strs[j].split(",");
                        for(let i=0;i<strs2.length;++i){
                            let bid=parseInt(strs2[i]);
                            if(bid>=0){
                                this.biologyCanHave[k][j].push(bid);
                                this.biologysData[bid].desc=k.toString();//desc临时用来表示属于哪个建筑物
                            }
                        }
                    }
                    strs=data.img.split(";");
                    for(let j=0;j<strs.length;++j){
                        this.prefabs[k].push(strs[j]);
                    }
                    strs=data.icon.split(";");
                    for(let j=0;j<strs.length;++j){
                        this.icons[k].push(strs[j]);
                    }
                    strs=data.buildGrade.split(";");
                    this.maxGrade[k]=strs.length-1;
                }
            }
            for(let k=0;k<this.biologyCanHave.length;++k){
                let bios:number[]=[];
                for(let j=0;j<this.biologyCanHave[k].length;++j){
                    this.biologyTotalHave[k].push(new Array());
                    bios=bios.concat(this.biologyCanHave[k][j]);
                    this.biologyTotalHave[k][j]=bios;
                }
            }

       }
        
       
        
    }

    public static getBuidId(biologyId:number):number{
        return parseInt(this.biologysData[biologyId].desc);
    }
}