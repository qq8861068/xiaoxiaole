//该文件自动生成 不能手动修改参数 所有数值信息以策划的excel表为准
export default class LDataGifts
{
    public id:number;//--//blockID
    public desc:string;//--礼包种类备注
    public award:string;//--礼包奖励
    constructor(id:number,desc:string,award:string)
    {
        this.id = id;
        this.desc = desc;
        this.award = award;
    }

};