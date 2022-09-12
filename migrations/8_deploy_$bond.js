const ToyoBondToken = artifacts.require("./tokens/ERC20/ToyoBondToken.sol");
const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");

let deployedBond;

module.exports = async function (deployer, network, accounts) {
  return true;

  // Mumbai
  // const _bondProxyAddress = '0x39728382b7B3f2a27c9507d951CB9D5c5fA81cBf';

  // Mainnet
  // const _bondProxyAddress = '0x0436de015ce680cb7150d901d187cbda2727b466';

  const _name = "Toyoverse";
  const _symbol = "$BOND";

  deployedBond = await deployProxy(
    ToyoBondToken,
    [_name, _symbol],
    { kind: "uups" },
    { deployer }
  );

  // deployedBond = await upgradeProxy(_bondProxyAddress, ToyoBondToken, { kind: "uups" }, { deployer });
};
