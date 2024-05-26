//该文件自动生成 不能手动修改参数 所有数值信息以策划的excel表为准
export default class LDataBanner
{
    public viewId:number;//--//viewID
    public desc:string;//--备注
    public isShowBanner:boolean;//--是否显示广告
    constructor(viewId:number,desc:string,isShowBanner:boolean)
    {
        this.viewId = viewId;
        this.desc = desc;
        this.isShowBanner = isShowBanner;
    }

};