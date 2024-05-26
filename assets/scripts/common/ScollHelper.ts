

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
export default class ScollHelper extends cc.Component {

    @property(cc.ScrollView)
    scollView: cc.ScrollView = null;

    @property(cc.Node)
    nodeItem: cc.Node = null;
    
    @property(cc.Node)
    nodeContent: cc.Node = null;
    
    //初始item 的数量
    initCount:number = 0;
    //item 的最大数量
    maxCount:number = 100;

    //显示数量
    showCount:number = 0;

    //当前索引
    curIndex:number = 0;
    //偏移索引
    offsetIndex:number = 0;
    //上次的y的位置
    lastPosY:number = 0;

    lastPosX:number = 0;
    
    @property
    itemWidth:number = 0;

    @property
    itemHeight:number = 0;

    isVertical:boolean = false; //是否是竖着的

    scrollState:number = 0;

    isLeftScorll:boolean = false;

    isAutoFit:boolean = false

    refreshItemCallBack:Function;
    contentInitPos:cc.Vec2 = cc.Vec2.ZERO;

    onLoad(){
        this.isVertical = this.node.getComponent<cc.ScrollView>(cc.ScrollView).vertical
        /*
        this.node.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            this.contentInitPos = this.nodeContent.position;
            this.initItems(10,5,null)
        }.bind(this))))
        */

        this.contentInitPos = this.nodeContent.position;
        //this.initItems(10,3,null)
    }

    initItems(maxCount:number,showCount:number,callBack:Function,isAutoFit:boolean = false){
        this.isAutoFit = isAutoFit
        this.showCount = showCount + 1;
        this.refreshItemCallBack = callBack;
        let curCount:number = this.nodeContent.childrenCount
        if(curCount < this.showCount){
            for (let index = 0; index < this.showCount - curCount; index++) { // 60 
                let itemNode =  cc.instantiate(this.nodeItem)
                this.nodeContent.addChild(itemNode);
            }
        }

        //隐藏所有
        for (let index = 0; index < this.showCount; index++) { // 60 
            if(!this.isVertical){
                this.nodeContent.children[index].position = new cc.Vec2(index*this.itemWidth + this.itemWidth*0.5,0);
            }else{
                let y:number = index*(this.itemHeight*-1) - this.itemHeight*0.5
                this.nodeContent.children[index].position = new cc.Vec2(0,y);
            }
            this.nodeContent.children[index].active = false
        }

        this.maxCount = maxCount
        let tempCount = this.showCount;
        if(this.maxCount < this.showCount){
            tempCount = this.maxCount
        }

        for (let index = 0; index < tempCount; index++) { // 60 
            let itemNode:cc.Node = this.nodeContent.children[index];
            this.initCount = index;
            itemNode.active = true;
            this.refreshItem(index,0,itemNode);
        }

        if(!this.isVertical){
            this.nodeContent.width = this.maxCount * this.itemWidth;
        }
        else{
            this.nodeContent.height = this.maxCount * this.itemHeight;
        }
       
        this.lastPosY = this.nodeContent.position.y;
        this.lastPosX = this.nodeContent.position.x;

        this.offsetIndex = 0;

        this.nodeContent.position = this.contentInitPos;
    }

