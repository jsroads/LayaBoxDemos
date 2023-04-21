/**
 * Created by jsroads on 2019-05-23.16:28
 * Note:
 */
import {ui} from "../ui/layaMaxUI";
import {CD_GRID, CD_SPACE, IPork} from "./DataConst";
import MyScrollItemUI = ui.smile.MyScrollItemUI;
import GameHelper from "./GameHelper";

export default class MyScrollView extends MyScrollItemUI {
    public info: IPork;
    public SINGLE_SCALE: number = 640;

    constructor(data: IPork) {
        super();
        this.info = data;
        this.size(CD_GRID, CD_GRID);
        this.anchorX = this.anchorY = 0.5;
        this.SINGLE_SCALE = this.info.p_width / 80;
    }

    public onEnable() {
        this.y = this.info.p_height / 2;
        this.x = (this.info.index - 4) * CD_SPACE + this.info.p_width / 2;
        // console.log("jsroads------ this.x:" + JSON.stringify(this.x));
        this.setCDState();
        this.resetRightScale();
    }

    public setCDState() {
        this.porkImage.loadImage("pork/" + this.info.icon);
    }

    public setTargetPos() {
        Laya.Tween.clearAll(this);
        let targetX = (this.info.index - 4) * CD_SPACE + this.info.p_width / 2;
        let scale = (this.info.p_width * 0.5 - Math.abs((this.info.p_width * 0.5 - targetX))) / this.SINGLE_SCALE * 0.01 + 0.6;
        Laya.Tween.to(this, {x: targetX}, 150);
        Laya.Tween.to(this.porkImage, {scaleX: scale, scaleY: scale}, 150);
        if (this.info.index == 4) {
            Laya.timer.loop(30, this, this.updateTime, [])
        }
    }
    

    public resetRightScale() {
        let scale = (this.info.p_width * 0.5 - Math.abs((this.info.p_width * 0.5 - this.x))) / this.SINGLE_SCALE * 0.01 + 0.6;
        this.porkImage.scale(scale, scale);
        this.porkImage.scaleX;
        let zOrder = GameHelper.ins.getZorderByIndex(this.info.index);
        if (zOrder != this.zOrder) {
            this.zOrder = zOrder;
        }
    }

    public stopTime() {
        this.porkImage.rotation = 0;
        Laya.timer.clear(this, this.updateTime)
    }

    private updateTime() {
        // this.porkImage.rotation += 1;
    }

}