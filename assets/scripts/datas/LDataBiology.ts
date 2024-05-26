//该文件自动生成 不能手动修改参数 所有数值信息以策划的excel表为准
export default class LDataBiology
{
    public ID:number;//--//blockID
    public desc:string;//--备注
    public name:string;//--道具名称
    public price:number;//--价格
    public buygrade:number;//--购买需求建筑等级
    public produce:number;//--每秒产出
    public img:string;//--资源
    public icon:string;//--缩略图
    constructor(ID:number,desc:string,name:string,price:number,buygrade:number,produce:number,img:string,icon:string)
    {
        this.ID = ID;
        this.desc = desc;
        this.name = name;
        this.price = price;
        this.buygrade = buygrade;
        this.produce = produce;
        this.img = img;
        this.icon = icon;
    }

};