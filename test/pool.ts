import { expect, assert } from "chai";
import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import Price from "./schema/price";
import { PoolContract } from "../typechain-types/Pool.sol";
// import "@nomicfoundation/hardhat-chai-matchers";
describe("Pool", async () => {
  let contract: any;

  beforeEach(async () => {
    const Pool = await ethers.getContractFactory("PoolContract");
    contract = await Pool.deploy();
  });

  describe("TestPoolPrice", async () => {
    it("(normal case) Should return the correct price", async () => {
      const prams = [
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
      for (let i = 0; i < prams.length; i++) {
        await contract.createPool(prams[i].rx, prams[i].ry, prams[i].ps);
        const price = await contract.price();
        const paramPrice = new Price(prams[i].p);
        expect(price.toString()).to.equal(paramPrice.Price);
      }
    });

    // panicking cases
    it("(panicking case) Should return the correct price", async () => {
      const prams = [
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
    const params = [
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

    for (let i = 0; i < params.length; i++) {
      it(`(${params[i].name}) Should return the correct status of pool's depletion`, async () => {
        await contract.createPool(params[i].rx, params[i].ry, params[i].ps);
        const isDepleted = await contract.isDepleted();
        expect(isDepleted).to.equal(params[i].isDepleted);
      });
    }
  });
  describe("TestXtoY", async () => {
    const params = [
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

    for (let i = 0; i < params.length; i++) {
      it(` (${params[i].name}) Should return the correct amount of y`, async () => {
        await contract.createPool(params[i].rx, params[i].ry, 0);
        const y = await contract.callStatic.XtoY(params[i].inputX);
        expect(y.toString()).to.equal(params[i].outputY.toString());
      });
    }
  });

  describe("TestYtoX", async () => {
    const params = [
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

    for (let i = 0; i < params.length; i++) {
      it(`(${params[i].name}) Should return the correct amount of x`, async () => {
        await contract.createPool(params[i].rx, params[i].ry, 0);
        const x = await contract.callStatic.YtoX(params[i].inputY);
        expect(x.toString()).to.equal(params[i].outputX.toString());
      });
    }
  });
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
