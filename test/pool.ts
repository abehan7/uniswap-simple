import { expect, assert } from "chai";
import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import Price from "./schema/price";
import { PoolContract } from "../typechain-types/Pool.sol";
// import "@nomicfoundation/hardhat-chai-matchers";
describe("Pool", async () => {
  let contract: PoolContract;

  beforeEach(async () => {
    const Pool = await ethers.getContractFactory("PoolContract");
    contract = await Pool.deploy();
  });

  describe("TestPoolPrice", async () => {
    it("Should return the correct price(normal case)", async () => {
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
    it("Should return the correct price(panicking case)", async () => {
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
    it("Should return the correct status of pool's depletion", async () => {
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
        await contract.createPool(params[i].rx, params[i].ry, params[i].ps);
        const isDepleted = await contract.isDepleted();
        expect(isDepleted).to.equal(params[i].isDepleted);
      }
    });
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
      it(`Should return the correct amount of y (${params[i].name})`, async () => {
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
      it(`Should return the correct amount of x (${params[i].name})`, async () => {
        await contract.createPool(params[i].rx, params[i].ry, 0);
        const x = await contract.callStatic.YtoX(params[i].inputY);
        expect(x.toString()).to.equal(params[i].outputX.toString());
      });
    }
  });
});
