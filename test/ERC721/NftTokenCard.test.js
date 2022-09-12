const { assert } = require("chai");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const NftTokenCard = artifacts.require("NftTokenCard");
const NAME = "Toyoverse";
const SYMBOL = "CARD";

contract("NftTokenCard", ([deployer]) => {
  beforeEach(async () => {
    nftTokenCard = await deployProxy(NftTokenCard, [NAME, SYMBOL], { from: deployer });
  });

  describe("NftTokenCard", function () {
    it("should mint a new NFT", async function () {
      const URI = "https://uri/";
      const CARD_CODE = "001";
      const TO = deployer;

      await nftTokenCard.setBaseURI(URI, { from: deployer });
      await nftTokenCard.safeMint(TO, CARD_CODE, { from: deployer });

      assert.equal(await nftTokenCard.ownerOf(1), TO);
      assert.equal(await nftTokenCard.balanceOf(TO), 1);
      assert.equal(await nftTokenCard.tokenURI(1), "https://uri/001.json");
      assert.equal(await nftTokenCard.totalSupply(), 1);
      assert.equal(await nftTokenCard.name(), NAME);
      assert.equal(await nftTokenCard.symbol(), SYMBOL);
    });
  });
});
