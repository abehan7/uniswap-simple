// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract PoolCoin {
    struct Coin {
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 decimals;
    }

    struct balance {
        uint256 x;
        uint256 y;
        uint256 pool;
    }

    Coin public xCoin =
        Coin({name: "X Coin", symbol: "X", totalSupply: 1000000, decimals: 18});

    Coin public yCoin =
        Coin({name: "Y Coin", symbol: "Y", totalSupply: 1000000, decimals: 18});

    Coin public poolCoin =
        Coin({
            name: "Pool Coin",
            symbol: "POOL",
            totalSupply: 1000000,
            decimals: 18
        });

    // swap ratio
    uint256 public x = 5;
    uint256 public y = 2;
    uint256 public pool = x;

    // x:y = 5:2
    // poolCoinValue = 10x + 4y

    address public owner;
    // mapping(address => uint256) balances;
    mapping(address => balance) balances;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 xCoin,
        uint256 yCoin,
        uint256 poolCoin
    );

    constructor() {
        balances[msg.sender].x = xCoin.totalSupply;
        balances[msg.sender].y = yCoin.totalSupply;
        balances[msg.sender].pool = poolCoin.totalSupply;
        owner = msg.sender;
    }

    function deposit(uint256 _x, uint256 _y) public returns (uint256) {
        require(
            balances[msg.sender].x >= _x && balances[msg.sender].y >= _y,
            "Not enough tokens"
        );
        balances[msg.sender].x -= _x;
        balances[msg.sender].y -= _y;
        balances[msg.sender].pool += _x * x + _y * y;
        emit Transfer(
            msg.sender,
            msg.sender,
            balances[msg.sender].pool,
            _x,
            _y,
            balances[msg.sender].pool
        );
        return balances[msg.sender].pool;
    }

    // function transfer(address to, uint256 amount) external {
    //     require(balances[msg.sender] >= amount, "Not enough tokens");
    //     balances[to] += amount;
    //     balances[msg.sender] -= amount;
    //     emit Transfer(msg.sender, to, amount);
    // }

    // function balanceOf(address account) external view returns (uint256) {
    //     return balances[account];
    // }
}
