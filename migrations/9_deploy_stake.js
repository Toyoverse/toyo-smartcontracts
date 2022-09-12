const Stake = artifacts.require("./stake/NftTokenStakeUpgradeable.sol");
const Bond = artifacts.require("./tokens/ERC20/ToyoBondToken.sol");
const Card = artifacts.require("./tokens/ERC721/NftTokenCard.sol");

const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");
const { deploy } = require("@openzeppelin/truffle-upgrades/dist/utils");

let deployedStake;

module.exports = async function (deployer, network, accounts) {
  return true;

  // Mumbai
  /*
    const _token = '0xc02173691984D68625C455e0AB45f52581c008Da';
    const _tokenToyo = '0xb9F84081B4a621C819f8D206036F7548aa06638a';
    const _signerAddress = '0xf0c89da9a5b470c0a7e8208c6bcc8d17257a810d';
    const _bondAddress = '0x39728382b7B3f2a27c9507d951CB9D5c5fA81cBf';
    const _cardAddress = "0x3e191e47d8dc1eb345793109b71b0af0a7cabc6d";
    const _stakeProxyAddress = '0x39a66BB85ec5F0Ba8572B6e2452F78b6301843D1';
    */

  // Mainnet
  const _token = "0x07AE3987C679c0aFd2eC1ED2945278c37918816c";
  const _tokenToyo = "0xaf5107e0a3Ea679B6Fc23A9756075559e2e4649b";
  const _signerAddress = "0x3380A358DF117A950eb3FdB59a355b486573232b";
  const _bondAddress = "0x0436de015ce680cb7150d901d187cbda2727b466";
  const _cardAddress = "0xb0d8e7fc99f1b9c80d35c753e43a0cb9b6d7bf6f";
  const _stakeProxyAddress = "0xd44ad19885a9a20dbd3f7022409804d8636a8243";

  deployedStake = await deployProxy(
    Stake,
    [_token, _tokenToyo, _signerAddress, _bondAddress, _cardAddress],
    { kind: "uups" },
    { deployer }
  );

  var deployedBond = await Bond.at(_bondAddress);
  await deployedBond.grantRole(
    await deployedBond.MINTER_ROLE(),
    deployedStake.address
  );

  var deployedCard = await Card.at(_cardAddress);
  await deployedCard.grantRole(
    await deployedCard.MINTER_ROLE(),
    deployedStake.address
  );

  // deployedStake = await upgradeProxy(_stakeProxyAddress, Stake, { kind: "uups" }, { deployer });
};
