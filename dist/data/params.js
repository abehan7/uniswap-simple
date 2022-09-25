"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDepositParams = exports.testWithdrawPrams = exports.testYtoXParams = exports.testXtoYParams = exports.testIsDepletedParams = exports.testPoolPriceParams_2 = exports.testPoolPriceParams_1 = void 0;
exports.testPoolPriceParams_1 = [
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
exports.testPoolPriceParams_2 = [
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
exports.testIsDepletedParams = [
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
exports.testXtoYParams = [
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
exports.testYtoXParams = [
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
exports.testWithdrawPrams = [
    {
        name: "ideal withdraw",
        rx: 2000,
        ry: 100,
        ps: 10000,
        pc: 1000,
        feeRate: 0,
        x: 200,
        y: 10, // withdrawn coin amount
    },
    {
        name: "ideal withdraw - with fee",
        rx: 2000,
        ry: 100,
        ps: 10000,
        pc: 1000,
        feeRate: 0.003,
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
exports.testDepositParams = [
    {
        name: "ideal deposit",
        rx: 2000,
        ry: 100,
        ps: 10000,
        x: 200,
        y: 10,
        ax: 200,
        ay: 10,
        pc: 1000, // expected minted pool coin amount
    },
    {
        name: "unbalanced deposit",
        rx: 2000,
        ry: 100,
        ps: 10000,
        x: 100,
        y: 2000,
        ax: 100,
        ay: 5,
        pc: 500, // expected minted pool coin amount
    },
    {
        // FIXME: error case
        name: "decimal truncation",
        rx: 222,
        ry: 333,
        ps: 333,
        x: 100,
        y: 100,
        ax: 66,
        ay: 99,
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
