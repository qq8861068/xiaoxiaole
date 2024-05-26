/**
 * 长图页中的 level item，满星 3 颗星
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelItem extends cc.Component {

    @property(cc.Label) level_label: cc.Label = null;
    @property(cc.Sprite) level_bg: cc.Sprite = null;
    @property(cc.SpriteFrame) level_bg_lockSF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) level_bg_unlockSF: cc.SpriteFrame = null;

    @property([cc.Sprite]) common_star_arr: cc.Sprite[] = [];
    @property(cc.SpriteFrame) common_star_SF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) common_star_huiSF: cc.SpriteFrame = null;

    /** 显示第几关，配置好的 */
    @property level: number = 0;
    /** 是否已解锁 */
    isUnLock = false;
    /** 星星数 */
    starCount = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    //根据是否已解锁，星星数据做展示
    refresh() {
        this.level_label.string = `${this.level}`;
        //如果处于开启状态
        if (this.isUnLock) {
            this.level_label.node.active = true;
            this.level_bg.node.active = true;
            this.level_bg.spriteFrame = this.level_bg_unlockSF;
            for (let i = 0; i < 3; i++) {
                this.common_star_arr[i].node.active = true;
                if (this.starCount > i) {
                    this.common_star_arr[i].spriteFrame = this.common_star_SF;
                } else {
                    this.common_star_arr[i].spriteFrame = this.common_star_huiSF;
                }
            }
        } else {
            this.level_label.node.active = false;
            this.level_bg.node.active = true;
            this.level_bg.spriteFrame = this.level_bg_lockSF;
            this.common_star_arr.forEach(n => n.node.active = false);
        }
    }

    // update (dt) {}
}
