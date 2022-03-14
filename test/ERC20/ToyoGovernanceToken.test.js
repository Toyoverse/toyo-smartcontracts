const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const ToyoGovernanceToken = artifacts.require('ToyoGovernanceToken');

let deployedToken;

require('chai')
  .should();

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