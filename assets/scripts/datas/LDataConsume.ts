//该文件自动生成 不能手动修改参数 所有数值信息以策划的excel表为准
export default class LDataConsume
{
    public ID:number;//--//blockID
    public challengeNumber:number;//--挑战次数
    public gold:number;//--消耗金币
    public item:string;//--消耗道具
    constructor(ID:number,challengeNumber:number,gold:number,item:string)
    {
        this.ID = ID;
        this.challengeNumber = challengeNumber;
        this.gold = gold;
        this.item = item;
    }

};