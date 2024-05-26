import Define from "./common/Define";
import ResManager from "./manager/ResManager";
import Block from "./Block";
import BlockManager from "./manager/BlockManager";

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
export default class CheckCollectShape{

    shapeId:number = -1;
    info:any[] = new Array()

    offsetMaxRow:number = 0
    offsetMaxCol:number = 0;

    totalCollectCount:number = 0;
    
    checkCollect(shapeId:number,blocks:Block[] = []){
        this.shapeId = shapeId;
        for (let index = 0; index < Define.maxRow*2; index++) {
            this.info.push(new Array())   
        }
        ResManager.loadMapData('shape' + this.shapeId.toString(),function(mapData){
            let mapArr:string [] =  mapData.split(';')
            let totalCol:number = 0;
            let totalRow:number = 0;
            for (let index = 0; index < mapArr.length; index++) {
                let arr:string [] = mapArr[index].split(',')
                if(arr.length == 3){
                    let row = parseInt(arr[0])
                    let col = parseInt(arr[1])
                    let id = parseInt(arr[2])   
                    this.info[row][col] = id
                    if(id != 0){
                        this.totalCollectCount = this.totalCollectCount + 1
                        if(row > totalRow){
                            totalRow = row
                        }
                        if(col > totalCol){
                            totalCol = col
                        }
                    }
                }
            }

            this.offsetMaxCol = Define.maxCol - totalCol
            this.offsetMaxRow = Define.maxRow - totalRow
            
            for (let i = 0; i < this.offsetMaxRow; i++) {
                for (let j = 0; j < this.offsetMaxCol; j++) {
                   let tempdata =  this.getCompareData(i,j)
                   this.check(tempdata)
                }  
            }

            //检测指定的图形     

   

            // console.log("this.offsetMaxCol = " + this.offsetMaxCol.toString())
            // console.log("this.offsetMaxRow = " + this.offsetMaxRow.toString())
        }.bind(this))
    }
    //获得对比数据
    getCompareData(offsetRow:number,offsetCol:number){

        let data:any[] = new Array()
        for (let index = 0; index < Define.maxRow*2; index++) {
            data.push(new Array())   
        }

        for (let i = 0; i < Define.maxRow; i++) {
            for (let j = 0; j < Define.maxCol; j++) {
                data[i+offsetRow][j+offsetCol] = this.info[i][j]
            }  
        }
        return data
    }

    check(data){
        let lastBlock:Block = null
        let blockArr:Block [] = []
        for (let i = 0; i < Define.maxRow; i++) {
            for (let j = 0; j < Define.maxCol; j++) {
                if(data[i][j] == 1){
                    let block:Block = BlockManager.getInstance().getBlockByRowCol(i,j)
                    if(block == null){
                        return
                    }else{
                        if(lastBlock == null){
                            if(block.data.whetheExchange){
                                blockArr.push(block)
                            }
                            lastBlock = block
                        }else{
                            if(lastBlock.blockId != block.blockId){
                                return
                            }else{
                                if(block.data.whetheExchange){
                                    blockArr.push(block)
                                }
                                lastBlock = block
                            }
                        }
                    }
                }
            }  
        }
        //收集成功
        if(this.totalCollectCount == blockArr.length){
            console.log("收集成功")
            BlockManager.getInstance().collectShape(blockArr)
        }
    }
}
