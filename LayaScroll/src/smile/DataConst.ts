/**
 * Created by jsroads on 2019-05-23.16:53
 * Note:
 */
export enum DIRECTION {
    LEFT = -1,
    RIGHT = 1
}
export const CD_SPACE = 120;
export const CD_GRID = 316;

export interface IPork {
    tid: number,
    icon: string,
    show: number,
    star: number,
    name: string,
    type: number,
    url: string,
    index: number,
    p_height: number,
    p_width: number,
    percent: number,
    nextTid: number,
    open: number,
    statusType: number
}

export default class DataConst {
    get startId(): number {
        return this._startId;
    }

    set startId(value: number) {
        this._startId = value;
    }
    static get ins(): DataConst {
        if(!this._ins) this._ins = new DataConst();
        return this._ins;
    }

    static set ins(value: DataConst) {
        this._ins = value;
    }

    private _startId:number = 1;
    private static _ins: DataConst;
}