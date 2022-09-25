import { testDepositParams } from "./data";

const errorCase1 = testDepositParams.find(
  (param) => param.name === "decimal truncation"
);

const errorCase2 = testDepositParams.find(
  (param) => param.name === "tiny minting amount #2"
);

const normalCase = testDepositParams.find(
  (param) => param.name === "decimal truncation #2"
);

// console.log(normalCase);

const params = [errorCase1, errorCase2, normalCase];

interface IParam {
  name: string;
  rx: number;
  ry: number;

  ps: number;

  x: number;
  y: number;

  ax: number;
  ay: number;

  pc: number;
}

class Deposit {
  private tc: IParam;
  constructor(tc: IParam) {
    this.tc = tc;
  }
  private getAxAy(ay: number) {
    const price = this.tc.rx / this.tc.ry;
    const ax = ay * price;
    const pc = (this.tc.ps * ax) / this.tc.rx;
    return [ax, pc];
  }

  private cutDec(number: number) {
    return parseInt(number.toString());
  }

  get getDepositResult() {
    console.log(` `);

    if (!normalCase) return;
    let ay = this.tc.y;
    // 아~ normal case같은 경우에는 1을 줄여버리니까 바로 코인 1개가 사라져버리네
    let ax: number, pc: number;

    // 여기부터 반복
    // while (true) {
    const [ax1, pc1] = this.getAxAy(ay);
    const [ax2, pc2] = this.getAxAy(ay - 1);
    ax = ax1;
    pc = pc1;
    if (this.cutDec(pc1) === this.cutDec(pc2)) {
      pc = this.cutDec(pc1);
      const poolCoinRatio = pc / this.tc.ps;
      ax = poolCoinRatio * this.tc.rx;
      ay = (this.tc.ry / this.tc.rx) * ax;
    }

    // }

    console.log(
      `${this.tc.name} >> ax: ${parseInt(ax.toString())} ay: ${parseInt(
        ay.toString()
      )} pc: ${parseInt(pc.toString())} `
    );

    console.log(
      `expected values >> ax : ${this.tc.ax} ay:${this.tc.ay} pc:${this.tc.pc}`
    );

    const isPassable =
      this.cutDec(ax) === this.tc.ax &&
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
    const deposit = new Deposit(param!);
    deposit.getDepositResult;
  });
};

init();

// 결론
// pc갯수에 따라 ay가 달라진다
// 만약에 ay에 -1했을때 pc 동일하다 ==> ay -1하기

// ay에 -1했을때 pc값이 달라지면 ay 유지하기
// while 돌리기
