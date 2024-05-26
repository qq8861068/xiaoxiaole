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
import PastureConfigMgr from "../manager/PastureConfigMgr";
import LDataBiology from "../datas/LDataBiology";
import ResManager from "../manager/ResManager";
import ShopItem from "../ui2/ShopItem"


const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopView extends ViewBase {

    @property(cc.Node)
    btn_back:cc.Node = null;

    @property(cc.Node)
    scontent:cc.Node = null;

    @property(cc.Prefab)
    itemPrefab:cc.Prefab = null;

    @property(cc.Sprite)
    btn_spt_nainiu:cc.Sprite = null;

    @property(cc.Sprite)
    btn_spt_xianhua:cc.Sprite = null;

    @property(cc.Sprite)
    btn_spt_fangwu:cc.Sprite = null;

    @property(cc.Sprite)
    btn_spt_yu:cc.Sprite = null;

    @property(cc.Node)
    btn_nainiu:cc.Node = null;

    @property(cc.Node)
    btn_xianhua:cc.Node = null;

    @property(cc.Node)
    btn_fangwu:cc.Node = null;

    @property(cc.Node)
    btn_yu:cc.Node = null;

    @property(cc.SpriteFrame)
    btn_tex_normal:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    btn_tex_selected:cc.SpriteFrame = null;

    
    bio_nodes:cc.Node[]=[];

    refreshView(isFristRefresh:boolean = false){

        if(isFristRefresh){

        }
        this.refresh();
    }

    refresh(buildId:number=0){
        if(buildId>=PastureConfigMgr.maxBuildCount){return;}
        this.selectBt(buildId);
        let icon_disX=180;
        let icon_disY=200;
        let startx=-150;
        let starty=-120;

        let goldNum=UserInfo.userGold;
        let grade=PastureDataMgr.data.buildGrades[buildId];
        let canBuyBios:LDataBiology[]=[];
        if(this.bio_nodes.length>0){
            for(let k=0;k<this.bio_nodes.length;++k){
                this.bio_nodes[k].destroy();
            }
            this.bio_nodes.length=0;
        }
        let index=0;
        for(let k=0;k<PastureConfigMgr.biologysData.length;++k){
            let data=PastureConfigMgr.biologysData[k];
            let dataBuildId=PastureConfigMgr.getBuidId(data.ID);
            if(dataBuildId==buildId){
                let node=cc.instantiate(this.itemPrefab);
                this.scontent.addChild(node);
                node.x=startx+index*icon_disX;
                node.y=starty;//-k*icon_disY;
                this.bio_nodes.push(node);
                let comp:ShopItem=node.getComponent<ShopItem>(ShopItem);
                if(goldNum<data.price){
                    comp.noStar=true;
                }
                if(data.buygrade>grade){
                    comp.setDisable();
                    comp.showBuyGrade(data.buygrade);
                }
                comp.initWithData(data);
                this.bio_nodes.push(node);
                index++;
            }
        }
        if(PastureDataMgr.data.biologys[buildId].length>=PastureConfigMgr.maxBiologyCount[buildId][grade]){
            for(let k=0;k<this.bio_nodes.length;++k){
                let comp=this.bio_nodes[k].getComponent<ShopItem>(ShopItem);
                comp.setDisable();
            }
        }
    }

    removeAllAni()
    {
        //this.fenxiangdongnode.removeAllChildren(true);
    }

    selectBt(buildId){
        if(buildId==0){
            this.btn_spt_fangwu.spriteFrame=this.btn_tex_normal;
            this.btn_spt_xianhua.spriteFrame=this.btn_tex_selected;
            this.btn_spt_nainiu.spriteFrame=this.btn_tex_normal;
            this.btn_spt_yu.spriteFrame=this.btn_tex_normal;
        }else if(buildId==1){
            this.btn_spt_fangwu.spriteFrame=this.btn_tex_normal;
            this.btn_spt_xianhua.spriteFrame=this.btn_tex_normal;
            this.btn_spt_nainiu.spriteFrame=this.btn_tex_normal;
            this.btn_spt_yu.spriteFrame=this.btn_tex_selected;
        }
        else if(buildId==2){
            this.btn_spt_fangwu.spriteFrame=this.btn_tex_normal;
            this.btn_spt_xianhua.spriteFrame=this.btn_tex_normal;
            this.btn_spt_nainiu.spriteFrame=this.btn_tex_selected;
            this.btn_spt_yu.spriteFrame=this.btn_tex_normal;
        }
        else if(buildId==3){
            this.btn_spt_fangwu.spriteFrame=this.btn_tex_selected;
            this.btn_spt_xianhua.spriteFrame=this.btn_tex_normal;
            this.btn_spt_nainiu.spriteFrame=this.btn_tex_normal;
            this.btn_spt_yu.spriteFrame=this.btn_tex_normal;
        }
    }
    //点击点击事件 //只调用一次
    addEvent(){
        Common.addClickEvent(this.btn_back,this.onClick.bind(this));
        Common.addClickEvent(this.btn_fangwu,this.onClick.bind(this));
        Common.addClickEvent(this.btn_nainiu,this.onClick.bind(this));
        Common.addClickEvent(this.btn_xianhua,this.onClick.bind(this));
        Common.addClickEvent(this.btn_yu,this.onClick.bind(this));
    }   
    
    onClick(tag:string){
        if(tag == "btn_back"){
            UIManager.getInstance().sendMessage(Define.viewStart,"refreshPropInfo");
            UIManager.getInstance().hideView(Define.viewShop);
        }else if(tag=="btn_fangwu"){

            this.refresh(3);
        }
        else if(tag=="btn_nainiu"){

            this.refresh(2);
        }
        else if(tag=="btn_xianhua"){

            this.refresh(0);
        }
        else if(tag=="btn_yu"){

            this.refresh(1);

        }
    }
    //只调用一次
    initView(){
    }

    //额外的事件调用
    message(tag:string = "defualt",args: any = null){
        if(tag == "tap"){
            let buildId=args;
            this.refresh(buildId);
        }
    }
}