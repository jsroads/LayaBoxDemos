/**
 * Created by jsroads on 2019-05-23.17:09
 * Note:
 */
export default class GameHelper {
    static get ins(): GameHelper {
        if(!this._ins) this._ins = new GameHelper();
        return this._ins;
    }

    static set ins(value: GameHelper) {
        this._ins = value;
    }

    private static _ins: GameHelper;
    /**
     * 深度克隆
     * 对象可以完全脱离原对象
     */
    public deepCopy(source): any {
        let target: any = Array.isArray(source) ? [] : {};
        for (var k in source) {
            if (typeof source[k] === 'object') {
                target[k] = this.deepCopy(source[k])
            } else {
                target[k] = source[k]
            }
        }
        return target
    }
    public getZorderByIndex(index: number): number {
        let z: number = 0;
        switch (index) {
            case 4:
                z = 8;
                break;
            case 5:
                z = 7;
                break;
            case 3:
                z = 6;
                break;
            case 6:
                z = 5;
                break;
            case 2:
                z = 4;
                break;
            case 7:
                z = 3;
                break;
            case 1:
                z = 2;
                break;
            case 8:
                z = 1;
                break;
            case 0:
                z = 0;
                break;

        }
        return z
    }
}