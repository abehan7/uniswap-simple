// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

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
        return pool.Rx.div(pool.Ry);
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

    function deposit(uint256 ax, uint256 ay) public returns (uint256) {
        require(ax > 0 && ay > 0, "invalid deposit amount");

        uint256 pc;
        /**  
         Calculate accepted amount and minting amount.
         Note that we take as many coins as possible(by ceiling numbers)
         from depositor and mint as little coins as possible.

         TODO: implement calculating logic for ax, ay, pc =================
         ..
         */
        // 여기도 아까랑 비슷한 논리로 하면
        // A에 돈을 넣으면 A가 많아저서 평가절하 되니까
        // B가지고 있으면 상대적으로 돈이 많아지는거지

        // ==================================================================
        // 	// update pool states
        pool.Rx = pool.Rx.add(ax);
        pool.Ry = pool.Ry.add(ay);
        pool.Ps = pool.Ps.add(pc);
        // 	return
        return pc;
    }

    function withdraw(uint256 ps) public returns (uint256, uint256) {
        uint256 x;
        uint256 y;
        uint256 pc;
        // 	// TODO: implement calculating logic for x, y =======================
        // 	// ..

        // 	// ==================================================================
        // 	// update pool states
        pool.Rx = pool.Rx.sub(x);
        pool.Ry = pool.Ry.sub(y);
        pool.Ps = pool.Ps.sub(pc);
        return (x, y);
    }

    function XtoY(uint256 xDelta) public returns (uint256) {
        require(xDelta > 0, "xDelta must be positive");
        require(pool.Rx > xDelta, "xDelta must be less than Rx");
        // 	// TODO: implement x to y swap logic  ===============================
        // 	// ..
        uint256 oldPrice = price();
        uint256 yDelta = oldPrice.div(xDelta);
        uint256 fee = (pool.Rx + xDelta).div(pool.Ry - yDelta).sub(oldPrice);

        // 	// ==================================================================
        // 	// update pool states
        pool.Rx = pool.Rx.add(xDelta).add(xDelta.mul(fee));
        pool.Ry = pool.Ry.sub(yDelta);
        return yDelta;
    }

    function YtoX(uint256 yDelta) public returns (uint256) {
        require(yDelta > 0, "yDelta must be positive");
        require(pool.Ry > yDelta, "yDelta must be less than Ry");
        // TODO: implement y to x swap logic  ===============================
        // ..
        uint256 oldPrice = price();
        uint256 xDelta = price().mul(yDelta);
        uint256 fee = (pool.Rx - xDelta).div(pool.Ry + yDelta).sub(oldPrice);
        // uint256 fee = (pool.Rx - xDelta).div(pool.Ry + yDelta).sub(oldPrice);
        // ==================================================================

        // update pool states
        pool.Rx = pool.Rx.sub(xDelta);
        pool.Ry = pool.Ry.add(yDelta).add(yDelta.mul(fee));
        return xDelta;
    }
}

library lib {
    function ToDec(uint256 a) public pure returns (uint256) {
        unchecked {
            return a * 10**18;
        }
    }

    function Quo(uint256 a, uint256 b) public pure returns (uint256) {
        unchecked {
            if (b == 0) return 0;
            return a / b;
        }
    }
}
