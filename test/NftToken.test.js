const NftToken = artifacts.require('NftToken');

require('chai')
  .should();

contract('NftToken', accounts => {
  const _name = 'NftToken';
  const _symbol = 'NFT';

  beforeEach(async function () {
    this.token = await NftToken.new(_name, _symbol,);
  });

  describe('token attributes', function() {
    it('has the correct name', async function() {
      const name = await this.token.name();
      name.should.equal(_name);
    });

    it('has the correct symbol', async function() {
      const symbol = await this.token.symbol();
      symbol.should.equal(_symbol);
    });
  });
});