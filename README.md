# Install pre-requirements

solcjs -- version

npm install -g solc (solc@0.8.9)
npm install -g ganache-cli
npm install --save-dev @openzeppelin/truffle-upgrades
npm install @openzeppelin/contracts-upgradeable

npm install

# Compile contracts

npx truffle compile

# Configure env variables

CAUTION: NEVER PUSH THE ENVIRONMENT FILE TO GIT, OTHERWISE YOU WILL EXPOSE SENSITIVE DATA THAT CAN HARM THE PROJECT.

source .env

## MNEMONIC

The wallet private key used to assign transaction.

## INFURA_PROJECT_ID

Infura project ID created for this project. This is used to connect to Infura RPC in order to send transaction to blockchain node.

# Test contracts

npx truffle test --network development

npx truffle test --network development --stacktrace --compile-none

npx truffle test --network development ./test/ERC20/ToyoGovernanceToken.test.js

# Migrate contracts

## Development

npx truffle migrate --network development --reset

## Testnet

npx truffle migrate --network polygon_infura_testnet --f 2 --to 2

## Production

CAUTION: MAKE SURE THAT YOU REVIEW THE CONFIGURATIONS INSIDE THIS FILE BEFORE MIGRATE IT TO PRODUCTION. 
IT'S IMPORTANT THAT YOU UNDERSTAND WHAT EACH LINE DOES AND WHY IT DOES IT BEFORE DEPLOYING ANY SMART CONTRACT INTO PRODUCTION.

truffle migrate --network polygon_infura_mainnet --f 3 --to 3

# Polygon faucet

https://faucet.polygon.technology/

# remix.ethereum.org

You can access the local folder on Remix by exposing it through these commands:

npm install -g @remix-project/remixd

remixd -s ./ -u https://remix.ethereum.org

remixd -s ./ -u http://remix.ethereum.org

# Tests Coverage

npm install --save-dev solidity-coverage

truffle run coverage

# Gas Reports

https://www.npmjs.com/package/eth-gas-reporter

npm install --save-dev eth-gas-reporter

# Contract Size

npm install truffle-contract-size

truffle run contract-size

# Migrate Governance Token (ERC20)

npx truffle migrate --network dashboard --f 4 --to 4

# Verify contracts

npx truffle run verify ToyoGovernanceToken --network polygon_infura_mainnet --debug

npx truffle run verify NftTokenSwap@0x00258f054bD2f559d38Abe63b975a5F87A617F8d --network polygon_infura_mainnet --debug

# Contracts

## Mumbai (test)

NFTTOKEN=0xc02173691984D68625C455e0AB45f52581c008Da

NFTTOKENTOYO=0xb9F84081B4a621C819f8D206036F7548aa06638a

NFTTOKENBOX=0x68118EDf6d9CCA7960D19f87B94583216ADd12B8

NFTTOKENAIRDROP=0x926460224bFaD5851f68f32D6AA9314713D350C8

NFTTOKENSTORAGE=0xa0f9D18a2a028266dfaF5E40ae476F49e7bcc8F6

NFTTOKENCROWDSALE=0xf150b30099655721c6463d7579B6FaC52857dA90

NFTTOKENSWAP=0xEea6d567276e1499Eef22eD779Aaf7D01c6Fb775

## Mainnet (production)

NFTTOKEN=0x07AE3987C679c0aFd2eC1ED2945278c37918816c

NFTTOKENTOYO=0xaf5107e0a3Ea679B6Fc23A9756075559e2e4649b

NFTTOKENBOX=0x5c29302b5ae9e99f866704e28528d5be9b7b6a40

NFTTOKENAIRDROP=0xF7DeDa9D83224789D3f905DD95425670c0a5D63d

NFTTOKENSTORAGE=0x458cAaDe191B874D6d378f19e42640A711Db90F0

NFTTOKENCROWDSALE=0x656fb7446ad100C0DC7a2d0f65b56069F499bff8

NFTTOKENSWAP=0x00258f054bD2f559d38Abe63b975a5F87A617F8d

# Token Types

1 - Caixa fechada - Kytunt Simples

2 - Caixa fechada - Kytunt Fortificada

3 - Airdrop - Palhaço

4 - Airdrop - Caveira

5 - Airdrop - Abóbora

6 - Caixa fechada - Jakana Seed Box

7 - Caixa fechada - Fortified Jakana Seed Box

8 - Caixa aberta - Open Kyntunt Seed Box

9 - Toyos

10 - Caixa aberta - Open Fortified Kyntunt Seed Box

# Test MATIC

https://faucet.polygon.technology/

# Truffle Dashboard

npx truffle dashboard