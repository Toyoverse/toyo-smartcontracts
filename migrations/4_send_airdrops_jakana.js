const NftTokenCrowdsale = artifacts.require("./factory/NftTokenCrowdsale.sol");

module.exports = async function(deployer, network, accounts) {
    return true;

    // Mumbai
    const deployedFactory = await NftTokenCrowdsale.at("0xf150b30099655721c6463d7579B6FaC52857dA90");

    // deployedFactory.buyTokens(DestinationWallet, TokenTypeId, Quantity);
    await deployedFactory.buyTokens("DESTINATION_WALLET", 1, 15);
    await deployedFactory.buyTokens("DESTINATION_WALLET", 2, 15);
    await deployedFactory.buyTokens("DESTINATION_WALLET", 6, 15);
    await deployedFactory.buyTokens("DESTINATION_WALLET", 7, 15);
}