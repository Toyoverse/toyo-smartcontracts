const NftToken = artifacts.require("./tokens/ERC721/NftToken.sol");
const NftTokenAirdrop = artifacts.require("./tokens/ERC721/NftTokenAirdrop.sol");
const NftTokenBox = artifacts.require("./tokens/ERC721/NftTokenBox.sol");
const NftTokenStorage = artifacts.require("./factory/NftTokenStorage.sol");
const NftTokenCrowdsale = artifacts.require("./factory/NftTokenCrowdsale.sol");
const NftTokenSwap = artifacts.require("./swap/NftTokenSwap.sol");

module.exports = async function (deployer, network, accounts) {
  return true;
  
  // Mumbai - NftTokenCrowdsale (v5)
  /*
  const vaultAddress = "0xafa75ff125e0e5f90dc66fbb77c3574f2b2883a2";
  const deployedTokenAddress = "0xc02173691984d68625c455e0ab45f52581c008da";
  const deployedTokenToyoAddress = "0xb9f84081b4a621c819f8d206036f7548aa06638a";
  const deployedTokenBoxAddress = "0x68118EDf6d9CCA7960D19f87B94583216ADd12B8";
  const deployedTokenAirdropAddress = "0x926460224bFaD5851f68f32D6AA9314713D350C8";
  const deployedTokenStorageAddress = "0xa0f9d18a2a028266dfaf5e40ae476f49e7bcc8f6";
  const paymentTokenAddress = "0x292124a29Bb14EA071EfDDB573595a12925be8Be";
  const deployedTokenSwapAddress = "0x53904b4640474d2f79b822ad4e2c40597d886bd5";
  const deployedCrowdsaleAddress = "0xeAC3AaC0467B16621D0e12C86541e3dd89D3f86d";
  */

  // Mainnet
  const vaultAddress = "0xafa75ff125e0e5f90dc66fbb77c3574f2b2883a2";
  const deployedTokenAddress = "0x07ae3987c679c0afd2ec1ed2945278c37918816c";
  const deployedTokenToyoAddress = "0xaf5107e0a3ea679b6fc23a9756075559e2e4649b";
  const deployedTokenBoxAddress = "0x5c29302b5ae9e99f866704e28528d5be9b7b6a40";
  const deployedTokenAirdropAddress = "0xf7deda9d83224789d3f905dd95425670c0a5d63d";
  const deployedTokenStorageAddress = "0x458caade191b874d6d378f19e42640a711db90f0";
  const paymentTokenAddress = "0x3cFA087AA1A74e18676a875de69c49563AFA803D";
  const deployedTokenSwapAddress = "0xB86743535e2716E2cea0D285A3fc3c1A58e44318";

  await deployer.deploy(NftTokenCrowdsale,
      vaultAddress,
      deployedTokenAddress, 
      deployedTokenToyoAddress, 
      deployedTokenBoxAddress, 
      deployedTokenAirdropAddress,
      deployedTokenStorageAddress,
      paymentTokenAddress
  );

  const deployedCrowdsale = await NftTokenCrowdsale.deployed();
    
  console.log("NftTokenCrowdsale deployed at ", deployedCrowdsale.address); 

  // Grant roles to crowdsale contract

  const deployedToken = await NftToken.at(deployedTokenAddress);
  const deployedTokenAirdrop = await NftTokenAirdrop.at(deployedTokenAirdropAddress);
  const deployedTokenBox = await NftTokenBox.at(deployedTokenBoxAddress);
  const deployedTokenStorage = await NftTokenStorage.at(deployedTokenStorageAddress);

  this.MINTER_ROLE = web3.utils.keccak256("MINTER_ROLE");
  this.DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  await deployedToken.grantRole(this.MINTER_ROLE, deployedCrowdsale.address);
  await deployedTokenBox.grantRole(this.MINTER_ROLE, deployedCrowdsale.address);
  await deployedTokenAirdrop.grantRole(this.MINTER_ROLE, deployedCrowdsale.address);
  await deployedTokenStorage.grantRole(this.MINTER_ROLE, deployedCrowdsale.address);

  console.log("Minter has been granted to NftTokenCrowdsale");

  /* 
  const deployedCrowdsale = await NftTokenCrowdsale.at(deployedCrowdsaleAddress);
  */

    // Token Type 16 - Xeon fechada
  const xeonClosedMetadata = "https://toyoverse.com/nft_metadata/16_toyo_xeon_seed_box.json";
  const xeonClosedRate = ether('500.0');
  const xeonClosedMaxSupply = new web3.utils.BN(10000);
  const xeonClosedPurchaseCap = new web3.utils.BN(9);
  const xeonClosedPaused = true;

  await deployedCrowdsale.addTokenType(
    xeonClosedMetadata, 
    xeonClosedRate, 
    xeonClosedMaxSupply, 
    xeonClosedPurchaseCap, 
    xeonClosedPaused);

  const xeonClosedTypeId = await deployedCrowdsale.getLastTypeId();

  console.log(`Added token type - ${xeonClosedTypeId} Xeon fechada`);

  // Token Type 17 - Xeon aberta
  const xeonOpenedMetadata = "https://toyoverse.com/nft_metadata/17_open_xeon_seed_box.json";
  const xeonOpenedRate = ether('0.0');
  const xeonOpenedMaxSupply = new web3.utils.BN(10000);
  const xeonOpenedPurchaseCap = new web3.utils.BN(9);
  const xeonOpenedPaused = true;

  await deployedCrowdsale.addTokenType(
    xeonOpenedMetadata, 
    xeonOpenedRate, 
    xeonOpenedMaxSupply, 
    xeonOpenedPurchaseCap, 
    xeonOpenedPaused);

  const xeonOpenedTypeId = await deployedCrowdsale.getLastTypeId();

  console.log(`Added token type - ${xeonOpenedTypeId} Xeon aberta`);

  // Configure Token Swap Mapping

  const deployedSwap = await NftTokenSwap.at(deployedTokenSwapAddress);

  await deployedSwap.setTokenSwapQuantity(xeonClosedTypeId, 2);
  await deployedSwap.setTokenSwapMapping(xeonClosedTypeId, 1, xeonOpenedTypeId, false);
  await deployedSwap.setTokenSwapMapping(xeonClosedTypeId, 2, 9, true);

  console.log("Added token swap mapping for Xeon fechada");
};

function ether(n) {
  return new web3.utils.BN(web3.utils.toWei(n, 'ether'));
}