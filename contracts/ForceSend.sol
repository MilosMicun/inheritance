// SPDX-License-Identifier: MIT
// WARNING: selfdestruct used intentionally for force-send test scenario
pragma solidity ^0.8.20;

contract ForceSend {
    constructor() payable {}

    function boom(address payable target) external {
        selfdestruct(target);
    }
}