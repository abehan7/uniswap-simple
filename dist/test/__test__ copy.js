"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const errorCase1 = data_1.testDepositParams.find((param) => param.name === "decimal truncation");
const errorCase2 = data_1.testDepositParams.find((param) => param.name === "tiny minting amount #2");
const normalCase = data_1.testDepositParams.find((param) => param.name === "decimal truncation #2");
// console.log(normalCase);
const params = [errorCase1, errorCase2, normalCase];
class Deposit {
    constructor(tc) {
        this.tc = tc;
    }
    getAxAy(ay) {
        const price = this.tc.rx / this.tc.ry;
        const ax = ay * price;
        const pc = (this.tc.ps * ax) / this.tc.rx;
        return [ax, pc];
    }
    cutDec(number) {
        return parseInt(number.toString());
    }
    get getDepositResult() {
        console.log(` `);
        if (!normalCase)
            return;
        let ay = this.tc.y;
        // 아~ normal case같은 경우에는 1을 줄여버리니까 바로 코인 1개가 사라져버리네
        let ax, pc;
        // 여기부터 반복
        while (true) {
            const [ax1, pc1] = this.getAxAy(ay);
            const [ax2, pc2] = this.getAxAy(ay - 1);
            ax = ax1;
            pc = pc1;
            if (this.cutDec(pc1) > this.cutDec(pc2))
                break;
            pc = pc2;
            ay--;
        }
        console.log(`${this.tc.name} >> ax: ${parseInt(ax.toString())} ay: ${parseInt(ay.toString())} pc: ${parseInt(pc.toString())} `);
        console.log(`expected values >> ax : ${this.tc.ax} ay:${this.tc.ay} pc:${this.tc.pc}`);
        const isPassable = this.cutDec(ax) === this.tc.ax &&
            this.cutDec(ay) === this.tc.ay &&
            this.cutDec(pc) === this.tc.pc;
        console.log(`testing pass : ${isPassable}`);
        console.log(` `);
    }
}
// 똑같이 1개 받을꺼면 더 줄여서 가져가라 이건가?
// 확실한건 pc decimal 은 무시된다
const init = () => {
    params.forEach((param) => {
        const deposit = new Deposit(param);
        deposit.getDepositResult;
    });
};
init();
// 결론
// pc갯수에 따라 ay가 달라진다
// 만약에 ay에 -1했을때 pc 동일하다 ==> ay -1하기
// ay에 -1했을때 pc값이 달라지면 ay 유지하기
// while 돌리기
