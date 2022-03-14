const NftToken = artifacts.require("./tokens/ERC721/NftToken.sol");
const NftTokenToyo = artifacts.require("./tokens/ERC721/NftTokenToyo.sol");
const NftTokenBox = artifacts.require("./tokens/ERC721/NftTokenBox.sol");
const NftTokenAirdrop = artifacts.require("./tokens/ERC721/NftTokenAirdrop.sol");
const NftTokenStorage = artifacts.require("./factory/NftTokenStorage.sol");
const NftTokenCrowdsale = artifacts.require("./factory/NftTokenCrowdsale.sol");
const NftTokenSwap = artifacts.require("./swap/NftTokenSwap.sol");
const NftTokenSwapStorage = artifacts.require("./swap/NftTokenSwapStorage.sol");

module.exports = async function(deployer, network, accounts) {
    return true;
    // Already deployed 
  
    /*await deployer.deploy(NftToken, "Toyo - First 9", "TOYF9");
    await deployer.deploy(NftTokenStorage);
    await deployer.deploy(NftTokenSwapStorage);

    const _deployedToken = await NftToken.deployed();
    const _deployedTokenStorage = await NftTokenStorage.deployed();
    const _deployedTokenSwapStorage = await NftTokenSwapStorage.deployed();*/
    
    const _deployedTokenAddress = "0xc02173691984D68625C455e0AB45f52581c008Da"; //_deployedToken.address;
    const _deployedTokenStorageAddress = "0xa0f9D18a2a028266dfaF5E40ae476F49e7bcc8F6"; //_deployedTokenStorage.address;
    const _deployedTokenSwapStorageAddress = "0x165E2377C6690f83bDb2589c81b10667E06957ae"; //_deployedTokenSwapStorage.address;

    // (........................................)

    // const _deployedTokenAddress = "0x0";
    // const _deployedTokenStorageAddress = "0x0";
    // const _deployedTokenSwapStorageAddress = "0x0";

    const _vault = "0xAFa75fF125E0e5F90dC66fBB77C3574f2B2883a2";
    const _royaltiesRecipientAddress = "0xAFa75fF125E0e5F90dC66fBB77C3574f2B2883a2";
    const _coolDownSeconds = new web3.utils.BN(33); // 33 seconds
    const _percentageBasisPoints =  new web3.utils.BN(300); // 3% royalties

    const deployedToken = await NftToken.at(_deployedTokenAddress);
    const deployedTokenStorage = await NftTokenStorage.at(_deployedTokenStorageAddress);
    const deployedTokenSwapStorage = await NftTokenSwapStorage.at(_deployedTokenSwapStorageAddress);

    // (........................................)

    //const deployedTokenToyo = await NftTokenToyo.at("0x2377f3FFdD9a06b8aF6F8aB814C27f7158722989");
    //const deployedTokenBox = await NftTokenBox.at("0x3f2Dc1a9d961F40c24a152e544FE95D94552949f");

    await deployer.deploy(NftTokenToyo, "Toyo - First 9 - Toyos", "TOYOS");
    const deployedTokenToyo = await NftTokenToyo.deployed();

    await deployer.deploy(NftTokenBox, "Toyo - Seed Boxes", "TOYSB");
    const deployedTokenBox = await NftTokenBox.deployed();

    await deployer.deploy(NftTokenAirdrop, "Toyo - Air Drops", "TOYAD");
    const deployedTokenAirdrop = await NftTokenAirdrop.deployed();

    await deployer.deploy(NftTokenCrowdsale, 
        _vault, 
        deployedToken.address, 
        deployedTokenToyo.address, 
        deployedTokenBox.address, 
        deployedTokenAirdrop.address, 
        deployedTokenStorage.address);

    const deployedFactory = await NftTokenCrowdsale.deployed();

    await deployer.deploy(NftTokenSwap, 
        deployedToken.address, 
        deployedTokenToyo.address, 
        deployedTokenBox.address, 
        deployedTokenStorage.address,
        deployedTokenSwapStorage.address
    );
    const deployedSwap = await NftTokenSwap.deployed();

    // Roles
    
    this.MINTER_ROLE = web3.utils.keccak256("MINTER_ROLE");
    this.DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

    // Grant roles to factory contract

    await deployedToken.grantRole(this.MINTER_ROLE, deployedFactory.address);
    await deployedTokenBox.grantRole(this.MINTER_ROLE, deployedFactory.address);
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
    await deployedTokenSwapStorage.grantRole(this.DEFAULT_ADMIN_ROLE, deployedSwap.address);
    await deployedTokenSwapStorage.grantRole(this.MINTER_ROLE, deployedSwap.address);

    await deployedFactory.initialize(_coolDownSeconds, _royaltiesRecipientAddress, _percentageBasisPoints);

    // const deployedFactory = await NftTokenCrowdsale.at("0x47cC9B0cb8aA9b3C0c1eaFCCD8b4916513E4884c");

    /*
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

    //const deployedSwap = await NftTokenSwap.deployed();
    //const deployedSwap = await NftTokenSwap.at("0xaAf410d944600DfFC5259f7E1938009193974d55");

    await deployedSwap.setTokenSwapQuantity(6, 2);
    await deployedSwap.setTokenSwapQuantity(7, 2);

    await deployedSwap.setTokenSwapMapping(6, 1, tokenType14, false);
    await deployedSwap.setTokenSwapMapping(6, 2, 9, true);

    await deployedSwap.setTokenSwapMapping(7, 1, tokenType15, false);
    await deployedSwap.setTokenSwapMapping(7, 2, 9, true);
    */

    return true;
};