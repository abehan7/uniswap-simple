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

console.log(errorCase1);
