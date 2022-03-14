const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  return true;
  deployer.deploy(Migrations);
};
