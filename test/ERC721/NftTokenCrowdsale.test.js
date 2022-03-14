function ether(n) {
  return new web3.utils.BN(web3.utils.toWei(n, 'ether'));
}

const { BN } = require('bn.js');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))
  .should();

const NftToken = artifacts.require('NftToken');
const NftTokenToyo = artifacts.require('NftTokenToyo');
const NftTokenBox = artifacts.require('NftTokenBox');
const NftTokenAirdrop = artifacts.require('NftTokenAirdrop');

const NftTokenStorage = artifacts.require('NftTokenStorage');
const NftTokenCrowdsale = artifacts.require('NftTokenCrowdsale');
const NftTokenSwap = artifacts.require('NftTokenSwap');
const NftTokenSwapStorage = artifacts.require('NftTokenSwapStorage');

let deployedToken,
    deployedTokenStorage,
    deployedTokenSwapStorage,
    deployedTokenToyo,
    deployedTokenBox,
    deployedTokenAirdrop,
    deployedFactory,
    deployedSwap;

let paused;
let tokenType1,rate1,maxSupply1,purchaseCap1,metadata1;
let tokenType2,rate2,maxSupply2,purchaseCap2,metadata2;
let tokenType3,rate3,maxSupply3,purchaseCap3,metadata3;
let tokenType4,rate4,maxSupply4,purchaseCap4,metadata4;

let coolDownSeconds,royaltiesRecipientAddress,percentageBasisPoints

