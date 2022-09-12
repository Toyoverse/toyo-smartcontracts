const { assert } = require("chai");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const NftTokenStake = artifacts.require("NftTokenStakeUpgradeable");
const NftToken = artifacts.require("NftToken");
const ToyoBondToken = artifacts.require("ToyoBondToken");
const NftTokenToyo = artifacts.require("NftTokenToyo");
const NftTokenCard = artifacts.require("NftTokenCard");

const { BN } = require("bn.js");

require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bn")(BN))
  .should();

require("dotenv").config();

function ether(n) {
  return new web3.utils.BN(web3.utils.toWei(n, "ether"));
}

contract("NftTokenStake", ([deployer, player1]) => {
  beforeEach(async () => {
    publicKey = process.env.PUBLIC_KEY_SIGN_MESSAGES;

    deployedToken = await NftToken.new("NftToken", "NFT", { from: deployer });
    deployedToyo = await NftTokenToyo.new("Toyo - First 9", "TOYF9", {
      from: deployer,
    });
    deployedBond = await deployProxy(ToyoBondToken, ["Toyoverse", "$BOND"], {
      from: deployer,
    });
    deployedCard = await deployProxy(NftTokenCard, ["Toyoverse", "CARD"], { from: deployer });

    deployedStake = await deployProxy(
      NftTokenStake,
      [
        deployedToken.address,
        deployedToyo.address,
        publicKey,
        deployedBond.address,
        deployedCard.address,
      ],
      { from: deployer }
    );

    await deployedStake.setSignerAddress(publicKey, { from: deployer });

    await deployedBond.grantRole(
      await deployedBond.MINTER_ROLE(),
      deployedStake.address
    );

    await deployedCard.grantRole(
      await deployedCard.MINTER_ROLE(),
      deployedStake.address
    );
  });

  describe("NftTokenStake", function () {
    it("should stake a token", async function () {
      const tokenId = 1;

      await deployedToyo.mint(player1, "ipfs://abcd", tokenId, {
        from: deployer,
      });

      await deployedToyo.approve(deployedStake.address, tokenId, {
        from: player1,
      });

      await deployedStake.stakeToken(tokenId, { from: player1 });
    });

    it("should claim a token", async function () {
      var claimId = "WWsMS88f3g";
      var tokenId = "5692";
      var bondAmount = ether("0.3588");
      var cardCode = "a20fdddb87ff73dc41fbdbf1f87c15f1c";
      var privateKey = process.env.PRIVATE_KEY_SIGN_MESSAGES;

      var message = web3.utils.keccak256(
        web3.eth.abi.encodeParameters(
          ["string", "uint256", "uint256", "string"],
          [claimId, tokenId, bondAmount, cardCode]
        )
      );

      var signner = web3.eth.accounts.sign(message, privateKey);
      var signature = signner.signature;

      await deployedToyo.mint(player1, "ipfs://abcd", tokenId, {
        from: deployer,
      });

      // First stake

      await deployedToyo.approve(deployedStake.address, tokenId, {
        from: player1,
      });

      await deployedStake.stakeToken(tokenId, { from: player1 });

      await deployedStake.claimToken(
        claimId,
        tokenId,
        bondAmount,
        cardCode,
        signature,
        {
          from: player1,
        }
      );

      var bondBalance = await deployedBond.balanceOf(player1);
      var cardBalance = await deployedCard.balanceOf(player1);

      bondBalance.should.be.bignumber.equal(bondAmount);
      assert.equal(cardBalance, 1);

      // Second stake using the same signature

      await deployedToyo.approve(deployedStake.address, tokenId, {
        from: player1,
      });

      await deployedStake.stakeToken(tokenId, { from: player1 });

      await deployedStake
        .claimToken(claimId, tokenId, bondAmount, cardCode, signature, {
          from: player1,
        })
        .should.be.rejectedWith("already claimed");

      await deployedStake
        .claimToken(claimId, 2, bondAmount, cardCode, signature, {
          from: player1,
        })
        .should.be.rejectedWith("signature not valid");
    });
  });
});
