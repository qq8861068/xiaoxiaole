//该文件自动生成 不能手动修改参数 所有数值信息以策划的excel表为准
export default class LDataShare
{
    public ID:number;//--//blockID
    public invitationNumber:number;//--邀请人数
    public invitationAward:string;//--邀请奖励
    constructor(ID:number,invitationNumber:number,invitationAward:string)
    {
        this.ID = ID;
        this.invitationNumber = invitationNumber;
        this.invitationAward = invitationAward;
    }

};