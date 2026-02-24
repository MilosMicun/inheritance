// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseVault {
    uint256 public totalDeposits;

    event Deposit(address indexed from, uint256 amount);

    function deposit() external payable {
        _beforeDeposit(msg.sender, msg.value);

        totalDeposits += msg.value;

        emit Deposit(msg.sender, msg.value);

        _afterDeposit(msg.sender, msg.value);
    }

    function _beforeDeposit(address from, uint256 amount) internal virtual {}

    function _afterDeposit(address from, uint256 amount) internal virtual {}

    function invariantHolds() public view returns (bool) {
        return address(this).balance == totalDeposits;
    }
}

contract PointsVault is BaseVault {
    mapping(address => uint256) public points;

    event PointsEarned(address indexed user, uint256 points);

    function _afterDeposit(address from, uint256 amount) internal override {
        uint256 earned = amount / 1e15; // 0.001 ETH -> 1 point
        points[from] += earned;
        emit PointsEarned(from, earned);
    }
}