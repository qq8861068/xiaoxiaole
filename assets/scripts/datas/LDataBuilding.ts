//该文件自动生成 不能手动修改参数 所有数值信息以策划的excel表为准
export default class LDataBuilding
{
    public ID:number;//--//blockID
    public des:string;//--备注
    public buildGrade:string;//--建筑等级
    public upConsumption:string;//--升级消耗
    public biology:string;//--对应庄园道具
    public addition:string;//--金币加成
    public maxNumber:string;//--对应道具最大展示数量
    public open:string;//--开启条件
    public Feed:string;//--喂养消耗
    public duration:string;//--喂养持续时间（s）
    public img:string;//--资源
    public icon:string;//--缩略图资源
    constructor(ID:number,des:string,buildGrade:string,upConsumption:string,biology:string,addition:string,maxNumber:string,open:string,Feed:string,duration:string,img:string,icon:string)
    {
        this.ID = ID;
        this.des = des;
        this.buildGrade = buildGrade;
        this.upConsumption = upConsumption;
        this.biology = biology;
        this.addition = addition;
        this.maxNumber = maxNumber;
        this.open = open;
        this.Feed = Feed;
        this.duration = duration;
        this.img = img;
        this.icon = icon;
    }

};