    update (dt) {

        let isUp = false;
        let isLeft = false;
        let index:number = 0;
        if(this.isVertical){ 
            //限制滑动 超出
            if(this.nodeContent.position.y <= this.contentInitPos.y){
                return
            }

            // console.log("update this.lastPosY = " + this.lastPosY)
            // console.log("update this.nodeContent.position.y = " + this.nodeContent.position.y)
            // console.log("update sub  = " + (this.lastPosY - this.nodeContent.position.y))

            let isMaxDistance:boolean = Math.abs(this.lastPosY - this.nodeContent.position.y) > this.itemHeight
            if(this.lastPosY < this.nodeContent.position.y){ //上面
                isUp = true;
                if(isMaxDistance){
                    this.nodeContent.position = new cc.Vec2(this.nodeContent.position.x,this.lastPosY + this.itemHeight*0.5)
                   // console.log("偏移 1  Math.abs(this.lastPosY - this.nodeContent.position.y) " + Math.abs(this.lastPosY - this.nodeContent.position.y))
                }
            }else{
                if(isMaxDistance){
                    this.nodeContent.position = new cc.Vec2(this.nodeContent.position.x,this.lastPosY - this.itemHeight*0.5)
                    console.log("偏移 2 ")
                }
            }
            //上下移动
            index = Math.abs(Math.floor((this.nodeContent.position.y - this.contentInitPos.y)/this.itemHeight))
       

        }else{
            //限制滑动 超出
            if(this.nodeContent.position.x >= this.contentInitPos.x){
                return
            }
            //左右移动
            let v = this.nodeContent.position.x + Math.abs(this.contentInitPos.x)
            index = Math.abs(Math.floor(Math.abs(v)/this.itemWidth))
            if(this.lastPosX > this.nodeContent.position.x){ //左右
                isLeft = true;
            }
        }

        this.autoScroll();
    
        this.lastPosY = this.nodeContent.position.y;
        this.lastPosX = this.nodeContent.position.x;
        if(index + this.initCount >= this.maxCount){
            return;
        } 

        let count = Math.abs(this.offsetIndex - index)
        if(count > 0){
            this.offsetIndex = index;
            for (let i = count; i > 0; i--) {
                if(!this.isVertical){
                    this.nodeContent.children.sort((a, b) => {
                        return a.position.x - b.position.x;
                    });
                }else{
                    this.nodeContent.children.sort((a, b) => {
                        return b.position.y - a.position.y;
                    });
                }
                //上下移动
                if(this.isVertical){
                    if(isUp){ 
                        this.curIndex = index - i;
                        let tempNode1:cc.Node = this.nodeContent.children[0]
                        let tempNode2:cc.Node = this.nodeContent.children[this.showCount - 1];
                        tempNode1.position =new cc.Vec2(0,tempNode2.position.y - this.itemHeight);
                        this.refreshItem(this.curIndex + this.initCount + 1 ,0,tempNode1);
                    
                    }else{
                
                        this.curIndex = index + i;
                        let tempNode1:cc.Node = this.nodeContent.children[0]
                        let tempNode2:cc.Node = this.nodeContent.children[this.showCount - 1];
                        tempNode2.position =new cc.Vec2(0,tempNode1.position.y + this.itemHeight);
                        this.refreshItem(this.curIndex - 1,0,tempNode2);
                    }
                }else{
                    //左右
                    if(isLeft){ 
                        this.curIndex = index - i;
                        let tempNode1:cc.Node = this.nodeContent.children[0]
                        let tempNode2:cc.Node = this.nodeContent.children[this.showCount - 1];
                        tempNode1.position = new cc.Vec2(tempNode2.position.x + this.itemWidth,tempNode1.position.y);
                        this.refreshItem(this.curIndex + this.initCount + 1 ,0,tempNode1);
                    
                    }else{
                
                        this.curIndex = index + i;
                        let tempNode1:cc.Node = this.nodeContent.children[0]
                        let tempNode2:cc.Node = this.nodeContent.children[this.showCount - 1];
                        tempNode2.position = new cc.Vec2(tempNode1.position.x - this.itemWidth,tempNode1.position.y);
                        this.refreshItem(this.curIndex - 1,0,tempNode2);
                    }
                }
            }
        }
    }

    refreshItem(idx:number, objIdx:number, obj:cc.Node){
        if(this.refreshItemCallBack != null){
            this.refreshItemCallBack(idx,objIdx,obj);
        }
    }

    autoScroll(){
        if(!this.isAutoFit){
            return
        }
        if(this.scollView.isScrolling()){
            this.scrollState = 1
            if(this.nodeContent.position.x > this.lastPosX){
                this.isLeftScorll = false 
            }else{
                this.isLeftScorll = true
            }
            this.lastPosX = this.nodeContent.position.x
        }else{
            if(this.scrollState == 1){
                this.scrollState = 0
                this.scrollToFitPos()
            }
        }
    }

    scrollToFitPos(){
        if(this.isLeftScorll){
            this.scrollToIndex(Math.abs(Math.floor((this.nodeContent.position.x+300)/600)))
        }else{
            this.scrollToIndex(Math.abs(Math.ceil((this.nodeContent.position.x+300)/600)))
        }  
    }

    scrollToIndex(index:number,time:number = 1){
        this.scollView.scrollTo(new cc.Vec2(index/(this.maxCount-1),0),time)
    }
}
