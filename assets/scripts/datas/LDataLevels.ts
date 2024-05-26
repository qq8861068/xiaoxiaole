//该文件自动生成 不能手动修改参数 所有数值信息以策划的excel表为准
export default class LDataLevels
{
    public id:number;//--//blockID
    public mapType:number;//--地图类型
    public mapData:number;//--地图数据
    public obstacle:number;//--障碍物数据
    public step:number;//--关卡步数
    public collectInfo:string;//--收集的道具
    public propInfo:string;//--道具信息
    public weight:string;//--道具权重
    public mapImg:string;//--地图
    public music:number;//--关卡音乐
    public award:string;//--关卡奖励
    constructor(id:number,mapType:number,mapData:number,obstacle:number,step:number,collectInfo:string,propInfo:string,weight:string,mapImg:string,music:number,award:string)
    {
        this.id = id;
        this.mapType = mapType;
        this.mapData = mapData;
        this.obstacle = obstacle;
        this.step = step;
        this.collectInfo = collectInfo;
        this.propInfo = propInfo;
        this.weight = weight;
        this.mapImg = mapImg;
        this.music = music;
        this.award = award;
    }

};