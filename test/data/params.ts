export const testPoolPriceParams_1 = [
  {
    name: "normal pool",
    ps: 10000,
    rx: 20000,
    ry: 100,
    p: "200",
  },
  {
    name: "decimal rounding",
    ps: 10000,
    rx: 200,
    ry: 300,
    p: "0.666666666666666667",
  },
];
export const testPoolPriceParams_2 = [
  {
    rx: 0,
    ry: 1000,
    ps: 1000,
  },
  {
    rx: 1000,
    ry: 0,
    ps: 1000,
  },
];

export const testIsDepletedParams = [
  {
    name: "empty pool",
    rx: 0,
    ry: 0,
    ps: 0,
    isDepleted: true,
  },
  {
    name: "depleted, with some coins from outside",
    rx: 100,
    ry: 0,
    ps: 0,
    isDepleted: true,
  },
  {
    name: "depleted, with some coins from outside #2",
    rx: 100,
    ry: 100,
    ps: 0,
    isDepleted: true,
  },
  {
    name: "normal pool",
    rx: 10000,
    ry: 10000,
    ps: 10000,
    isDepleted: false,
  },
  {
    name: "not depleted, but reserve coins are gone",
    rx: 0,
    ry: 10000,
    ps: 10000,
    isDepleted: true,
  },
];

export const testXtoYParams = [
  {
    name: "x to y swap 1",
    rx: 100000,
    ry: 10000000000,
    inputX: 100000,
    outputY: 5000000000,
  },
  {
    name: "x to y swap 2",
    rx: 2000000,
    ry: 3000000,
    inputX: 500000,
    outputY: 600000,
  },
];

export const testYtoXParams = [
  {
    name: "y to x swap 1",
    rx: 2000000,
    ry: 3000000,
    inputY: 1000000,
    outputX: 500000,
  },
  {
    name: "y to x swap 2",
    rx: 3000000,
    ry: 2000000,
    inputY: 100,
    outputX: 149,
  },
];

export const testWithdrawPrams = [
  {
    name: "ideal withdraw",
    rx: 2000, // reserve balance
    ry: 100, // reserve balance
    ps: 10000, // pool coin supply
    pc: 1000, // redeeming pool coin amount
    feeRate: 0, //수수료
    x: 200, // withdrawn coin amount
    y: 10, // withdrawn coin amount
  },
  {
    name: "ideal withdraw - with fee",
    rx: 2000,
    ry: 100,
    ps: 10000,
    pc: 1000,
    feeRate: 0.003, // 수수료
    x: 199,
    y: 9,
  },
  {
    name: "withdraw all",
    rx: 123,
    ry: 567,
    ps: 10,
    pc: 10,
    feeRate: 0.003,
    x: 123,
    y: 567,
  },
  {
    name: "advantageous for pool",
    rx: 100,
    ry: 100,
    ps: 10000,
    pc: 99,
    feeRate: 0,
    x: 0,
    y: 0,
  },
  {
    name: "advantageous for pool",
    rx: 10000,
    ry: 100,
    ps: 10000,
    pc: 99,
    feeRate: 0,
    x: 99,
    y: 0,
  },
];

export const testDepositParams = [
  {
    name: "ideal deposit",
    rx: 2000, // reserve balance
    ry: 100, // reserve balance

    ps: 10000, // pool coin supply

    x: 200, // depositing coin amount
    y: 10, // depositing coin amount

    ax: 200, // expected accepted coin amount
    ay: 10, // expected accepted coin amount

    pc: 1000, // expected minted pool coin amount
  },
  {
    name: "unbalanced deposit",
    rx: 2000, // reserve balance
    ry: 100, // reserve balance

    ps: 10000, // pool coin supply

    x: 100, // depositing coin amount
    y: 2000, // depositing coin amount

    ax: 100, // expected accepted coin amount
    ay: 5, // expected accepted coin amount

    pc: 500, // expected minted pool coin amount
  },
  {
    name: "decimal truncation",
    rx: 222, // reserve balance
    ry: 333, // reserve balance

    ps: 333, // pool coin supply

    x: 100, // depositing coin amount
    y: 100, // depositing coin amount

    ax: 66, // expected accepted coin amount
    ay: 99, // expected accepted coin amount

    pc: 99, // expected minted pool coin amount
  },
  {
    name: "decimal truncation #2",
    rx: 200,
    ry: 300,
    ps: 333,
    x: 80,
    y: 80,
    ax: 53,
    ay: 80,
    pc: 88,
  },
  {
    name: "zero minting amount",
    ps: 100,
    rx: 10000,
    ry: 10000,
    x: 99,
    y: 99,
    ax: 0,
    ay: 0,
    pc: 0,
  },
  {
    name: "tiny minting amount",
    rx: 10000,
    ry: 10000,
    ps: 100,
    x: 100,
    y: 100,
    ax: 100,
    ay: 100,
    pc: 1,
  },
  {
    // FIXME: error case
    name: "tiny minting amount #2",
    rx: 10000,
    ry: 10000,
    ps: 100,
    x: 199,
    y: 199,
    ax: 100,
    ay: 100,
    pc: 1,
  },
  {
    name: "zero minting amount",
    rx: 10000,
    ry: 10000,
    ps: 999,
    x: 10,
    y: 10,
    ax: 0,
    ay: 0,
    pc: 0,
  },
];
