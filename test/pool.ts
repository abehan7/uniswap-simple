import { expect, assert } from "chai";
import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import Price from "./schema/price";
import { PoolContract } from "../typechain-types";
import {
  testIsDepletedParams,
  testPoolPriceParams_1,
  testPoolPriceParams_2,
  testXtoYParams,
  testYtoXParams,
} from "./data";
// import "@nomicfoundation/hardhat-chai-matchers";
describe("Pool", async () => {
  let contract: PoolContract;

  beforeEach(async () => {
    const Pool = await ethers.getContractFactory("PoolContract");
    contract = await Pool.deploy();
  });

  describe("TestPoolPrice", async () => {
    it("(normal case) Should return the correct price", async () => {
      const prams = testPoolPriceParams_1;
      for (let i = 0; i < prams.length; i++) {
        await contract.createPool(prams[i].rx, prams[i].ry, prams[i].ps);
        const price = await contract.price();
        const paramPrice = new Price(prams[i].p);
        expect(price.toString()).to.equal(paramPrice.Price);
      }
    });

    // panicking cases
    it("(panicking case) Should return the correct price", async () => {
      const prams = testPoolPriceParams_2;

      for (let i = 0; i < prams.length; i++) {
        await contract.createPool(prams[i].rx, prams[i].ry, prams[i].ps);
        try {
          await contract.price();
        } catch (error: any) {
          expect(error.message).includes("pool is empty");
        }
      }
    });
  });

  describe("TestIsDepleted", async () => {
    const params = testIsDepletedParams;

    for (let i = 0; i < params.length; i++) {
      it(`(${params[i].name}) Should return the correct status of pool's depletion`, async () => {
        await contract.createPool(params[i].rx, params[i].ry, params[i].ps);
        const isDepleted = await contract.isDepleted();
        expect(isDepleted).to.equal(params[i].isDepleted);
      });
    }
  });
  describe("TestXtoY", async () => {
    const params = testXtoYParams;

    for (let i = 0; i < params.length; i++) {
      it(` (${params[i].name}) Should return the correct amount of y`, async () => {
        await contract.createPool(params[i].rx, params[i].ry, 0);
        const y = await contract.callStatic.XtoY(params[i].inputX);
        expect(y.toString()).to.equal(params[i].outputY.toString());
      });
    }
  });

  describe("TestYtoX", async () => {
    const params = testYtoXParams;

    for (let i = 0; i < params.length; i++) {
      it(`(${params[i].name}) Should return the correct amount of x`, async () => {
        await contract.createPool(params[i].rx, params[i].ry, 0);
        const x = await contract.callStatic.YtoX(params[i].inputY);
        expect(x.toString()).to.equal(params[i].outputX.toString());
      });
    }
  });

  describe("TestWithdraw", async () => {
    const params = [
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
        // FIXME: error case
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
        // FIXME: error case
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
    for (let i = 0; i < params.length; i++) {
      it(`(${params[i].name}) Should return the correct amount of x, y`, async () => {
        await contract.createPool(params[i].rx, params[i].ry, params[i].ps);
        const [_x, _y] = await contract.callStatic.withdraw(
          params[i].pc,
          params[i].feeRate * 10 ** 18 //여기 decimal처리해야할듯
        );
        const [x, y] = [_x, _y].map((token) => token.toString());
        // console.log(`x:${x} expected x:${params[i].x}`);
        // console.log(`y:${y} expected y:${params[i].y}`);
        expect(x).to.equal(params[i].x.toString());
        expect(y).to.equal(params[i].y.toString());

        // Additional assertions 여기는 차후적으로 추가하기
        // require.True(t, tc.pc * tc.rx >= x.Int64() * tc.ps);
        // require.True(t, tc.pc * tc.ry >= y.Int64() * tc.ps);
      });
    }
  });
  assert(false, "stop for now to check withdraw");

  describe("TestDeposit", async () => {
    const params = [
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
        // FIXME: error case
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
        //  done
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
        // FIXME: error case
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
        // FIXME: error case
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
      it(`(${params[i].name}) Should return the correct amount of pool coins`, async () => {
        await contract.createPool(params[i].rx, params[i].ry, params[i].ps);
        const [_ax, _ay, _pc] = (await contract.callStatic.deposit(
          params[i].x,
          params[i].y
        )) as any;

        const [ax, ay, pc] = [_ax, _ay, _pc].map((x) => x.toString());
        // console.log(ax, ay, pc);
        expect(ax).to.equal(params[i].ax.toString());
        expect(ay).to.equal(params[i].ay.toString());
        expect(pc).to.equal(params[i].pc.toString());

        // Additional assertions
        // if !pool.IsDepleted() {
        // 	require.True(t, (ax.Int64()*tc.ps) >= (pc.Int64()*tc.rx)) // (ax / Rx) > (pc / Ps)
        // 	require.True(t, (ay.Int64()*tc.ps) >= (pc.Int64()*tc.ry)) // (ay / Ry) > (pc / Ps)
        // }
      });
    }
  });
});
