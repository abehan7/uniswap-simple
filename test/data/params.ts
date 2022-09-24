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
