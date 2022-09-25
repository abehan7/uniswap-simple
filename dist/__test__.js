"use strict";
// const test2 = {
//   name: "y to x swap 2",
//   rx: 3000000,
//   ry: 2000000,
//   inputY: 100,
//   outputX: 149,
// };
// const k = test2.rx * test2.ry;
// const deltaX = -k / (test2.ry + test2.inputY) + test2.rx;
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const errorCase1 = data_1.testDepositParams.find((param) => param.name === "decimal truncation");
const errorCase2 = data_1.testDepositParams.find((param) => param.name === "tiny minting amount #2");
console.log(errorCase1);
