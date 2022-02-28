const NftToken = artifacts.require("./tokens/NftToken.sol");
const NftTokenToyo = artifacts.require("./tokens/NftTokenToyo.sol");
const NftTokenBox = artifacts.require("./tokens/NftTokenBox.sol");
const NftTokenAirdrop = artifacts.require("./tokens/NftTokenAirdrop.sol");
const NftTokenStorage = artifacts.require("./factory/NftTokenStorage.sol");
const NftTokenCrowdsale = artifacts.require("./factory/NftTokenCrowdsale.sol");
const NftTokenSwap = artifacts.require("./swap/NftTokenSwap.sol");
const NftTokenSwapStorage = artifacts.require("./swap/NftTokenSwapStorage.sol");

module.exports = async function(deployer, network, accounts) {
    //return true;

    // deploy wallet: 0x62761466bB3A3Da83B408B5F5fE00ac7b2a5A996

    const _deployedTokenAddress = "0x07AE3987C679c0aFd2eC1ED2945278c37918816c"; // Mainnet
    const _deployedTokenStorageAddress = "0x458cAaDe191B874D6d378f19e42640A711Db90F0"; // Mainnet
    const _deployedTokenSwapStorageAddress = "0x0Fe44a27C9224656fB729a1358EEB9d8876D5695"; // Mainnet

    const _vault = "0xAFa75fF125E0e5F90dC66fBB77C3574f2B2883a2";
    const _royaltiesRecipientAddress = "0xAFa75fF125E0e5F90dC66fBB77C3574f2B2883a2";
    const _coolDownSeconds = new web3.utils.BN(33); // 33 seconds
    const _percentageBasisPoints =  new web3.utils.BN(300); // 3% royalties

    const deployedToken = await NftToken.at(_deployedTokenAddress);
    const deployedTokenStorage = await NftTokenStorage.at(_deployedTokenStorageAddress);
    const deployedTokenSwapStorage = await NftTokenSwapStorage.at(_deployedTokenSwapStorageAddress);

    // (........................................)

    //await deployer.deploy(NftTokenToyo, "Toyo - First 9 - Toyos", "TOYOS");
    //const deployedTokenToyo = await NftTokenToyo.deployed();
    const deployedTokenToyo = await NftTokenToyo.at("0xaf5107e0a3Ea679B6Fc23A9756075559e2e4649b");

    //await deployer.deploy(NftTokenBox, "Toyo - Seed Boxes", "TOYSB");
    //const deployedTokenBox = await NftTokenBox.deployed();
    const deployedTokenBox = await NftTokenBox.at("0x5c29302b5ae9e99f866704e28528d5be9b7b6a40");

    //await deployer.deploy(NftTokenAirdrop, "Toyo - Air Drops", "TOYAD");
    //const deployedTokenAirdrop = await NftTokenAirdrop.deployed();
    const deployedTokenAirdrop = await NftTokenAirdrop.at("0xF7DeDa9D83224789D3f905DD95425670c0a5D63d");

    /*await deployer.deploy(NftTokenCrowdsale, 
        _vault, 
        deployedToken.address, 
        deployedTokenToyo.address, 
        deployedTokenBox.address, 
        deployedTokenAirdrop.address, 
        deployedTokenStorage.address
    );
    const deployedFactory = await NftTokenCrowdsale.deployed();*/

    const deployedFactory = await NftTokenCrowdsale.at("0x656fb7446ad100C0DC7a2d0f65b56069F499bff8");

    /*await deployer.deploy(NftTokenSwap, 
        deployedToken.address, 
        deployedTokenToyo.address, 
        deployedTokenBox.address, 
        deployedTokenStorage.address,
        deployedTokenSwapStorage.address
    );
    const deployedSwap = await NftTokenSwap.deployed();*/

    const deployedSwap = await NftTokenSwap.at("0x00258f054bD2f559d38Abe63b975a5F87A617F8d");

    // Roles
    
    this.MINTER_ROLE = web3.utils.keccak256("MINTER_ROLE");
    this.DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

    // Grant roles to factory contract

    await deployedToken.grantRole(this.MINTER_ROLE, deployedFactory.address);
    console.log("await deployedToken.grantRole(this.MINTER_ROLE, deployedFactory.address)");
    
    await deployedTokenBox.grantRole(this.MINTER_ROLE, deployedFactory.address);
    console.log("await deployedTokenBox.grantRole(this.MINTER_ROLE, deployedFactory.address)");
    
    await deployedTokenAirdrop.grantRole(this.MINTER_ROLE, deployedFactory.address);
    await deployedTokenStorage.grantRole(this.MINTER_ROLE, deployedFactory.address);

    // Grant roles to deployer account

    const deployerAccount = accounts[0];

    await deployedToken.grantRole(this.DEFAULT_ADMIN_ROLE, deployerAccount);
    await deployedTokenAirdrop.grantRole(this.DEFAULT_ADMIN_ROLE, deployerAccount);
    await deployedFactory.grantRole(this.DEFAULT_ADMIN_ROLE, deployerAccount);
    await deployedFactory.grantRole(this.MINTER_ROLE, deployerAccount);

    // Grant roles to swap contract

    await deployedTokenStorage.grantRole(this.MINTER_ROLE, deployedSwap.address);
    await deployedToken.grantRole(this.MINTER_ROLE, deployedSwap.address);
    await deployedTokenToyo.grantRole(this.MINTER_ROLE, deployedSwap.address);
    await deployedTokenBox.grantRole(this.MINTER_ROLE, deployedSwap.address);
    await deployedTokenSwapStorage.grantRole(this.MINTER_ROLE, deployedSwap.address);
    await deployedTokenSwapStorage.grantRole(this.DEFAULT_ADMIN_ROLE, deployedSwap.address);

    await deployedFactory.initialize(_coolDownSeconds, _royaltiesRecipientAddress, _percentageBasisPoints);
    
    const paused = true;
    const rate = new web3.utils.BN(web3.utils.toWei('0', 'wei'));
    const totalSupply = new web3.utils.BN(1000000);
    const maxPurchaseCap = new web3.utils.BN(1);

    // Token Type 14 - Open Jakana Seed Box

    const metadata14 = "https://toyoverse.com/nft_metadata/14_open_jakana_seed_box.json";
    await deployedFactory.addTokenType(metadata14, rate, totalSupply, maxPurchaseCap, paused);

    const tokenType14 = await deployedFactory.getLastTypeId();

    // Token Type 15 - Open Fortified  Jakana Seed Box

    const metadata15 = "https://toyoverse.com/nft_metadata/15_open_fortified_jakana_seed_box.json";
    await deployedFactory.addTokenType(metadata15, rate, totalSupply, maxPurchaseCap, paused);

    const tokenType15 = await deployedFactory.getLastTypeId();

    await deployedSwap.setTokenSwapQuantity(6, 2);
    await deployedSwap.setTokenSwapQuantity(7, 2);

    await deployedSwap.setTokenSwapMapping(6, 1, tokenType14, false);
    await deployedSwap.setTokenSwapMapping(6, 2, 9, true);

    await deployedSwap.setTokenSwapMapping(7, 1, tokenType15, false);
    await deployedSwap.setTokenSwapMapping(7, 2, 9, true);

    return true;
};