const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const ToyoGovernanceToken = artifacts.require('ToyoGovernanceToken');

let deployedToken;

require('chai')
  .use(require('chai-as-promised'))
  .should();

function ether(n) {
  return new web3.utils.BN(web3.utils.toWei(n, 'ether'));
}

contract('ToyoGovernanteToken', accounts => {
  const _name = 'Toyoverse';
  const _symbol = '$TOYO';

  beforeEach(async function () {
    deployedToken = await ToyoGovernanceToken.new(_name, _symbol,);
    deployedToken = await deployProxy(ToyoGovernanceToken, [_name, _symbol], { _ });
  });

  describe('upgrade', () => {
    it('upgrade contracts must keep the same address', async () => {
      var deployed_v1 = await deployProxy(ToyoGovernanceToken, [_name, _symbol], { _ });
      var deployed_v2 = await upgradeProxy(deployed_v1.address, ToyoGovernanceToken, [_name, _symbol], { _ });

      expect(deployed_v1.address).to.equal(deployed_v2.address);
    });
  });

  describe('burnable', function() {
    it('can burn tokens', async function() {

      await deployedToken.mint(accounts[0], ether('100'), { from: accounts[0] });
      await deployedToken.burn(ether('50'), { from: accounts[0] });
    });

    it('cannot burn tokens', async function() {

      await deployedToken.mint(accounts[0], ether('100'), { from: accounts[0] });
      await deployedToken.burn(ether('50'), { from: accounts[1] }).should.be.rejectedWith('burn amount exceeds balance');
    });
  });

  describe('mintable', function() {
    it('cannot mint more than 150M tokens', async function() {
      await deployedToken.mint(accounts[0], ether('150000000'), { from: accounts[0] });
      await deployedToken.mint(accounts[0], ether('1'), { from: accounts[0] }).should.be.rejectedWith('Quantity to be minted cannot be greater than the max supply');
    });
  });

  describe('pausable', function() {
    it('cannot pause transfers', async function() {
      await deployedToken.mint(accounts[0], ether('100'), { from: accounts[0] });
      await deployedToken.pause({ from: accounts[0] });
      await deployedToken.transfer(accounts[1], ether('100'), { from:  accounts[0] });
    });
  });

  describe('token attributes', function() {
    it('has the correct name', async function() {
      const name = await deployedToken.name();
      name.should.equal(_name);
    });

    it('has the correct symbol', async function() {
      const symbol = await deployedToken.symbol();
      symbol.should.equal(_symbol);
    });
  });
});