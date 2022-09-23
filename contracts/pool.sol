// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

// Rx, Ry sdk.Int
contract PoolContract {
    using lib for uint256;
    using SafeMath for uint256;

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

    function deposit(uint256 x, uint256 y) public returns (uint256) {
        /**  
         Calculate accepted amount and minting amount.
         Note that we take as many coins as possible(by ceiling numbers)
         from depositor and mint as little coins as possible.

         TODO: implement calculating logic for ax, ay, pc =================
         ..
         */
        require(x > 0 && y > 0, "invalid deposit amount");

        uint256 _k = k();
        uint256 pc = (pool.Rx.add(x)).mul(pool.Ry.add(y)) - _k;

        // ==================================================================
        // 	// update pool states
        pool.Rx = pool.Rx.add(x);
        pool.Ry = pool.Ry.add(y);
        pool.Ps = pool.Ps.add(pc);
        // 	return
        return pc;
    }

    function withdraw(uint256 pc) public returns (uint256, uint256) {
        // 	// TODO: implement calculating logic for x, y =======================
        // 	// ..

        uint256 x = pool.Rx.mul(pc) / pool.Ps;
        uint256 y = pool.Ry.mul(pc) / pool.Ps;
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
        uint256 yDelta = pool.Ry.sub(_k.div(pool.Rx + xDelta));

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
        uint256 xDelta = pool.Rx.sub(_k.div(pool.Ry + yDelta));
        // uint256 fee = (pool.Rx - xDelta).div(pool.Ry + yDelta).sub(oldPrice);
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
}
