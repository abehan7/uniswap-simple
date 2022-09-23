import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
// import "@nomicfoundation/hardhat-chai-matchers";
const decimal = 10 ** 18;
describe("Pool", async () => {
  let contract: any;
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
          // p: sdk.NewDec(200),
        },
        {
          name: "decimal rounding",
          ps: 10000,
          rx: 200,
          ry: 300,
          p: "0.666666666666666667",
          // 이거 18자리까지 나오게하고 올림으로 처리하기
          // p: sdk.MustNewDecFromStr("0.666666666666666667"),
        },
      ];
      for (let i = 0; i < prams.length; i++) {
        await contract.createPool(prams[i].rx, prams[i].ry, prams[i].ps);
        //   console.log(test);
        const price = await contract.price();
        //   console.log(price.toString());
        //   console.log(prams[i].p);

        const isDecimal = prams[i].p.includes(".");
        let decimalPrice = "0";
        if (isDecimal) {
          const decimalPriceLength = prams[i].p.split(".")[1].length;
          decimalPrice =
            prams[i].p.split(".")[1] + "0".repeat(18 - decimalPriceLength);
          // console.log(`decimalPrice: ${decimalPrice}`);
          // console.log(`price: ${price.toString()}`);
        }

        const testPrice = isDecimal
          ? decimalPrice
          : Number(prams[i].p) * decimal;
        expect(price.toString()).to.equal(testPrice.toString());
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
        const price = await contract.price();
        expect(price.toString()).to.equal("0");
      }
    });
  });
});
