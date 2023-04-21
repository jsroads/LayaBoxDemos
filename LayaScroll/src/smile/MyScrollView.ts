/**
 * Created by jsroads on 2019-05-23.16:27
 * Note:
 */
import {ui} from "../ui/layaMaxUI";
import DataConst, {CD_SPACE, DIRECTION, IPork} from "./DataConst";
import MyScrollViewUI = ui.smile.MyScrollViewUI;
import Handler = Laya.Handler;
import Event = Laya.Event;
import Point = Laya.Point;
import GameHelper from "./GameHelper";
import MyScrollItem from "./MyScrollItem";
export const MIDDLE_SIZE = 4;
export default class MyScrollView extends MyScrollViewUI{
    public static PORK_CHANGE: string = "pork_change";//PORK改变
    private porkJson:any;
    private porkList: Array<IPork>;
    private cdViewList: Array<MyScrollItem> = [];
    private direction: number;
    private speed: number;
    private beginTime: number;
    private endTime: number;

    private beginPoint: Point;
    private tempPoint: Point;
    private endTimePoint: Point;
    private changeEvent: number;

    private cdTemptList: Array<any> = [];
    private startIndex: number = 0;
    private endIndex: number = 0;
    private currentPork: IPork;

    private rate: number = 0.95;
    constructor(){
        super();
    }
    public onAwake() {
        this.on(MyScrollView.PORK_CHANGE, this, this.cdChange);
        this.loadJSON();
        this.initEvent();
    }
    private initCD() {
        if (!DataConst.ins.startId) {
            DataConst.ins.startId = 1;
        }
        this.porkList = [];
        for (let key in this.porkJson) {
            this.porkList.push(this.porkJson[key]);
        }
        this.porkList.sort((a, b) => {
            return a.tid > b.tid ? 1 : -1;
        });
        this.startIndex = this.getPorkIndex(DataConst.ins.startId);
        this.startIndex = this.startIndex % this.porkList.length;
        this.endIndex = this.startIndex;
        this.cdTemptList.push(this.getCurMusicFromCD());
        for (let i = 0; i < MIDDLE_SIZE; i++) {
            let cd;
            cd = this.getNextMusicFromCD();
            this.cdTemptList.push(cd);
            cd = this.getPreMusicFromCD();
            this.cdTemptList.unshift(cd);
        }
        // console.log("jsroads------cdTemptList:" + JSON.stringify(this.cdTemptList));
        for (let i = 0; i < this.cdTemptList.length; i++) {
            let msg: any = this.cdTemptList[i];
            msg.index = i;
            let cdViewListElement = new MyScrollItem(msg);
            if (cdViewListElement.info.index == 4) {
                this.setCurrentMusicName(cdViewListElement.info);
            }
            this.cdViewList.push(cdViewListElement);
            this.container.addChild(cdViewListElement);
        }
    }
    public setCurrentMusicName(info: IPork) {
        // SoundMgr.Ins.playSound(SoundURL.PICK);
        this.currentPork = info;
        this.nameText.text = info.name;
    }
    public getPreMusicFromCD() {
        this.startIndex--;
        if (this.startIndex < 0) {
            this.startIndex = this.porkList.length - 1
        }
        let cd = GameHelper.ins.deepCopy(this.porkList[this.startIndex]);
        cd.p_height = this.container.height;
        cd.p_width = this.container.width;
        return cd;
    }

    public getNextMusicFromCD() {
        this.endIndex++;
        if (this.endIndex >= this.porkList.length) {
            this.endIndex = 0
        }
        let cd = GameHelper.ins.deepCopy(this.porkList[this.endIndex]);
        cd.p_height = this.container.height;
        cd.p_width = this.container.width;
        return cd;
    }
    private getPorkIndex(tid) {
        for (let i = 0; i < this.porkList.length; i++) {
            let cdListElement = this.porkList[i];
            if (tid == cdListElement.tid) {
                return i;
            }
        }
        return 0;
    }

