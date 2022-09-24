// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

// Rx, Ry sdk.Int
contract PoolContract {
    using lib for uint256;
    using lib for string;

    using SafeMath for uint256;
    using Strings for uint256;
    uint256 constant one = 1;

    struct Pool {
        // Rx and Ry are the pool's reserve balance of each x/y coin.
        uint256 Rx;
        uint256 Ry;
        // Ps is the pool's pool coin supply.
        uint256 Ps;
        // Ps sdk.Int
    }
    Pool pool;

    constructor() {}

    function createPool(
        uint256 _rx,
        uint256 _ry,
        uint256 _ps
    ) public returns (bool) {
        pool.Rx = _rx;
        pool.Ry = _ry;
        pool.Ps = _ps;
        return true;
    }

    // Balances returns the balances of the pool.
    function balances() public view returns (uint256, uint256) {
        return (pool.Rx, pool.Ry);
    }

    // PoolCoinSupply returns the pool coin supply.
    function poolCoinSupply() public view returns (uint256) {
        return pool.Ps;
    }

    // Price returns the pool price.
    function price() public view returns (uint256) {
        require(pool.Rx > 0 && pool.Ry > 0, "pool is empty");
        return (pool.Rx.ToDec() * 10).div(pool.Ry).rounds();
    }

    // K returns the pool k.
    function k() public view returns (uint256) {
        return pool.Rx.mul(pool.Ry);
    }

    // IsDepleted returns whether the pool is depleted or not.
    function isDepleted() public view returns (bool) {
        return pool.Ps == 0 || pool.Rx == 0 || pool.Ry == 0;
    }

    // Deposit returns accepted x and y coin amount and minted pool coin amount
    // when someone deposits x and y coins.

    function deposit(uint256 x, uint256 y)
        public
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        /**  
         Calculate accepted amount and minting amount.
         Note that we take as many coins as possible(by ceiling numbers)
         from depositor and mint as little coins as possible.

         TODO: implement calculating logic for ax, ay, pc =================
         ..
         */
        require(x > 0 && y > 0, "invalid deposit amount");
        uint256 pc;
        uint256 ax;
        uint256 ay;

        uint256 XdivY = pool.Rx.div(pool.Ry);
        bool isDecimalCase = XdivY * 10 != (pool.Rx.mul(10)).div(pool.Ry);
        // working well

        if (isDecimalCase) {
            //  XdivY = pool.Rx.div(pool.Ry);
            XdivY = (pool.Rx.ToDec()).div(pool.Ry);
            // console.log("XdivY", XdivY);
            // console.log("x", x.ToDec());
        }

        uint256 requiredXamount = y.mul(XdivY);

        if (!isDecimalCase && requiredXamount <= x) {
            // when x supply is more than y supply
            ax = requiredXamount;
            ay = y;
        } else if (!isDecimalCase && requiredXamount > x) {
            // when y supply is more than x supply
            ax = x;
            ay = x.div(XdivY);
        } else if (isDecimalCase && requiredXamount <= x.ToDec()) {
            // when it's decimal case and x supply is more than y supply
            ax = requiredXamount;
            ay = y.ToDec();

            // console.log("ay:", ay);
        } else if (isDecimalCase && requiredXamount > x.ToDec()) {
            // when it's decimal case and y supply is more than x supply
            ax = x.ToDec();
            ay = x.ToDec().div(XdivY);
        }
        pc = (ax.mul(pool.Ps)).div(pool.Rx);
        // console.log("ax: ", ax);
        // console.log("ay: ", ay);
        // console.log("pc: ", pc);

        // uint256 pc = (pool.Rx.add(x)).mul(pool.Ry.add(y)) - _k;
        // ==================================================================
        // 	// update pool states
        if (!isDecimalCase) {
            pool.Rx = pool.Rx.add(ax);
            pool.Ry = pool.Ry.add(ay);
            pool.Ps = pool.Ps.add(pc);
            return (ax, ay, pc);
        } else {
            uint256 ax2 = ax.delDec();
            uint256 ay2 = ay.delDec();
            uint256 pc2 = pc.delDec();
            // console.log("ax2: ", ax2);
            // console.log("ay2: ", ay2);
            // console.log("ay: ", ay);
            // console.log("pc2: ", pc2);
            pool.Rx = pool.Rx.add(ax2);
            pool.Ry = pool.Ry.add(ay2);
            pool.Ps = pool.Ps.add(pc2);
            return (ax2, ay2, pc2);
        }
        // 	return
        // return (ax, ay, pc);
    }

    function withdraw(uint256 pc, uint256 feeRate)
        public
        returns (uint256, uint256)
    {
        // 	// TODO: implement calculating logic for x, y =======================
        // 	// ..
        // 일단 feeRate 이거는 무시하고 차후적으로 추가하기
        uint256 x;
        uint256 y;
        uint256 _pc = pc;
        uint256 _price = price(); // decimal 곱해져있는 상태 // price  * (10**18)

        if (feeRate != 0) {
            _pc = pc.mul(one.ToDec() - feeRate);
            x = (pool.Rx.mul(_pc)).div(pool.Ps).delDec();
        } else {
            x = (pool.Rx.mul(pc)).div(pool.Ps);
        }
        y = x.ToDec() / _price;

        // x = (pool.Rx.mul(pc)).div(pool.Ps);
        // if (feeRate != 0) {
        // x = (pool.Rx.mul(_pc)).div(pool.Ps).delDec();
        // }

        // 	// ==================================================================
        // 	// update pool states
        pool.Rx = pool.Rx.sub(x);
        pool.Ry = pool.Ry.sub(y);
        pool.Ps = pool.Ps.sub(pc);
        // console.log("x", x);
        // console.log("y", y);
        // console.log("pc", pc);
        return (x, y);
    }

    function XtoY(uint256 xDelta) public returns (uint256) {
        require(xDelta > 0, "xDelta must be positive");
        require(pool.Rx >= xDelta, "xDelta must be less than Rx");
        // 	// TODO: implement x to y swap logic  ===============================
        // 	// ..
        uint256 _k = k();
        // add decimals
        uint256 valA = pool.Ry.ToDec();
        uint256 valB = _k.div(pool.Rx + xDelta).ToDec();

        // delete decimals
        uint256 yDelta = (valA - valB) / one.ToDec();

        // 	// ==================================================================
        // 	// update pool states
        pool.Rx = pool.Rx.add(xDelta);
        pool.Ry = pool.Ry.sub(yDelta);
        return yDelta;
    }

    function YtoX(uint256 yDelta) public returns (uint256) {
        require(yDelta > 0, "yDelta must be positive");
        require(pool.Ry >= yDelta, "yDelta must be less than Ry");
        // TODO: implement y to x swap logic  ===============================
        // ..
        uint256 _k = k();
        // add decimals
        uint256 valA = pool.Rx.ToDec();
        uint256 valB = _k.ToDec().div(pool.Ry + yDelta);
        // uint256 one = 1;
        // delete decimals
        uint256 xDelta = (valA - valB) / one.ToDec();
        // ==================================================================

        // update pool states
        pool.Rx = pool.Rx.sub(xDelta);
        pool.Ry = pool.Ry.add(yDelta);
        return xDelta;
    }
}

library lib {
    using SafeMath for uint256;

    function ToDec(uint256 a) internal pure returns (uint256) {
        unchecked {
            return a * 10**18;
        }
    }

    function delDec(uint256 a) internal pure returns (uint256) {
        unchecked {
            return a / 10**18;
        }
    }

    function Quo(uint256 a, uint256 b) internal pure returns (uint256) {
        unchecked {
            if (b == 0) return 0;
            return a / b;
        }
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function rounds(uint256 a) internal pure returns (uint256) {
        unchecked {
            if ((a % 10) >= 5) {
                return (a / 10) + (1);
            } else {
                return (a / 10);
            }
        }
    }

    function toLength(string memory a) internal pure returns (uint256) {
        return bytes(a).length - 1;
    }
}
