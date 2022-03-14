const ToyoGovernanceToken = artifacts.require("./tokens/ERC20/ToyoGovernanceToken.sol");
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

let deployedToken;

module.exports = async function(deployer, network, accounts) {
    return true;
    const _name = 'Esrevoyot';
    const _symbol = '$OYOT3';

    deployedToken = await deployProxy(ToyoGovernanceToken, [_name, _symbol], { deployer });
    // deployedToken = await upgradeProxy("0x292124a29Bb14EA071EfDDB573595a12925be8Be", ToyoGovernanceToken, [_name, _symbol], { deployer });
    // deployedToken = await ToyoGovernanceToken.at("0x292124a29Bb14EA071EfDDB573595a12925be8Be");
    // await deployedToken.mint("0x62761466bB3A3Da83B408B5F5fE00ac7b2a5A996", new web3.utils.BN(web3.utils.toWei('5000000000000000000000000', 'wei')));
}