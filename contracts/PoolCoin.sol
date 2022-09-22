// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract PoolCoin {
    using SafeMath for uint256;

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
        Coin({name: "X Coin", symbol: "X", totalSupply: 100**18, decimals: 18});

    Coin public yCoin =
        Coin({name: "Y Coin", symbol: "Y", totalSupply: 100**18, decimals: 18});

    Coin public poolCoin =
        Coin({
            name: "Pool Coin",
            symbol: "POOL",
            totalSupply: 100**18,
            decimals: 18
        });

    // swap ratio
    // uint256 public x = 10;
    // uint256 public y = 2;
    // uint256 public YtoX = 10 / 2;
    // uint256 public pool = x / y;
    // uint256 k = 5 / 2;

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

    function XtoY(uint256 _x) public returns (uint256) {
        require(balances[msg.sender].x >= _x, "Not enough X Coin");
        // 1자리수는 없어야돼 나누기에서 소수점이 생기니까
        uint256 _y = _x.mul(2).div(5);
        // y = x * 2 / 5
        // y = x * 0.4

        balances[msg.sender].x = balances[msg.sender].x.sub(_x);
        balances[msg.sender].y = balances[msg.sender].y.add(_y);
        // balances[msg.sender].pool = balances[msg.sender].pool.add(_x);
        // emit Transfer(msg.sender, msg.sender, _x, _x, _y, _x);
        return _y;
    }

    function YtoX(uint256 _y) public returns (uint256) {
        uint256 _x = _y.mul(5).div(2);
        // x = y * 5 / 2
        // x = y * 2.5

        balances[msg.sender].y = balances[msg.sender].y.sub(_y);
        balances[msg.sender].x = balances[msg.sender].x.add(_x);
        // balances[msg.sender].pool = balances[msg.sender].pool.add(_x);
        // emit Transfer(msg.sender, msg.sender, _x, _x, _y, _x);
        return _x;
    }

    function deposit(uint256 _x, uint256 _y) public returns (uint256) {
        ufixed8x1 _poolRatio = 2.5;
        uint256 _pool = _x.mul(_poolRatio) + _y.mul(_poolRatio);
        uint256 _pool = _x;
        return 1;
    }
}
