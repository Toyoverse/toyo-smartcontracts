const Card = artifacts.require("./tokens/ERC721/NftTokenCard.sol");
const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");

let deployedCard;

module.exports = async function (deployer, network, accounts) {
  return true;

  // Mumbai
  /*
   const _cardProxyAddress = "0x3e191e47d8dc1eb345793109b71b0af0a7cabc6d";
   const _cardBaseUri = "https://nakatoshivault.dev/nft_metadata/cards/";
   */

  // Mainnet
  const _cardProxyAddress = "0xb0d8e7fc99f1b9c80d35c753e43a0cb9b6d7bf6f";
  const _cardBaseUri = "https://toyoverse.com/nft_metadata/cards/";

  const _name = "Toyoverse";
  const _symbol = "CARD";

  // Deploy
  deployedCard = await deployProxy(
    Card,
    [_name, _symbol],
    { kind: "uups" },
    { deployer }
  );

  // Set base URI
  await deployedCard.setBaseURI(_cardBaseUri);

  // Upgrade
  // deployedCard = await upgradeProxy(_cardProxyAddress, Card, { kind: "uups" }, { deployer });
};
