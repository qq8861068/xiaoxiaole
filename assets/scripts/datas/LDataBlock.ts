//该文件自动生成 不能手动修改参数 所有数值信息以策划的excel表为准
export default class LDataBlock
{
    public ID:number;//--//blockID
    public desc:string;//--道具名称
    public invitationAward:number;//--移动方式
    public whetherCover:boolean;//--是否覆盖普通道具
    public nextID:number;//--下个道具ID
    public eliminateType:number;//--消除方式
    public whetheExchange:boolean;//--是否可交换
    public icon:string;//--资源道具名称
    constructor(ID:number,desc:string,invitationAward:number,whetherCover:boolean,nextID:number,eliminateType:number,whetheExchange:boolean,icon:string)
    {
        this.ID = ID;
        this.desc = desc;
        this.invitationAward = invitationAward;
        this.whetherCover = whetherCover;
        this.nextID = nextID;
        this.eliminateType = eliminateType;
        this.whetheExchange = whetheExchange;
        this.icon = icon;
    }

};