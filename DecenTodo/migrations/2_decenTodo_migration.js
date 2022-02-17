const decenTodo = artifacts.require("./decenTodo.sol");

module.exports = function (deployer) {
    deployer.deploy(decenTodo);
};
//todo: fix deploy contract to blockchain