import ViewBase from "../ui/ViewBase";
import Common from "../common/Common";
import UIManager from "../manager/UIManager";
import Define from "../common/Define";
import GameManager from "../manager/GameManager";
import UserInfo from "../UserInfo";
import SoundManager from "../manager/SoundManager";
import WXHelper from "../common/WXHelper";
import HttpManager from "../manager/HttpManager";
import LDataConsume from "../datas/LDataConsume";
import LDataConsumeManager from "../datas/LDataConsumeManager";
import GuidanceMgr from "../manager/GuidanceMgr";
import PastureDataMgr from "../manager/PastureDataMgr";
import LDataBiology from "../datas/LDataBiology";
import PastureConfigMgr from "../manager/PastureConfigMgr";
import ResManager from "../manager/ResManager";
import Building from "./Building";
import Biology from "./Biology";
import TimeTask from "../common/TimeTask";
import TimeTaskManager from "../manager/TimeTaskManager";
import Collector from "./Collector";
import PastureRes from "./PastureRes";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PastureView extends ViewBase {

    @property(cc.Node)
    btn_back:cc.Node = null;

    @property(cc.Node)
    maskAll:cc.Node = null;


    @property(cc.Node)
    btn_jiaohua:cc.Node = null;

    @property(cc.Node)
    btn_weiyu:cc.Node = null;

    @property(cc.Node)
    btn_weiniu:cc.Node = null;





    @property(cc.Node)
    ui_root:cc.Node = null;

    @property(cc.Node)
    btn_shop:cc.Node = null;

    @property(cc.Node)
    btn_get:cc.Node = null;

    @property(cc.Node)
    btn_collect:cc.Node = null;

    @property(cc.Node)
    pasture_root:cc.Node=null;

    @property(cc.Node)
    scontent:cc.Node=null;

    @property(cc.Label)
    star_num_label:cc.Label = null;

    @property(cc.Label)
    collect_num_label:cc.Label = null;


    @property(cc.Label)
    gold_num_label:cc.Label = null;

    @property(cc.Node)
    bioPosNodes0:cc.Node[] = [];

    @property(cc.Node)
    bioPosNodes1:cc.Node[] = [];

    @property(cc.Node)
    bioPosNodes2:cc.Node[] = [];

    @property(cc.Node)
    bioPosNodes3:cc.Node[] = [];

    @property(cc.Node)
    buildPosNodes:cc.Node[]=[];

    @property(cc.Prefab)
    collectPrefab:cc.Prefab=null;

    @property(cc.Node)
    pastureResNode:cc.Node=null;

    @property(cc.ScrollView)
    scrollView:cc.ScrollView=null;
    
    buildNodes:cc.Node[]=[];
    biologyNodes:cc.Node[][]=[];
    buildFeedFlags:number[]=[];
    collecting=false;
    pastureRes:PastureRes=null;
    is3times=false;
    
    refreshView(isFristRefresh:boolean = false){


        this.btn_jiaohua.active=false;
        this.btn_weiyu.active=false;
        this.btn_weiniu.active=false;

        if(this.pastureRes==null){
            this.pastureRes=this.pastureResNode.getComponent<PastureRes>(PastureRes);
        }
        this.removeAllAni();
        if(isFristRefresh){
            Common.pastureView=this;
            if(this.biologyNodes.length==0){
                for(let k=0;k<PastureConfigMgr.maxBuildCount;++k){
                    this.biologyNodes.push([]);
                }
                //PastureDataMgr.clearAllBioForTest();//临时测试,必须注释掉
                //UserInfo.userStar=3;//临时测试,必须注释掉
            }
            TimeTaskManager.addTimeTask(1,function(){
                UIManager.getInstance().sendMessage(Define.viewPasture,"refreshcollected");
            }.bind(this),"collect_timer",-1)
        }
        this.refreshInfo()
        this.refreshPasture();
        UIManager.getInstance().sendMessage(Define.viewPasture,"refreshcollected");
    }
    

    removeAllAni()
    {
        //this.fenxiangdongnode.removeAllChildren(true);
    }

    //刷新信息
    refreshInfo(){
        this.gold_num_label.string = UserInfo.userGold>999999?"999999+":UserInfo.userGold.toString();
        const starCount = UserInfo.userStarArr.reduce((p, c) => p + c, 0);
        this.star_num_label.string = starCount>999?"999+":starCount.toString();
    }

    refreshPasture(){
        for(let k=0;k<this.buildNodes.length;++k){
            this.buildNodes[k].destroy();
        }

        //生成建筑物
        this.buildNodes.length=0;
        for(let k=0;k<PastureConfigMgr.maxBuildCount;++k){
            this.buildFeedFlags.push(0);
            let grade=PastureDataMgr.data.buildGrades[k];
            let node:cc.Node=cc.instantiate(this.pastureRes["building"+k+"Prefab"][grade]);
            let building=node.getComponent<Building>(Building);
            building.buildId=k;
            this.scontent.addChild(node);
            node.setPosition(this.buildPosNodes[k].getPosition());
            if(k==0){
                node.setScale(1.2);
            }
            this.buildNodes.push(node);
        }

        for(let t=0;t<PastureConfigMgr.maxBuildCount;++t){
            for(let k=0;k<this.biologyNodes[t].length;++k){
                let comp=this.biologyNodes[t][k].getComponent<Biology>(Biology);
                comp.beforeDestroy();
                this.biologyNodes[t][k].destroy();
            }
        }

        //生成生物
        for(let t=0;t<this.biologyNodes.length;++t){
            this.biologyNodes[t].length=0;
        }
        let ms=Common.getCurTime();
        let indexs:number[]=[0,0,0];
        for(let t=0;t<PastureConfigMgr.maxBuildCount;++t){
            for(let k=0;k<PastureDataMgr.data.biologys[t].length;++k){
                let bid=PastureDataMgr.data.biologys[t][k].id;
                console.log("生成生物---buildId:"+t+" grade:"+k);
                console.log("生成生物："+bid);
                let data=PastureConfigMgr.biologysData[bid];
                let node:cc.Node=cc.instantiate(this.pastureRes.biolobyPrefabs[bid]);
                this.scontent.addChild(node);
                node.setPosition(this["bioPosNodes"+t][indexs[t]].getPosition());
                indexs[t]++;
                this.biologyNodes[t].push(node);
                let comp=node.getComponent<Biology>(Biology);
                comp.init(bid,t,k);
                PastureDataMgr.data.biologys[t][k].comp=comp;
                //检查feed
                PastureDataMgr.loadFeedData(t,k);
                let bioData=PastureDataMgr.data.biologys[t][k];
                if(bioData.time!=0){
                    if((ms-bioData.time)*0.001<bioData.dur){

                        let duration=bioData.dur-(ms-bioData.time)*0.001;
                        bioData.comp.feed(duration);
                        if(this.buildFeedFlags[t]==0){
                            this.buildFeedFlags[t]=1;
                            let comp=this.buildNodes[t].getComponent<Building>(Building);
                            TimeTaskManager.addTimeTask(duration,function(){
                                this.buildFeedFlags[t]=0;
                            }.bind(this),"buildingFeed"+t,1);
                        }
                        
                    }
                }
            }
        }
        
    }

    feed(buildId:number):boolean{
        if(this.buildFeedFlags[buildId]==0){
            let ms=Common.getCurTime();
            let grade=PastureDataMgr.data.buildGrades[buildId];
            let bios=PastureDataMgr.data.biologys[buildId];
            let duration=PastureConfigMgr.feedDurations[buildId][grade];
            for(let k=0;k<bios.length;++k){
                let data=PastureDataMgr.data.biologys[buildId][k];
                let bioConfig=PastureConfigMgr.biologysData[data.id];
                data.startPro=PastureDataMgr.getPro(data,ms);
                data.time=ms;
                data.dur=duration;
                data.pro=bioConfig.produce*Common.pastureFeedFactor;//临时，未加成
                PastureDataMgr.saveFeedData(buildId,k);
                data.comp.feed(duration);
            }
            if(bios.length>0){
                this.buildFeedFlags[buildId]=1;
                TimeTaskManager.addTimeTask(duration,function(){
                this.buildFeedFlags[buildId]=0;
                if(UIManager.getInstance().isShow(Define.viewPasture)){
                    Common.showPrompt("产出结束");
                }
                }.bind(this),"buildingFeed"+buildId,1);

                this.disableAllUI();
                let grade=PastureDataMgr.data.buildGrades[buildId];
                let buildNode=this.buildNodes[buildId];
                let building=buildNode.getComponent<Building>(Building);
                building.playFeed(buildId,grade,function(){
                    //UIManager.getInstance().showView2(Define.viewFeedOkYu);
                    Common.showPrompt("你的农场正在开始赚钱了！");
                    this.enableAllUI();
                }.bind(this));

            }else{
                Common.showPrompt("没有物品可以喂养");
                return false;
            }
            
            return true;
        }else{
            Common.showPrompt("正在产出中，等结束后再试");
            return false;
        }

    }
    startCollect(){
        this.collecting=true;
        let node=cc.instantiate(this.collectPrefab);
        this.scontent.addChild(node);
        node.position=cc.p(750,1000);
        let comp=node.getComponent<Collector>(Collector);
        comp.collect();
        this.disableAllUI();
    }
    collect(buildId:number){
        let ms=Common.getCurTime();
        let grade=PastureDataMgr.data.buildGrades[buildId];
        let bios=PastureDataMgr.data.biologys[buildId];
        let totalMoney=0;
        for(let k=0;k<bios.length;++k){
            let data=PastureDataMgr.data.biologys[buildId][k];
            if(data.time>0){
                let totalDur=ms-data.time;
                let money=0;
                if(totalDur*0.001>=data.dur){//已经吃草完毕
                    money=PastureDataMgr.getPro(data,ms);
                    data.time=0;
                    data.dur=0;
                    data.pro=0;
                    data.startPro=0;
                    
                }else{//仍在吃草中
                    money=PastureDataMgr.getPro(data,ms);
                    data.time=ms;
                    data.dur-=totalDur*0.001;
                    data.startPro=0;
                }
                PastureDataMgr.saveFeedData(buildId,k);
                totalMoney+=money;
            }else if(data.startPro>0){
                totalMoney+=data.startPro;
                data.startPro=0;
                PastureDataMgr.saveFeedData(buildId,k);
            }
        }
        if(this.is3times){
            UserInfo.userGold+=Math.round(totalMoney*3);

        }else{
            UserInfo.userGold+=Math.round(totalMoney);

        }
        UIManager.getInstance().sendMessage(Define.viewPasture,"refreshInfo");
        UIManager.getInstance().sendMessage(Define.viewPasture,"refreshcollected");
    }

    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_back,this.onClick.bind(this));
        Common.addClickEvent(this.btn_shop,this.onClick.bind(this));
        Common.addClickEvent(this.btn_get,this.onClick.bind(this));
        Common.addClickEvent(this.btn_collect,this.onClick.bind(this));
        Common.addClickEvent(this.btn_jiaohua,this.onClick.bind(this));
        Common.addClickEvent(this.btn_weiyu,this.onClick.bind(this));
        Common.addClickEvent(this.btn_weiniu,this.onClick.bind(this));


    }   
    
    onClick(tag:string){
        if(tag == "btn_back"){
            UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo");
            UIManager.getInstance().showView(Define.viewStart,function(){
                UIManager.getInstance().hideView(Define.viewPasture);
            }.bind(this))
            
        }else if(tag == "btn_shop"){
            UIManager.getInstance().showView2(Define.viewShop);
        }else if(tag == "btn_get"){
            Common.gameModel = Define.gameModel_Normal
            UIManager.getInstance().showView(Define.viewBegin)
        }else if(tag == "btn_collect"){
            if(this.collecting){
                Common.showPrompt("正在收集！请稍后再试");
            }else if(parseInt(this.collect_num_label.string)==0){
                Common.showPrompt("没有金币可以收集！");
            }
            else{
                UIManager.getInstance().showView2(Define.viewCollect);
            }
        }else if(tag == "btn_jiaohua"){
            UIManager.getInstance().sendMessage(Define.viewPasture,"show_build",0);
            UIManager.getInstance().showView2(Define.viewFeedYu);
        }else if(tag == "btn_weiyu"){
            UIManager.getInstance().sendMessage(Define.viewPasture,"show_build",1);
            UIManager.getInstance().showView2(Define.viewFeedHua);

        }else if(tag == "btn_weiniu"){
            UIManager.getInstance().sendMessage(Define.viewPasture,"show_build",2);
            UIManager.getInstance().showView2(Define.viewFeedNiu);

        }
    }
    //只调用一次
    initView(){
    }
    disableAllUI(){
        this.maskAll.active=true;
        this.ui_root.active=false;
    }
    enableAllUI(){
        this.ui_root.active=true;
        this.maskAll.active=false;
    }
    startFeed(buildId,factor){
        let grade=PastureDataMgr.data.buildGrades[buildId];
        let price=PastureConfigMgr.feedConsume[buildId][grade];
        if(price<=UserInfo.userGold){
            Common.pastureFeedFactor=factor;
            if(this.feed(buildId)==true){
                UserInfo.userGold-=price;
                this.refreshInfo();
                UIManager.getInstance().sendMessage(Define.viewStart,"refreshInfo");
            }
        }else{
            UIManager.getInstance().showView2(Define.viewNoEnoughStar);
        }
    }
    //额外的事件调用
    message(tag:string = "defualt",args: any = null){
        if(tag == "refreshInfo"){
            this.refreshInfo();
        }
        else if(tag=="buy"){
            this.refreshInfo();
            this.refreshPasture();
            Common.showPrompt("购买成功，快去农场看看吧！");
        }
        else if(tag=="upgrade"){
            this.refreshInfo();
            this.refreshPasture();
        }
        else if(tag=="feed"){
            this.startFeed(args,1);
        }
        else if(tag=="feed_double"){
            this.startFeed(args,2);
        }
        else if(tag=="start_collect"){
            this.is3times=false;
            this.startCollect();
        }
        else if(tag=="start_collect_3times"){
            this.is3times=true;
            this.startCollect();
        }
        else if(tag=="collect"){
            this.collect(args);
        }
        else if(tag=="collect_ok"){
        this.enableAllUI();

            this.collecting=false;
        }
        else if(tag=="refreshcollected"){
            let ms=Common.getCurTime();
            this.collect_num_label.string=PastureDataMgr.getTotalPro(ms).toString();
            this.refreshInfo();
        }
        else if(tag=="play_upgrade"){
            this.disableAllUI();
            let buildId=args;
            let grade=PastureDataMgr.data.buildGrades[buildId];
            let buildNode=this.buildNodes[buildId];
            let building=buildNode.getComponent<Building>(Building);
            building.playUpgrade(buildId,grade-1,function(){
                UIManager.getInstance().showView2(Define.viewUpgradeOk);
                this.enableAllUI();
            }.bind(this));
        }else if(tag=="showjiaohua"){
            this.btn_jiaohua.active=true;

        }else if(tag=="showweiyu"){
            this.btn_weiyu.active=true;

        }else if(tag=="showweiniu"){
            this.btn_weiniu.active=true;
        }else if(tag=="show_build"){
            let buildId=args;
            if(buildId==0){
                this.scrollView.scrollTo(cc.v2(0.94,0),0.7);

            }else if(buildId==1){
                this.scrollView.scrollTo(cc.v2(0.65,0),0.7);

            }else if(buildId==2){
                this.scrollView.scrollTo(cc.v2(0.01,0),0.7);

            }
        }
    }
}