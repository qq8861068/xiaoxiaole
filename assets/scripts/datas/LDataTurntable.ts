//该文件自动生成 不能手动修改参数 所有数值信息以策划的excel表为准
export default class LDataTurntable
{
    public ID:number;//--//blockID
    public itemID:string;//--道具id
    public itemNumber:string;//--道具数量
    public itemWeight:string;//--道具权重
    public weightReduce:string;//--权重减少项
    constructor(ID:number,itemID:string,itemNumber:string,itemWeight:string,weightReduce:string)
    {
        this.ID = ID;
        this.itemID = itemID;
        this.itemNumber = itemNumber;
        this.itemWeight = itemWeight;
        this.weightReduce = weightReduce;
    }

};