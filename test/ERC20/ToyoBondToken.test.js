const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const ToyoBondToken = artifacts.require('ToyoBondToken');

let deployedToken;

require('chai')
  .use(require('chai-as-promised'))
  .should();

function ether(n) {
  return new web3.utils.BN(web3.utils.toWei(n, 'ether'));
}

contract('ToyoBondToken', accounts => {
  const _name = 'Toyoverse';
  const _symbol = '$BOND';

  beforeEach(async function () {
    deployedToken = await ToyoBondToken.new(_name, _symbol,);
    deployedToken = await deployProxy(ToyoBondToken, [_name, _symbol], { _ });
  });

  describe('upgrade', () => {
    it('upgrade contracts must keep the same address', async () => {
      var deployed_v1 = await deployProxy(ToyoBondToken, [_name, _symbol], { _ });
      var deployed_v2 = await upgradeProxy(deployed_v1.address, ToyoBondToken, [_name, _symbol], { _ });

      expect(deployed_v1.address).to.equal(deployed_v2.address);
    });
  });

  describe('burnable', function() {
    it('can burn tokens', async function() {
      await deployedToken.mint(accounts[0], ether('100'), { from: accounts[0] });
      await deployedToken.burn(ether('50'), { from: accounts[0] });
    });

    it('cannot burn more tokens than the balance', async function() {
      await deployedToken.mint(accounts[0], ether('100'), { from: accounts[0] });
      await deployedToken.burn(ether('150'), { from: accounts[0] }).should.be.rejectedWith('burn amount exceeds balance');
    });

    it('cannot burn tokens', async function() {
      await deployedToken.mint(accounts[0], ether('100'), { from: accounts[0] });
      await deployedToken.burn(ether('50'), { from: accounts[1] }).should.be.rejectedWith('burn amount exceeds balance');
    });
  });

  describe('mintable', function() {
    it('can mint tokens', async function() {
      await deployedToken.mint(accounts[0], ether('150000000'), { from: accounts[0] });
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