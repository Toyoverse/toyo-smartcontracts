// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../tokens/ERC721/NftToken.sol";
import "../tokens/ERC721/NftTokenToyo.sol";
import "../tokens/ERC721/NftTokenCard.sol";
import "../tokens/ERC20/ToyoBondToken.sol";

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

contract NftTokenStakeUpgradeable is
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using ECDSAUpgradeable for bytes32;
    using StringsUpgradeable for uint256;

    NftToken public token;
    NftTokenToyo public tokenToyo;
    NftTokenCard public cardAddress;

    address public signerAddress;
    address public bondAddress;

    mapping(uint256 => address) owners;
    mapping(string => bool) public claims;

    event TokenStaked(address indexed owner, uint256 indexed tokenId);
    event TokenClaimed(
        address indexed owner,
        string indexed claimId,
        uint256 indexed tokenId,
        uint256 bondAmount,
        string cardCode
    );

    function _authorizeUpgrade(address)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}

    function initialize(
        NftToken _token,
        NftTokenToyo _tokenToyo,
        address _signerAddress,
        address _bondAddress,
        NftTokenCard _cardAddress
    ) public initializer {
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        token = _token;
        tokenToyo = _tokenToyo;
        signerAddress = _signerAddress;
        bondAddress = _bondAddress;
        cardAddress = _cardAddress;
    }

    // -----------------------------------------
    // Public only DEFAULT_ADMIN_ROLE
    // -----------------------------------------

    function setSignerAddress(address _signerAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        signerAddress = _signerAddress;
    }

    function setBondAddress(address _bondAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        bondAddress = _bondAddress;
    }

    function setCardAddress(NftTokenCard _cardAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        cardAddress = _cardAddress;
    }

    function setToken(NftToken _token) public onlyRole(DEFAULT_ADMIN_ROLE) {
        token = _token;
    }

    function setTokenToyo(NftTokenToyo _tokenToyo)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        tokenToyo = _tokenToyo;
    }

    // -----------------------------------------
    // Internal
    // -----------------------------------------

    function _getTokenAddress(uint256 _tokenId)
        internal
        view
        returns (IERC721 tokenAddress)
    {
        if (tokenToyo.exists(_tokenId)) {
            return IERC721(address(tokenToyo));
        }

        return IERC721(address(token));
    }

    function matchSigner(bytes32 hash, bytes memory signature)
        private
        view
        returns (bool)
    {
        return
            signerAddress == hash.toEthSignedMessageHash().recover(signature);
    }

    // -----------------------------------------
    // Public
    // -----------------------------------------

    function getOwner(uint256 _tokenId) public view returns (address owner) {
        return owners[_tokenId];
    }

    function claimToken(
        string calldata _claimId,
        uint256 _tokenId,
        uint256 _bondAmount,
        string calldata _cardCode,
        bytes memory _signature
    ) public nonReentrant {
        require(
            matchSigner(
                keccak256(
                    abi.encode(_claimId, _tokenId, _bondAmount, _cardCode)
                ),
                _signature
            ),
            "signature not valid"
        );

        require(
            getOwner(_tokenId) == _msgSender(),
            "you do not stake this tokenId"
        );

        require(!claims[_claimId], "already claimed");

        IERC721 toyoToken = _getTokenAddress(_tokenId);
        toyoToken.transferFrom(address(this), _msgSender(), _tokenId);

        if (_bondAmount > 0) {
            ToyoBondToken bondToken = ToyoBondToken(address(bondAddress));
            bondToken.mint(_msgSender(), _bondAmount);
        }

        if (bytes(_cardCode).length > 0) {
            NftTokenCard cardToken = NftTokenCard(cardAddress);
            cardToken.safeMint(_msgSender(), _cardCode);
        }

        delete owners[_tokenId];
        claims[_claimId] = true;

        emit TokenClaimed(
            _msgSender(),
            _claimId,
            _tokenId,
            _bondAmount,
            _cardCode
        );
    }

    function stakeToken(uint256 _tokenId) public nonReentrant {
        _beforeTokenStake(_tokenId);
        owners[_tokenId] = _msgSender();

        emit TokenStaked(_msgSender(), _tokenId);
    }

    function _beforeTokenStake(uint256 _tokenId) private {
        if (tokenToyo.exists(_tokenId)) {
            require(
                tokenToyo.ownerOf(_tokenId) == _msgSender(),
                "You do not own this tokenId (new collection)"
            );

            tokenToyo.transferFrom(_msgSender(), address(this), _tokenId);
        } else {
            require(
                token.ownerOf(_tokenId) == _msgSender(),
                "You do not own this tokenId (old collection)"
            );

            token.transferFrom(_msgSender(), address(this), _tokenId);
        }
    }
}
