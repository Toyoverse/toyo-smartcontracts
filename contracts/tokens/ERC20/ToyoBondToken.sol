// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetMinterPauserUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract ToyoBondToken is
    ERC20PresetMinterPauserUpgradeable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    function initialize(string memory _name, string memory _symbol)
        public
        override
        initializer
    {
        __ERC20_init(_name, _symbol);
        __ERC20PresetMinterPauser_init(_name, _symbol);
        __AccessControl_init();
        __Ownable_init();
        __Pausable_init();
    }

    function mint(address to, uint256 amount)
        public
        virtual
        override(ERC20PresetMinterPauserUpgradeable)
        nonReentrant
    {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "ERC20PresetMinterPauser: must have minter role to mint"
        );
        _mint(to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20PresetMinterPauserUpgradeable) {}

    function _authorizeUpgrade(address)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}
}
