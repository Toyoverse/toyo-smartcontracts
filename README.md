# Install pre-requirements

solcjs -- version

npm install -g solc (solc@0.8.9)
npm install -g ganache-cli
npm install --save-dev @openzeppelin/truffle-upgrades
npm install @openzeppelin/contracts-upgradeable

npm install

# Compile contracts

truffle compile

# Configure env variables

CAUTION: NEVER PUSH THE ENVIRONMENT FILE TO GIT, OTHERWISE YOU WILL EXPOSE SENSITIVE DATA THAT CAN HARM THE PROJECT.

source .env

## MNEMONIC

The wallet private key used to assign transaction.

## INFURA_PROJECT_ID

Infura project ID created for this project. This is used to connect to Infura RPC in order to send transaction to blockchain node.

# Test contracts

truffle test --network development

truffle test --network development --stacktrace --compile-none

truffle test --network development ./test/ERC20/ToyoGovernanceToken.test.js

# Migrate contracts

## Development

truffle migrate --network development --reset

## Testnet

truffle migrate --network polygon_infura_testnet --f 2 --to 2

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

truffle migrate --network polygon_infura_testnet --f 4 --to 4