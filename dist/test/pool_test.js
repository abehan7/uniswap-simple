"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
require("@nomiclabs/hardhat-ethers");
const schema_1 = require("./schema");
const data_1 = require("./data");
// import "@nomicfoundation/hardhat-chai-matchers";
describe("Pool", () => __awaiter(void 0, void 0, void 0, function* () {
    let contract;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const Pool = yield hardhat_1.ethers.getContractFactory("PoolContract");
        contract = (yield Pool.deploy());
    }));
    describe("TestPoolPrice", () => __awaiter(void 0, void 0, void 0, function* () {
        it("(normal case) Should return the correct price", () => __awaiter(void 0, void 0, void 0, function* () {
            const prams = data_1.testPoolPriceParams_1;
            for (let i = 0; i < prams.length; i++) {
                yield contract.createPool(prams[i].rx, prams[i].ry, prams[i].ps);
                const price = yield contract.price();
                const paramPrice = new schema_1.Price(prams[i].p);
                (0, chai_1.expect)(price.toString()).to.equal(paramPrice.Price);
            }
        }));
        // panicking cases
        it("(panicking case) Should return the correct price", () => __awaiter(void 0, void 0, void 0, function* () {
            const prams = data_1.testPoolPriceParams_2;
            for (let i = 0; i < prams.length; i++) {
                yield contract.createPool(prams[i].rx, prams[i].ry, prams[i].ps);
                try {
                    yield contract.price();
                }
                catch (error) {
                    (0, chai_1.expect)(error.message).includes("pool is empty");
                }
            }
        }));
    }));
    describe("TestIsDepleted", () => __awaiter(void 0, void 0, void 0, function* () {
        const params = data_1.testIsDepletedParams;
        for (let i = 0; i < params.length; i++) {
            it(`(${params[i].name}) Should return the correct status of pool's depletion`, () => __awaiter(void 0, void 0, void 0, function* () {
                yield contract.createPool(params[i].rx, params[i].ry, params[i].ps);
                const isDepleted = yield contract.isDepleted();
                (0, chai_1.expect)(isDepleted).to.equal(params[i].isDepleted);
            }));
        }
    }));
    describe("TestXtoY", () => __awaiter(void 0, void 0, void 0, function* () {
        const params = data_1.testXtoYParams;
        for (let i = 0; i < params.length; i++) {
            it(` (${params[i].name}) Should return the correct amount of y`, () => __awaiter(void 0, void 0, void 0, function* () {
                yield contract.createPool(params[i].rx, params[i].ry, 0);
                const y = yield contract.callStatic.XtoY(params[i].inputX);
                (0, chai_1.expect)(y.toString()).to.equal(params[i].outputY.toString());
            }));
        }
    }));
    describe("TestYtoX", () => __awaiter(void 0, void 0, void 0, function* () {
        const params = data_1.testYtoXParams;
        for (let i = 0; i < params.length; i++) {
            it(`(${params[i].name}) Should return the correct amount of x`, () => __awaiter(void 0, void 0, void 0, function* () {
                yield contract.createPool(params[i].rx, params[i].ry, 0);
                const x = yield contract.callStatic.YtoX(params[i].inputY);
                (0, chai_1.expect)(x.toString()).to.equal(params[i].outputX.toString());
            }));
        }
    }));
    describe("TestWithdraw", () => __awaiter(void 0, void 0, void 0, function* () {
        const params = data_1.testWithdrawPrams;
        for (let i = 0; i < params.length; i++) {
            const tc = params[i];
            it(`(${tc.name}) Should return the correct amount of x, y`, () => __awaiter(void 0, void 0, void 0, function* () {
                yield contract.createPool(tc.rx, tc.ry, tc.ps);
                const [_x, _y] = yield contract.callStatic.withdraw(tc.pc, tc.feeRate * 10 ** 18 //여기 decimal처리해야할듯
                );
                const [x, y] = [_x, _y].map((token) => token.toString());
                (0, chai_1.expect)(x).to.equal(tc.x.toString());
                (0, chai_1.expect)(y).to.equal(tc.y.toString());
                // Additional assertions 여기는 차후적으로 추가하기
                // require.True(t, tc.pc * tc.rx >= x.Int64() * tc.ps);
                (0, chai_1.assert)(tc.pc * tc.rx >= Number(x) * tc.ps, "");
                // require.True(t, tc.pc * tc.ry >= y * tc.ps);
                (0, chai_1.assert)(tc.pc * tc.ry >= Number(y) * tc.ps, "");
            }));
        }
    }));
    // assert(false, "stop for now to check withdraw");
    describe("TestDeposit", () => __awaiter(void 0, void 0, void 0, function* () {
        const params = [
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
        for (let i = 0; i < params.length; i++) {
            it(`(${params[i].name}) Should return the correct amount of pool coins and accepted x,y`, () => __awaiter(void 0, void 0, void 0, function* () {
                yield contract.createPool(params[i].rx, params[i].ry, params[i].ps);
                const [_ax, _ay, _pc] = yield contract.callStatic.deposit(params[i].x, params[i].y);
                const [ax, ay, pc] = [_ax, _ay, _pc].map((x) => x.toString());
                // console.log(ax, ay, pc);
                (0, chai_1.expect)(ax).to.equal(params[i].ax.toString());
                (0, chai_1.expect)(ay).to.equal(params[i].ay.toString());
                (0, chai_1.expect)(pc).to.equal(params[i].pc.toString());
                // Additional assertions
                // if !pool.IsDepleted() {
                // 	require.True(t, (ax.Int64()*tc.ps) >= (pc.Int64()*tc.rx)) // (ax / Rx) > (pc / Ps)
                // 	require.True(t, (ay.Int64()*tc.ps) >= (pc.Int64()*tc.ry)) // (ay / Ry) > (pc / Ps)
                // }
            }));
        }
    }));
}));
