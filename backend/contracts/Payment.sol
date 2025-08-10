// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Payment {
event Paid(address indexed payer, uint256 amount, string paymentReference);

    // Accept ETH payment and emit event
    function pay(string calldata paymentReference) external payable {
        require(msg.value > 0, "No value sent");
        emit Paid(msg.sender, msg.value, paymentReference);
    }

    // Owner withdraw convenience (optional)
    address public owner = msg.sender;
    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "only owner");
        payable(owner).transfer(amount);
    }
}


