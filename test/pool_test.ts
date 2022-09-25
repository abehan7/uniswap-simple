import { expect, assert } from "chai";
import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
// import { PoolContract } from "../typechain-types";
import { PoolContract } from "../typechain-types";
import { Price } from "./schema";
import {
  testDepositParams,
  testIsDepletedParams,
  testPoolPriceParams_1,
  testPoolPriceParams_2,
  testWithdrawPrams,
  testXtoYParams,
  testYtoXParams,
} from "./data";
// import "@nomicfoundation/hardhat-chai-matchers";
describe("Pool", async () => {
  let contract: PoolContract;

  beforeEach(async () => {
    const Pool = await ethers.getContractFactory("PoolContract");
    contract = (await Pool.deploy()) as PoolContract;
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
    const params = testWithdrawPrams;

    for (let i = 0; i < params.length; i++) {
      const tc = params[i];
      it(`(${tc.name}) Should return the correct amount of x, y`, async () => {
        await contract.createPool(tc.rx, tc.ry, tc.ps);
        const [_x, _y] = await contract.callStatic.withdraw(
          tc.pc,
          tc.feeRate * 10 ** 18 //여기 decimal처리해야할듯
        );

        const [x, y] = [_x, _y].map((token) => token.toString());
        expect(x).to.equal(tc.x.toString());
        expect(y).to.equal(tc.y.toString());

        // Additional assertions 여기는 차후적으로 추가하기
        // require.True(t, tc.pc * tc.rx >= x.Int64() * tc.ps);
        assert(tc.pc * tc.rx >= Number(x) * tc.ps, "");
        // require.True(t, tc.pc * tc.ry >= y * tc.ps);
        assert(tc.pc * tc.ry >= Number(y) * tc.ps, "");
      });
    }
  });
  // assert(false, "stop for now to check withdraw");

  describe("TestDeposit", async () => {
    const params = testDepositParams;
    for (let i = 0; i < params.length; i++) {
      it(`(${params[i].name}) Should return the correct amount of pool coins and accepted x,y`, async () => {
        await contract.createPool(params[i].rx, params[i].ry, params[i].ps);
        const [_ax, _ay, _pc] = await contract.callStatic.deposit(
          params[i].x,
          params[i].y
        );

        const [ax, ay, pc] = [_ax, _ay, _pc].map((x) => x.toString());
        // console.log(ax, ay, pc);
        expect(ax).to.equal(params[i].ax.toString());
        expect(ay).to.equal(params[i].ay.toString());
        expect(pc).to.equal(params[i].pc.toString());

        const isDepleted = await contract.callStatic.isDepleted();

        const tc = params[i];
        if (!isDepleted) {
          expect(Number(ax) * Number(tc.ps) >= Number(pc) * Number(tc.rx));
          // (ax / Rx) > (pc / Ps)
          expect(Number(ax) / tc.rx > Number(pc) / Number(tc.ps));

          expect(Number(ay) * Number(tc.ps) >= Number(pc) * Number(tc.ry));
          // (ay / Ry) > (pc / Ps)
          expect(Number(ay) / tc.ry > Number(pc) / Number(tc.ps));
        }
        // Additional assertions
        // if !pool.IsDepleted() {
        // 	require.True(t, (ax.Int64()*tc.ps) >= (pc.Int64()*tc.rx)) // (ax / Rx) > (pc / Ps)
        // 	require.True(t, (ay.Int64()*tc.ps) >= (pc.Int64()*tc.ry)) // (ay / Ry) > (pc / Ps)
        // }
      });
    }
  });
});