    public getCurMusicFromCD() {
        let cd = GameHelper.ins.deepCopy(this.porkList[this.startIndex]);
        cd.p_height = this.container.height;
        cd.p_width = this.container.width;
        return cd;
    }
    private initEvent(): void {
        this.container.on(Event.MOUSE_DOWN, this, (e) => {
            Laya.timer.clear(this, this.updateTime);
            this.resetCDElement();
            this.stage.on(Event.MOUSE_OUT, this, this.onMouseUp);
            this.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);
            this.beginTime = Laya.Browser.now();
            this.beginPoint = new Laya.Point(e.stageX, e.stageY);
            this.tempPoint = new Laya.Point(e.stageX, e.stageY);
        });
        this.leftBtn.on(Event.CLICK, this, () => {
            this.leftMusic()
        });
        this.rightBtn.on(Event.CLICK, this, () => {
            this.rightMusic()
        });
    }
    private rightChange() {
        for (let i = 0; i < this.cdViewList.length; i++) {
            let cdViewListElement = this.cdViewList[i];
            if (cdViewListElement.x > 900) {
                return true;
            }
        }
        return false;
    }

    private leftChange() {
        for (let i = 0; i < this.cdViewList.length; i++) {
            let cdViewListElement = this.cdViewList[i];
            if (cdViewListElement.x < -260) {
                return true;
            }
        }
        return false;
    }
    private getDistance(pos1: Point, pos2: Point): number {
        let pos: Point = new Laya.Point(pos2.x - pos1.x, pos2.y - pos1.y);
        return Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    }
    private setCardPosition(distance: number) {
        for (let i = 0; i < this.cdViewList.length; i++) {
            let cdViewListElement = this.cdViewList[i];
            cdViewListElement.x += Math.floor(distance);
            cdViewListElement.resetRightScale()
        }
        if (this.leftChange()) {
            this.cdChange(DIRECTION.LEFT)
        } else if (this.rightChange()) {
            this.cdChange(DIRECTION.RIGHT)
        }
    }

    /**移到事件处理*/
    onMouseMove(e: Event) {
        let point = new Laya.Point(e.stageX, e.stageY);
        let distance = point.x - this.tempPoint.x;
        this.tempPoint = point;
        this.direction = distance > 0 ? DIRECTION.RIGHT : DIRECTION.LEFT;
        this.setCardPosition(distance);

    }
    /**抬起事件处理*/
    private onMouseUp(e: Event): void {
        // console.log("jsroads------onMouseUp:" + JSON.stringify("onMouseUp"));
        Laya.stage.off(Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.off(Event.MOUSE_OUT, this, this.onMouseUp);
        Laya.stage.off(Event.MOUSE_MOVE, this, this.onMouseMove);
        this.endTime = Laya.Browser.now();
        this.endTimePoint = new Laya.Point(e.stageX, e.stageY);
        let distance = this.getDistance(this.endTimePoint, this.beginPoint);
        if (Math.abs(distance) <= 5) {
            this.setPosToTarget();
            return;
        }
        this.speed = Math.abs(distance) / (this.endTime - this.beginTime) * 10;
        if ((this.endTimePoint.x - this.beginPoint.x) > 0) {
            this.speed *= 1;
        } else {
            this.speed *= -1;
        }
        Laya.timer.loop(10, this, this.updateTime, [])
    }

    private updateTime(timer, dt) {
        this.speed = this.speed * this.rate;
        if (Math.abs(this.speed) < 1) {
            Laya.timer.clear(this, this.updateTime);
            this.setPosToTarget();
        }
        for (let i = 0; i < this.cdViewList.length; i++) {
            let cdViewListElement = this.cdViewList[i];
            cdViewListElement.x += Math.floor(this.speed);
        }
        if (this.leftChange()) {
            this.cdChange(DIRECTION.LEFT)
        } else if (this.rightChange()) {
            this.cdChange(DIRECTION.RIGHT)
        }
    }
    onOpened(param: any): void {

    }
    loadJSON() {
        let porkURL = "json/pork.json";
        Laya.loader.load(porkURL, Handler.create(null, (success) => {
            this.porkJson = Laya.loader.getRes(porkURL);
            console.log("smile------:" + JSON.stringify(this.porkJson));

            this.initCD();
        }));
    }
    private cdChange(changeEvent) {
        this.changeEvent = changeEvent;
        if (this.changeEvent == DIRECTION.LEFT) {
            let first = this.cdViewList.shift();
            first.x = this.cdViewList[this.cdViewList.length - 1].x + CD_SPACE;
            first.info = this.getNextMusicFromCD();
            this.cdViewList.push(first);
        } else {
            let end = this.cdViewList.pop();
            end.x = this.cdViewList[0].x - CD_SPACE;
            end.info = this.getPreMusicFromCD();
            this.cdViewList.unshift(end)
        }
        this.setCDScale();
    }
    setCDScale() {
        for (let i = 0; i < this.cdViewList.length; i++) {
            let cdViewListElement = this.cdViewList[i];
            cdViewListElement.info.index = i;
            if (i == 4) {
                this.setCurrentMusicName(cdViewListElement.info);
            }
            cdViewListElement.setCDState();
            cdViewListElement.resetRightScale();
        }
    }
    resetCDElement() {
        for (let i = 0; i < this.cdViewList.length; i++) {
            let cdViewListElement = this.cdViewList[i];
            cdViewListElement.stopTime();
        }
    }

    setPosToTarget() {
        for (let i = 0; i < this.cdViewList.length; i++) {
            let cdViewListElement = this.cdViewList[i];
            cdViewListElement.setTargetPos();
        }
    }
    private leftMusic() {
        this.resetCDElement();
        this.cdChange(DIRECTION.RIGHT);
        this.setPosToTarget();
    }

    private rightMusic() {
        this.resetCDElement();
        this.cdChange(DIRECTION.LEFT);
        this.setPosToTarget();
    }
}
