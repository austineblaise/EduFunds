// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title EduToken - Custom ERC20 Token for Education Stipends
contract EduToken is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("EduToken", "EDU") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

/// @title StipendManager - Manages stipend assignments and withdrawals
contract StipendManager is Ownable {
    EduToken public eduToken;

    struct Stipend {
        uint256 amount;
        uint256 unlockDate;
        string category;
        bool withdrawn;
    }

    mapping(address => Stipend[]) public stipends;

    event StipendAssigned(
        address indexed student,
        uint256 amount,
        uint256 unlockDate,
        string category
    );
    event StipendWithdrawn(address indexed student, uint256 amount);

    constructor(address _token) Ownable(msg.sender) {
        eduToken = EduToken(_token);
    }

    /// @notice Assigns a stipend to a student
    function assignStipend(
        address student,
        uint256 amount,
        uint256 unlockDate,
        string memory category
    ) external onlyOwner {
        require(student != address(0), "Invalid address");
        require(unlockDate > block.timestamp, "Unlock date must be in the future");

        eduToken.transferFrom(msg.sender, address(this), amount);
        stipends[student].push(Stipend(amount, unlockDate, category, false));

        emit StipendAssigned(student, amount, unlockDate, category);
    }

    /// @notice Allows students to withdraw unlocked stipends
    function withdraw(uint256 index) external {
        require(index < stipends[msg.sender].length, "Invalid stipend index");
        Stipend storage s = stipends[msg.sender][index];

        require(block.timestamp >= s.unlockDate, "Not yet unlocked");
        require(!s.withdrawn, "Already withdrawn");

        s.withdrawn = true;
        eduToken.transfer(msg.sender, s.amount);

        emit StipendWithdrawn(msg.sender, s.amount);
    }

    /// @notice Returns all stipends for the caller
    function getMyStipends() external view returns (Stipend[] memory) {
        return stipends[msg.sender];
    }
}

