import TimeTaskManager from "../manager/TimeTaskManager"

const {ccclass, property} = cc._decorator;

@ccclass
export default class Biology extends cc.Component {

    
    @property(sp.Skeleton)
    skeleton:sp.Skeleton=null;
    // LIFE-CYCLE CALLBACKS:

    biologyId=0;
    buildId=0;
    inIndex=0;
    feeding=false;
    // onLoad () {}

    start () {

    }

    // update (dt) {}
    init(bid:number,buildId:number,index:number){
        this.biologyId=bid;
        this.inIndex=index;
        this.buildId=buildId;
    }
    feed(ms:number){
        //临时注释
        this.skeleton.setAnimation(0,"2shengji",true);
        this.feeding=true;
        TimeTaskManager.addTimeTask(ms,function(){
            //临时注释
            this.skeleton.setAnimation(0,"1daiji",true);
        }.bind(this),"feedAnim"+this.inIndex+"_"+this.biologyId,1);
    }
    beforeDestroy(){
        if(this.feeding){
            TimeTaskManager.removeTimeTask("feedAnim"+this.inIndex+"_"+this.biologyId);
        }
    }
}
