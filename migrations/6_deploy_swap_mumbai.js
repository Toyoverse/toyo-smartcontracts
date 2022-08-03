const NftTokenSwap = artifacts.require("./swap/NftTokenSwap.sol");
const NftToken = artifacts.require("./tokens/ERC721/NftToken.sol");
const NftTokenToyo = artifacts.require("./tokens/ERC721/NftTokenToyo.sol");
const NftTokenBox = artifacts.require("./tokens/ERC721/NftTokenBox.sol");
const NftTokenStorage = artifacts.require("./factory/NftTokenStorage.sol");
const NftTokenSwapStorage = artifacts.require("./swap/NftTokenSwapStorage.sol");

module.exports = async function(deployer, network, accounts) {

    // NftTokenSwap (v6)
    const deployedTokenAddress = "0xc02173691984D68625C455e0AB45f52581c008Da";
    const deployedTokenToyoAddress = "0xb9F84081B4a621C819f8D206036F7548aa06638a";
    const deployedTokenBoxAddress = "0x68118EDf6d9CCA7960D19f87B94583216ADd12B8";
    const deployedTokenStorageAddress = "0xa0f9d18a2a028266dfaf5e40ae476f49e7bcc8f6";
    const deployedTokenSwapStorageAddress = "0x165e2377c6690f83bdb2589c81b10667e06957ae" ;
    
    await deployer.deploy(NftTokenSwap, 
        deployedTokenAddress, 
        deployedTokenToyoAddress, 
        deployedTokenBoxAddress, 
        deployedTokenStorageAddress,
        deployedTokenSwapStorageAddress
    );
    const deployedSwap = await NftTokenSwap.deployed();

    console.log("NftTokenSwap deployed at ", deployedSwap.address);

    // Grant roles to swap contract

    const deployedToken = await NftToken.at(deployedTokenAddress);
    const deployedTokenStorage = await NftTokenStorage.at(deployedTokenStorageAddress);
    const deployedTokenToyo = await NftTokenToyo.at(deployedTokenToyoAddress);
    const deployedTokenBox = await NftTokenBox.at(deployedTokenBoxAddress);
    const deployedTokenSwapStorage = await NftTokenSwapStorage.at(deployedTokenSwapStorageAddress);

    await deployedTokenStorage.grantRole(this.MINTER_ROLE, deployedSwap.address);
    await deployedToken.grantRole(this.MINTER_ROLE, deployedSwap.address);
    await deployedTokenToyo.grantRole(this.MINTER_ROLE, deployedSwap.address);
    await deployedTokenBox.grantRole(this.MINTER_ROLE, deployedSwap.address);
    await deployedTokenSwapStorage.grantRole(this.MINTER_ROLE, deployedSwap.address);
    await deployedTokenSwapStorage.grantRole(this.DEFAULT_ADMIN_ROLE, deployedSwap.address);

    console.log("Minter has been granted to NftTokenSwap");
};