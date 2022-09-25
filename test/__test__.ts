// const test2 = {
//   name: "y to x swap 2",
//   rx: 3000000,
//   ry: 2000000,
//   inputY: 100,
//   outputX: 149,
// };
// const k = test2.rx * test2.ry;
// const deltaX = -k / (test2.ry + test2.inputY) + test2.rx;

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
const getDepositResult = (tc: IParam) => {
  if (!normalCase) return;
  //   const tc = normalCase;
  const ay = tc.y - 1;
  // 아~ normal case같은 경우에는 1을 줄여버리니까 바로 코인 1개가 사라져버리네
  const price = tc.rx / tc.ry;
  const ax = ay * price;
  const pc = tc.ps * (ax / tc.rx);
  console.log(`ax: ${ax} ay: ${ay} pc: ${pc} `);
};
// 똑같이 1개 받을꺼면 더 줄여서 가져가라 이건가?

const init = () => {
  params.forEach((param) => getDepositResult(param!));
};

init();

// 결론
// pc갯수에 따라 ay가 달라진다