contract('NftTokenCrowdsale', function ([_, vault, player1, royaltyAddress, player3]) {
  
  /*
  beforeEach(async function() {
    this.token = await NftToken.deployed();
    this.vault = "0x2Ba569fC0C16fBDaebe68D17642126118E440ce0";

    await this.crowdsale.setVault(this.vault);
    await this.crowdsale.setToken(this.token.address);
    await this.crowdsale.setCoolDown(new web3.utils.BN(0));
    await this.crowdsale.unpause(this.tokenType1);
    await this.crowdsale.unpause(this.tokenType2);
    await this.crowdsale.setCoolDown(0);
  });*/

  beforeEach(async function () {
    // Token config
    this.name = "NftToken";
    this.symbol = "NFT";

    coolDownSeconds = new BN(0);
    royaltiesRecipientAddress = royaltyAddress;
    percentageBasisPoints = new web3.utils.BN(300); // 3% royalties
    
    // Deploy NftToken
    /*this.token = await NftToken.new(
      this.name,
      this.symbol
    );*/



    /*
    this.token = await NftToken.deployed();
    this.tokenStorage = await NftTokenStorage.deployed();
    this.tokenSwapStorage = await NftTokenSwapStorage.deployed();
    this.tokenToyo = await NftTokenToyo.deployed();
    this.tokenBox = await NftTokenBox.deployed();
    this.tokenAirdrop = await NftTokenAirdrop.deployed();
    this.tokenSwap = await NftTokenSwap.deployed();
    this.crowdsale = await NftTokenCrowdsale.deployed();
    */

    /*
    console.log("NftToken address:", this.token.address);
    console.log("NftTokenStorage address:", this.tokenStorage.address);
    console.log("NftTokenSwapStorage address:", this.tokenSwapStorage.address);
    console.log("NftTokenToyo address:", this.tokenToyo.address);
    console.log("NftTokenBox address:", this.tokenBox.address);
    console.log("NftTokenAirdrop address:", this.tokenAirdrop.address);
    console.log("NftTokenSwap address:", this.tokenSwap.address);
    console.log("NftTokenCrowdsale address:", this.crowdsale.address);
    */

    



    deployedToken = await NftToken.new("Toyo - First 9", "TOYF9");
    deployedTokenStorage = await NftTokenStorage.new();
    deployedTokenSwapStorage = await NftTokenSwapStorage.new();

    //await deployer.deploy(NftToken, "Toyo - First 9", "TOYF9");
    //await deployer.deploy(NftTokenStorage);
    //await deployer.deploy(NftTokenSwapStorage);

    /*
    deployedToken = await NftToken.deployed();
    deployedTokenStorage = await NftTokenStorage.deployed();
    deployedTokenSwapStorage = await NftTokenSwapStorage.deployed();
    */
    
    /*const _deployedTokenAddress = _deployedToken.address;
    const _deployedTokenStorageAddress = _deployedTokenStorage.address;
    const _deployedTokenSwapStorageAddress = _deployedTokenSwapStorage.address;*/

    // (........................................)

    // const _deployedTokenAddress = "0x0";
    // const _deployedTokenStorageAddress = "0x0";
    // const _deployedTokenSwapStorageAddress = "0x0";

    const _vault = vault; // "0x2Ba569fC0C16fBDaebe68D17642126118E440ce0";
    const _royaltiesRecipientAddress = "0x2Ba569fC0C16fBDaebe68D17642126118E440ce0";
    const _coolDownSeconds = new web3.utils.BN(33); // 33 seconds
    const _percentageBasisPoints =  new web3.utils.BN(300); // 3% royalties

    /*const deployedToken = await NftToken.at(_deployedTokenAddress);
    console.log("NftToken address:", deployedToken.address);

    const deployedTokenStorage = await NftTokenStorage.at(_deployedTokenStorageAddress);
    console.log("NftTokenStorage address:", deployedTokenStorage.address);

    const deployedTokenSwapStorage = await NftTokenSwapStorage.at(_deployedTokenSwapStorageAddress);
    console.log("NftTokenSwapStorage address:", deployedTokenSwapStorage.address);*/

    // (........................................)

    //await deployer.deploy(NftTokenToyo,    "Toyo - First 9", "TOYF9");
    deployedTokenToyo = await NftTokenToyo.new("Toyo - First 9", "TOYF9");
    //deployedTokenToyo = await NftTokenToyo.deployed();
    //console.log("NftTokenToyo address:", deployedTokenToyo.address);

    //await deployer.deploy(NftTokenBox,     "Toyo - First 9", "TOYF9BOX");
    deployedTokenBox = await NftTokenBox.new("Toyo - First 9", "TOYF9BOX");
    //deployedTokenBox = await NftTokenBox.deployed();
    //console.log("NftTokenBox address:", deployedTokenBox.address);

    //await deployer.deploy(NftTokenAirdrop, "Toyo - First 9", "TOYF9AIR");
    deployedTokenAirdrop = await NftTokenAirdrop.new("Toyo - First 9", "TOYF9AIR");
    //deployedTokenAirdrop = await NftTokenAirdrop.deployed();
    //console.log("NftTokenAirdrop address:", deployedTokenAirdrop.address);

    /*await deployer.deploy(NftTokenCrowdsale, 
        _vault, 
        deployedToken.address, 
        deployedTokenAirdrop.address, 
        deployedTokenStorage.address);*/

    deployedFactory = await NftTokenCrowdsale.new(
        _vault, 
        deployedToken.address, 
        deployedTokenToyo.address, 
        deployedTokenBox.address, 
        deployedTokenAirdrop.address, 
        deployedTokenStorage.address);

    //deployedFactory = await NftTokenCrowdsale.deployed();
    //console.log("NftTokenCrowdsale address:", deployedFactory.address);

    /*await deployer.deploy(NftTokenSwap, 
        deployedToken.address, 
        deployedTokenToyo.address, 
        deployedTokenBox.address, 
        deployedTokenStorage.address,
        deployedTokenSwapStorage.address
    );*/

    deployedSwap = await NftTokenSwap.new(
        deployedToken.address, 
        deployedTokenToyo.address, 
        deployedTokenBox.address, 
        deployedTokenStorage.address,
        deployedTokenSwapStorage.address
    );

    //deployedSwap = await NftTokenSwap.deployed();
    //console.log("NftTokenSwap address:", deployedSwap.address);

    // Roles
    
    this.MINTER_ROLE = web3.utils.keccak256("MINTER_ROLE");
    this.DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

    // Grant roles to factory contract

    await deployedToken.grantRole(this.MINTER_ROLE, deployedFactory.address);
    await deployedTokenBox.grantRole(this.MINTER_ROLE, deployedFactory.address);
    await deployedTokenAirdrop.grantRole(this.MINTER_ROLE, deployedFactory.address);
    await deployedTokenStorage.grantRole(this.MINTER_ROLE, deployedFactory.address);

    // Grant roles to deployer account

    //const deployerAccount = accounts[0];
    const deployerAccount = _;

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


 
  // (........................................)
 
 
    // NFT Token Types
    // Token Type 1 - Caixa fechada
    rate1 = ether('0.2');
    maxSupply1 = new BN(9);
    purchaseCap1 = new BN(5);
    metadata1 = "https://ipfs.io/ipfs/QmQg5qNaaeJiEqys8XaPLXGWh2Q2x2cT5NNoWfqq9YQLNt";
    paused = true;

    await deployedFactory.addTokenType(metadata1, rate1, maxSupply1, purchaseCap1, paused);

    tokenType1 = await deployedFactory.getLastTypeId();
    deployedFactory.unpause(tokenType1);

    // Token Type 2 - Caixa fechada
    rate2 = ether('0.5');
    maxSupply2 = new BN(6);
    purchaseCap2 = new BN(3);
    metadata2 = "https://ipfs.io/ipfs/QmVhowFE9dqGZi9rFmbm62sRqeZGBii9cjYH7oyNBNzwMf";

    await deployedFactory.addTokenType(metadata2, rate2, maxSupply2, purchaseCap2, paused);

    tokenType2 = await deployedFactory.getLastTypeId();
    deployedFactory.unpause(tokenType2);

    // Token Type 3 - Caixa aberta
    rate3 = ether('0.0');
    maxSupply3 = new BN(10000);
    purchaseCap3 = new BN(1);
    metadata3 = "https://ipfs.io/ipfs/OpenBox";

    await deployedFactory.addTokenType(metadata3, rate3, maxSupply3, purchaseCap3, paused);

    tokenType3 = await deployedFactory.getLastTypeId();
    //deployedFactory.unpause(this.tokenType3);

    // Token Type 4 - Toyo

    rate4 = ether('0.0');
    maxSupply4 = new BN(10000);
    purchaseCap4 = new BN(1);
    metadata4 = "https://toyoverse.com/nft_metadata/";

    await deployedFactory.addTokenType(metadata4, rate4, maxSupply4, purchaseCap4, paused);

    tokenType4 = await deployedFactory.getLastTypeId();
    //deployedFactory.unpause(this.tokenType4);

    // Configure Token Swap Mapping
    await deployedSwap.setTokenSwapQuantity(tokenType1, 2);
    await deployedSwap.setTokenSwapQuantity(tokenType2, 2);

    await deployedSwap.setTokenSwapMapping(tokenType1, 1, tokenType3, false);
    await deployedSwap.setTokenSwapMapping(tokenType1, 2, tokenType4, true);

    await deployedSwap.setTokenSwapMapping(tokenType2, 1, tokenType3, false);
    await deployedSwap.setTokenSwapMapping(tokenType2, 2, tokenType4, true);
  });

  const buyAndSwapTokens = async (_this, _tokenContract, _tokenType, _tokenId) => {
    const quantity = new BN(1);
    const weiAmount = rate1.mul(quantity);

    // Buy the token that will be used to swap later
    await deployedFactory.setTokenBox(_tokenContract.address);
    await deployedFactory.buyTokens(player1, _tokenType, quantity, { value: weiAmount, from: player1 });

    const totalMintedBeforeSwap = await deployedFactory.getTotalMinted();

    // Check if the owner before the swap is corret
    const ownerOfBeforeSwap = await _tokenContract.ownerOf(_tokenId);

    ownerOfBeforeSwap.should.equal(player1);

    // Let the user approve the transfer before swap
    await _tokenContract.approve(deployedSwap.address, _tokenId, { from: player1 });

    // Swap the token id
    await deployedSwap.swapToken(player1, _tokenId, _tokenType, { value: new BN(0), from: player1 });

    // Check if the total minted after swap is correct
    const totalMintedAfterSwap = await deployedFactory.getTotalMinted();
    const totalMinted = (totalMintedAfterSwap - totalMintedBeforeSwap);
    const quantityToMint = await deployedSwap.getTokenSwapQuantity(_tokenType);

    quantityToMint.should.be.a.bignumber.that.equals(new BN(totalMinted));

    // Check if the token type minted is correct based on the swap mapping
    for (let order = 1; order <= quantityToMint; order++) {
      _tokenId++
      toTypeId = await deployedSwap.getTokenSwapMapping(_tokenType, order)

      typeMetadata = await deployedTokenStorage.getMetadata(toTypeId);
      hasMetadataByToken = await deployedSwap.hasMetadataByToken(_tokenType, order);

      if(hasMetadataByToken){
        tokenMetadata = await deployedTokenToyo.tokenURI(_tokenId);
        tokenMetadata.should.be.equal(typeMetadata+_tokenId+".json");  
      } else {
        tokenMetadata = await deployedTokenBox.tokenURI(_tokenId);
        tokenMetadata.should.be.equal(typeMetadata);
      }
    }
  }

  describe('swap', function(){
    it('swap token from old collection', async function () {
      var tokenId = await deployedTokenStorage.getTotalMinted();
      tokenId++;

      await buyAndSwapTokens(this, deployedToken, tokenType1, tokenId);

      // Check if the new owner is the swap contract
      const ownerOfAfterSwap = await deployedToken.ownerOf(tokenId);
      ownerOfAfterSwap.should.equal(deployedSwap.address);
    });

    it('swap token from new collection', async function () {
      var tokenId = await deployedTokenStorage.getTotalMinted();
      tokenId++;

      await buyAndSwapTokens(this, deployedTokenBox, tokenType1, tokenId);

      // Check if the token exists after the swap (burned)
      const tokenExistsAfterSwap = await deployedTokenBox.exists(tokenId);
      tokenExistsAfterSwap.should.equal(false);
    });
  });

  describe('crowdsale', function () {

    it('tracks the vault', async function () {
      const vault = await deployedFactory.vault();
      vault.should.equal(vault);
    });

    it('sets a new vault', async function () {
      const vault = player3;
      await deployedFactory.setVault(vault, { from: _ });
      vault.should.equal(player3);
    });
    /*
    it('cannot set a new vault', async function () {
      const vault = player3;
      await this.deployedFactory.setVault(vault, { from: player3 }).should.be.rejectedWith('Value sent is below the price');;
    });*/

    it('tracks the token', async function () {
      const token = await deployedFactory.token();
      token.should.equal(deployedToken.address);
    });
  });

  describe('buy tokens', function () {
    it('allows to buy the token during crowdsale', async function () {
      const quantity = new BN(1);
      const weiAmount = rate1.mul(quantity);
      const tokensMintedBefore = await deployedFactory.getTotalMinted();

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });
      
      const tokensMintedAfter = await deployedFactory.getTotalMinted();

      const tokensMinted = new BN(tokensMintedAfter - tokensMintedBefore);

      tokensMinted.should.be.a.bignumber.that.equals(quantity);
    });

    it('does not allow to buy with value sent not equal to the price', async function () {
      const weiAmount = ether('0.1');
      const quantity = new BN(1);

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 })
        .should.be.rejectedWith('Value sent is below the price');
    })

    it('allows to burn token purchased by you', async function () {
      const quantity = new BN(1);
      const weiAmount = rate1.mul(quantity);

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });

      await deployedTokenBox.burn(1, { from: player1 });

      const exists = await deployedTokenBox.exists(1);
    });

    it('does not allow to burn token not purchased by you', async function () {
      const quantity = new BN(1);
      const weiAmount = rate1.mul(quantity);

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });

      await deployedTokenBox.burn(1, { from: royaltyAddress }).should.be.rejectedWith('caller is not owner nor approved');
    });
  });

  describe('buy tokens with purchase cap', function () {

    it('does not allow to buy with quantity that exceeds the purchase cap', async function () {
      const quantity = new BN(2);
      const weiAmount = rate1.mul(quantity);
      const purchaseCap = new BN(1);

      await deployedFactory.setPurchaseCap(tokenType1, purchaseCap);
      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 })
        .should.be.rejectedWith('Quantity exceeds purchase cap');
    })
  });

  describe('buy tokens with max supply', function () {
    it('does not allow to buy with quantity that exceeds the max supply', async function () {
      const quantity = new BN(10);
      const weiAmount = rate1.mul(quantity);

      await deployedFactory.setPurchaseCap(tokenType1, quantity);
      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 })
        .should.be.rejectedWith('Quantity exceeds max supply');
    })

    it('allows to buy when quantity reaches max supply', async function () {
      const quantity = new BN(1);
      const weiAmount = rate1.mul(quantity);

      var tokensMinted = await deployedFactory.getTotalMinted();
      tokensMinted++;

      await deployedFactory.setMaxSupply(tokenType1, tokensMinted);
      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });
    })
  });

  describe('buy tokens while whitelisted', function () {
    it('does not allow to buy with whitelist enabled and while not being part of that list', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.setWhitelist(true);
      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 })
        .should.be.rejectedWith('You are not whitelisted');
    })

    it('allows to buy with whitelist enabled and white being part of that list', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.setWhitelist(true);
      await deployedFactory.addToWhitelist(player1);
      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });
    })

    it('allows to buy with whitelist by balance enabled and with balance', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);
      const seconds = new BN(0);

      await deployedFactory.setCoolDown(seconds);
      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });
      await deployedFactory.setWhitelistByBalance(true);
      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });
    })

    it('does not allow to buy with whitelist by balance enabled with no balance', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.setWhitelistByBalance(true);
      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 })
      .should.be.rejectedWith('You are not whitelisted');
    })
  });

  describe('buy tokens while blacklisted', function () {

    it('does not allow to buy with blacklist enabled and while not being part of that list', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.setBlacklist(true);
      await deployedFactory.addToBlacklist(player1);
      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 })
        .should.be.rejectedWith('You are blacklisted');
    })

    it('allows to buy with blacklist disabled and while part of that list', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.setBlacklist(false);
      await deployedFactory.addToBlacklist(player1);
      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });
    })
  });

  describe('buy tokens while graylisted', function () {
    it('does not allow to do a second buy while graylisted', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);
      const seconds = new BN(60); // 60 seconds

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });
      await deployedFactory.setCoolDown(seconds);
      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 })
        .should.be.rejectedWith('You are graylisted');
    });
  });

  describe('buy tokens while paused', function () {

    it('does not allow to buy with token paused', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.pause(tokenType1);
      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 })
        .should.be.rejectedWith('paused');
    })

    it('allows to buy token 1 with token 2 paused', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.pause(tokenType2);

      const tokensMintedBefore = await deployedFactory.getTotalMinted();

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });

      const tokensMintedAfter = await deployedFactory.getTotalMinted();

      const tokensMinted = new BN(tokensMintedAfter - tokensMintedBefore);

      tokensMinted.should.be.a.bignumber.that.equals(quantity);

      await deployedFactory.unpause(tokenType2);
    })

    it('allows to buy with token unpaused', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.pause(tokenType1);
      await deployedFactory.unpause(tokenType1);

      const tokensMintedBefore = await deployedFactory.getTotalMinted();

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });

      const tokensMintedAfter = await deployedFactory.getTotalMinted();

      const tokensMinted = new BN(tokensMintedAfter - tokensMintedBefore);

      tokensMinted.should.be.a.bignumber.that.equals(quantity);
    })

    it('does not allow to buy with crowdsale paused', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.pauseAll();

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 })
        .should.be.rejectedWith('Paused');

      await deployedFactory.unpauseAll();
    })

    it('allows to buy with crowdsale unpaused', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.pauseAll();
      await deployedFactory.unpauseAll();

      const tokensMintedBefore = await deployedFactory.getTotalMinted();

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });

      const tokensMintedAfter = await deployedFactory.getTotalMinted();

      const tokensMinted = new BN(tokensMintedAfter - tokensMintedBefore);

      tokensMinted.should.be.a.bignumber.that.equals(quantity);
    })
  });

  describe('buy tokens as admin', function () {

    it('(admin) allows to buy with value sent not equal to the price', async function () {
      const weiAmount = ether('0.1');
      const quantity = new BN(1);

      await deployedFactory.buyTokens(_, tokenType1, quantity, { value: weiAmount, from: _ });
    })

    it('(admin) allows to buy with quantity that exceeds the purchase cap', async function () {
      const quantity = new BN(2);
      const weiAmount = rate1.mul(quantity);
      const purchaseCap = new BN(1);

      await deployedFactory.setPurchaseCap(tokenType1, purchaseCap);

      await deployedFactory.buyTokens(_, tokenType1, quantity, { value: weiAmount, from: _ });
    })

    it('(admin) allows to buy with quantity that exceeds the max supply', async function () {
      const quantity = new BN(10);
      const weiAmount = rate1.mul(quantity);
      const purchaseCap = new BN(1);
      
      await deployedFactory.setPurchaseCap(tokenType1, purchaseCap);

      await deployedFactory.buyTokens(_, tokenType1, quantity, { value: weiAmount, from: _ });
    })

    it('(admin) allows to buy with whitelist enabled and while not being part of that list', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.setWhitelist(true);
      await deployedFactory.buyTokens(_, tokenType1, quantity, { value: weiAmount, from: _ });
    })

    it('(admin) allows to buy with blacklist enabled and while not being part of that list', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.setBlacklist(true);
      await deployedFactory.addToBlacklist(player1);
      await deployedFactory.buyTokens(_, tokenType1, quantity, { value: weiAmount, from: _ });
    })

    it('(admin) allows to do a second buy while graylisted', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);
      const seconds = new BN(60); // 60 seconds

      await deployedFactory.setCoolDown(seconds);
      await deployedFactory.buyTokens(_, tokenType1, quantity, { value: weiAmount, from: _ });
      await deployedFactory.buyTokens(_, tokenType1, quantity, { value: weiAmount, from: _ });
    });

    it('(admin) allows to buy with token paused', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.pause(tokenType1);
      await deployedFactory.buyTokens(_, tokenType1, quantity, { value: weiAmount, from: _ });
    })

    it('(admin) allows to buy with crowdsale paused', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);

      await deployedFactory.pauseAll();
      await deployedFactory.buyTokens(_, tokenType1, quantity, { value: weiAmount, from: _ });
    })

  });

  describe('buy tokens and track funds raised', function () {

    it('tracks the wei raised after buying the token', async function () {
      const weiAmount = rate1;
      const quantity = new BN(1);
      const seconds = new BN(0);

      await deployedFactory.setCoolDown(seconds);

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });
      const weiRaisedFirstSell = await deployedFactory.weiRaised();
      weiRaisedFirstSell.should.be.a.bignumber.that.equals(weiAmount);

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });
      const weiRaisedSecondSell = await deployedFactory.weiRaised();

      weiRaisedSecondSell.should.be.a.bignumber.that.equals(weiAmount.mul(new BN(2)));
    })
  });

  describe('buy tokens and track vault balance', function () {

    it('tracks the wei raised was sent to vault after a buying', async function () {
      const weiAmount = ether('0.2');
      const quantity = new BN(1);

      const beforeBalance = new BN(await web3.eth.getBalance(vault));

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });

      const afterBalance = new BN(await web3.eth.getBalance(vault));

      const balanceDifference = afterBalance.sub(beforeBalance);

      balanceDifference.should.be.a.bignumber.that.equals(weiAmount);
    })
  });

  describe('check royalties', function () {

    it('does royalties on constructor is working', async function () {
      const quantity = new BN(1);
      const tokenId = new BN(1);
      const weiAmount = rate1.mul(quantity);

      const salesPrice = new BN(1000);
      const salesRoyalty = new BN((salesPrice.mul(percentageBasisPoints)) / 10000);

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });
      var royalty = await deployedTokenBox.royaltyInfo(tokenId, salesPrice);

      royalty.royaltyAmount.should.be.a.bignumber.that.equals(salesRoyalty);
    })

    it('does royalties basis points and address are being setting and getting correctly', async function () {
      const quantity = new BN(1);
      const tokenId = new BN(1);
      const weiAmount = rate1.mul(quantity);
      
      const salesPrice = new BN(100);
      const basisPoints = new BN(400); // 4% royalty
      const salesRoyalty = new BN(4);

      await deployedFactory.setRoyaltiesRecipientAddress(royaltiesRecipientAddress);
      await deployedFactory.setPercentageBasisPoints(basisPoints);

      await deployedFactory.buyTokens(player1, tokenType1, quantity, { value: weiAmount, from: player1 });
      var royalty = await deployedTokenBox.royaltyInfo(tokenId, salesPrice);

      royalty.royaltyAmount.should.be.a.bignumber.that.equals(salesRoyalty);
      royalty.receiver.should.be.equals(royaltiesRecipientAddress);
    })
  });
});