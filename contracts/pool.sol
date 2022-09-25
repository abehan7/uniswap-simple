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

        uint256 _price = price(); // decimal 나중에 없애기
        uint256 ax = x;
        uint256 ay = ax.ToDec().div(_price);
        uint256 pc = (ax.mul(pool.Ps)).div(pool.Rx);

        // when pool coin mint decimal, revert the tx
        if (pc == 0) return (0, 0, 0);

        // bool priceIsOne = pool.Rx.div(pool.Ry) == 1 && pool.Rx % pool.Ry == 0;
        // decimal truncation case 2 handler
        // FIXME: 여기 로직을 잘못만들었어
        if (ay > y) {
            ay = y;
            // while (true) {
            //     uint256 _ax1 = ((pool.Rx * ay).mul(10)).div(pool.Ry);
            //     uint256 _ax2 = ((pool.Rx * ay).div(pool.Ry)).mul(10);

            //     if (_ax1 != _ax2) {
            //         ay = ay.sub(one);
            //     } else {
            ax = (pool.Rx.mul(ay)).div(pool.Ry);
            pc = (ax.mul(pool.Ps)).div(pool.Rx);
            // break;
            // }
            // }
        }
        // decimal truncation case 1 handler

        // ==================================================================
        // 	// update pool states
        pool.Rx = pool.Rx.add(ax);
        pool.Ry = pool.Ry.add(ay);
        pool.Ps = pool.Ps.add(pc);
        return (ax, ay, pc);
    }

    function withdraw(uint256 pc, uint256 feeRate)
        public
        returns (uint256, uint256)
    {
        // 	// TODO: implement calculating logic for x, y =======================
        // 	// ..
        uint256 x;
        uint256 y;
        uint256 _pc = pc;
        uint256 _price = price(); // decimal 곱해져있는 상태 // price  * (10**18)

        uint256 holdingPoolCoinPercent = pc.ToDec() / pool.Ps;
        bool isWithdrawAll = holdingPoolCoinPercent == one.ToDec();

        if (feeRate != 0 && !isWithdrawAll) {
            _pc = pc.mul(one.ToDec() - feeRate);
            x = (pool.Rx.mul(_pc)).div(pool.Ps).delDec();
        } else {
            x = (pool.Rx.mul(pc)).div(pool.Ps);
        }
        y = x.ToDec() / _price;

        // 	// ==================================================================
        // 	// update pool states
        pool.Rx = pool.Rx.sub(x);
        pool.Ry = pool.Ry.sub(y);
        pool.Ps = pool.Ps.sub(pc);
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
